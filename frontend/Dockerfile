# Stage 1: Build the React app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set the environment variable for Vite
ENV VITE_BACKEND_URL="https://team2.robbeonline.com/api"
ENV VITE_KC_URL="https://team2.robbeonline.com/auth"

# Build the React app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy build output to Nginx's HTML directory
COPY --from=build /app/dist /usr/share/nginx/html


# Expose the default Nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

##team2.robbeonline.com