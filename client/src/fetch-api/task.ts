"use server";
import { API_URL } from "@/lib/secret";
import { apiError, apiSuccess } from "./api-response";
import { getAccessToken } from "@/lib/cookie-handler";
import { revalidatePath, revalidateTag } from "next/cache";
import { ITask } from "@/types";

// Revalidate Task cache
export const revalidateTask = async () => {
  revalidateTag("tasks", "max");
  revalidateTag("task", "max");
  revalidateTag("summary", "max");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
};


// <!-- Add Task By Sprint & Project ID -->
interface AddTaskIdsProps {
  projectId: string;
  sprintId: string;
  body: FormData
}
export const addTaskBySprintProjectIds = async ({ sprintId, projectId, body }: AddTaskIdsProps) => {
  try {
    const response = await fetch(
      `${API_URL}/projects/${projectId}/sprint/${sprintId}/task`,
      {
        method: "POST",
        headers: {
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
        body
      }
    );

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while adding task to sprint."
      );
    };
    await revalidateTask();

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while adding task to sprint."
    );
  }
};

// <!-- Update Task By ID -->
export const updateTaskById = async (id: string, body: FormData) => {
  try {
    const response = await fetch(
      `${API_URL}/projects/sprint/task/${id}`,
      {
        method: "PATCH",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
        body
      }
    );

    const result = await response.json();
    console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while updating task."
      );
    };
    await revalidateTask();

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while updating task."
    );
  }
};

// <!-- Update Task Status By ID -->
export const updateTaskStatusById = async (id: string, status: ITask["status"]) => {
  try {
    const response = await fetch(
      `${API_URL}/projects/sprint/task/status/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
        body: JSON.stringify({ status })
      }
    );

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while updating task status."
      );
    };
    await revalidateTask();

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while updating task status."
    );
  }
};

// <!-- Get Tasks By Sprint & Project ID -->
interface GetTaskIdsProps {
  projectId: string;
  sprintId: string;
}
export const getTaskBySprintProjectIds = async ({ sprintId, projectId }: GetTaskIdsProps) => {
  try {
    const response = await fetch(
      `${API_URL}/projects/${projectId}/sprint/${sprintId}/task`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
        cache: "force-cache",
        next: { tags: ["tasks"] }
      }
    );

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while fetching tasks."
      );
    };

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while fetching tasks."
    );
  }
};

// <!-- Delete Task By ID -->
export const deleteTaskById = async (id: string) => {
  try {
    const response = await fetch(
      `${API_URL}/projects/sprint/task/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `accessToken=${await getAccessToken()}`,
        },
        credentials: "include",
      }
    );

    const result = await response.json();
    // console.log("Fetch error response:", result);
    if (!response.ok) {
      return apiError(
        result?.message || "An unexpected error occurred while deleting task."
      );
    };
    await revalidateTask();

    return apiSuccess(result, result?.message);
  } catch (error: any) {
    return apiError(
      error?.message || "An unexpected error occurred while deleting task."
    );
  }
};
