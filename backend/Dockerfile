FROM node:18 AS builder
WORKDIR /app
COPY package* ./
RUN npm install
COPY . .

#Stage-2
FROM node:18
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 5000
CMD ["node", "index.js"]
