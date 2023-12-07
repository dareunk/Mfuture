FROM bitnami/node:latest as builder
ENV NODE_ENV="production"

COPY ./mfuture/. /app
WORKDIR /app/mfuture

RUN npm install

FROM bitnami/node:latest
ENV NODE_ENV="production"
COPY --from=builder /app /app
WORKDIR /app/mfuture
ENV PORT 5000
EXPOSE 5000

CMD ["npm","start"]

