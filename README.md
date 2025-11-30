# CoilFlow Manufacturing System

Complete manufacturing management system for tracking coils, loads, and locations.

## 🚀 Quick Start with Docker

### Start All Services
```bash
docker compose up -d
```

### Access Services
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3010
- **phpMyAdmin**: http://localhost:8088

### Stop Services
```bash
docker compose down
```

## 📚 Documentation

- **[Docker Guide](DOCKER.md)** - Complete Docker setup and management
- **[Quick Reference](DOCKER_QUICK_REFERENCE.md)** - Common commands

## 🏗️ Architecture

- **Backend**: NestJS + TypeORM (Port 3010)
- **Frontend**: React + Vite + Nginx (Port 3000)
- **Database**: MySQL 8.0 (Internal only)
- **phpMyAdmin**: Database management (Port 8088)

All services communicate via internal Docker network.
