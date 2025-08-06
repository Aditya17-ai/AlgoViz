import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const algorithms = pgTable("algorithms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'sorting', 'searching', 'data-structure', 'graph'
  difficulty: text("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
  description: text("description").notNull(),
  timeComplexity: text("time_complexity").notNull(),
  spaceComplexity: text("space_complexity").notNull(),
  implementation: text("implementation").notNull(),
  visualization: jsonb("visualization").notNull(), // Visualization configuration
  created_at: timestamp("created_at").defaultNow(),
});

export const visualizationSessions = pgTable("visualization_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  algorithmId: varchar("algorithm_id").references(() => algorithms.id).notNull(),
  inputData: jsonb("input_data").notNull(),
  steps: jsonb("steps").notNull(),
  metrics: jsonb("metrics").notNull(), // comparisons, swaps, time taken
  created_at: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(), // Browser session ID
  algorithmId: varchar("algorithm_id").references(() => algorithms.id).notNull(),
  completed: boolean("completed").default(false),
  bestTime: integer("best_time"), // milliseconds
  attempts: integer("attempts").default(0),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertAlgorithmSchema = createInsertSchema(algorithms).omit({
  id: true,
  created_at: true,
});

export const insertVisualizationSessionSchema = createInsertSchema(visualizationSessions).omit({
  id: true,
  created_at: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  created_at: true,
});

export type Algorithm = typeof algorithms.$inferSelect;
export type InsertAlgorithm = z.infer<typeof insertAlgorithmSchema>;
export type VisualizationSession = typeof visualizationSessions.$inferSelect;
export type InsertVisualizationSession = z.infer<typeof insertVisualizationSessionSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
