import React, { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useAIAssistantStore } from "utils/aiAssistantStore";
import { useHouseholdStore } from "utils/householdStore";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, Camera } from "lucide-react";
import brain from "brain";
import BarcodeScanner from "components/BarcodeScanner";
import { toast } from "sonner";

const AIAssistant: React.FC = () => {
  const { status, setStatus, isMicOn, toggleMic, setTranscript, setResponse, reset } = useAIAssistantStore();
  const { household } = useHouseholdStore();
  const [showScanner, setShowScanner] = useState(false);
  const [shoppingListFeedback, setShoppingListFeedback] = useState(null);
  
  const {
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
    utterance.onend = () => {
      setStatus("idle");
      reset();
    };
  };

  const handleProductFound = async (product: any) => {
    // Add the scanned product to pantry
    try {
      const response = await brain.add_pantry_item({
        name: product.name,
        quantity: 1,
        category: product.category || 'Other',
        brand: product.brand,
        upc: product.upc
      });
      
      if (response.ok) {
        const responseText = `Added ${product.name} to your pantry!`;
        setResponse(responseText);
        setStatus("speaking");
        speak(responseText);
        toast.success(responseText);
      } else {
        throw new Error('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding scanned product:', error);
      const errorText = "Sorry, I couldn't add that item to your pantry.";
      setResponse(errorText);
      setStatus("speaking");
      speak(errorText);
      toast.error(errorText);
    }
  };

  const handleLookupUPC = async (upcCode: string) => {
    setStatus("processing");
    try {
      // Use enhanced UPC lookup API that combines basic + enhanced data
      const response = await brain.get_enhanced_upc_info({ upc: upcCode });
      const data = await response.json();
      
      const basicProduct = data.basic_product_info?.product;
      const enhancedProduct = data.enhanced_product_info;
      
      if (data.basic_product_info?.success && basicProduct) {
        // Auto-add the product to pantry with enhanced data
        await handleProductFound({
          name: enhancedProduct?.enhanced_name || enhancedProduct?.base_name || basicProduct.name,
          brand: basicProduct.brand,
          category: enhancedProduct?.category || basicProduct.category,
          image_url: basicProduct.image_url,
          ingredients: basicProduct.ingredients,
          nutrition_grade: basicProduct.nutrition_grade,
          // Enhanced metadata
          enhanced_name: enhancedProduct?.enhanced_name,
          subcategory: enhancedProduct?.subcategory,
          tags: enhancedProduct?.tags || [],
          storage_tips: enhancedProduct?.storage_tips,
          typical_shelf_life: enhancedProduct?.typical_shelf_life,
          upc: upcCode,
          has_enhancement: data.has_enhancement
        });
        return;
      } else {
        const responseText = "Sorry, I couldn't find that product in the database.";
        setResponse(responseText);
        setStatus("speaking");
        speak(responseText);
        return;
      }
    } catch (error) {
      console.error('Error looking up UPC:', error);
      const responseText = "Sorry, I had trouble looking up that barcode.";
      setResponse(responseText);
      setStatus("speaking");
      speak(responseText);
    }
  };

  useEffect(() => {
    const processTranscript = async () => {
      if (finalTranscript) {
        setTranscript(finalTranscript);
        setStatus("processing");
        try {
          const response = await brain.interpret_command({ text: finalTranscript });
          const { action, payload } = await response.json();
          let responseText = "Sorry, I didn't understand that.";

          if (action === "add_item") {
            // Add item to pantry via API
            try {
              const addResponse = await brain.add_pantry_item({
                name: payload.item_name,
                quantity: payload.quantity || 1,
                category: 'Other'
              });
              
              if (addResponse.ok) {
                responseText = `Added ${payload.quantity} ${payload.item_name} to the pantry.`;
              } else {
                responseText = "Sorry, I couldn't add that item to the pantry.";
              }
            } catch (error) {
              responseText = "Sorry, I had trouble adding that item.";
            }
          } else if (action === "consume_item") {
            // Handle consumption tracking
            try {
              if (!household?.id) {
                responseText = "Please join a household first to track consumption.";
              } else {
                const consumeResponse = await brain.consume_pantry_item(
                  { householdId: household.id },
                  {
                    item_name: payload.item_name,
                    quantity_used: payload.quantity_used || 1,
                    consumed_completely: payload.consumed_completely || false
                  }
                );
                
                if (consumeResponse.ok) {
                  const result = await consumeResponse.json();
                  if (result.success) {
                    responseText = result.message;
                    if (result.matched_by_voice_label) {
                      responseText += " (Found by voice label)";
                    }
                    toast.success(result.message);
                  } else {
                    responseText = result.message;
                    toast.error(result.message);
                  }
                } else {
                  responseText = "Sorry, I couldn't update that item.";
                  toast.error(responseText);
                }
              }
            } catch (error) {
              console.error('Error consuming item:', error);
              responseText = "Sorry, I had trouble updating that item.";
              toast.error(responseText);
            }
          } else if (action === "check_quantity") {
            // In a real app, we'd fetch this from the pantry state
            responseText = `You have 5 ${payload.item_name}.`;
          } else if (action === "scan_barcode") {
            responseText = "Opening the barcode scanner for you.";
            setResponse(responseText);
            setStatus("speaking");
            speak(responseText);
            setTimeout(() => {
              setShowScanner(true);
            }, 2000); // Wait for speech to finish
            return;
          } else if (action === "lookup_upc") {
            await handleLookupUPC(payload.upc_code);
            return;
          } else if (action === "create_shopping_list") {
            // Create new shopping list
            try {
              setShoppingListFeedback("Creating shopping list...");
              const createResponse = await brain.create_shopping_list({
                name: payload.list_name
              });
              
              if (createResponse.ok) {
                responseText = `Created shopping list "${payload.list_name}".`;
                setShoppingListFeedback(`✅ Created "${payload.list_name}"`);
                toast.success(responseText);
              } else {
                responseText = "Sorry, I couldn't create that shopping list.";
                setShoppingListFeedback(null);
              }
            } catch (error) {
              responseText = "Sorry, I had trouble creating the shopping list.";
              setShoppingListFeedback(null);
            }
          } else if (action === "add_to_shopping_list") {
            // Add items to shopping list
            try {
              setShoppingListFeedback("Adding items to shopping list...");
              // First get existing shopping lists to find the target list
              const listsResponse = await brain.get_shopping_lists();
              const lists = await listsResponse.json();
              
              let targetListId = null;
              
              if (payload.list_name) {
                // Find list by name (case insensitive partial match)
                const targetList = lists.find((list: any) => 
                  list.name.toLowerCase().includes(payload.list_name.toLowerCase())
                );
                targetListId = targetList?.id;
              } else if (lists.length > 0) {
                // Use the first available list if no specific list mentioned
                targetListId = lists[0].id;
              }
              
              if (!targetListId) {
                responseText = payload.list_name 
                  ? `I couldn't find a shopping list named "${payload.list_name}". Would you like me to create it?`
                  : "You don't have any shopping lists yet. Would you like me to create one?";
                setShoppingListFeedback(null);
              } else {
                // Add all items to the list
                const itemPromises = payload.items.map((item: any) => 
                  brain.add_shopping_list_item(targetListId, {
                    name: item.name,
                    quantity: item.quantity || 1
                  })
                );
                
                await Promise.all(itemPromises);
                
                const itemNames = payload.items.map((item: any) => 
                  item.quantity > 1 ? `${item.quantity} ${item.name}` : item.name
                ).join(", ");
                
                const targetListName = lists.find((list: any) => list.id === targetListId)?.name;
                responseText = `Added ${itemNames} to your "${targetListName}" shopping list.`;
                setShoppingListFeedback(`✅ Added ${payload.items.length} item${payload.items.length > 1 ? 's' : ''} to "${targetListName}"`);
                toast.success(responseText);
              }
            } catch (error) {
              console.error('Error adding items to shopping list:', error);
              responseText = "Sorry, I had trouble adding those items to your shopping list.";
              setShoppingListFeedback(null);
            }
          } else if (action === "list_shopping_lists") {
            // List existing shopping lists
            try {
              setShoppingListFeedback("Getting your shopping lists...");
              const listsResponse = await brain.get_shopping_lists();
              const lists = await listsResponse.json();
              
              if (lists.length === 0) {
                responseText = "You don't have any shopping lists yet. Would you like me to create one?";
                setShoppingListFeedback(null);
              } else {
                const listNames = lists.map((list: any) => list.name).join(", ");
                responseText = `You have ${lists.length} shopping list${lists.length > 1 ? 's' : ''}: ${listNames}.`;
                setShoppingListFeedback(`📋 Found ${lists.length} list${lists.length > 1 ? 's' : ''}`);
              }
            } catch (error) {
              responseText = "Sorry, I had trouble getting your shopping lists.";
              setShoppingListFeedback(null);
            }
          }
          
          setResponse(responseText);
          setStatus("speaking");
          speak(responseText);

        } catch (error) {
          console.error("Error interpreting command:", error);
          const errorText = "I seem to be having trouble connecting to the network.";
          setResponse(errorText);
          setStatus("speaking");
          speak(errorText);
        }
      }
    };
    processTranscript();
  }, [finalTranscript, setTranscript, setStatus, setResponse, reset]);

  const handleToggleMic = () => {
    if (isMicOn) {
      SpeechRecognition.stopListening();
      toggleMic();
      setStatus("idle");
    } else {
      reset();
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false });
      toggleMic();
      setStatus("listening");
    }
  };
  
  const getButtonContent = () => {
    switch (status) {
      case "listening":
        return <Mic className="h-8 w-8 animate-pulse" />;
      case "processing":
        return <Loader2 className="h-8 w-8 animate-spin" />;
      case "speaking":
        return <MicOff className="h-8 w-8" />;
      case "idle":
      default:
        return <Mic className="h-8 w-8" />;
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return null; // Don't render if not supported
  }

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        {/* Manual Scanner Button */}
        <Button 
          onClick={() => setShowScanner(true)} 
          variant="outline" 
          size="icon" 
          className="rounded-full w-16 h-16 shadow-lg"
          title="Open Barcode Scanner"
        >
          <Camera className="h-6 w-6" />
        </Button>
        
        {/* Voice Assistant Button */}
        <Button 
          onClick={handleToggleMic} 
          variant="pipboy" 
          size="icon" 
          className="rounded-full w-20 h-20 shadow-lg shadow-primary/30"
          title="Voice Assistant"
        >
          {getButtonContent()}
        </Button>
      </div>
      
      {/* Barcode Scanner Modal */}
      <BarcodeScanner 
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onProductFound={handleProductFound}
      />
      
      {shoppingListFeedback && (
        <div className="fixed bottom-20 right-8 z-50 bg-white p-4 rounded-lg shadow-lg">
          {shoppingListFeedback}
        </div>
      )}
    </>
  );
};

export default AIAssistant;
