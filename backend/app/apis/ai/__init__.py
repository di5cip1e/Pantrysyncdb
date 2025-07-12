from fastapi import APIRouter
from pydantic import BaseModel
import databutton as db
from openai import OpenAI

router = APIRouter()

# Initialize the client with the Deepseek API key and base URL
client = OpenAI(
    api_key=db.secrets.get("DEEPSEEK_API"),
    base_url="https://api.deepseek.com"
)

class InterpretRequest(BaseModel):
    text: str

class InterpretResponse(BaseModel):
    action: str
    payload: dict

@router.post("/interpret", response_model=InterpretResponse)
async def interpret_command(request: InterpretRequest):
    """
    Interprets the user's voice command using the Deepseek chat model.
    """
    try:
        system_prompt = """
        You are Pantry-Pal, an AI assistant for the PantrySync app.
        Your task is to interpret the user's command and respond with a JSON object
        containing the 'action' and a 'payload'.

        The possible actions are:
        - 'add_item': For when the user wants to add an item to the pantry. 
          The payload should include 'item_name' and 'quantity'.
        - 'consume_item': For when the user mentions using, consuming, eating, finishing, or depleting an item.
          The payload should include 'item_name', 'quantity_used' (default 1), and 'consumed_completely' (boolean).
        - 'check_quantity': For when the user asks about the quantity of an item.
          The payload should include 'item_name'.
        - 'scan_barcode': For when the user wants to scan a barcode or UPC to add an item.
          The payload can include 'item_name' if mentioned, or be empty to trigger scanning mode.
        - 'lookup_upc': For when the user provides a specific UPC/barcode number.
          The payload should include 'upc_code' with the barcode number.
        - 'create_shopping_list': For when the user wants to create a new shopping list.
          The payload should include 'list_name'.
        - 'add_to_shopping_list': For when the user wants to add items to a shopping list.
          The payload should include 'items' (array of objects with 'name' and 'quantity') and optionally 'list_name' (defaults to current active list).
        - 'list_shopping_lists': For when the user asks to see their shopping lists.
          The payload can be an empty object.
        - 'unknown': For any command you don't understand.
          The payload can be an empty object or contain a 'message'.

        The user's command will be provided as text. Be concise and accurate.
        
        IMPORTANT: Recognize voice labels and nicknames for items. Users may refer to items by:
        - Brand names ("Captain Crunch", "Coca Cola")
        - Nicknames ("purple drink" for grape juice, "cereal" for specific cereals)
        - Casual terms ("milk" could be "dairy", "bread" could be "loaf")
        - Shortened versions ("pasta" for "spaghetti pasta")
        
        For consumption commands, recognize these patterns:
        - "I used [item]" / "I ate [item]" / "I consumed [item]"
        - "We finished [item]" / "[item] is gone" / "[item] is empty"
        - "Used up [quantity] [item]" / "Ate [quantity] [item]"
        - "Had some [item]" / "Grabbed a [item]"
        
        Examples:
        - "add 2 apples to the pantry" → { "action": "add_item", "payload": { "item_name": "apple", "quantity": 2 } }
        - "I used a box of captain crunch" → { "action": "consume_item", "payload": { "item_name": "captain crunch", "quantity_used": 1, "consumed_completely": false } }
        - "we finished the purple drink" → { "action": "consume_item", "payload": { "item_name": "purple drink", "quantity_used": 1, "consumed_completely": true } }
        - "ate 2 slices of bread" → { "action": "consume_item", "payload": { "item_name": "bread", "quantity_used": 2, "consumed_completely": false } }
        - "pasta is all gone" → { "action": "consume_item", "payload": { "item_name": "pasta", "quantity_used": 1, "consumed_completely": true } }
        - "how many eggs are left" → { "action": "check_quantity", "payload": { "item_name": "egg" } }
        - "scan barcode" → { "action": "scan_barcode", "payload": {} }
        - "lookup UPC 123456789012" → { "action": "lookup_upc", "payload": { "upc_code": "123456789012" } }
        - "create grocery list" → { "action": "create_shopping_list", "payload": { "list_name": "grocery list" } }
        - "add milk and bread to shopping list" → { "action": "add_to_shopping_list", "payload": { "items": [{ "name": "milk", "quantity": 1 }, { "name": "bread", "quantity": 1 }] } }
        - "show my shopping lists" → { "action": "list_shopping_lists", "payload": {} }
        
        For shopping list commands, be flexible with natural language - users might say "shopping list", "grocery list", "store list", etc.
        Handle quantities mentioned in natural speech like "a few", "some", "a couple" by converting to reasonable numbers (few=3, some=2, couple=2).
        Recognize voice labels and product nicknames that users might use (like "purple drink" for grape juice).
        """

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": request.text}
        ]
        
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            stream=False,
            response_format={"type": "json_object"}
        )
        
        # Log the raw response for debugging
        print("Deepseek raw response:", response.choices[0].message.content)
        
        # Parse the JSON string from the response
        import json
        interpreted_response = json.loads(response.choices[0].message.content)
        
        return InterpretResponse(
            action=interpreted_response.get("action", "unknown"),
            payload=interpreted_response.get("payload", {})
        )

    except Exception as e:
        print(f"Error calling Deepseek API or parsing response: {e}")
        return InterpretResponse(action="error", payload={"message": "Failed to interpret command."})
