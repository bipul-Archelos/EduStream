#!/bin/bash

echo "🔥 EduStream Launching..."

# 1. Kubernetes Files Apply karo (Just in case kuch change hua ho)
echo "📂 Applying Kubernetes Manifests..."
kubectl apply -f k8s/

# 2. Wait karo jab tak Pods ready na ho jayein
echo "⏳ Waiting for Pods to be ready..."
kubectl wait --for=condition=ready pod -l app=edustream-db --timeout=90s
kubectl wait --for=condition=ready pod -l app=edustream-backend --timeout=90s
kubectl wait --for=condition=ready pod -l app=edustream-frontend --timeout=90s

# 3. Port Forwarding Start karo
echo "🔌 Establishing Connections..."

# Ye trick hai: Jab script band karoge (Ctrl+C), to ye connections bhi band kar dega
trap 'kill $(jobs -p)' EXIT

# Backend aur Frontend ko background (&) mein chalao
kubectl port-forward svc/edustream-backend-service 8000:8000 > /dev/null 2>&1 &
kubectl port-forward svc/edustream-frontend-service 3000:3000 > /dev/null 2>&1 &

# Thoda wait taaki connection ban jaye
sleep 3

echo "---------------------------------------------------"
echo "✅ App is Live! Access here:"
echo "🌍 Frontend: http://localhost:3000"
echo "📄 Backend API: http://localhost:8000/docs"
echo "---------------------------------------------------"
echo "🛑 Press Ctrl+C to stop everything."

# Script ko hold par rakho taaki connection chalta rahe
wait