"use client";
import SidebarItem from "./sidebar-item";
import { Album, Book, BookOpenText, Layout, Users } from "lucide-react";

const guestRoutes = [
  {
   icon: Layout,
   label: "Dashboard",
   href: "/adminDashboard/dashboard",
  },{
    icon: BookOpenText,
    label: "Exams",
    href: "/adminDashboard/dashboard/exams",
   },
  {
    icon: Book,
    label: "Questions",
    href: "/adminDashboard/dashboard/questions",
   },
   
{
    icon: Users,
    label: "Dashboard",
    href: "/adminDashboard/dashboard/students",
   },
   {
    icon: Album,
    label: "Dashboard",
    href: "/adminDashboard/dashboard/results",
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