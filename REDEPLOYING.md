# How to redeploy your service

1. Change your code
2. Build your image (`docker build...`)
3. Push your image (`docker tag...` + `docker push`)
4. Kill your pod so the deployment will create a new pod
   with the new image
   a) `kubectl get pods`
   b) `kubectl delete pod <id>` where `<id>` is the id from step a
