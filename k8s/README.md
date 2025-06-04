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
