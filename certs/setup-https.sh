#!/usr/bin/env bash

set -e

echo "🔍 Detecting local IP..."
IP=$(hostname -I | awk '{print $1}')
echo "✅ Your IP: $IP"

# Check mkcert
if ! command -v mkcert &> /dev/null
then
  echo "📦 Installing mkcert..."

  sudo apt update
  sudo apt install -y libnss3-tools

  wget -q https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-v1.4.4-linux-amd64 -O mkcert
  chmod +x mkcert
  sudo mv mkcert /usr/local/bin/
fi

echo "🔐 Installing local CA..."
mkcert -install

mkdir -p certs

echo "📜 Generating certificates..."
mkcert -key-file certs/key.pem -cert-file certs/cert.pem localhost 127.0.0.1 $IP

echo "✅ Certificates generated in ./certs"