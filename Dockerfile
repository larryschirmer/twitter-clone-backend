FROM mhart/alpine-node:16.4 as base

FROM mhart/alpine-node:16.4
COPY . /app
WORKDIR /app
RUN npm install --only=prod

EXPOSE 4000
CMD ["npm", "run", "dev"]

# docker build -t larryschirmer/twitter-clone-backend:1.0.0 .
