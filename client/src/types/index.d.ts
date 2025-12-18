
export type IUserRole = "admin" | "manager" | "member";

// <!-- User -->
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: IUserRole;
  department: string;
  skills: string[];
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// <!-- Project -->
export interface IProject {
  _id?: string | ObjectId;
  title: string,
  client: string,
  description: string,
  startDate: Date,
  endDate: Date,
  budget: number,
  status: "planned" | "active" | "completed" | "archived";
  thumbnail: string,
  userId?: string | IUser;
}

// <!-- Sprint -->
export interface ISprint {
  _id?: string | ObjectId;
  title: string,
  sprintNumber: number,
  order: number
  projectId: string | IProject,
  userId: string | IUser,
  startDate: Date,
  endDate: Date,
}

// <!-- Task -->
export interface ITask {
  _id?: string | ObjectId;
  title: string;
  description: string;
  assigns: IUser[];
  estimateHours: number;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "review" | "done";
  dueDate: Date;
  projectId: IProject;
  sprintId: ISprint;
  attachments: IAttachment[];
  createdAt?: Date;
  updatedAt?: Date;
  // comments: IComment
}

export interface IAttachment {
  filename: string;
  url: string;
  size?: number;
}

// <!-- Comment -->
export interface IComment {
  _id?: string | ObjectId;
  author: IUser;
  task: ITask;
  body: string;
  parentId: IComment | null;
}


// <!-- Pagination -->
export interface IPagination {
  totalPage: number;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
}