import {
  users,
  students,
  activities,
  recommendations,
  alerts,
  behaviorEntries,
  studentGrowth,
  type User,
  type UpsertUser,
  type Student,
  type Activity,
  type Recommendation,
  type Alert,
  type BehaviorEntry,
  type StudentGrowth,
  type InsertStudent,
  type InsertActivity,
  type InsertRecommendation,
  type InsertAlert,
  type InsertBehaviorEntry,
  type InsertStudentGrowth,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Student operations
  getStudent(userId: string): Promise<Student | undefined>;
  getStudentById(id: number): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  getStudentsByParent(parentId: string): Promise<Student[]>;
  getStudentsByTeacher(teacherId: string): Promise<Student[]>;
  getStudentsByCounselor(counselorId: string): Promise<Student[]>;
  
  // Growth tracking
  getStudentGrowth(studentId: number, year?: number): Promise<StudentGrowth[]>;
  recordGrowth(growth: InsertStudentGrowth): Promise<StudentGrowth>;
  getGrowthByDimension(studentId: number, dimension: string): Promise<StudentGrowth[]>;
  
  // Activities
  getStudentActivities(studentId: number, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivityStatus(id: number, completed: boolean): Promise<Activity>;
  
  // Recommendations
  getStudentRecommendations(studentId: number, status?: string): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  updateRecommendationStatus(id: number, status: string): Promise<Recommendation>;
  
  // Alerts
  getStudentAlerts(studentId: number, acknowledged?: boolean): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  acknowledgeAlert(id: number, acknowledgedBy: string): Promise<Alert>;
  
  // Behavior tracking
  getBehaviorEntries(studentId: number, dimension?: string): Promise<BehaviorEntry[]>;
  recordBehavior(behavior: InsertBehaviorEntry): Promise<BehaviorEntry>;
  
  // Analytics
  getStudentStats(studentId: number): Promise<{
    overallGrowth: number;
    completedActivities: number;
    totalActivities: number;
    participationScore: number;
    activeRecommendations: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Student operations
  async getStudent(userId: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.userId, userId));
    return student;
  }

  async getStudentById(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const [newStudent] = await db.insert(students).values(student).returning();
    return newStudent;
  }

  async getStudentsByParent(parentId: string): Promise<Student[]> {
    return await db.select().from(students).where(sql`${students.parentIds} @> ${JSON.stringify([parentId])}`);
  }

  async getStudentsByTeacher(teacherId: string): Promise<Student[]> {
    return await db.select().from(students).where(sql`${students.teacherIds} @> ${JSON.stringify([teacherId])}`);
  }

  async getStudentsByCounselor(counselorId: string): Promise<Student[]> {
    return await db.select().from(students).where(eq(students.counselorId, counselorId));
  }

  // Growth tracking
  async getStudentGrowth(studentId: number, year?: number): Promise<StudentGrowth[]> {
    if (year) {
      return await db.select().from(studentGrowth)
        .where(and(eq(studentGrowth.studentId, studentId), eq(studentGrowth.year, year)))
        .orderBy(desc(studentGrowth.year), desc(studentGrowth.month));
    }
    return await db.select().from(studentGrowth)
      .where(eq(studentGrowth.studentId, studentId))
      .orderBy(desc(studentGrowth.year), desc(studentGrowth.month));
  }

  async recordGrowth(growth: InsertStudentGrowth): Promise<StudentGrowth> {
    const [newGrowth] = await db.insert(studentGrowth).values(growth).returning();
    return newGrowth;
  }

  async getGrowthByDimension(studentId: number, dimension: string): Promise<StudentGrowth[]> {
    return await db.select().from(studentGrowth)
      .where(and(
        eq(studentGrowth.studentId, studentId),
        eq(studentGrowth.dimension, dimension)
      ))
      .orderBy(desc(studentGrowth.year), desc(studentGrowth.month));
  }

  // Activities
  async getStudentActivities(studentId: number, limit = 50): Promise<Activity[]> {
    return await db.select().from(activities)
      .where(eq(activities.studentId, studentId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async updateActivityStatus(id: number, completed: boolean): Promise<Activity> {
    const [activity] = await db.update(activities)
      .set({ 
        completed,
        completedAt: completed ? new Date() : null
      })
      .where(eq(activities.id, id))
      .returning();
    return activity;
  }

  // Recommendations
  async getStudentRecommendations(studentId: number, status = "active"): Promise<Recommendation[]> {
    return await db.select().from(recommendations)
      .where(and(
        eq(recommendations.studentId, studentId),
        eq(recommendations.status, status)
      ))
      .orderBy(desc(recommendations.generatedAt));
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const [newRecommendation] = await db.insert(recommendations).values(recommendation).returning();
    return newRecommendation;
  }

  async updateRecommendationStatus(id: number, status: string): Promise<Recommendation> {
    const [recommendation] = await db.update(recommendations)
      .set({ status })
      .where(eq(recommendations.id, id))
      .returning();
    return recommendation;
  }

  // Alerts
  async getStudentAlerts(studentId: number, acknowledged?: boolean): Promise<Alert[]> {
    if (acknowledged !== undefined) {
      return await db.select().from(alerts)
        .where(and(
          eq(alerts.studentId, studentId),
          eq(alerts.acknowledged, acknowledged)
        ))
        .orderBy(desc(alerts.createdAt));
    }
    return await db.select().from(alerts)
      .where(eq(alerts.studentId, studentId))
      .orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async acknowledgeAlert(id: number, acknowledgedBy: string): Promise<Alert> {
    const [alert] = await db.update(alerts)
      .set({ 
        acknowledged: true,
        acknowledgedBy,
        acknowledgedAt: new Date()
      })
      .where(eq(alerts.id, id))
      .returning();
    return alert;
  }

  // Behavior tracking
  async getBehaviorEntries(studentId: number, dimension?: string): Promise<BehaviorEntry[]> {
    if (dimension) {
      return await db.select().from(behaviorEntries)
        .where(and(
          eq(behaviorEntries.studentId, studentId),
          eq(behaviorEntries.dimension, dimension)
        ))
        .orderBy(desc(behaviorEntries.observedAt));
    }
    return await db.select().from(behaviorEntries)
      .where(eq(behaviorEntries.studentId, studentId))
      .orderBy(desc(behaviorEntries.observedAt));
  }

  async recordBehavior(behavior: InsertBehaviorEntry): Promise<BehaviorEntry> {
    const [newBehavior] = await db.insert(behaviorEntries).values(behavior).returning();
    return newBehavior;
  }

  // Analytics
  async getStudentStats(studentId: number): Promise<{
    overallGrowth: number;
    completedActivities: number;
    totalActivities: number;
    participationScore: number;
    activeRecommendations: number;
  }> {
    const currentYear = new Date().getFullYear();
    
    // Get latest growth scores
    const growthData = await db.select().from(studentGrowth)
      .where(and(
        eq(studentGrowth.studentId, studentId),
        eq(studentGrowth.year, currentYear)
      ));

    // Calculate overall growth average
    const overallGrowth = growthData.length > 0 
      ? growthData.reduce((sum, g) => sum + parseFloat(g.score), 0) / growthData.length
      : 0;

    // Get activity stats
    const allActivities = await db.select().from(activities)
      .where(eq(activities.studentId, studentId));
    
    const completedActivities = allActivities.filter(a => a.completed).length;
    const totalActivities = allActivities.length;

    // Get participation score (average behavior scores)
    const behaviorData = await db.select().from(behaviorEntries)
      .where(eq(behaviorEntries.studentId, studentId));
    
    const participationScore = behaviorData.length > 0
      ? behaviorData.reduce((sum, b) => sum + b.score, 0) / behaviorData.length * 20 // Convert to 100 scale
      : 0;

    // Get active recommendations count
    const activeRecommendationsData = await db.select().from(recommendations)
      .where(and(
        eq(recommendations.studentId, studentId),
        eq(recommendations.status, "active")
      ));

    return {
      overallGrowth: Math.round(overallGrowth),
      completedActivities,
      totalActivities,
      participationScore: Math.round(participationScore),
      activeRecommendations: activeRecommendationsData.length
    };
  }
}

export const storage = new DatabaseStorage();