FROM basaltinc/docker-node-php-base:latest
WORKDIR /app
COPY . .
EXPOSE 3088
RUN yarn install
RUN yarn build
RUN yarn test

CMD cd examples/simple && npm run serve
