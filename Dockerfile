FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npx next build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npx next start"]
