FROM node:9-alpine

ENV APP node

ENV APP_DIR /home/$APP

ENV NODE_ENV production

ENV NODE_PATH $APP_DIR

RUN mkdir -p $APP_DIR

WORKDIR $APP_DIR

COPY package.json package-lock.json $APP_DIR/

RUN npm i

COPY . $APP_DIR/

RUN chown -R $APP:$APP $APP_DIR

USER $APP

ENTRYPOINT node .
