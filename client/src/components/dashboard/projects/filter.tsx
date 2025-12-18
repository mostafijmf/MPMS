"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Button } from "@/components/ui/button";
import { Filter, Trash } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const ProjectsFilter = () => {
  const { set, get, has, clear, remove } = useQueryParams();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimeout(() => {
      if (value) set("search", value);
      else remove("search");
    }, 300);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <Input
        type="text"
        defaultValue={get("search") || ""}
        placeholder="Search..."
        className="max-w-96"
        onChange={handleOnChange}
      />
      <div className="flex items-center justify-between lg:gap-4 gap-2">
        {has && (
          <Button variant={"outline"} className="h-9 max-lg:p-2!" onClick={clear}>
            <Trash className="size-5 lg:hidden" />
            <span className="max-lg:hidden">Clear</span>
          </Button>
        )}

        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant={"outline"} className="h-9">
              <Filter />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter</SheetTitle>
            </SheetHeader>

            <FilterOptions />
          </SheetContent>
        </Sheet>

        <FilterOptions className="max-lg:hidden" />
      </div>
    </div>
  );
};

export default ProjectsFilter;

const FilterOptions = ({ className }: { className?: string }) => {
  const { set, get, has, clear } = useQueryParams();

  return (
    <div className={cn("flex max-lg:flex-col items-center justify-between gap-3 max-lg:px-5", className)}>
      <Select value={get("status") || ""} onValueChange={(val) => set("status", val)}>
        <SelectTrigger className="lg:w-32 w-full cursor-pointer">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="planned">Planned</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
      {has && (
        <Button variant={"outline"} className="h-9 max-lg:w-full lg:hidden mt-5" onClick={clear}>
          <Trash className="size-4" />
          Clear
        </Button>
      )}
    </div>
  );
};
