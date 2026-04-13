import { type Response } from "express";
import { ZodError } from "zod";
import { projectService } from "../services/project.service";
import type { AuthRequest } from "../../../middleware/auth.middleware";
import {
  CreateProjectDtoSchema,
  UpdateProjectDtoSchema,
  ProjectQueryDtoSchema,
  ProjectParamsDtoSchema,
} from "../dto/project.dto";

class ProjectController {
  /**
   * POST /api/projects
   * Create a new project
   */
  async create(req: AuthRequest, res: Response) {
    try {
      // Validate request body
      const data = CreateProjectDtoSchema.parse(req.body);

      // Get admin ID from auth middleware
      const adminId = req.adminId;
      if (!adminId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized - Admin ID not found",
        });
      }

      const project = await projectService.createProject(data, adminId);

      res.status(201).json({
        success: true,
        data: project,
        message: "Project created successfully",
      });
    } catch (error: any) {
      console.error("Error creating project:", error);

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.issues,
        });
      }

      if (error.code === "P2002") {
        return res.status(409).json({
          success: false,
          error: "Project with this slug already exists",
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to create project",
      });
    }
  }

  /**
   * GET /api/projects
   * Get all projects with filtering and pagination
   */
  async getAll(req: AuthRequest, res: Response) {
    try {
      const query = ProjectQueryDtoSchema.parse(req.query);

      const result = await projectService.getProjects(query);

      res.json({
        success: true,
        data: result.projects,
        pagination: result.pagination,
      });
    } catch (error: any) {
      console.error("Error getting projects:", error);

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.issues,
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to get projects",
      });
    }
  }

  /**
   * GET /api/projects/:id
   * Get single project by ID
   */
  async getById(req: AuthRequest, res: Response) {
    try {
      const params = ProjectParamsDtoSchema.parse(req.params);

      const project = await projectService.getProjectById(params.id);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      res.json({
        success: true,
        data: project,
      });
    } catch (error: any) {
      console.error("Error getting project:", error);

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.issues,
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to get project",
      });
    }
  }

  /**
   * GET /api/projects/slug/:slug
   * Get single project by slug
   */
  async getBySlug(req: AuthRequest, res: Response) {
    try {
      const slugParam = (req.params as any).slug as string | string[];
      const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

      const project = await projectService.getProjectBySlug(slug);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      res.json({
        success: true,
        data: project,
      });
    } catch (error: any) {
      console.error("Error getting project by slug:", error);

      res.status(500).json({
        success: false,
        error: "Failed to get project",
      });
    }
  }

  /**
   * PUT /api/projects/:id
   * Update project
   */
  async update(req: AuthRequest, res: Response) {
    try {
      const params = ProjectParamsDtoSchema.parse(req.params);
      const data = UpdateProjectDtoSchema.parse(req.body);

      const project = await projectService.updateProject(params.id, data);

      res.json({
        success: true,
        data: project,
        message: "Project updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating project:", error);

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.issues,
        });
      }

      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      if (error.code === "P2002") {
        return res.status(409).json({
          success: false,
          error: "Project with this slug already exists",
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to update project",
      });
    }
  }

  /**
   * DELETE /api/projects/:id
   * Delete project
   */
  async delete(req: AuthRequest, res: Response) {
    try {
      const params = ProjectParamsDtoSchema.parse(req.params);

      await projectService.deleteProject(params.id);

      res.json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting project:", error);

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.issues,
        });
      }

      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to delete project",
      });
    }
  }

  /**
   * POST /api/projects/:id/publish
   * Publish project
   */
  async publish(req: AuthRequest, res: Response) {
    try {
      const params = ProjectParamsDtoSchema.parse(req.params);

      const project = await projectService.publishProject(params.id);

      res.json({
        success: true,
        data: project,
        message: "Project published successfully",
      });
    } catch (error: any) {
      console.error("Error publishing project:", error);

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.issues,
        });
      }

      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to publish project",
      });
    }
  }

  /**
   * POST /api/projects/:id/featured
   * Toggle featured status
   */
  async toggleFeatured(req: AuthRequest, res: Response) {
    try {
      const params = ProjectParamsDtoSchema.parse(req.params);

      const result = await projectService.toggleFeatured(params.id);

      if (!result) {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      res.json({
        success: true,
        data: result,
        message: result.isFeatured ? "Project marked as featured" : "Project unmarked as featured",
      });
    } catch (error: any) {
      console.error("Error toggling featured:", error);

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.issues,
        });
      }

      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to toggle featured status",
      });
    }
  }

  /**
   * POST /api/projects/:id/archive
   * Archive project
   */
  async archive(req: AuthRequest, res: Response) {
    try {
      const params = ProjectParamsDtoSchema.parse(req.params);

      const project = await projectService.archiveProject(params.id);

      res.json({
        success: true,
        data: project,
        message: "Project archived successfully",
      });
    } catch (error: any) {
      console.error("Error archiving project:", error);

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.issues,
        });
      }

      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to archive project",
      });
    }
  }
}

export const projectController = new ProjectController();
