FROM iojs:3.3

ADD package.json /app/package.json
WORKDIR /app
RUN npm install --only=prod

ADD . /app

EXPOSE 3000
CMD ["npm", "run", "server]
