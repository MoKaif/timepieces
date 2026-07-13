# The compose "app" service mounts the repo and installs dependencies at runtime,
# so the image only needs Node + pnpm (via corepack). Deps are installed by the
# compose command against the mounted volume (which includes patches/).
FROM node:20-alpine
WORKDIR /app
RUN corepack enable
EXPOSE 3000
CMD ["pnpm", "dev"]
