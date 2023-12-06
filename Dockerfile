FROM bitnami/node:9 as builder
ENV NODE_ENV="production"

COPY ./mfuture/ /app
WORKDIR /app

RUN sudo npm install

FROM bitnami/node:9-prod
ENV NODE_ENV="production"
COPY --from=builder /app /app
ENV PORT 5000
EXPOSE 5000

CMD ["npm","start"]

