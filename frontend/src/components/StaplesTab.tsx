import React, { useState, useEffect } from "react";
import { useHouseholdStore } from "utils/householdStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, StarOff, Package, TrendingUp, AlertTriangle, Clock, Lightbulb, Check, X, Sparkles } from "lucide-react";
import brain from "brain";
import { PantryItemResponse } from "types";
import { toast } from "sonner";
import { useUserGuardContext } from "app/auth";

interface StaplesStats {
  total_staples: number;
  low_stock_staples: number;
  never_used_staples: number;
  frequently_used_staples: number;
}

interface StapleSuggestion {
  item_id: string;
  item_name: string;
  usage_frequency: number;
  days_since_added: number;
  usage_count: number;
  suggestion_score: number;
  suggestion_reason: string;
}

interface StapleSuggestionsResponse {
  suggestions: StapleSuggestion[];
  total_suggestions: number;
}

const StaplesTab: React.FC = () => {
  const { user } = useUserGuardContext();
  const { household } = useHouseholdStore();
  const [staples, setStaples] = useState<PantryItemResponse[]>([]);
  const [stats, setStats] = useState<StaplesStats | null>(null);
  const [suggestions, setSuggestions] = useState<StapleSuggestionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const fetchStaples = async () => {
    if (!household?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch staples, stats, and suggestions in parallel
      const [staplesResponse, statsResponse, suggestionsResponse] = await Promise.all([
        brain.get_staples({ householdId: household.id }),
        brain.get_staples_stats({ householdId: household.id }),
        brain.get_staple_suggestions({ householdId: household.id })
      ]);
      
      const staplesData = await staplesResponse.json();
      const statsData = await statsResponse.json();
      const suggestionsData = await suggestionsResponse.json();
      
      setStaples(staplesData);
      setStats(statsData);
      setSuggestions(suggestionsData);
    } catch (err) {
      console.error('Error fetching staples:', err);
      setError('Failed to load staples data');
      toast.error('Failed to load staples');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStapleStatus = async (itemId: string, currentStatus: boolean) => {
    if (!household?.id) return;
    
    try {
      await brain.toggle_staple_status(
        { householdId: household.id, itemId },
        { is_staple: !currentStatus }
      );
      
      toast.success(currentStatus ? 'Removed from staples' : 'Added to staples');
      
      // Refresh staples data
      await fetchStaples();
    } catch (err) {
      console.error('Error toggling staple status:', err);
      toast.error('Failed to update staple status');
    }
  };

  const handleSuggestion = async (itemId: string, action: 'accept' | 'dismiss') => {
    if (!household?.id) return;
    
    setProcessingIds(prev => new Set([...prev, itemId]));
    
    try {
      await brain.handle_staple_suggestion({
        householdId: household.id,
        itemId,
        action
      });
      
      toast.success(
        action === 'accept' 
          ? 'Added to staples!' 
          : 'Suggestion dismissed'
      );
      
      // Refresh all data
      await fetchStaples();
    } catch (err) {
      console.error('Error handling suggestion:', err);
      toast.error('Failed to handle suggestion');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    if (household?.id) {
      fetchStaples();
    }
  }, [household?.id]);

  if (!household) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-primary font-mono">Loading household...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-primary font-mono">Loading staples...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-400 font-mono">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-black/80 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-primary font-mono">{stats.total_staples}</p>
                  <p className="text-xs text-gray-400 font-mono">Total Staples</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/80 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <div>
                  <p className="text-2xl font-bold text-red-400 font-mono">{stats.low_stock_staples}</p>
                  <p className="text-xs text-gray-400 font-mono">Low Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/80 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-green-400 font-mono">{stats.frequently_used_staples}</p>
                  <p className="text-xs text-gray-400 font-mono">Frequent Use</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/80 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600 font-mono">{stats.never_used_staples}</p>
                  <p className="text-xs text-gray-400 font-mono">Never Used</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Suggestions Section */}
      {suggestions && suggestions.total_suggestions > 0 && (
        <Card className="bg-black/80 border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary font-mono-upper flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              AI Staples Suggestions
              <Badge variant="secondary" className="text-xs">
                {suggestions.total_suggestions}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {suggestions.suggestions.map((suggestion) => {
                const isProcessing = processingIds.has(suggestion.item_id);
                
                return (
                  <div
                    key={suggestion.item_id}
                    className="bg-black/40 border border-purple-500/20 rounded p-4 hover:border-purple-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-purple-400" />
                          <h3 className="text-primary font-mono font-semibold">
                            {suggestion.item_name}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className="text-xs text-purple-400 border-purple-400"
                          >
                            Score: {suggestion.suggestion_score}%
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-300 font-mono mb-2">
                          {suggestion.suggestion_reason}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
                          <span>Used {suggestion.usage_count} times</span>
                          <span>{suggestion.usage_frequency}x/week</span>
                          <span>{suggestion.days_since_added} days old</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuggestion(suggestion.item_id, 'accept')}
                          disabled={isProcessing}
                          className="h-8 px-3 border-green-500/30 hover:border-green-500/60 text-green-400"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuggestion(suggestion.item_id, 'dismiss')}
                          disabled={isProcessing}
                          className="h-8 px-3 border-red-500/30 hover:border-red-500/60 text-red-400"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staples List */}
      <Card className="bg-black/80 border-primary/30">
        <CardHeader>
          <CardTitle className="text-primary font-mono-upper flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Household Staples
          </CardTitle>
        </CardHeader>
        <CardContent>
          {staples.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Package className="h-12 w-12 text-gray-500 mb-4" />
              <div className="text-primary font-mono mb-2">No staples marked yet</div>
              <div className="text-gray-400 text-sm font-mono">
                Mark frequently used items as staples in your pantry
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {staples.map((item) => (
                <div
                  key={item.id}
                  className="bg-black/40 border border-primary/20 rounded p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <h3 className="text-primary font-mono font-semibold">
                          {item.display_name || item.name}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            item.quantity <= 2 
                              ? 'text-red-400 border-red-400' 
                              : 'text-primary border-primary'
                          }`}
                        >
                          Qty: {item.quantity}
                        </Badge>
                        {item.quantity <= 2 && (
                          <Badge variant="outline" className="text-xs text-red-400 border-red-400">
                            LOW STOCK
                          </Badge>
                        )}
                      </div>
                      
                      {/* Voice Labels */}
                      {item.voice_labels && item.voice_labels.length > 0 && (
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs text-gray-400 font-mono">Voice:</span>
                          {item.voice_labels.map((label, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              "{label}"
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Usage Stats */}
                      <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
                        <span>Used {item.usage_count || 0} times</span>
                        {item.last_used && (
                          <span>Last: {new Date(item.last_used).toLocaleDateString()}</span>
                        )}
                        {item.expiry_date && (
                          <span className="text-yellow-400">
                            Expires: {new Date(item.expiry_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStapleStatus(item.id, item.is_staple || false)}
                        className="h-8 px-3 border-yellow-500/30 hover:border-yellow-500/60 text-yellow-400"
                      >
                        <StarOff className="h-3 w-3 mr-1" />
                        Unmark
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaplesTab;
