# Use official Node.js LTS image
FROM node:20-bullseye

WORKDIR /workspace

# Install Vite globally
RUN npm install -g vite

CMD ["bash"]
