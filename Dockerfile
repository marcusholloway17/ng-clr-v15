FROM node:18.15-alpine AS Builder

ENV NODE_OPTIONS="--max-old-space-size=8192"
ARG NODE_AUTH_TOKEN
ARG VERSION
ARG API_URL
ARG AUTH_API_URL
ARG AUTH_API_CLIENT
ARG AUTH_API_CLIENT_TOKEN
ARG STORAGE_SECRET
ARG STORAGE_API_HOST
ARG STORAGE_API_CLIENT
ARG STORAGE_API_SECRET
ARG STORAGE_API_PARENT
ARG STORAGE_API_VOLUME
ARG MODULE_NAME
ARG PLATFORMS_DRC_URL=
ARG REDIRECT_URL='/auth/login'

WORKDIR /app

# Copy application data to container app dir
COPY . .

# Install project packages
RUN npm install

# Build the angular project
RUN npm run build

FROM nginx:1.25.2-alpine

COPY --from=Builder /app/dist/ /usr/share/nginx/html/

COPY ./nginx/conf.d/ /etc/nginx/conf.d/

# Expose port 80
EXPOSE 80

# When the container starts, replace the environment.json with values from environment variables
CMD ["/bin/sh",  "-c",  "exec nginx -g 'daemon off;'"]