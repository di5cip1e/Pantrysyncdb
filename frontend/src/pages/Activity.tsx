import React from "react";
import MemberList from "components/MemberList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ActivityPage: React.FC = () => {
  // Hardcoded householdId for now, we will replace this later
  const householdId = "0vuRUQZPrwaJGJN8a9CN";

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Household</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            <MemberList householdId={householdId} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Activity feed will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ActivityPage;
