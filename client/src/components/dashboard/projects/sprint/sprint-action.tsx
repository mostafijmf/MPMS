"use client";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { deleteSprintById } from "@/fetch-api/sprint";
import { ISprint } from "@/types";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SprintFormModal } from "./add-sprint";

const SprintAction = ({ sprint }: { sprint: ISprint }) => {
  const [isEditForm, setIsEditForm] = useState<ISprint | null>(null);

  return (
    <div className="mr-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="">
            <MoreVertical className="size-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 pb-3">
          <DropdownMenuLabel className="px-4 text-base">Actions</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Button variant={"ghost"} className="w-full justify-start" onClick={() => setIsEditForm(sprint)}>
              <Pencil />
              Edit
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <DeleteAction sprint={sprint} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SprintFormModal
        isOpen={isEditForm ? true : false}
        sprint={isEditForm!}
        setIsOpen={() => setIsEditForm(null)}
        type="update"
      />
    </div>
  );
};

export default SprintAction;

const DeleteAction = ({ sprint }: { sprint: ISprint }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { error, message, success } = await deleteSprintById(sprint._id);
      if (success) {
        toast.success(message);
        router.push(`/dashboard/projects/${sprint?.projectId || ""}`);
      }
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
            This action cannot be undone. This will permanently delete this sprint and all tasks data from our servers.
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
