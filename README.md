# DevOps Sample Server

A Node.js Express server demonstrating a full DevOps toolchain.

## Tech Stack

| Tool            | Purpose                        |
|-----------------|-------------------------------|
| Node.js/Express | Application server             |
| Docker          | Containerization               |
| Docker Compose  | Local multi-service dev env    |
| Kubernetes      | Container orchestration        |
| Terraform       | AWS infrastructure as code     |
| GitHub Actions  | CI/CD pipeline                 |
| Jenkins         | Alternative CI/CD pipeline     |
| Prometheus      | Metrics collection             |
| Grafana         | Metrics visualization          |

## Project Structure

```
devops-sample-server/
├── app/
│   ├── server.js          # Express app with /metrics endpoint
│   ├── server.test.js     # Jest tests
│   ├── package.json
│   └── Dockerfile
├── k8s/
│   ├── deployment.yml     # K8s Deployment (2 replicas)
│   ├── service.yml        # K8s LoadBalancer Service
│   └── hpa.yml            # HorizontalPodAutoscaler
├── terraform/
│   ├── main.tf            # ECS + ECR + IAM + Security Group
│   ├── variables.tf
│   └── outputs.tf
├── monitoring/
│   └── prometheus.yml     # Prometheus scrape config
├── .github/workflows/
│   └── ci-cd.yml          # GitHub Actions pipeline
├── Jenkinsfile            # Jenkins pipeline
└── docker-compose.yml     # App + Prometheus + Grafana
```

## Quick Start (Local)

```bash
# Run everything locally
docker-compose up --build

# App:        http://localhost:3000
# Prometheus: http://localhost:9090
# Grafana:    http://localhost:3001  (admin/admin)
```

## Run Tests

```bash
cd app && npm ci && npm test
```

## Deploy to AWS

```bash
# 1. Provision infrastructure
cd terraform
terraform init
terraform apply -var="vpc_id=<vpc-id>" -var='subnet_ids=["<subnet-id>"]'

# 2. Build & push image
aws ecr get-login-password | docker login --username AWS --password-stdin <ecr-url>
docker build -t <ecr-url>/devops-sample-server:latest ./app
docker push <ecr-url>/devops-sample-server:latest

# 3. Deploy to Kubernetes
kubectl apply -f k8s/
```

## API Endpoints

| Endpoint   | Description              |
|------------|--------------------------|
| GET /      | Server info              |
| GET /health| Health check             |
| GET /metrics| Prometheus metrics      |

## CI/CD Flow

```
Push to main
    → GitHub Actions: Test → Build Docker → Push to ECR → Deploy to ECS
    → Jenkins (alternative): same stages
```

