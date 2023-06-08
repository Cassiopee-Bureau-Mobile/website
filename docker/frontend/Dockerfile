FROM node:19-alpine

# Install nmap dependency
RUN apk add nmap --no-cache

# Install ansible dependency
RUN apk add ansible openssh-client sshpass --no-cache

# Setup ansible
RUN mkdir -p /etc/ansible

WORKDIR /code

ARG next_public_base_url
ENV NEXT_PUBLIC_BASE_URL=${next_public_base_url}

# Install pm2
RUN npm install -g pm2

COPY ./frontend/package.json ./package.json
COPY ./frontend/package-lock.json ./package-lock.json

RUN npm set progress=false

RUN npm install
ENV NODE_ENV=production

# Copy prisma schema
COPY ./frontend/prisma/schema.prisma ./prisma/schema.prisma

# Generate Prisma client
RUN npm run generate

# Copy the source code
COPY ./frontend/ ./

RUN npm run build
