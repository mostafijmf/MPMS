import validator from "validator";
import { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value: string) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be 6 length"],
      validate: {
        validator: (value: string) =>
          validator.isStrongPassword(value, {
            minLength: 6,
            // minNumbers: 1,
            // minUppercase: 1,
            // minSymbols: 1,
          }),
        message: "Password {VALUE} is not enough strong!",
      },
      set: (v: string) => bcrypt.hashSync(v, bcrypt.genSaltSync(12)),
    },
    role: {
      type: String,
      enum: ["admin", "manager", "member"],
      default: "member",
    },
    avatar: { type: String, },
    department: { type: String },
    skills: {
      type: [String],
      validate: {
        validator: (arr) => arr.length <= 20,
        message: "You can add up to 20 skills",
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;
