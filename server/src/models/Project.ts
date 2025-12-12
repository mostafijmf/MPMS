import { model, models, Schema } from "mongoose";
import { IProject } from "../types";

const projectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: [true, "Project title is required"],
    trim: true,
  },
  client: {
    type: String,
    required: [true, "Client is required"]
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    validate: {
      validator: function (val) {
        return val >= (this as any).startDate;
      },
      message: "End date must be after start date",
    },
  },
  budget: {
    type: Number,
    min: [0, "Budget cannot be negative"],
  },
  status: {
    type: String,
    enum: ["planned", "active", "completed", "archived"],
    default: "planned"
  },
  thumbnail: String,
  members: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true });

const Project = models.Project || model("Project", projectSchema);

export default Project;