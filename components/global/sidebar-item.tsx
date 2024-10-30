"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
};

 const SidebarItem = ({
  icon: Icon,

  
  href,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/default" && href === "/default") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 active:text-green-600 text-slate-500 px-2 pl-6 text-sm font-[500]  transition-all  hover:text-slate-600 hover:bg-slate-300/20",
        isActive && "flex items-center text-green-700  px-2 pl-6   dark:text-white hover:bg-slate-300/20 hover:text-green-700"
      )}
    >
      <div className="flex items-center  gap-x-2 py-4">
        <Icon
          size={18}
          className={cn(
            "font-extralight",
            isActive && ""
          )}
        />
   
      </div>
     
    </button>
  )
}

export default SidebarItem;