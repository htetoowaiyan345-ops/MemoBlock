# --- Build Stage ---
FROM node:24-alpine AS builder

WORKDIR /app

# Copy dependency definitions first to leverage Docker cache
COPY package.json .

RUN npm i

# Copy source code
COPY . .

# Build the application
RUN npm run build

# --- Production Stage ---
FROM node:24-alpine AS runner

# Install dumb-init to handle PID 1 correctly (signals, zombie processes)
RUN apk add --no-cache dumb-init

ENV NODE_ENV=production

WORKDIR /app

# Create a non-root user and setup permissions (Node images have a 'node' user built-in)
# We ensure the app directory is owned by this user
RUN chown node:node /app

# Switch to non-root user
USER node

# Copy production dependencies (clean install)
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built artifacts from builder stage
# Ensure ownership is transferred to the non-root user
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 2567

# Use dumb-init as entrypoint to wrap the node process
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["node", "dist/src/index.js"]