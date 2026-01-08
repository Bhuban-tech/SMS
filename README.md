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
- Tailwind CSS
- Axios

## Project Structure
- `app/` – Application routes and pages
- `components/` – Reusable UI components
- `config/` – Application configuration and constants
- `context/` – Global state management and providers
- `hooks/` – Custom React hooks
- `lib/` – Shared libraries and utility logic

## Development
```bash
npm install
npm run dev
