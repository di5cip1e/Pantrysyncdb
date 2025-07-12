import React from "react";
import { useHouseholdStore } from "utils/householdStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationCenter } from "components/NotificationCenter";

export interface Props {
  householdId?: string;
}

const DataTab: React.FC<Props> = ({ householdId }) => {
  const { household, inviteCode, createInvitation } = useHouseholdStore();

  return (
    <Tabs defaultValue="shopping-list" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="shopping-list">SHOPPING LIST</TabsTrigger>
        <TabsTrigger value="active-users">ACTIVE USERS</TabsTrigger>
        <TabsTrigger value="notifications">NOTIFICATIONS/LOG</TabsTrigger>
        <TabsTrigger value="household">HOUSEHOLD</TabsTrigger>
      </TabsList>
      <TabsContent value="shopping-list">
        <p>Shopping list content will go here.</p>
      </TabsContent>
      <TabsContent value="active-users">
        <p>Active users content will go here.</p>
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationCenter />
      </TabsContent>
      <TabsContent value="household">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Household Management</h3>
          <p>Household settings and invitation management will go here.</p>
          {inviteCode && (
            <div>
              <p>Current invite code: {inviteCode}</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DataTab;
