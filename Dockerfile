FROM node:16-alpine as build-stage

# make the 'app' folder the current working directory
WORKDIR /app

# Copy build files.
COPY ./package.json /app/

# Install and build.
RUN npm install 


# Copy build files.
COPY . /app/
RUN npm run build
# PRODUCTION-STAGE
#FROM nginx:stable-alpine as nginx

# Copy the dist folder from the build-stage into app.
# COPY --from=build-stage /app/dist /app

# Copy a default nginx.conf with all the necessary configurations.
# COPY nginx.conf /etc/nginx/nginx.conf
CMD ["npm", "run", "serve"]
