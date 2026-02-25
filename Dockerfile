FROM node:20-alpine

WORKDIR /app

# Copy server files
COPY server/package.json server/package-lock.json* ./server/
COPY server/src ./server/src

# Copy client build (must be built first)
COPY dist ./dist

WORKDIR /app/server

RUN npm install --production

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000
ENV CLIENT_URL=http://localhost:5000

CMD ["npm", "start"]
