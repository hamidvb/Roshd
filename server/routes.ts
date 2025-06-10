import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-fixed";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertStudentSchema,
  insertActivitySchema,
  insertRecommendationSchema,
  insertAlertSchema,
  insertBehaviorEntrySchema,
  insertStudentGrowthSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Always try to get student profile
      const student = await storage.getStudent(userId);

      res.json({ ...user, student });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Student routes
  app.get("/api/students/:id", isAuthenticated, async (req: any, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const student = await storage.getStudentById(studentId);
      
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ message: "Failed to fetch student" });
    }
  });

  app.post("/api/students", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(validatedData);
      res.status(201).json(student);
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(400).json({ message: "Invalid student data" });
    }
  });

  // Dashboard data route
  app.get("/api/dashboard", isAuthenticated, async (req: any, res) => {
    try {
      // Set JSON content type explicitly
      res.setHeader('Content-Type', 'application/json');
      const studentId = parseInt(req.query.studentId as string) || 1;
      const currentYear = new Date().getFullYear();

      // Get comprehensive dashboard data
      const [
        stats,
        growthData,
        activities,
        recommendations,
        alerts
      ] = await Promise.all([
        storage.getStudentStats(studentId),
        storage.getStudentGrowth(studentId, currentYear),
        storage.getStudentActivities(studentId, 10),
        storage.getStudentRecommendations(studentId, "active"),
        storage.getStudentAlerts(studentId, false)
      ]);

      // Group growth data by dimension for charts
      const growthByDimension = growthData.reduce((acc, growth) => {
        if (!acc[growth.dimension]) {
          acc[growth.dimension] = [];
        }
        acc[growth.dimension].push(growth);
        return acc;
      }, {} as Record<string, any[]>);

      res.json({
        stats,
        growthByDimension,
        recentActivities: activities,
        recommendations,
        alerts
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Growth tracking routes
  app.get("/api/growth/:studentId", isAuthenticated, async (req: any, res) => {
    try {
      const studentId = parseInt(req.params.studentId);
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const growth = await storage.getStudentGrowth(studentId, year);
      res.json(growth);
    } catch (error) {
      console.error("Error fetching growth data:", error);
      res.status(500).json({ message: "Failed to fetch growth data" });
    }
  });

  app.post("/api/growth", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertStudentGrowthSchema.parse({
        ...req.body,
        evaluatedBy: req.user.claims.sub
      });
      const growth = await storage.recordGrowth(validatedData);
      res.status(201).json(growth);
    } catch (error) {
      console.error("Error recording growth:", error);
      res.status(400).json({ message: "Invalid growth data" });
    }
  });

  // Activity routes
  app.get("/api/activities/:studentId", isAuthenticated, async (req: any, res) => {
    try {
      const studentId = parseInt(req.params.studentId);
      const activities = await storage.getStudentActivities(studentId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertActivitySchema.parse({
        ...req.body,
        createdBy: req.user.claims.sub
      });
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(400).json({ message: "Invalid activity data" });
    }
  });

  app.patch("/api/activities/:id/complete", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { completed } = req.body;
      const activity = await storage.updateActivityStatus(id, completed);
      res.json(activity);
    } catch (error) {
      console.error("Error updating activity:", error);
      res.status(500).json({ message: "Failed to update activity" });
    }
  });

  // Recommendation routes
  app.get("/api/recommendations/:studentId", isAuthenticated, async (req: any, res) => {
    try {
      const studentId = parseInt(req.params.studentId);
      const status = req.query.status as string || "active";
      const recommendations = await storage.getStudentRecommendations(studentId, status);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.post("/api/recommendations", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertRecommendationSchema.parse(req.body);
      const recommendation = await storage.createRecommendation(validatedData);
      res.status(201).json(recommendation);
    } catch (error) {
      console.error("Error creating recommendation:", error);
      res.status(400).json({ message: "Invalid recommendation data" });
    }
  });

  // Alert routes
  app.get("/api/alerts/:studentId", isAuthenticated, async (req: any, res) => {
    try {
      const studentId = parseInt(req.params.studentId);
      const acknowledged = req.query.acknowledged === 'true' ? true : 
                         req.query.acknowledged === 'false' ? false : undefined;
      const alerts = await storage.getStudentAlerts(studentId, acknowledged);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      console.error("Error creating alert:", error);
      res.status(400).json({ message: "Invalid alert data" });
    }
  });

  app.patch("/api/alerts/:id/acknowledge", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const alert = await storage.acknowledgeAlert(id, userId);
      res.json(alert);
    } catch (error) {
      console.error("Error acknowledging alert:", error);
      res.status(500).json({ message: "Failed to acknowledge alert" });
    }
  });

  // Behavior tracking routes
  app.get("/api/behavior/:studentId", isAuthenticated, async (req: any, res) => {
    try {
      const studentId = parseInt(req.params.studentId);
      const dimension = req.query.dimension as string;
      const behaviors = await storage.getBehaviorEntries(studentId, dimension);
      res.json(behaviors);
    } catch (error) {
      console.error("Error fetching behavior entries:", error);
      res.status(500).json({ message: "Failed to fetch behavior entries" });
    }
  });

  app.post("/api/behavior", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertBehaviorEntrySchema.parse({
        ...req.body,
        observedBy: req.user.claims.sub
      });
      const behavior = await storage.recordBehavior(validatedData);
      res.status(201).json(behavior);
    } catch (error) {
      console.error("Error recording behavior:", error);
      res.status(400).json({ message: "Invalid behavior data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
