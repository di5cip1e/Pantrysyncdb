import React from "react";
import { usePantryStore } from "utils/pantryStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PantryPal from "components/PantryPal";

const StatsTab: React.FC = () => {
  const { items } = usePantryStore();

  const totalItems = items.length;
  // These are placeholders for now, we will implement the logic later
  const stockLevel = "85%";
  const spoilageRisk = 3;
  const shoppingListCount = 5;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-black/80 border-primary/30">
        <CardHeader>
          <CardTitle className="text-primary font-mono-upper">Core Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-primary font-mono">ITEMS MONITORED: {totalItems}</p>
          <p className="text-primary font-mono">STOCK LEVEL: {stockLevel}</p>
          <p className="text-primary font-mono">SPOILAGE RISK: {spoilageRisk}</p>
          <p className="text-primary font-mono">SHOPPING LIST: {shoppingListCount}</p>
        </CardContent>
      </Card>
      <Card className="bg-black/80 border-primary/30">
        <CardHeader>
          <CardTitle className="text-primary font-mono-upper">Pantry Pal Status</CardTitle>
        </CardHeader>
        <CardContent>
          <PantryPal />
        </CardContent>
      </Card>
      <Card className="md:col-span-2 bg-black/80 border-primary/30">
        <CardHeader>
          <CardTitle className="text-primary font-mono-upper">Recent Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-primary/70 font-mono">Recent updates will go here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsTab;
