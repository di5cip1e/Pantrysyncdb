import React, { useState } from "react";
import { useHouseholdStore } from "utils/householdStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const CreateHouseholdPage: React.FC = () => {
  const [name, setName] = useState("");
  const { createHousehold, isLoading, error } = useHouseholdStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const success = await createHousehold(name);
    if (success) {
      navigate("/pantry");
    }
    // If not successful, the error will be displayed via the error state
  };

  return (
    <main className="container mx-auto p-4 flex justify-center items-center h-screen scanline">
      <Card className="w-full max-w-md bg-black/50 border-2 border-primary/50 rounded-lg shadow-lg shadow-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl text-primary font-mono-upper text-center">
            Create a Pantry Group
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary/80 font-mono">
                Pantry Group Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Vault 76"
                required
                className="bg-black border-primary/50 rounded-md text-primary font-mono"
              />
            </div>
            {error && <p className="text-red-500 font-mono">{error}</p>}
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/80 text-black font-bold py-3 px-4 rounded">
              {isLoading ? "Creating..." : "Create Pantry Group"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default CreateHouseholdPage;
