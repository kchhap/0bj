"use server"

import dbConnect from "@/lib/mongodb"
import Project, { type IProject } from "@/models/Project"
import { revalidatePath } from "next/cache"

export async function saveProject(projectData: { userId: string; name: string; prompt: string; modelUrl?: string }) {
  try {
    await dbConnect()
    const newProject = new Project(projectData)
    await newProject.save()
    revalidatePath("/") // Revalidate the home page to show new projects in sidebar
    return { success: true, message: "Project saved successfully!" }
  } catch (error: any) {
    console.error("Error saving project:", error)
    return { success: false, message: error.message || "Failed to save project." }
  }
}

export async function getProjects(userId: string): Promise<IProject[]> {
  try {
    await dbConnect()
    const projects = await Project.find({ userId }).sort({ createdAt: -1 }).lean() // Sort by newest first
    // Convert _id to string for client-side compatibility
    return projects.map((project) => ({
      ...project,
      _id: project._id.toString(),
      createdAt: project.createdAt.toISOString(), // Ensure date is stringified
    })) as IProject[]
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export async function deleteProject(projectId: string, userId: string) {
  try {
    await dbConnect()
    const result = await Project.deleteOne({ _id: projectId, userId: userId }) // Ensure user owns the project
    if (result.deletedCount === 0) {
      return { success: false, message: "Project not found or you don't have permission to delete it." }
    }
    revalidatePath("/") // Revalidate the home page to update project list
    return { success: true, message: "Project deleted successfully!" }
  } catch (error: any) {
    console.error("Error deleting project:", error)
    return { success: false, message: error.message || "Failed to delete project." }
  }
}
