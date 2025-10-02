# Prep for Public Deployment of .NET 8 API

## Recommended Deployment Order for .NET 8 API

## 1. Check Public & Private Endpoints
- Ensure all **public endpoints** are secure.
- Verify `[Authorize]` is applied where needed.
- Disable or protect **Swagger** in production.
- Confirm **CORS rules** are properly restricted.
- Test authentication flows:
  - Invalid/expired tokens → return `401`.
  - Private endpoints not exposed.

---

## 2. Set Up Docker (Locally)
- Build and run the API inside Docker.
- Use a `.env` file for environment variables.
- Verify the API works via `http://localhost:8080`.
- Test security again inside the container.

---

## 3. Create DigitalOcean Droplet VM
- Spin up an Ubuntu LTS server (22.04 recommended).
- SSH into the server.
- Install **Docker** and **docker-compose**.
- Secure the server:
  - Create a non-root user.
  - Enable UFW firewall (allow only 22, 80, 443).
  - Disable password-based SSH login.

---

## 4. Deploy to the Droplet
- Copy project files or push Docker image.
- Run container with:
  - `docker run`  
  - or `docker-compose up -d`
- Add reverse proxy (nginx or Caddy) for HTTPS with Let’s Encrypt.
- Verify logs and test endpoints live in production.


## 1. Environment Variables
- **App Platform (PaaS)**: Add variables in DigitalOcean Dashboard → Settings → Environment Variables.
- **Droplet (Docker)**:
  - Use `.env` file:
    ```env
    ASPNETCORE_ENVIRONMENT=Production
    ConnectionStrings__Default=Server=...;Database=...;User Id=...;Password=...
    JWT_SECRET=supersecretkey
    ```
  - Run with `--env-file .env`:
    ```bash
    docker run -d -p 8080:8080 --env-file .env myapi:latest
    ```
- Never commit `.env` to GitHub.

---

## 2. Docker Setup

**Dockerfile**
```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "YourApiProject.dll"]
```

**.dockerignore**
```
bin/
obj/
*.db
*.env
```

**Build & Run Locally**
```bash
docker build -t myapi .
docker run -d -p 8080:8080 myapi
```

---

## 3. Security Testing Checklist

- **Basic Checks**
  - `ASPNETCORE_ENVIRONMENT=Production`.
  - Disable or protect Swagger UI in prod.
  - Proper CORS rules (no `AllowAnyOrigin()` unless public).

- **Authentication**
  - Verify `[Authorize]` endpoints block unauthenticated requests.
  - Test with invalid/expired JWT tokens → should return `401`.

- **Secrets**
  - Don’t log secrets.
  - No production creds in `appsettings.json`.

- **Tools**
  - [OWASP ZAP](https://www.zaproxy.org/) for vulnerability scanning.
  - `curl` / Postman to test edge cases (invalid tokens, long inputs).
  - Check dependencies:  
    ```bash
    dotnet list package --vulnerable
    ```
