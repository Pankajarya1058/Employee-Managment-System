# Stage 1 For install node_modules and build the code
FROM node:latest AS builder

WORKDIR	/app

COPY package* . 

RUN npm i

COPY . /app

#EXPOSE 3000
# Increase memory limit for Node.js before building
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build
#CMD ["npm", "start"]


# Stage 2 build 
FROM nginx:latest

COPY --from=builder /app/build	/usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 


