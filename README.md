# TravelBuddy (Frontend)

## Project Overview
TravelBuddy is a social-travel web platform that helps travelers create travel plans and find compatible travel buddies. 

## Tech Stack
- Next.js (TypeScript) 
- Tailwind CSS
- radix-ui 
- Zod (validation) 

## Credentials 

| Role  | Email               | Password               |
|------ |-------------------- |----------------------- |
| Admin | admin@travelbuddy.local  | Admin@12345  |
| User1 | john@example.com | Demo@23456  |
| User2 | demo2@example.com  | deMo@sd23  |
| User3 | demo3@example.com  | deMo@sd56  |


## Key Features (UI)
- Public pages: Home + exploration pages for discovering travelers and travel plans with filtering/details.
- Authentication: Register/Login with role support (User/Admin).
- User features: Create/manage travel plans, profile management, matchmaking/search experience.
- Admin features: Admin dashboard to manage users, travel plans, and platform content.
- Friendly error handling: Toasts/alerts and clear validation messages (no silent failures).

## Pages / Routes (Suggested)
- Home (minimum 6 sections) 
- /auth/login 
- /auth/register 
- /explore (Find Travel Buddy / matching) 
- /travel-plans (list + add/edit/delete) 
- /travel-plans/[id] (details) 
- /profile/[id] (public profile view) 
- /dashboard (role-based dashboard views) 



## Environment Variables (Example)
Create `.env.local` and set: 
- NEXT_PUBLIC_API_BASE_URL=<YOUR_BACKEND_BASE_URL> 
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<YOUR_STRIPE_PUBLISHABLE_KEY> 

## Local Setup
1. Install dependencies:
   - `bun install`
2. Run dev server: `bun run dev` 
3. Update API base URL so frontend can call backend endpoints. 


