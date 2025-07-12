import type { ReactNode } from "react";
import { useEffect } from "react";
import { useUser } from "@stackframe/react";
import { useHouseholdStore } from "utils/householdStore";
import AIAssistant from "components/AIAssistant";

interface Props {
  children: ReactNode;
}

/**
 * A provider wrapping the whole app.
 *
 * You can add multiple providers here by nesting them,
 * and they will all be applied to the app.
 *
 * Note: ThemeProvider is already included in AppWrapper.tsx and does not need to be added here.
 */
export const AppProvider = ({ children }: Props) => {
  const user = useUser();
  const { fetchHousehold, fetchAttempted } = useHouseholdStore();

  // Globally fetch household data when user is available
  useEffect(() => {
    if (user && !fetchAttempted) {
      console.log('AppProvider: User authenticated, fetching household data');
      fetchHousehold();
    }
  }, [user, fetchHousehold, fetchAttempted]);

  return (
    <>
      {children}
      <AIAssistant />
    </>
  );
};
