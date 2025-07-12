import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useHouseholdStore } from "utils/householdStore";
import { useUser } from "@stackframe/react";
import { Button } from "@/components/ui/button";
import WelcomeGreeting from "components/WelcomeGreeting";

function App() {
  const { household, fetchHousehold, isLoading, fetchAttempted } = useHouseholdStore();
  const user = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeShown, setWelcomeShown] = useState(false);

  useEffect(() => {
    // Only fetch if we have a user and we haven't tried fetching before
    if (user && !fetchAttempted) {
      fetchHousehold();
    }
  }, [user, fetchHousehold, fetchAttempted]);

  // Show welcome greeting when household is loaded and we're on home page
  useEffect(() => {
    if (household && location.pathname === "/" && !welcomeShown && !isLoading) {
      setShowWelcome(true);
    }
  }, [household, location.pathname, welcomeShown, isLoading]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setWelcomeShown(true);
    // Navigation to /pantry is handled in WelcomeGreeting component
  };

  if (isLoading) {
    return (
      <main className="container mx-auto p-4 flex justify-center items-center h-screen scanline">
        <p className="text-2xl text-primary font-mono-upper">Loading...</p>
      </main>
    );
  }

  if (!household) {
    return (
      <main className="container mx-auto p-4 flex flex-col justify-center items-center h-screen scanline">
        <div className="text-center space-y-4 p-8 border-2 border-primary/50 bg-black/50 rounded-lg shadow-lg shadow-primary/20">
          <h1 className="text-5xl text-primary font-mono-upper drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]">
            Welcome to PantrySync
          </h1>
          <p className="text-lg text-primary/80 font-mono">
            Get started by creating or joining a household.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button asChild variant="pipboy">
              <Link to="/create-household">Create a Household</Link>
            </Button>
            <Button asChild variant="pipboy-outline">
              <Link to="/join-household">Join a Household</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (showWelcome) {
    return (
      <WelcomeGreeting onComplete={handleWelcomeComplete} />
    );
  }

  return null;
}

export default App;
