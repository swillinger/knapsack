FROM basaltinc/docker-node-php-base:latest
WORKDIR /app
COPY . .
EXPOSE 3999
RUN yarn install && NODE_ENV=production yarn build

CMD echo "the example is: $EXAMPLE" && cd examples/$EXAMPLE && NODE_ENV=production yarn build && NODE_ENV=production yarn serve
