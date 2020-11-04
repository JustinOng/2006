FROM tiangolo/meinheld-gunicorn-flask:python3.8

COPY ./ /app
ENV MODULE_NAME api

WORKDIR /app
RUN pip install -r requirements.txt
