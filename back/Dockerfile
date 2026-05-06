# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Stage 2: Run the application
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/env.js ./env.js
COPY --from=builder /app/.env.test ./.env.test
COPY --from=builder /app/jest.config.js ./jest.config.js


ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
