FROM golang:alpine AS builder

WORKDIR /go/src/app
COPY main.go .

RUN go build -o webserver .

FROM alpine AS production
WORKDIR /app
COPY --from=builder /go/src/app/ /app/

CMD ["./webserver"]
