import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHouseholdStore } from "utils/householdStore";
import { useUser } from "@stackframe/react";
import brain from "brain";
import { NotificationResponse } from "types";

interface WelcomeGreetingProps {
  onComplete: () => void;
}

const WelcomeGreeting: React.FC<WelcomeGreetingProps> = ({ onComplete }) => {
  const user = useUser(); // Changed from useUserGuardContext
  const { household } = useHouseholdStore();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  // Time-based greeting logic
  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 22) return "Good Evening";
    return "Good Night";
  };

  // Fetch notifications when component loads
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!household?.id) return;
      
      try {
        const response = await brain.get_notifications({});
        const data = await response.json();
        if (Array.isArray(data)) {
          const unreadNotifications = data.filter(n => !n.is_read);
          setNotifications(unreadNotifications);
          setNotificationCount(unreadNotifications.length);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Gracefully handle error - just show 0 notifications
        setNotifications([]);
        setNotificationCount(0);
      }
    };

    fetchNotifications();
  }, [household?.id]);

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
      navigate('/pantry');
    }, 500); // Wait for fade out animation
  };

  const getRelevantInfo = () => {
    if (notificationCount === 0) {
      return "All systems operational. No urgent alerts.";
    }
    
    const lowStockCount = notifications.filter(n => n.type === 'low_stock').length;
    const expiryCount = notifications.filter(n => n.type === 'expiry').length;
    
    let info = [];
    if (lowStockCount > 0) {
      info.push(`${lowStockCount} low stock alert${lowStockCount > 1 ? 's' : ''}`);
    }
    if (expiryCount > 0) {
      info.push(`${expiryCount} expiry warning${expiryCount > 1 ? 's' : ''}`);
    }
    
    return info.length > 0 ? info.join(' • ') : "Checking pantry status...";
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 transition-opacity duration-500 scanline ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleDismiss}
    >
      <div className="relative text-center space-y-6 p-8 max-w-2xl mx-auto animate-pulse-glow">
        {/* Time-based Greeting */}
        <div className="space-y-2">
          <h1 className="text-6xl text-primary font-mono-upper drop-shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-in fade-in duration-1000">
            {getTimeBasedGreeting()}
          </h1>
          <h2 className="text-3xl text-primary/80 font-mono animate-in fade-in duration-1000 delay-300">
            {user?.display_name || user?.primary_email || 'Vault Dweller'}
          </h2>
        </div>

        {/* Pantry-Pal Image */}
        <div className="flex justify-center my-8">
          <div className="relative">
            <img 
              src="https://static.databutton.com/public/3c7c8a1e-a3a2-4178-9979-13dc0c47ff60/photostudio_1752088991407.png"
              alt="Pantry-Pal"
              className={`max-w-xs h-auto rounded-lg border-2 border-primary/30 shadow-lg shadow-primary/20 transition-all duration-1000 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => console.error('Failed to load Pantry-Pal image')}
            />
            
            {/* Pip-Boy style scanlines overlay on image */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full opacity-20 bg-gradient-to-b from-transparent via-primary/10 to-transparent bg-[length:100%_4px] animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Pantry Information */}
        <div className="space-y-4 animate-in fade-in duration-1000 delay-700">
          <div className="bg-black/60 border border-primary/30 rounded-lg p-4 space-y-2">
            <h3 className="text-xl text-primary font-mono-upper flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              PANTRY STATUS UPDATE
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            </h3>
            
            <div className="text-primary/80 font-mono space-y-1">
              <p className="flex justify-between">
                <span>HOUSEHOLD:</span>
                <span className="text-primary">{household?.name || 'UNKNOWN'}</span>
              </p>
              <p className="flex justify-between">
                <span>NOTIFICATIONS:</span>
                <span className={`${notificationCount > 0 ? 'text-yellow-400 animate-pulse' : 'text-primary'}`}>
                  {notificationCount} PENDING
                </span>
              </p>
              <p className="text-sm mt-2 text-center text-primary/60">
                {getRelevantInfo()}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <p className="text-primary/60 font-mono text-sm animate-pulse">
            [ TAP ANYWHERE TO CONTINUE TO PANTRY TERMINAL ]
          </p>
        </div>
      </div>

      {/* Retro corner decorations */}
      <div className="absolute top-4 left-4 text-primary/30 font-mono text-xs">
        ┌─ PANTRYSYNC v2.0 ─┐
      </div>
      <div className="absolute top-4 right-4 text-primary/30 font-mono text-xs">
        ┌─ {new Date().toLocaleDateString()} ─┐
      </div>
      <div className="absolute bottom-4 left-4 text-primary/30 font-mono text-xs">
        └─ VAULT-TEC TECH ─┘
      </div>
      <div className="absolute bottom-4 right-4 text-primary/30 font-mono text-xs">
        └─ STATUS: ONLINE ─┘
      </div>
    </div>
  );
};

export default WelcomeGreeting;
