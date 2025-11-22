FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./

# Ensure correct esbuild version is installed & no stale cache
RUN npm install
# Copy the rest of the project
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
