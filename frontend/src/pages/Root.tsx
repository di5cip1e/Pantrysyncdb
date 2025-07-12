import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "components/Sidebar";
import { UserButton } from "@stackframe/react";
import { Toaster } from "@/components/ui/sonner";

const Root: React.FC = () => {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] scanline">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <Sidebar />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          <div className="flex-1">
            {/* Add search or other header content here if needed */}
          </div>
          <UserButton />
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default Root;
