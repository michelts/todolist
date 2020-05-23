FROM node:alpine as builder

COPY assets/ /srv/assets/
WORKDIR /srv/assets/
RUN npm install && npm run build

FROM python:alpine
COPY requirements.txt /srv/
WORKDIR /srv/
RUN pip3 install --upgrade pip \
    && pip3 install -r requirements.txt
COPY app/ /srv/app/
COPY docker-entrypoint.sh /srv/
COPY migrations/ /srv/migrations/
COPY --from=builder /srv/app/static/ /srv/app/static/
