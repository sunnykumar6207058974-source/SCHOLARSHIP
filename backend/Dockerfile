FROM node:20-slim

WORKDIR /app

# Install build dependencies for better-sqlite3 native compilation
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 5005

ENV PORT=5005
ENV NODE_ENV=production
ENV USE_MYSQL=false

CMD ["npm", "start"]
