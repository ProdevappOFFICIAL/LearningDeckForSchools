"use client";
import  SidebarItem  from "./sidebar-item";
import { Plus } from "lucide-react";

const guestRoutes = [
  {
   icon: Plus,
   label: "Dashboard",
   href: "/default/",
  },

];


const SidebarRoutes = () => {
  const routes = guestRoutes;
     return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  )
}
export default SidebarRoutes;