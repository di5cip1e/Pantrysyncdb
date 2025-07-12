import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import brain from "brain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FlameIcon } from "lucide-react";
import { useHouseholdStore } from "utils/householdStore";

interface IFormInput {
  code: string;
}

const JoinHouseholdPage: React.FC = () => {
  const [inviteCode, setInviteCode] = useState("");
  const { joinHousehold, isLoading, error } = useHouseholdStore();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setErrorMessage(null);
    try {
      const response = await brain.join_household({ code: data.code.toUpperCase() });

      if (response.ok) {
        toast.success("Welcome to the household!", {
          description: "You have successfully joined the household.",
        });
        if (!error) {
          navigate("/pantry");
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || "An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Failed to join household:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main className="container mx-auto p-4 flex justify-center items-center h-screen scanline">
      <Card className="w-full max-w-md bg-black/50 border-2 border-primary/50 rounded-lg shadow-lg shadow-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl text-primary font-mono-upper text-center">
            Join a Household
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="invite-code" className="text-primary/80 font-mono">
                Invite Code
              </Label>
              <Input
                id="invite-code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter 8-digit code"
                required
                className="bg-black border-primary/50 rounded-md text-primary font-mono"
              />
            </div>
            {error && <p className="text-red-500 font-mono">{error}</p>}
            <Button type="submit" disabled={isLoading} className="w-full" variant="pipboy">
              {isLoading ? "Joining..." : "Join Household"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default JoinHouseholdPage;
