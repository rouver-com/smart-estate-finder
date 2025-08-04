import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc } from "drizzle-orm";
import { 
  users, 
  properties, 
  inquiries, 
  chatConversations,
  type User, 
  type InsertUser,
  type Property,
  type InsertProperty,
  type Inquiry,
  type InsertInquiry,
  type ChatConversation,
  type InsertChatConversation
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property operations
  getProperties(): Promise<Property[]>;
  getFeaturedProperties(): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;
  
  // Inquiry operations
  getInquiries(): Promise<Inquiry[]>;
  getInquiriesByProperty(propertyId: string): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: string, inquiry: Partial<InsertInquiry>): Promise<Inquiry | undefined>;
  
  // Chat conversation operations
  getChatConversations(): Promise<ChatConversation[]>;
  getChatConversation(sessionId: string): Promise<ChatConversation | undefined>;
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  updateChatConversation(sessionId: string, conversation: Partial<InsertChatConversation>): Promise<ChatConversation | undefined>;
}

export class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    const sql = neon(process.env.DATABASE_URL!);
    this.db = drizzle(sql);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Property operations
  async getProperties(): Promise<Property[]> {
    return await this.db.select().from(properties).where(eq(properties.isActive, true)).orderBy(desc(properties.createdAt));
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return await this.db.select().from(properties)
      .where(eq(properties.isActive, true))
      .where(eq(properties.isFeatured, true))
      .orderBy(desc(properties.createdAt));
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const result = await this.db.select().from(properties).where(eq(properties.id, id));
    return result[0];
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const result = await this.db.insert(properties).values(property).returning();
    return result[0];
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const result = await this.db.update(properties).set(property).where(eq(properties.id, id)).returning();
    return result[0];
  }

  async deleteProperty(id: string): Promise<boolean> {
    const result = await this.db.update(properties).set({ isActive: false }).where(eq(properties.id, id)).returning();
    return result.length > 0;
  }

  // Inquiry operations
  async getInquiries(): Promise<Inquiry[]> {
    return await this.db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  async getInquiriesByProperty(propertyId: string): Promise<Inquiry[]> {
    return await this.db.select().from(inquiries).where(eq(inquiries.propertyId, propertyId)).orderBy(desc(inquiries.createdAt));
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const result = await this.db.insert(inquiries).values(inquiry).returning();
    return result[0];
  }

  async updateInquiry(id: string, inquiry: Partial<InsertInquiry>): Promise<Inquiry | undefined> {
    const result = await this.db.update(inquiries).set(inquiry).where(eq(inquiries.id, id)).returning();
    return result[0];
  }

  // Chat conversation operations
  async getChatConversations(): Promise<ChatConversation[]> {
    return await this.db.select().from(chatConversations).orderBy(desc(chatConversations.createdAt));
  }

  async getChatConversation(sessionId: string): Promise<ChatConversation | undefined> {
    const result = await this.db.select().from(chatConversations).where(eq(chatConversations.sessionId, sessionId));
    return result[0];
  }

  async createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation> {
    const result = await this.db.insert(chatConversations).values(conversation).returning();
    return result[0];
  }

  async updateChatConversation(sessionId: string, conversation: Partial<InsertChatConversation>): Promise<ChatConversation | undefined> {
    const result = await this.db.update(chatConversations).set(conversation).where(eq(chatConversations.sessionId, sessionId)).returning();
    return result[0];
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<string, Property>;
  private inquiries: Map<string, Inquiry>;
  private conversations: Map<string, ChatConversation>;
  currentUserId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.inquiries = new Map();
    this.conversations = new Map();
    this.currentUserId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Property operations
  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => p.isActive);
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => p.isActive && p.isFeatured);
  }

  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = crypto.randomUUID();
    const now = new Date();
    const newProperty: Property = { 
      ...property, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const existing = this.properties.get(id);
    if (!existing) return undefined;
    
    const updated: Property = { 
      ...existing, 
      ...property, 
      updatedAt: new Date() 
    };
    this.properties.set(id, updated);
    return updated;
  }

  async deleteProperty(id: string): Promise<boolean> {
    const existing = this.properties.get(id);
    if (!existing) return false;
    
    const updated: Property = { 
      ...existing, 
      isActive: false, 
      updatedAt: new Date() 
    };
    this.properties.set(id, updated);
    return true;
  }

  // Inquiry operations
  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  async getInquiriesByProperty(propertyId: string): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).filter(i => i.propertyId === propertyId);
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const id = crypto.randomUUID();
    const newInquiry: Inquiry = { 
      ...inquiry, 
      id, 
      createdAt: new Date() 
    };
    this.inquiries.set(id, newInquiry);
    return newInquiry;
  }

  async updateInquiry(id: string, inquiry: Partial<InsertInquiry>): Promise<Inquiry | undefined> {
    const existing = this.inquiries.get(id);
    if (!existing) return undefined;
    
    const updated: Inquiry = { 
      ...existing, 
      ...inquiry 
    };
    this.inquiries.set(id, updated);
    return updated;
  }

  // Chat conversation operations
  async getChatConversations(): Promise<ChatConversation[]> {
    return Array.from(this.conversations.values());
  }

  async getChatConversation(sessionId: string): Promise<ChatConversation | undefined> {
    return Array.from(this.conversations.values()).find(c => c.sessionId === sessionId);
  }

  async createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation> {
    const id = crypto.randomUUID();
    const now = new Date();
    const newConversation: ChatConversation = { 
      ...conversation, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.conversations.set(id, newConversation);
    return newConversation;
  }

  async updateChatConversation(sessionId: string, conversation: Partial<InsertChatConversation>): Promise<ChatConversation | undefined> {
    const existing = Array.from(this.conversations.values()).find(c => c.sessionId === sessionId);
    if (!existing) return undefined;
    
    const updated: ChatConversation = { 
      ...existing, 
      ...conversation, 
      updatedAt: new Date() 
    };
    this.conversations.set(existing.id, updated);
    return updated;
  }
}

// Use database storage by default, fall back to memory storage if DATABASE_URL is not available
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
