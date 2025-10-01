FROM node:20-alpine

WORKDIR /app

# Install deps with cache
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest
COPY . .

# Expose and start
EXPOSE 5000
CMD ["npm", "start"]
