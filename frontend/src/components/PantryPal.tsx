import React from "react";
import { usePantryStore } from "utils/pantryStore";

const PantryPal: React.FC = () => {
  const { items } = usePantryStore();

  const stockLevel = items.length > 0 ? (items.reduce((acc, item) => acc + item.quantity, 0) / (items.length * 10)) * 100 : 0;

  let palImage;
  let palMessage;

  if (stockLevel > 75) {
    palImage = "https://static.databutton.com/public/3c7c8a1e-a3a2-4178-9979-13dc0c47ff60/pantrypal_happy.png";
    palMessage = "Pantry is looking great!";
  } else if (stockLevel > 25) {
    palImage = "https://static.databutton.com/public/3c7c8a1e-a3a2-4178-9979-13dc0c47ff60/pantrypal_neutral.png";
    palMessage = "Pantry is getting low.";
  } else {
    palImage = "https://static.databutton.com/public/3c7c8a1e-a3a2-4178-9979-13dc0c47ff60/pantrypal_sad.png";
    palMessage = "Pantry is nearly empty!";
  }

  return (
    <div className="flex flex-col items-center text-center">
      <img src={palImage} alt="Pantry Pal" className="w-32 h-32" />
      <p className="mt-2">{palMessage}</p>
    </div>
  );
};

export default PantryPal;

