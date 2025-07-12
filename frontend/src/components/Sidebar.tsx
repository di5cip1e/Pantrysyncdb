import React from "react";
import { NavLink } from "react-router-dom";
import { HomeIcon, ShoppingCartIcon, UsersIcon, ActivityIcon, SettingsIcon } from "lucide-react";
import { FlameIcon } from "lucide-react";

const Sidebar: React.FC = () => {
  const navItems = [
    { to: "/pantry", icon: <HomeIcon className="h-5 w-5" />, label: "Pantry" },
    { to: "/shopping-lists", icon: <ShoppingCartIcon className="h-5 w-5" />, label: "Shopping Lists" },
    { to: "/household", icon: <UsersIcon className="h-5 w-5" />, label: "Household" },
    { to: "/activity", icon: <ActivityIcon className="h-5 w-5" />, label: "Activity" },
  ];

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-[60px] items-center border-b px-6">
        <NavLink to="/" className="flex items-center gap-2 font-semibold">
          <FlameIcon className="h-6 w-6" />
          <span>PantrySync</span>
        </NavLink>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900 ${
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-500"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
