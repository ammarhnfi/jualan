# Depok Hyperlocal Marketplace PWA

A blazing-fast, location-first Progressive Web App (PWA) designed for Depok, Indonesia. Built with Next.js, Node.js/Express, and PostgreSQL + PostGIS for spatial radius queries and marketplace clustering.

## Features
- **30-Second Posting**: Auto-geolocation with simple Form UX.
- **Map-Based Discovery**: Clustering map (Leaflet) directly on the homepage showing items in a Depok region mock boundary.
- **PostGIS Spatial Queries**: Lightning-fast geospatial indexes for radius discovery (`ST_DWithin`).
- **Offline PWA Support**: Caches App Shell for offline availability.
- **Social Sharing**: Copy & Share generator for Instagram and TikTok.

## Tech Stack
- Frontend: Next.js (App Router), TailwindCSS, React-Leaflet, next-pwa.
- Backend: Node.js, Express, `pg` driver.
- Database: PostgreSQL (15) with PostGIS (3.3) extension.
- Deployment: Docker Compose.

---

## Local Development / Running the App

### Prerequisites
- Docker & Docker Compose installed OR Node.js 18+ and PostgreSQL with PostGIS installed locally.
- 5432, 3000, 4000 ports available.

### Quick Start with Docker (Recommended)
You can run the entire stack (Database, Backend API, Frontend PWA) with a single command:
```bash
docker-compose up -d --build
```

**Access the services:**
- **Frontend / PWA UI**: `http://localhost:3000`
- **Backend API API**: `http://localhost:4000/api/health`
- **Database**: `localhost:5432` (User: `postgres`, Password: `password`, DB: `mypwa`)

### First Run Checklist
1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Grant Location Permissions.
3. Click "Post in 30s" to create a test listing with your coords.
4. Verify the new pin drops immediately on the map cluster.

---

## Deployment Guide (Production)
The provided `docker-compose.yml` is production-ready. For a remote server:
1. Ensure the server has Docker installed.
2. Clone this project.
3. Update environment variables in `frontend/next.config.js` and `backend/server.js` if necessary (e.g. use standard `.env` mapped to Docker configs).
4. Run `docker-compose up -d --build`.
5. For HTTPS and custom domains, simply run the Next.js server behind an NGINX reverse-proxy or Cloudflare Tunnel.

### PWA Note
For PWA and Geolocation features to work on a mobile phone (outside of localhost), your frontend **must be served over HTTPS**.
