import React, { useEffect } from "react";
import { useHouseholdStore } from "utils/householdStore";
import { useCollaborationNotifications } from "utils/collaborationNotifications";
import { useUserGuardContext } from "app/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsTab from "components/StatsTab";
import ItemsTab from "components/ItemsTab";
import StaplesTab from "components/StaplesTab";
import DataTab from "components/DataTab";
import { Link } from "react-router-dom";

const PantryPage: React.FC = () => {
  const { user } = useUserGuardContext();
  const { household } = useHouseholdStore();
  
  // Set up collaboration notifications for this page
  useCollaborationNotifications();

  if (!household) {
    return (
      <div className="flex items-center justify-center h-full scanline">
        <p className="text-primary font-mono">Loading household...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 scanline">
      <h1 className="text-2xl font-bold mb-4 text-primary font-mono-upper">[HOUSEHOLD NAME]'S PROVISIONS STATUS</h1>
      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid w-full grid-cols-5 tabs-list bg-black/80 border-primary/30">
          <TabsTrigger value="stats" className="tabs-trigger text-primary font-mono data-[state=active]:bg-primary data-[state=active]:text-black">STATS</TabsTrigger>
          <TabsTrigger value="items" className="tabs-trigger text-primary font-mono data-[state=active]:bg-primary data-[state=active]:text-black">ITEMS</TabsTrigger>
          <TabsTrigger value="staples" className="tabs-trigger text-primary font-mono data-[state=active]:bg-primary data-[state=active]:text-black">STAPLES</TabsTrigger>
          <TabsTrigger value="data" className="tabs-trigger text-primary font-mono data-[state=active]:bg-primary data-[state=active]:text-black">DATA</TabsTrigger>
          <TabsTrigger value="lists" asChild className="tabs-trigger text-primary font-mono data-[state=active]:bg-primary data-[state=active]:text-black">
            <Link to="/shopping-lists">LISTS</Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stats" className="tabs-content">
          <StatsTab />
        </TabsContent>
        <TabsContent value="items" className="tabs-content">
          <ItemsTab />
        </TabsContent>
        <TabsContent value="staples" className="tabs-content">
          <StaplesTab />
        </TabsContent>
        <TabsContent value="data" className="tabs-content">
          <DataTab />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default PantryPage;
