import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVisualizationSessionSchema, insertUserProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all algorithms
  app.get("/api/algorithms", async (req, res) => {
    try {
      const algorithms = await storage.getAlgorithms();
      res.json(algorithms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch algorithms" });
    }
  });

  // Get algorithms by category
  app.get("/api/algorithms/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const algorithms = await storage.getAlgorithmsByCategory(category);
      res.json(algorithms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch algorithms by category" });
    }
  });

  // Get single algorithm
  app.get("/api/algorithms/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const algorithm = await storage.getAlgorithm(id);
      if (!algorithm) {
        return res.status(404).json({ message: "Algorithm not found" });
      }
      res.json(algorithm);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch algorithm" });
    }
  });

  // Create visualization session
  app.post("/api/visualization-sessions", async (req, res) => {
    try {
      const validatedData = insertVisualizationSessionSchema.parse(req.body);
      const session = await storage.createVisualizationSession(validatedData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid session data" });
    }
  });

  // Get visualization session
  app.get("/api/visualization-sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.getVisualizationSession(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });

  // Get user progress
  app.get("/api/progress/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const progress = await storage.getUserProgress(sessionId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Update user progress
  app.post("/api/progress", async (req, res) => {
    try {
      const validatedData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.updateUserProgress(validatedData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
