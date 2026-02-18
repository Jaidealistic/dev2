# DevOps & Infrastructure Plan for LexFix

**Project:** LexFix

---

## 1. Executive Summary

This document outlines the DevOps strategy, CI/CD pipeline, and infrastructure requirements for LexFix. The goal is to ensure a **reliable, scalable, and automated** delivery process that supports rapid iteration while maintaining strict accessibility and performance standards.

---

## 2. CI/CD Pipeline Strategy

We will use **GitHub Actions** for our Continuous Integration and Continuous Deployment (CI/CD) pipeline. This integration provides seamless feedback on Pull Requests and automates deployments.

### 2.1 Workflow Stages

#### Stage 1: Continuous Integration (On Pull Request)

Triggered by any PR to `develop` or `main`.

1.  **Linting & Formatting:**
    - Run `npm run lint` (ESLint) to ensure code quality.
    - Run `npx prettier --check .` to enforce formatting.
2.  **Type Checking:**
    - Run `tsc --noEmit` to verify TypeScript integrity.
3.  **Unit & Integration Tests:**
    - Run `npm run test` (Vitest).
    - **Gate:** Pipeline fails if any test fails or coverage drops below threshold.
4.  **Build Verification:**
    - Run `npm run build` to ensure the Next.js app compiles without errors.

#### Stage 2: Continuous Deployment (On Merge to `develop`/`main`)

Triggered by push to `develop` (Staging) or `main` (Production).

1.  **Containerization:**
    - Build Docker images for:
      - `lexfix-app` (Next.js)
      - `lexfix-ml` (Python FastAPI)
    - Push to Container Registry (GHCR or AWS ECR).
2.  **Database Migration:**
    - Run `npx prisma migrate deploy` against the target environment database.
3.  **Deployment:**
    - Deploy updated containers to the orchestration platform.
    - Update environment variables if changed.
4.  **Smoke Tests:**
    - Run `npm run test:e2e` (Playwright) against the deployed URL.

---

## 3. Environment Strategy

| Environment     | URL                          | Purpose                                         | Branch           | Data                                        |
| :-------------- | :--------------------------- | :---------------------------------------------- | :--------------- | :------------------------------------------ |
| **Local (Dev)** | `http://localhost:3000`      | Active development & debugging.                 | Feature Branches | Local Docker DB (`docker-compose`)          |
| **Staging**     | `https://staging.lexfix.com` | Integration testing, UAT, Accessibility Audits. | `develop`        | Anonymized dump of Prod or Seed Data        |
| **Production**  | `https://app.lexfix.com`     | Live user traffic.                              | `main`           | Live Production DB (Snapshot backups daily) |

---

## 4. Deployment & Infrastructure

### 4.1 Containerization Strategy (Docker)

The application is containerized to ensure consistency across environments.

**Frontend (`Dockerfile.app`):**

- Base: `node:18-alpine`
- Build: Multi-stage build (install deps -> build -> runner).
- Optimization: Use `standalone` output mode in Next.js for smaller image size.

**ML Service (`Dockerfile.ml`):**

- Base: `python:3.9-slim`
- Dependencies: `pip install -r requirements.txt` (FastAPI, Torch, Librosa).
- Optimization: Pre-download heavy ML models during build or mount via volume.

### 4.2 Orchestration

**Recommended:** **Kubernetes (K8s)** or **Docker Swarm**.
Given the microservices interaction, K8s offers robust service discovery and scaling.

- **Ingress Controller:** Nginx (handles SSL termination and routing).
- **Service Discovery:** Internal DNS (app can call `http://ml-service:8000`).
- **Secrets Management:** Kubernetes Secrets (for DB credentials, API keys).

### 4.3 Database Management

- **PostgreSQL:** Primary relational data (User profiles, Lessons). Managed service recommended (AWS RDS / Supabase).
- **MongoDB:** Unstructured logs and flexible audit trails.
- **Redis:** Caching session data and socket.io pub/sub.

---

## 5. Monitoring & Observability

### 5.1 Application Monitoring (APM)

- **Sentry:** Integrated into Next.js and Python. Tracks unhandled exceptions, performance bottlenecks, and "User Misery" scores.
- **OpenTelemetry:** Standardized tracing across the Node.js frontend and Python backend to visualize request latency.

### 5.2 Infrastructure Monitoring

- **Prometheus:** Scrapes metrics from containers (CPU, Memory, Request Rate).
- **Grafana:** Visualizes Prometheus data. Dashboards for:
  - _API Latency_ (p95/p99)
  - _Error Rates_ (5xx)
  - _ML Inference Time_

### 5.3 Logging

- **ELK Stack (Elasticsearch, Logstash, Kibana)** or **Loki/Grafana**.
- Centralized logging is essential for debugging issues that span multiple services (e.g., "User clicked record -> App sent audio -> ML processed -> Result returned").

---

## 6. Definition of Done (DoD) for DevOps

A deployment is only considered "Complete" when:

- [ ] CI Pipeline passes (Lint, Build, Test).
- [ ] Docker images built and scanned for vulnerabilities (Trivy).
- [ ] Database migrations applied successfully.
- [ ] Services are healthy (`/health` endpoint returns 200 OK).
- [ ] Smoke tests passed on the target environment.
- [ ] Monitoring alerts configured (and not firing).
