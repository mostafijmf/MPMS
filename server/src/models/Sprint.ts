import { model, models, Schema } from "mongoose";
import { ISprint } from "../types";

const sprintSchema = new Schema<ISprint>({
  title: {
    type: String,
    required: [true, "Sprint title is required"],
    trim: true,
  },
  sprintNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  order: {
    type: Number,
    default: 0,
    min: 0,
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
      message: "End date must be before start date",
    },
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

sprintSchema.pre("validate", async function () {
  if (this.isNew) {
    const SprintModel = models.Sprint || model("Sprint");
    const count = await SprintModel.countDocuments({ projectId: this.projectId });
    this.sprintNumber = count + 1;
  }
});

const Sprint = models.Sprint || model("Sprint", sprintSchema);

export default Sprint;