import Project from "../models/Project";
import Sprint from "../models/Sprint";
import Task from "../models/Task";
import User from "../models/User";
import { ExpressProps } from "../types";
import { successResponse } from "./responseController";

// <!-- Get All Summary -->
export const getSummary: ExpressProps = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    if (role === "member") {
      const filter = { assigns: userId }
      const myTasks = await Task.find(filter)
        .sort({ dueDate: 1 })
        .populate("projectId", "title")
        .populate("sprintId", "title");
      const completedTasks = await Task.countDocuments({ ...filter, status: "done" });
      const inProgressTasks = await Task.countDocuments({ ...filter, status: "in_progress" });
      const overdueTasks = await Task.countDocuments({
        ...filter,
        status: "done",
        dueDate: { $lt: new Date() }
      });

      const projectIds = [
        ...new Set(myTasks.map((t) => t.projectId?._id?.toString())),
      ];

      const projects = await Project.find({
        _id: { $in: projectIds },
      }).select("title status");


      return successResponse(res, {
        statusCode: 200,
        message: `Summary were returned successfully`,
        data: {
          role: "member",
          stats: {
            myTasks: myTasks.length,
            inProgressTasks,
            completedTasks,
            overdueTasks,
          },
          myTasks,
          projects,
        }
      });
    }
    else {
      // <!-- Projects -->
      const totalProjects = await Project.countDocuments();
      const activeProjects = await Project.countDocuments({ status: "active" });

      // <!-- Tasks -->
      const totalTasks = await Task.countDocuments();
      const completedTasks = await Task.countDocuments({ status: "done" });

      // <!-- Project Progress -->
      const projects = await Project.find({ status: "active" }).lean();
      const projectIds = projects.map((p) => p._id);
      const tasks = await Task.find({ projectId: { $in: projectIds } });

      const projectProgress = projects.map((project) => {
        const projectTasks = tasks.filter(
          (t) => t.projectId.toString() === project._id.toString()
        );

        const done = projectTasks.filter((t) => t.status === "done").length;
        const total = projectTasks.length;

        return {
          _id: project._id,
          title: project.title,
          progress: total ? Math.round((done / total) * 100) : 0,
        };
      });

      // Team workload
      const users = await User.find({ role: "member" }).select("name");

      const workload = await Promise.all(
        users.map(async (user) => {
          const userTasks = await Task.find({ assigns: user._id });

          return {
            user: user.name,
            total: userTasks.length,
            inProgress: userTasks.filter(
              (t) => t.status === "in_progress"
            ).length,
            overdue: userTasks.filter(
              (t) => t.dueDate && t.dueDate < new Date() && t.status !== "done"
            ).length,
          };
        })
      );


      return successResponse(res, {
        statusCode: 200,
        message: `Summary were returned successfully`,
        data: {
          role,
          stats: {
            totalProjects,
            activeProjects,
            totalTasks,
            completedTasks,
          },
          activeProjects: projectProgress,
          teamWorkload: workload,
        }
      });
    }
  } catch (error) {
    next(error)
  }
};