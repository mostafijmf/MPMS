"use client";
import { TextAlignJustify } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import Sidebar from "./sidebar";

const MobileSidebarMenu = () => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button variant="ghost" size="icon" className="rounded-full align-middle">
          <TextAlignJustify className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="" side="left">
        <SheetHeader className="sr-only">
          <SheetTitle>MPMS</SheetTitle>
        </SheetHeader>
        <Sidebar className="border"/>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebarMenu;
