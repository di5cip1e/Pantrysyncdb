import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import brain from 'brain';
import { useUserGuardContext } from 'app/auth';
import { useHouseholdStore } from 'utils/householdStore';
import { ActivityResponse } from 'types';

export const useCollaborationNotifications = () => {
  const { user } = useUserGuardContext();
  const { household } = useHouseholdStore();
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityTimeRef = useRef<Date>(new Date());
  const lastActivitiesRef = useRef<ActivityResponse[]>([]);

  useEffect(() => {
    if (!household?.id || !user?.id) {
      console.log('Collaboration notifications: waiting for household and user data');
      return;
    }

    // Validate household ID
    if (household.id.trim() === '') {
      console.warn('Cannot start collaboration notifications: invalid household ID');
      return;
    }

    console.log('Starting collaboration notifications polling for household:', household.id);
    
    // Set up polling for activities every 5 seconds
    const startPolling = () => {
      const interval = setInterval(async () => {
        try {
          const response = await brain.get_household_activities();
          if (response.ok) {
            const activities: ActivityResponse[] = await response.json();
            
            // Compare with previous activities to find new ones
            const previousIds = new Set(lastActivitiesRef.current.map(a => a.id));
            const newActivities = activities.filter(activity => !previousIds.has(activity.id));
            
            // Show notifications for new activities
            newActivities.forEach(activity => {
              const activityTime = new Date(activity.created_at);
              
              // Only show notifications for:
              // 1. Activities from other users (not the current user)
              // 2. Activities that happened after we started listening
              // 3. Activities from the same household
              if (
                activity.user_id !== user.id &&
                activity.household_id === household.id &&
                activityTime > lastActivityTimeRef.current
              ) {
                // Show toast notification
                const icon = getActivityIcon(activity.entity_type);
                const color = getActivityColor(activity.action_type);
                
                toast.info(
                  `${activity.user_name}: ${activity.action_description}`,
                  {
                    duration: 4000,
                    icon: icon,
                    className: `${color} border-l-4`,
                    description: `${formatTimeAgo(activityTime)}`
                  }
                );
              }
            });
            
            // Update the reference for next comparison
            lastActivitiesRef.current = activities.slice(0, 10); // Keep last 10 activities
          }
        } catch (error) {
          console.error('Error in collaboration notifications polling:', error);
          // Don't spam with error messages during polling
        }
      }, 5000); // Poll every 5 seconds
      
      pollIntervalRef.current = interval;
    };

    startPolling();

    // Cleanup function
    return () => {
      if (pollIntervalRef.current) {
        console.log('Cleaning up collaboration notifications polling');
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [household?.id, user?.id]);

  // Update the last activity time when component mounts
  useEffect(() => {
    lastActivityTimeRef.current = new Date();
  }, []);
};

// Helper functions
const getActivityIcon = (entityType: string): string => {
  switch (entityType) {
    case 'pantry_item':
      return '📦';
    case 'shopping_list':
    case 'shopping_list_item':
      return '🛒';
    case 'household':
      return '🏠';
    default:
      return '📝';
  }
};

const getActivityColor = (actionType: string): string => {
  switch (actionType) {
    case 'add':
    case 'create':
      return 'border-l-green-500';
    case 'update':
    case 'rename':
      return 'border-l-blue-500';
    case 'delete':
    case 'remove':
      return 'border-l-red-500';
    case 'complete':
      return 'border-l-purple-500';
    default:
      return 'border-l-gray-500';
  }
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};
