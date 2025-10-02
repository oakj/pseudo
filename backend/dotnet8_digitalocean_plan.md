# 🚀 Deployment Plan: .NET 8 API on DigitalOcean Droplet

This document describes how to deploy a .NET 8 API with Docker on a DigitalOcean droplet using GitHub Actions for CI/CD, GitHub Container Registry (GHCR) for Docker images, and Nginx + Let’s Encrypt for HTTPS.

---

## 1. Provision the Droplet
1. Log into [DigitalOcean](https://cloud.digitalocean.com/).
2. Create a **basic droplet**:
   - OS: Ubuntu 22.04 LTS  
   - Plan: $5/month (1GB RAM, 1 vCPU)  
   - Datacenter region: closest to your users  
   - SSH keys: add your public key  
   - Monitoring: enable  
3. Save the droplet’s IP address.  

---

## 2. Install Dependencies on Droplet
SSH into droplet:
```bash
ssh root@YOUR_DROPLET_IP
```

Install packages:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker + Docker Compose
sudo apt install -y docker.io docker-compose

# Allow Docker without sudo
sudo usermod -aG docker $USER
```

Log out and back in for the group change to apply.

---

## 3. Set Up GitHub Container Registry (GHCR)
1. In your repo, create a **Personal Access Token** with `write:packages` + `read:packages`.  
   - Store it in GitHub Actions secrets: `GHCR_PAT`.
2. GHCR naming convention:  
   ```
   ghcr.io/<github-username>/<repo-name>:tag
   ```

---

## 4. CI/CD Pipeline Recommendations

### Workflow Stages

#### a. Build & Test
- Restore dependencies: `dotnet restore`
- Build: `dotnet build --configuration Release --no-restore`
- Run tests: `dotnet test --no-build --verbosity normal`

#### b. Build & Push Docker Image
- Build Docker image from your `Dockerfile`
- Tag it with the commit SHA or version
- Push it to GHCR

#### c. Deploy to Droplet
- SSH into Droplet and pull the new Docker image
- Stop old container, start new one

### Example GitHub Actions Workflow
File: `.github/workflows/ci-cd.yml`
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ "main" ]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'

      - name: Restore
        run: dotnet restore

      - name: Build
        run: dotnet build --configuration Release --no-restore

      - name: Test
        run: dotnet test --no-build --verbosity normal

  docker-build-push:
    runs-on: ubuntu-latest
    needs: build-test
    steps:
      - uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        run: |
          IMAGE=ghcr.io/${{ github.repository }}/dotnet-api:latest
          docker build -t $IMAGE .
          docker push $IMAGE

  deploy:
    runs-on: ubuntu-latest
    needs: docker-build-push
    steps:
      - name: Deploy to Droplet
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.DROPLET_IP }}
          username: ${{ secrets.DROPLET_USER }}
          key: ${{ secrets.DROPLET_SSH_KEY }}
          script: |
            docker login ghcr.io -u ${{ github.actor }} -p ${{ secrets.GITHUB_TOKEN }}
            docker pull ghcr.io/${{ github.repository }}/dotnet-api:latest
            docker stop dotnet-api || true
            docker rm dotnet-api || true
            docker run -d --name dotnet-api -p 5000:80 ghcr.io/${{ github.repository }}/dotnet-api:latest
```

---

## 5. Install & Configure Nginx on Droplet
SSH into droplet:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Configure reverse proxy (edit `/etc/nginx/sites-available/default`):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Test and reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. Enable HTTPS (Let’s Encrypt)
Run:
```bash
sudo certbot --nginx -d yourdomain.com
```

Certbot will auto-renew. Check with:
```bash
sudo systemctl status certbot.timer
```

---

## 7. Verify Deployment
- Push code to `main` branch → GitHub Actions runs  
- Droplet pulls image → container starts at `localhost:5000`  
- Nginx proxies traffic from `https://yourdomain.com` → container  

---

✅ At this point:
- CI/CD runs on push to `main`  
- API builds, tests, dockerizes, and deploys automatically  
- Nginx serves it securely with HTTPS  
- Cost = **$5/month** (droplet only)  
