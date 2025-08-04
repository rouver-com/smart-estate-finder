import { pgTable, text, serial, integer, boolean, decimal, uuid, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  price: decimal("price", { precision: 15, scale: 2 }).notNull(),
  priceType: text("price_type", { enum: ['للبيع', 'للإيجار'] }).default('للبيع'),
  propertyType: text("property_type", { enum: ['شقة', 'فيلا', 'مكتب', 'محل تجاري', 'أرض', 'مستودع'] }).notNull(),
  bedrooms: integer("bedrooms").default(0),
  bathrooms: integer("bathrooms").default(0),
  parking: integer("parking").default(0),
  area: decimal("area", { precision: 10, scale: 2 }),
  buildYear: integer("build_year"),
  floorNumber: text("floor_number"),
  images: text("images").array().default([]),
  features: text("features").array().default([]),
  amenities: text("amenities").array().default([]),
  agentName: text("agent_name"),
  agentPhone: text("agent_phone"),
  agentEmail: text("agent_email"),
  agentImage: text("agent_image"),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").references(() => properties.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  message: text("message").notNull(),
  inquiryType: text("inquiry_type", { enum: ['عام', 'معاينة', 'استفسار سعر', 'تفاوض'] }).default('عام'),
  status: text("status", { enum: ['جديد', 'قيد المراجعة', 'تم الرد', 'مكتمل'] }).default('جديد'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const chatConversations = pgTable("chat_conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id").notNull(),
  userName: text("user_name"),
  userEmail: text("user_email"),
  userPhone: text("user_phone"),
  conversationData: json("conversation_data").default([]),
  status: text("status", { enum: ['نشط', 'مكتمل', 'مغلق'] }).default('نشط'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export const insertChatConversationSchema = createInsertSchema(chatConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
