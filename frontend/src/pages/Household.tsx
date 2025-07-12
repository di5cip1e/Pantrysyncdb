import React, { useState } from "react";
import brain from "brain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useUserGuardContext } from "app/auth";
import { useHouseholdStore } from "utils/householdStore";
import { CopyIcon } from "lucide-react";

const HouseholdPage: React.FC = () => {
  const { user } = useUserGuardContext();
  const { household, setHousehold } = useHouseholdStore();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // This is a placeholder. In a real app, you'd fetch the user's current household ID.
  // For now, we'll assume a single household for simplicity or have the user select one.
  const currentHouseholdId = household?.id || "your-household-id";

  const generateInvite = async () => {
    setIsGenerating(true);
    try {
      // NOTE: The brain.create_invitation method needs to be implemented based on your API.
      // It likely takes the household_id as a parameter.
      const response = await brain.create_invitation({ householdId: currentHouseholdId });

      if (response.ok) {
        const newInvitation = await response.json();
        setInviteCode(newInvitation.code);
        toast.success("New invite code generated!");
      } else {
        const error = await response.json();
        toast.error("Failed to generate invite code", { description: error.detail });
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Household</h1>
      <Card>
        <CardHeader>
          <CardTitle>Invite New Members</CardTitle>
          <CardDescription>
            Generate a unique code to share with people you want to invite to your household.
            The code will be valid for 7 days.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4">
          <Button onClick={generateInvite} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Invite Code"}
          </Button>
          {inviteCode && (
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 w-full sm:w-auto">
              <span className="text-2xl font-mono font-bold tracking-widest">{inviteCode}</span>
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* We will add the member list component here in a future step */}
    </div>
  );
};

export default HouseholdPage;

