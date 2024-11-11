import Sidebar from "@/components/global/admin/sidebar";
import React from "react";


   const DashboardLay = ({children}: {children: React.ReactNode}) => {
    return ( 
    <div className="flex h-screen w-screen">
        <Sidebar/>
        <div className="w-screen">
    {children}
     </div>
    </div> );
   }
    
   export default DashboardLay;