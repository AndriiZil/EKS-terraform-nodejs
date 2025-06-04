# Working with kubernetes

## Update Deployment after image pushing to ECR

```bash
  kubectl rollout restart deployment lumino-backend
```

## Get the URL first
```bash
    LB_URL=$(kubectl get svc lumino-backend-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
```

## Make requests
```bash
    curl http://$LB_URL/health
    curl http://$LB_URL/ready
    curl http://$LB_URL/api/status
```

# PostgreSQL

```bash
  terraform plan
  terraform apply

  # Get RDS endpoint
  terraform output rds_endpoint

  # Encode and update the secret
  echo -n 'my-eks-cluster-db.c03b3gbav8a4.us-east-1.rds.amazonaws.com' | base64
  echo -n 'postgres' | base64

  # Apply the secret
  kubectl apply -f k8s/postgres-secret.yaml
```

# PostgreSQL debugging

```bash
  kubectl get pods

  kubectl exec -it lumino-backend-55449475cc-xp2vl -- /bin/sh

  nc -zv my-eks-cluster-db.c03b3gbav8a4.us-east-1.rds.amazonaws.com 5432

  nc -zv $POSTGRES_HOST $POSTGRES_PORT
```
