import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IUser } from "@/types";
import { Edit, Trash } from "lucide-react";
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
import { deleteUserById } from "@/fetch-api/user";
import { Spinner } from "@/components/ui/spinner";

const TableAction = ({ data }: { data: IUser }) => {
  const [isLoading, setIsLoading] = useState(false);

  // <!-- Handle Delete Account -->
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { error, message, success } = await deleteUserById(data?._id as string);
      if (success) {
        toast.success(message);
      }
      if (error) toast.error(message);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <ViewUserDetails user={data} />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={"link"} className="p-0! h-max rounded-full">
            <Edit className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit</TooltipContent>
      </Tooltip>

      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button variant={"link"} className="p-0! h-max rounded-full text-destructive">
                <Trash className="size-5" />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>

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
    </div>
  );
};

export default TableAction;
