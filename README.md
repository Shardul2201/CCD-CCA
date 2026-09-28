# SentinelDesk

SentinelDesk is a cloud-based cybersecurity incident management system developed as an individual Cloud Computing and DevOps project.

## Project Overview

SentinelDesk allows users to record, classify, search, filter, and track cybersecurity incidents through a web-based dashboard.

The application demonstrates a complete development and deployment workflow using Git, GitHub, automated testing, Docker, GitHub Actions, and Render cloud deployment.

## Features

- Security incident dashboard
- Incident reporting form
- Severity classification
- Incident status tracking
- Search and filtering
- Case-insensitive incident search
- JSON API for incident data
- Health check endpoint
- Running commit ID displayed on the dashboard
- Input validation for incident reports

## Technology Stack

- Node.js
- Express.js
- EJS
- HTML/CSS
- Node.js Test Runner
- Supertest
- ESLint
- Docker
- Git
- GitHub
- GitHub Actions
- Render

## Application Routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/` | Incident dashboard |
| GET | `/incidents/new` | Incident reporting form |
| POST | `/incidents` | Create a new incident |
| POST | `/incidents/:id/status` | Update incident status |
| GET | `/api/incidents` | JSON incident API |
| GET | `/health` | Application health check |

## Local Setup

Clone the repository and install dependencies:

```bash
npm install