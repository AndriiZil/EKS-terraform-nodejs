# Lumino Backend API

Simple Node.js Express application with health check endpoints for Kubernetes deployment.

## Endpoints

- `GET /` - Welcome message with available endpoints
- `GET /health` - Liveness probe endpoint
- `GET /ready` - Readiness probe endpoint  
- `GET /api/status` - Application status with system info

## Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Docker

### Build the image
```bash
  docker build --platform linux/amd64 -t lumino-backend .
```

### Run locally
```bash
  docker run -p 8080:8080 lumino-backend
```

### Test endpoints
```bash
curl http://localhost:8080/health
curl http://localhost:8080/ready
curl http://localhost:8080/api/status
```

## Push to ECR

```bash
# Login to ECR
  aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 081578102896.dkr.ecr.us-east-1.amazonaws.com/lumino-backend

# Tag for ECR
  docker tag lumino-backend:latest 081578102896.dkr.ecr.us-east-1.amazonaws.com/lumino-backend:latest

# Push to ECR
  docker push 081578102896.dkr.ecr.us-east-1.amazonaws.com/lumino-backend:latest
```

# Update Deployment
```bash
  kubectl rollout restart deployment lumino-backend
```

## Kubernetes Deployment

The app is designed to work with Kubernetes health checks:
- **Liveness Probe**: `GET /health` 
- **Readiness Probe**: `GET /ready`
- **Port**: 8080

## Environment Variables

- `PORT` - Server port (default: 8080)
- `NODE_ENV` - Environment (development/production) 