import { Schema, models, model, type Document } from "mongoose"

export interface IProject extends Document {
  userId: string
  name: string
  prompt: string
  modelUrl?: string // URL to the generated 3D model
  createdAt: Date
}

const ProjectSchema = new Schema<IProject>({
  userId: {
    type: String,
    required: true,
    index: true, // Index for faster queries by userId
  },
  name: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  modelUrl: {
    type: String,
    required: false, // Optional, as model generation might happen later
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Project = models.Project || model<IProject>("Project", ProjectSchema)

export default Project
