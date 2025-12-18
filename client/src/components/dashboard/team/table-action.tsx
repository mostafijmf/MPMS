import { Button } from "@/components/ui/button";
import { IUser } from "@/types";
import { MoreHorizontal, Pencil, Trash2, UserCog } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ViewUserDetails from "./view-user-details";
import { useState } from "react";
import { toast } from "sonner";
import { deleteUserById, updateUserById } from "@/fetch-api/user";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamFormModal } from "./team-form";

const TableAction = ({ data }: { data: IUser }) => {
  const [isEditForm, setIsEditForm] = useState<IUser | null>(null);

  return (
    <div className="flex items-center gap-4 justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="">
            <MoreHorizontal className="size-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="px-4 text-base">Actions</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <ViewUserDetails user={data} />
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Button variant={"ghost"} className="w-full justify-start" onClick={() => setIsEditForm(data)}>
              <Pencil />
              Edit
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <UpdateUserRole user={data} />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <DeleteAction user={data} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <!-- Edit Form Modal --> */}
      <TeamFormModal
        type="update"
        isOpen={isEditForm ? true : false}
        setIsOpen={() => setIsEditForm(null)}
        user={data}
      />
    </div>
  );
};

export default TableAction;

const UpdateUserRole = ({ user }: { user: IUser }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRoleUpdate = async (role: string) => {
    if (user?.role === role) return;

    toast.promise(
      new Promise(async (resolve, reject) => {
        const formData = new FormData();
        formData.append("role", role);
        const { error, message, success } = await updateUserById(user?._id as string, formData);
        if (success) {
          resolve(message);
          setDialogOpen(false);
        }
        if (error) reject(message);
      }),
      {
        loading: "Loading...",
        success: (data: any) => data,
        error: (data: any) => data,
      }
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="w-full justify-start">
          <UserCog />
          Update Role
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update user role</DialogTitle>
          <DialogDescription>Change the role and permissions for this user</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-12 shadow">
                <AvatarImage src={user?.avatar || "/user.png"} alt={user?.name} />
                <AvatarFallback>{user?.name}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 mb-2">
            <label className="text-sm font-medium">Role</label>
            <Select defaultValue={user?.role} onValueChange={(value) => handleRoleUpdate(value)}>
              <SelectTrigger className="w-full h-10!">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DeleteAction = ({ user }: { user: IUser }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { error, message, success } = await deleteUserById(user?._id as string);
      if (success) toast.success(message);
      if (error) toast.error(message);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} className="w-full justify-start text-destructive hover:text-destructive!">
          <Trash2 />
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this account and remove your data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="cursor-pointer">
            {isLoading ? (
              <>
                <Spinner /> Loading...
              </>
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
