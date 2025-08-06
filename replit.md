# Overview

AlgoViz is an interactive algorithm visualization platform that allows users to learn and understand various algorithms through visual demonstrations. The application provides an educational tool for visualizing sorting, searching, data structure, and graph algorithms with step-by-step execution controls and performance metrics tracking.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Comprehensive component library built on Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with custom CSS variables for theme management and algorithm visualization colors
- **State Management**: React Query (TanStack Query) for server state management and local React state for UI interactions
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom theme provider supporting light/dark modes with system preference detection

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API with structured endpoints for algorithms, visualization sessions, and user progress
- **Data Layer**: In-memory storage implementation with interface abstraction for future database integration
- **Development Setup**: Vite middleware integration for hot module replacement in development

## Database Schema
- **ORM**: Drizzle ORM configured for PostgreSQL with schema definitions
- **Tables**: 
  - Algorithms: Store algorithm metadata, implementations, and visualization configurations
  - Visualization Sessions: Track user interactions and algorithm execution data
  - User Progress: Monitor learning progress and performance metrics
- **Data Types**: JSON fields for complex data storage (visualization configs, execution steps, metrics)

## Visualization Engine
- **Canvas Rendering**: HTML5 Canvas-based visualization system with custom drawing utilities
- **Algorithm Support**: Modular architecture supporting sorting, searching, data structure, and graph algorithms
- **Animation Controls**: Step-by-step execution with play/pause/stop controls and variable speed settings
- **Performance Tracking**: Real-time metrics collection for comparisons, swaps, and execution time

## Component Architecture
- **Reusable UI**: Comprehensive set of accessible UI components following design system principles
- **Algorithm Components**: Specialized components for algorithm selection, visualization canvas, and control panels
- **Custom Hooks**: React hooks for algorithm execution state, canvas operations, and responsive design

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18 with TypeScript, React Query for data fetching
- **Build Tools**: Vite for development and build processes, ESBuild for server bundling
- **Styling**: Tailwind CSS with PostCSS processing, class-variance-authority for component variants

## UI and Interaction Libraries
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Icons**: Lucide React for consistent iconography
- **Form Handling**: React Hook Form with Zod resolvers for validation
- **Date Utilities**: date-fns for date manipulation and formatting

## Database and Backend
- **Database**: PostgreSQL with Neon serverless driver for cloud deployment
- **ORM**: Drizzle ORM with Drizzle Kit for migrations and schema management
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod for runtime type validation and schema generation

## Development and Deployment
- **Development**: Replit-specific plugins for error overlay and cartographer integration
- **Carousel**: Embla Carousel for interactive UI components
- **Utilities**: clsx and tailwind-merge for conditional styling, nanoid for ID generation

## Algorithm Visualization
- **Canvas Management**: Custom hooks and utilities for HTML5 Canvas manipulation
- **Animation Framework**: Built-in step management system for algorithm visualization
- **Performance Monitoring**: Custom metrics collection for algorithm analysis