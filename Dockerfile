FROM node:16

COPY . /app

WORKDIR /app
RUN ["yarn"]
RUN ["yarn", "compile"]
RUN ["rm", "-rf", "src"]
CMD ["yarn", "run", "start"]