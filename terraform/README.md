# EKS + ECR Terraform Configuration

Production-ready EKS cluster with ECR repositories, VPC, and all necessary components.

## Quick Start

```bash
# Copy example variables
cp terraform.tfvars.example terraform.tfvars

# Edit variables to your needs
vim terraform.tfvars

# Initialize and deploy
terraform init
terraform plan
terraform apply
```

## What's Created

- **EKS Cluster** with encryption and logging
- **VPC** with public/private subnets across 3 AZs
- **NAT Gateways** for private subnet internet access
- **Node Group** with auto-scaling
- **ECR Repositories** with lifecycle policies
- **Security Groups** with proper ingress/egress rules
- **IAM Roles** with minimal required permissions
- **CloudWatch Log Groups** for cluster logs

## Post-Deployment

Configure kubectl:
```bash
aws eks --region <region> update-kubeconfig --name <cluster-name>
```

Push to ECR:
```bash
# Get login token
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com

# Tag and push
docker tag my-app:latest <account-id>.dkr.ecr.<region>.amazonaws.com/app:latest  
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/app:latest
```

## Customization

- Modify `variables.tf` for different defaults
- Add more ECR repos in `ecr_repositories` variable
- Adjust node group sizing in variables
- Change instance types for different workloads

## Clean Up

```bash
terraform destroy
```

## Deployment Workflow

1. Deploy infrastructure
```bash
terraform apply
```

2. Configure kubectl
```bash
aws eks --region us-east-1 update-kubeconfig --name my-eks-cluster
```

3. Build and push your image
```bash
docker build -t lumino-backend .
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin $(terraform output -raw ecr_registry_id).dkr.ecr.us-west-2.amazonaws.com
docker tag lumino-backend:latest $(terraform output -raw ecr_repository_url):latest
docker push $(terraform output -raw ecr_repository_url):latest
```

4. Update the deployment YAML with actual values
```bash
sed -i 's/ACCOUNT_ID/$(terraform output -raw ecr_registry_id)/g' example-deployment.yaml
sed -i 's/REGION/us-west-2/g' example-deployment.yaml
```

5. Deploy to Kubernetes
```bash
kubectl apply -f example-deployment.yaml
```

6. Check pods are running
```bash
kubectl get pods -l app=lumino-backend
``` 