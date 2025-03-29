FROM node:18-alpine AS builder

WORKDIR /app

COPY package* ./

RUN npm install

COPY . .

#Stage-2
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app /app

# Install curl using Alpine package manager
RUN apk --no-cache add curl

EXPOSE 5000

CMD ["node", "index.js"]
