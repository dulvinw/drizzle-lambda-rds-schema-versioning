FROM public.ecr.aws/lambda/nodejs:22 AS builder
WORKDIR /usr/app
COPY package.json package-lock.json  drizzle.config.ts tsconfig.json ./
COPY src/* ./src/
COPY drizzle ./drizzle/
RUN npm ci
RUN npm run build

FROM public.ecr.aws/lambda/nodejs:22
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/dist/* ./
COPY --from=builder /usr/app/drizzle ./drizzle/

CMD ["index.handler"]
