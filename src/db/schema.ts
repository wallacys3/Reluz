import { pgTable, serial, text, timestamp, integer, boolean, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Admin users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull().unique(),
  displayName: text('display_name'),
  role: text('role').default('admin').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Services table
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  price: text('price'), // e.g., "A partir de R$ 150"
  category: text('category').notNull(), // 'Estética Externa', 'Estética Interna', etc.
  imageUrl: text('image_url'),
  isActive: boolean('is_active').default(true).notNull(),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Packages/Plans table
export const plans = pgTable('plans', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  description: text('description').notNull(),
  features: text('features').array().notNull(), // PostgreSQL array of strings
  isPopular: boolean('is_popular').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Bookings/Agendamentos table
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerWhatsapp: text('customer_whatsapp').notNull(),
  vehicleModel: text('vehicle_model').notNull(),
  vehicleYear: text('vehicle_year'),
  serviceType: text('service_type').notNull(),
  preferredDate: text('preferred_date').notNull(), // YYYY-MM-DD
  preferredTime: text('preferred_time').notNull(), // HH:MM
  observations: text('observations'),
  status: text('status').default('pending').notNull(), // pending, confirmed, cancelled, completed
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Gallery table
export const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  imageUrl: text('image_url').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Blog/Dicas table
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  imageUrl: text('image_url'),
  isPublished: boolean('is_published').default(false).notNull(),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Company Settings table
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(), // e.g., 'whatsapp', 'address', 'hours'
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Clients table
export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  address: text('address'),
  carModel: text('car_model').notNull(),
  licensePlate: text('license_plate').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
// Products table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').default(0).notNull(),
  sold: integer('sold').default(0).notNull(),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Sales table
export const sales = pgTable('sales', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(), // 'service' | 'product'
  itemId: integer('item_id'), // Reference ID (optional if item is deleted)
  itemName: text('item_name').notNull(),
  quantity: integer('quantity').default(1).notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text('payment_method').notNull(), // 'credit_card', 'pix', 'cash'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
