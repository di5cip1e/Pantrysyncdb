import React, { useState } from "react";
import PantryList from "components/PantryList";
import AddPantryItemForm from "components/AddPantryItemForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHouseholdStore } from "utils/householdStore";
import CategoryList from "components/CategoryList";

const ItemsTab: React.FC = () => {
  const { household } = useHouseholdStore();
  const [selectedCategory, setSelectedCategory] = useState("all");

  if (!household) {
    return null;
  }

  return (
    <div className="grid grid-cols-[200px_1fr] gap-4">
      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <div className="grid gap-4">
        <Card className="bg-black/80 border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary font-mono-upper">Pantry Items</CardTitle>
          </CardHeader>
          <CardContent>
            <PantryList
              householdId={household.id}
              selectedCategory={selectedCategory}
            />
          </CardContent>
        </Card>
        <Card className="bg-black/80 border-primary/30">
          <CardHeader>
            <CardTitle className="text-primary font-mono-upper">Add New Item</CardTitle>
          </CardHeader>
          <CardContent>
            <AddPantryItemForm householdId={household.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ItemsTab;
