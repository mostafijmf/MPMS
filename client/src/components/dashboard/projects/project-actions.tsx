"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { IProject } from "@/types";
import { EllipsisVertical, Pencil, Repeat2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteProjectById, updateProjectById } from "@/fetch-api/project";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

const ProjectActions = ({ project }: { project: IProject }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="">
          <EllipsisVertical className="size-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="px-4 text-base">Actions</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Button variant={"ghost"} className="w-full justify-start" asChild>
            <Link href={`/dashboard/projects/${project?._id}/edit`}>
              <Pencil />
              Edit
            </Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ChangeProjectStatus project={project} />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <DeleteAction project={project} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectActions;

const ChangeProjectStatus = ({ project }: { project: IProject }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleUpdateStatus = async (status: string) => {
    if (project?.status === status) return;
    toast.promise(
      new Promise(async (resolve, reject) => {
        const formData = new FormData();
        formData.append("status", status);
        const { error, message, success } = await updateProjectById(project?._id as string, formData);
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
          <Repeat2 />
          Change Status
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Status</DialogTitle>
        </DialogHeader>
        <div className="pb-10 pt-6">
          <label className="text-sm font-medium mb-2 inline-block">Status</label>
          <Select defaultValue={project?.status} onValueChange={(value) => handleUpdateStatus(value)}>
            <SelectTrigger className="w-full h-11!">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DeleteAction = ({ project }: { project: IProject }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { error, message, success } = await deleteProjectById(project?._id as string);
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
            This action cannot be undone. This will permanently delete this project and removes data from our servers.
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
