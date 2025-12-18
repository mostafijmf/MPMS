"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sprintSchema = new mongoose_1.Schema({
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
                return val >= this.startDate;
            },
            message: "End date must be before start date",
        },
    },
    projectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });
sprintSchema.pre("validate", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew) {
            const SprintModel = mongoose_1.models.Sprint || (0, mongoose_1.model)("Sprint");
            const count = yield SprintModel.countDocuments({ projectId: this.projectId });
            this.sprintNumber = count + 1;
        }
    });
});
const Sprint = mongoose_1.models.Sprint || (0, mongoose_1.model)("Sprint", sprintSchema);
exports.default = Sprint;
