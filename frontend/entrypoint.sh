#!/bin/sh

echo "Waiting for backend to be available..."

sleep 5

echo "Backend is available"

echo "Starting NGINX..."


nginx -g 'daemon off;'
