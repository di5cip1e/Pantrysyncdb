import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Package, ShoppingCart, Home, Activity, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import brain from 'brain';
import { useUserGuardContext } from 'app/auth';
import { toast } from 'sonner';

// Types
interface ActivityItem {
  id: string;
  household_id: string;
  user_id: string;
  user_name: string;
  action_type: string;
  action_description: string;
  entity_type: string;
  entity_id?: string;
  entity_name?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

const ActivityFeed = () => {
  const { user } = useUserGuardContext();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch activities
  const fetchActivities = async () => {
    try {
      setError(null);
      const response = await brain.get_household_activities({ limit: 50 });
      
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      
      const data = await response.json();
      setActivities(data);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activity feed');
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Get icon for activity type
  const getActivityIcon = (entityType: string, actionType: string) => {
    switch (entityType) {
      case 'pantry_item':
        return <Package className="h-4 w-4" />;
      case 'shopping_list':
      case 'shopping_list_item':
        return <ShoppingCart className="h-4 w-4" />;
      case 'household':
        return <Home className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  // Get color for activity type
  const getActivityColor = (actionType: string) => {
    switch (actionType) {
      case 'add':
      case 'create':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'update':
      case 'rename':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'delete':
      case 'remove':
        return 'bg-red-500/10 text-red-700 border-red-200';
      case 'complete':
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4 p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-400">Activity Feed</h1>
            <p className="text-gray-400 mt-1">Live household activity updates</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-black/20 border-green-500/30">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="bg-black/20 border-red-500/30">
          <CardContent className="p-6 text-center">
            <div className="text-red-400 mb-2">⚠️ Error</div>
            <p className="text-gray-400">{error}</p>
            <button 
              onClick={fetchActivities}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-400 flex items-center gap-2">
            <Activity className="h-8 w-8" />
            Activity Feed
          </h1>
          <p className="text-gray-400 mt-1">Live household activity updates</p>
        </div>
        
        <button 
          onClick={fetchActivities}
          className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded hover:bg-green-600/30 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Activity List */}
      {activities.length === 0 ? (
        <Card className="bg-black/20 border-green-500/30">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              No Activities Yet
            </h3>
            <p className="text-gray-400 mb-4">
              Start using your pantry and shopping lists to see household activity here.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => navigate('/Pantry')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Go to Pantry
              </button>
              <button
                onClick={() => navigate('/ShoppingLists')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Shopping Lists
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <Card key={activity.id} className="bg-black/20 border-green-500/30 hover:bg-black/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.action_type)}`}>
                      {getActivityIcon(activity.entity_type, activity.action_type)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-green-400 font-medium">
                        {activity.user_name}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getActivityColor(activity.action_type)}`}
                      >
                        {activity.action_type}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-2">
                      {activity.action_description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(activity.created_at)}</span>
                      {activity.entity_type && (
                        <>
                          <span>•</span>
                          <span className="capitalize">
                            {activity.entity_type.replace('_', ' ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Separator for non-last items */}
                {index < activities.length - 1 && (
                  <Separator className="mt-4 bg-green-500/20" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Load more button if there are many activities */}
      {activities.length >= 50 && (
        <Card className="bg-black/20 border-green-500/30">
          <CardContent className="p-4 text-center">
            <button 
              onClick={() => {
                // Could implement pagination here
                toast.info('Pagination coming soon!');
              }}
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              Load More Activities
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActivityFeed;
