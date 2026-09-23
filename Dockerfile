# Get Node.js 14 from the official Node image
FROM node:14.21.3-buster AS node

# Main image
FROM python:3.8

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get -y update
RUN apt-get install -y curl nano wget nginx git

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list




# Copy Node.js 14 and npm from the official Node image
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/bin/npm /usr/local/bin/npm
COPY --from=node /usr/local/bin/npx /usr/local/bin/npx
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

# Create npm/npx links
RUN ln -sf /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm
RUN ln -sf /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

# Install Yarn
RUN npm install -g yarn@1.22.22


# Install PIP
RUN python -m pip install "pip<24.1"


ENV ENV_TYPE staging
ENV MONGO_HOST mongo
ENV MONGO_PORT 27017

ENV PYTHONPATH=$PYTHONPATH:/src/

# Copy Python dependencies
COPY src/requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Frontend
WORKDIR /src/app
RUN yarn install