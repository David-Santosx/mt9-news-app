#!/bin/sh
set -e

echo "Waiting for MinIO to start..."
sleep 10

echo "Configuring MinIO..."
mc alias set minio http://minio:9000 minioadmin minioadmin123

echo "Creating news images..."
mc mb --ignore-existing minio/news-images

echo "Setting bucket policy..."
mc anonymous set download minio/news-images

echo "Setting bucket policy (ads-images)..."
mc mb --ignore-existing minio/ads-images
mc anonymous set download minio/ads-images

echo "MinIO configuration completed successfully"
