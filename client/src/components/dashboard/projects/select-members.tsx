import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getAllUsersByAdmin } from "@/fetch-api/user";
import { nameSplitter } from "@/lib/utils";
import { IUser } from "@/types";
import { Check, ChevronDown, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const SelectMembers = ({ defaultUsers, onChange }: { defaultUsers?: IUser[]; onChange: (data: IUser[]) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [usersData, setUsersData] = useState<IUser[]>([]);
  const [selectedData, setSelectedData] = useState<IUser[]>(defaultUsers || []);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadUsers = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const res = await getAllUsersByAdmin({ page, limit: 10 });
    const data = res?.data?.data;

    setUsersData((prev) => [...prev, ...data?.users]);
    setHasMore(Boolean(data?.pagination?.nextPage));
    setPage((p) => p + 1);
    setIsLoading(false);
  }, [page, isLoading, hasMore]);

  // <!-- Infinite scrolling Effect To Load Data -->
  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadUsers();
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadUsers]);

  const toggleUser = (user: IUser) => {
    setSelectedData((prev) => {
      const updated = prev.find((u) => u._id === user._id) ? prev.filter((u) => u._id !== user._id) : [...prev, user];
      onChange(updated);
      return updated;
    });
  };

  const handleOpenChange = (value: boolean) => {
    setIsOpen(value);
    if (value && usersData.length === 0) {
      loadUsers();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange} modal={true}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="w-full min-h-11 h-auto justify-between hover:bg-background">
          {selectedData.length > 0 ? (
            <div className="flex flex-wrap gap-1 flex-1 mr-2">
              {selectedData.map((user) => (
                <Badge key={user?._id} variant="secondary" className="gap-1 pr-1">
                  <Avatar className="size-5">
                    <AvatarFallback className="bg-background">{nameSplitter(user?.name)}</AvatarFallback>
                  </Avatar>
                  <span className="max-w-24 truncate">{user.name}</span>
                  <div onClick={() => toggleUser(user)} className="ml-1 rounded-full hover:bg-background/50 p-0.5">
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">Select </span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="min-w-fit p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList className="max-h-75 overflow-auto">
            <CommandEmpty>No users found.</CommandEmpty>

            <CommandGroup>
              {usersData.map((user) => {
                const isSelected = selectedData.some((u) => u._id === user._id);

                return (
                  <CommandItem
                    key={user._id}
                    onSelect={() => toggleUser(user)}
                    className="flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Avatar className="size-8 shadow">
                      <AvatarImage src={user?.avatar || "/user.png"} />
                      <AvatarFallback className="text-xs">{nameSplitter(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {hasMore && (
              <div ref={observerRef} className="flex items-center justify-center py-3">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectMembers;
