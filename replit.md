# Real Estate Property Platform

## Overview
A modern real estate platform built with React, TypeScript, and Express.js. The application allows users to browse, filter, and view property listings with a clean, modern interface featuring Arabic language support.

## Project Architecture

### Backend
- Express.js server with TypeScript
- PostgreSQL database with Drizzle ORM
- API routes for properties, inquiries, and chat conversations
- Session-based storage with in-memory store

### Frontend
- React with TypeScript and Vite
- Tailwind CSS for styling with shadcn/ui components
- Wouter for client-side routing
- TanStack Query for data fetching and caching
- Arabic language support throughout the interface

### Database Schema
- **Properties**: Real estate listings with pricing, location, features, and agent information
- **Inquiries**: User inquiries about specific properties
- **Chat Conversations**: AI assistant conversations
- **Users**: Basic user authentication

## Key Features
- Property listing with filtering by type and price category
- Featured properties showcase
- Responsive design with dark mode support
- Arabic language interface
- Property details with image galleries
- AI assistant integration (Header component includes AI chat)

## Recent Changes (August 4, 2025)
✓ Fixed import issues with Supabase dependencies
✓ Converted InspireAI component from Supabase to use internal API
✓ Fixed TypeScript type errors throughout the application
✓ Updated property field references to match Drizzle schema
✓ Fixed Header component style tag warnings
✓ Added proper prop interface for FeaturedProperties component
✓ Application now running successfully on port 5000

## File Structure
- `server/` - Express.js backend with API routes and database storage
- `client/src/` - React frontend application
- `shared/` - Shared TypeScript schemas and types
- `client/src/components/` - Reusable UI components
- `client/src/pages/` - Application pages (Index, Properties, Login, etc.)

## Technical Details
- Server runs on port 5000 serving both API and frontend
- Database queries use Drizzle ORM with PostgreSQL
- Frontend uses modern React patterns with hooks and context
- Styling with Tailwind CSS and custom CSS variables for theming
- Arabic language support with RTL-friendly layout

## Current Status
The application is fully functional and running without errors. All components are properly typed and API endpoints are working correctly.