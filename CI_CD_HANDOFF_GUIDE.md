# CI/CD Pipeline Specification & Setup Guide

**Project:** LexFix DevOps
**Date:** 2026-02-19
**Author:** DevOps Team

---

## 1. Executive Summary

This document defines the architecture, requirements, and setup instructions for the Automated Continuous Integration & Deployment (CI/CD) pipeline for `lexfix_devops`.
The pipeline is built using **GitHub Actions**, containerized with **Docker**, and deployed to **Vercel**.

## 2. Technology Stack

| Component            | Technology     | Purpose                                       |
| :------------------- | :------------- | :-------------------------------------------- |
| **Orchestration**    | GitHub Actions | Automates the workflow on git events.         |
| **Containerization** | Docker         | Builds portable images of the application.    |
| **Registry**         | Docker Hub     | Stores the built Docker images.               |
| **Deployment**       | Vercel         | Hosting platform for the Next.js application. |
| **Testing**          | Vitest         | Runs unit and integration tests.              |
| **Linting**          | ESLint         | Ensures code quality and consistency.         |

## 3. Workflow Architecture

The pipeline consists of a single workflow file: `.github/workflows/ci-cd.yml`.

### Triggers

- **Push**: To `main` or `develop` branches.
- **Pull Request**: To `main` or `develop` branches.

### Jobs

#### 1. `test_and_validate`

_Runs on every trigger._

1.  **Checkout**: Clones the code.
2.  **Install**: `npm ci` (Clean install).
3.  **Lint**: `npm run lint` (Checks for syntax/style errors).
4.  **Test**: `npm run test` (Runs Vitest suite).
5.  **Build Check**: `npm run build` (Ensures Next.js builds successfully).

#### 2. `build_and_push`

_Runs on Push to `main` or `develop` (skipped on PRs)._

1.  **Login**: Authenticates with Docker Hub.
2.  **Build**: Creates Docker image from `Dockerfile.app`.
3.  **Push**: Uploads image to Docker Hub tagged with commit SHA and `latest`.

#### 3. `deploy_vercel`

_Runs on Push to `main` only._

1.  **Install**: Installs Vercel CLI.
2.  **Pull Config**: Retrieves Vercel environment settings.
3.  **Deploy**: Deploys the built artifacts to Vercel Production.

## 4. Configuration Requirements

To activate this pipeline, the following **Secrets** must be added to the GitHub Repository (`Settings` -> `Secrets and variables` -> `Actions`).

### 4.1 Docker Hub Secrets

| Secret Name          | Value Description                                                                                       |
| :------------------- | :------------------------------------------------------------------------------------------------------ |
| `DOCKERHUB_USERNAME` | Your Docker Hub User ID.                                                                                |
| `DOCKERHUB_TOKEN`    | Access Token (Read/Write) generated in [Docker Hub Settings](https://hub.docker.com/settings/security). |

### 4.2 Vercel Secrets

| Secret Name         | Value Description | How to Retrieve                                                                 |
| :------------------ | :---------------- | :------------------------------------------------------------------------------ |
| `VERCEL_TOKEN`      | User API Token    | Generate at [Vercel Tokens](https://vercel.com/account/tokens).                 |
| `VERCEL_ORG_ID`     | Organization ID   | Run `npx vercel link` locally -> Look in `.vercel/project.json` -> `orgId`.     |
| `VERCEL_PROJECT_ID` | Project ID        | Run `npx vercel link` locally -> Look in `.vercel/project.json` -> `projectId`. |

## 5. Implementation Steps (For DevOps Engineer)

If setting this up from scratch or maintaining it, follow these steps:

1.  **Clone Repository**:

    ```bash
    git clone https://github.com/Swasthika-P-S/lexfix_devops.git
    cd lexfix_devops
    ```

2.  **Verify Workflow File**:
    Ensure `.github/workflows/ci-cd.yml` exists and matches the architecture defined above.

3.  **Setup Vercel Link (Local)**:

    ```bash
    npm install -g vercel
    vercel login
    vercel link
    # Follow prompts to link to your Vercel project
    ```

    _This generates the `.vercel/project.json` file needed for IDs._

4.  **Configure GitHub Secrets**:
    - Add `DOCKERHUB_USERNAME` & `DOCKERHUB_TOKEN`.
    - Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, & `VERCEL_PROJECT_ID`.

5.  **Trigger First Run**:

    ```bash
    git commit --allow-empty -m "chore: trigger ci/cd"
    git push origin main
    ```

6.  **Verify**:
    - Check "Actions" tab in GitHub for green checkmarks.
    - Check Docker Hub for the new image.
    - Check Vercel Dashboard for the new deployment.

## 6. Troubleshooting

- **Vercel Deploy Fails?** Ensure `VERCEL_PROJECT_ID` matches the project you linked.
- **Docker Login Fails?** Ensure you are using an **Access Token**, not your password.
- **Tests Fail?** Run `npm run test` locally to debug before pushing.
