FROM node:alpine

ARG PORT=3000

ENV PORT=${PORT}

CMD node src

EXPOSE ${PORT}
