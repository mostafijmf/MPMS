"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const TableFilter = () => {
  const { set, get, has, clear, remove } = useQueryParams();
  const [debouncedValue, setDebouncedValue] = useState(get("search") || "");

  // <!-- Search query with debounce -->
  useEffect(() => {
    const timer = setTimeout(() => {
      set("search", debouncedValue);
      if (!debouncedValue) remove("search");
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedValue, set, remove]);

  return (
    <div className="mb-4 flex items-center justify-between">
      <Input
        type="text"
        defaultValue={debouncedValue}
        placeholder="Search..."
        className="max-w-96"
        onChange={(e) => setDebouncedValue(e.target.value)}
      />
      <div className="flex items-center justify-between gap-4">
        {has && (
          <Button variant={"outline"} className="h-9" onClick={clear}>
            Clear
          </Button>
        )}
        <Select value={get("role") || ""} onValueChange={(val) => set("role", val)}>
          <SelectTrigger className="w-45 cursor-pointer">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TableFilter;
