FROM node:18.15.0-alpine
RUN mkdir /frontend
WORKDIR /frontend
ENV PATH /frontend/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm install
RUN npm install react-scripts -g
COPY . .