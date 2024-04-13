FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    lsb-release \
    python3-pip \
    apt-transport-https \
    ca-certificates \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g jest node-notifier

RUN pip install -U pytest

WORKDIR /home/app
