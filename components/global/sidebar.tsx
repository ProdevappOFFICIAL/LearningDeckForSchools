"use client"
import { Button } from "@/components/ui/button";
import { ChevronRight, LogOutIcon, Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Sidebar = () => {
  return(
    <div className="h-full border-r flex flex-col overflow-y-auto w-20  shadow-sm mr-10  bg-zinc-200/20">
    <div className="w-10 h-10 rounded-full p-2 m-4 items-center justify-center bg-green-200/20 text-green-600 font-bold ">
     <Plus/>
    </div>
  
    <div className="h-full"/>
  
    <Dialog>
              <DialogTrigger asChild>
                <div>
                <Button variant="outline" size="icon" className=" ml-5 py-1" >
 
         
                    <LogOutIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

                    <LogOutIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Enter Password</DialogTitle>
                  <DialogDescription>
                    <div className="mt-5">
                      <Input
                        placeholder="***************"  
                        className="bg-sky-200/20 " />
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit" size="sm" className="bg-red-600 dark:bg-red-800 px-3 dark:text-white dark:hover:bg-green-400">
                      <p className="text-[9px] mr-2 text-zinc-200">
                        <ChevronRight/>
                      </p>
                    
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>


    <div className="h-20"/>
</div>  
  )
}
export default Sidebar;