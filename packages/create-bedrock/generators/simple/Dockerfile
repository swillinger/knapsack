FROM basaltinc/docker-node-php-base:latest
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc
WORKDIR /app
COPY . .
EXPOSE 3999
RUN npm install
RUN npm run build

CMD npm run serve
