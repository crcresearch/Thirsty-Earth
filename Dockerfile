FROM node:16-alpine as build-stage

# Copy build files.
COPY ./ /app

# make the 'app' folder the current working directory
WORKDIR /app

# Install and build.
RUN npm install 
RUN npm run build

# PRODUCTION-STAGE
#FROM nginx:stable-alpine as nginx

# Copy the dist folder from the build-stage into app.
# COPY --from=build-stage /app/dist /app

# Copy a default nginx.conf with all the necessary configurations.
# COPY nginx.conf /etc/nginx/nginx.conf

CMD ["npm", "run", "serve"]
