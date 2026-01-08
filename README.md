# SMS Portal – Frontend

## Overview
SMS Portal is a single-admin web application that enables smooth and efficient SMS communication. The admin can send SMS messages individually, in bulk, or to custom-defined groups. The frontend provides an intuitive interface for managing contacts, groups, delivery reports, and payment workflows.

## Features
- Admin-only access
- Send SMS:
  - Individual messaging
  - Bulk messaging
  - Group-based messaging
- CSV import for bulk contacts
- CSV export for:
  - Delivery reports
  - Saved contacts
- Delivery report tracking
- Group management (create and manage custom groups)
- eSewa and Khalti payment integration
- Clean and responsive user interface

## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- Axios

## Project Structure
- `app/` – Application routes and pages
- `components/` – Reusable UI components
- `services/` – API service handlers
- `utils/` – Helper utilities
- `styles/` – Global styles

## Environment Variables
Create a `.env.local` file and configure required variables:
- API base URL
- eSewa public key
- Khalti public key

## Development
```bash
npm install
npm run dev
