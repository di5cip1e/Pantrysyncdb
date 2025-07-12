import React, { useState, useEffect } from 'react';
import { Bell, Settings, X, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import brain from 'brain';
import { useUserGuardContext } from 'app/auth';

interface Notification {
  id: string;
  type: 'low_stock' | 'expiry';
  title: string;
  message: string;
  item_id: string;
  item_name: string;
  household_id: string;
  created_at: string;
  is_read: boolean;
  metadata?: Record<string, any>;
}

interface NotificationPreferences {
  low_stock_enabled: boolean;
  low_stock_threshold: number;
  expiry_enabled: boolean;
  expiry_days_ahead: number;
}

export interface Props {
  className?: string;
}

export const NotificationCenter: React.FC<Props> = ({ className }) => {
  const { user } = useUserGuardContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    low_stock_enabled: true,
    low_stock_threshold: 3,
    expiry_enabled: true,
    expiry_days_ahead: 3,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load notifications and preferences
  useEffect(() => {
    loadNotifications();
    loadPreferences();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await brain.get_notifications();
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const response = await brain.get_notification_preferences();
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await brain.mark_notification_read({ notification_id: notificationId });
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const checkForNotifications = async () => {
    setLoading(true);
    try {
      const response = await brain.check_and_create_notifications();
      const data = await response.json();
      
      if (data.notifications_created > 0) {
        toast.success(`Found ${data.notifications_created} new notifications`);
        loadNotifications(); // Reload to show new notifications
      } else {
        toast.info('No new notifications found');
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
      toast.error('Failed to check for notifications');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      await brain.update_notification_preferences(newPreferences);
      setPreferences(newPreferences);
      toast.success('Notification preferences updated');
      setShowSettings(false);
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'expiry':
        return <Clock className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={checkForNotifications}
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Check Now'}
            </Button>
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Notification Settings</DialogTitle>
                </DialogHeader>
                <NotificationSettings
                  preferences={preferences}
                  onSave={updatePreferences}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No notifications yet
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    notification.is_read ? 'bg-muted/50' : 'bg-background'
                  }`}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(notification.created_at)}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Settings component
interface NotificationSettingsProps {
  preferences: NotificationPreferences;
  onSave: (preferences: NotificationPreferences) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  preferences,
  onSave,
}) => {
  const [localPrefs, setLocalPrefs] = useState(preferences);

  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  const handleSave = () => {
    onSave(localPrefs);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="low-stock-enabled">Low Stock Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when items are running low
            </p>
          </div>
          <Switch
            id="low-stock-enabled"
            checked={localPrefs.low_stock_enabled}
            onCheckedChange={(checked) =>
              setLocalPrefs({ ...localPrefs, low_stock_enabled: checked })
            }
          />
        </div>
        
        {localPrefs.low_stock_enabled && (
          <div className="ml-4">
            <Label htmlFor="low-stock-threshold">Alert when quantity is:</Label>
            <Input
              id="low-stock-threshold"
              type="number"
              min="1"
              max="100"
              value={localPrefs.low_stock_threshold}
              onChange={(e) =>
                setLocalPrefs({
                  ...localPrefs,
                  low_stock_threshold: parseInt(e.target.value) || 1,
                })
              }
              className="w-20 mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              or less
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="expiry-enabled">Expiry Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when items are about to expire
            </p>
          </div>
          <Switch
            id="expiry-enabled"
            checked={localPrefs.expiry_enabled}
            onCheckedChange={(checked) =>
              setLocalPrefs({ ...localPrefs, expiry_enabled: checked })
            }
          />
        </div>
        
        {localPrefs.expiry_enabled && (
          <div className="ml-4">
            <Label htmlFor="expiry-days-ahead">Alert days before expiry:</Label>
            <Input
              id="expiry-days-ahead"
              type="number"
              min="1"
              max="30"
              value={localPrefs.expiry_days_ahead}
              onChange={(e) =>
                setLocalPrefs({
                  ...localPrefs,
                  expiry_days_ahead: parseInt(e.target.value) || 1,
                })
              }
              className="w-20 mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              days ahead
            </p>
          </div>
        )}
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Settings
      </Button>
    </div>
  );
};
