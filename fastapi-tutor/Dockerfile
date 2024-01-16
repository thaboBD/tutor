FROM python:3.8-slim

RUN apt-get update && \
    apt-get install -y libpq-dev && \
    apt-get install -y build-essential

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8000