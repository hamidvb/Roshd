import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  decimal,
  boolean,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User roles enum
export const userRoles = ["student", "parent", "teacher", "counselor", "admin"] as const;
export type UserRole = typeof userRoles[number];

// Users table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 20 }).notNull().default("student"),
  schoolId: varchar("school_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Students table
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  studentNumber: varchar("student_number").unique(),
  grade: varchar("grade"),
  section: varchar("section"),
  birthDate: timestamp("birth_date"),
  parentIds: jsonb("parent_ids").$type<string[]>().default([]),
  teacherIds: jsonb("teacher_ids").$type<string[]>().default([]),
  counselorId: varchar("counselor_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Growth dimensions
export const growthDimensions = [
  "spiritual_religious",
  "emotional_moral", 
  "scientific_research",
  "economic_professional",
  "social_political",
  "patriotic",
  "artistic_aesthetic",
  "biological_physical"
] as const;

export type GrowthDimension = typeof growthDimensions[number];

// Student growth tracking
export const studentGrowth = pgTable("student_growth", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  dimension: varchar("dimension", { length: 50 }).notNull(),
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  evaluatedBy: varchar("evaluated_by").references(() => users.id).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Activities
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // academic, social, artistic, etc.
  dimension: varchar("dimension", { length: 50 }),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  dueDate: timestamp("due_date"),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Recommendations
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  priority: varchar("priority").notNull().default("medium"), // high, medium, low
  dimension: varchar("dimension", { length: 50 }),
  status: varchar("status").default("active"), // active, completed, dismissed
  generatedAt: timestamp("generated_at").defaultNow(),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
});

// Alerts/Warnings
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  type: varchar("type").notNull(), // early_warning, achievement, concern
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  severity: varchar("severity").default("medium"), // high, medium, low
  acknowledged: boolean("acknowledged").default(false),
  acknowledgedBy: varchar("acknowledged_by").references(() => users.id),
  acknowledgedAt: timestamp("acknowledged_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Behavioral tracking
export const behaviorEntries = pgTable("behavior_entries", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  dimension: varchar("dimension", { length: 50 }).notNull(),
  behavior: varchar("behavior").notNull(),
  score: integer("score").notNull(), // 1-5 scale
  observedBy: varchar("observed_by").references(() => users.id).notNull(),
  observedAt: timestamp("observed_at").defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  generatedAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertBehaviorEntrySchema = createInsertSchema(behaviorEntries).omit({
  id: true,
  createdAt: true,
});

export const insertStudentGrowthSchema = createInsertSchema(studentGrowth).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
export type BehaviorEntry = typeof behaviorEntries.$inferSelect;
export type StudentGrowth = typeof studentGrowth.$inferSelect;

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type InsertBehaviorEntry = z.infer<typeof insertBehaviorEntrySchema>;
export type InsertStudentGrowth = z.infer<typeof insertStudentGrowthSchema>;
