import Sidebar from "@/components/global/sidebar";

const DashLay = (
    {children}: {
    children: React.ReactNode,
}) => {
    return ( <div className="flex">

        {children}
    </div> );
}
 
export default DashLay;