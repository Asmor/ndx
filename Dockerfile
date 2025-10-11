FROM node:22-bullseye-slim

WORKDIR /workspace

RUN npm install -g vite
RUN apt-get update && apt-get install -y \
vim less curl git bsdextrautils procps \
&& rm -rf /var/lib/apt/lists/*
RUN git config --system --add safe.directory /workspace
run git config --global core.pager "/workspace/.devcontainer/smart-pager.sh"

COPY .devcontainer/.bashrc /root/.bashrc

CMD ["bash"]
