FROM tiangolo/meinheld-gunicorn-flask:python3.8

COPY ./ /app
RUN rm -r static/test/
ENV MODULE_NAME api

WORKDIR /app
RUN pip install -r requirements.txt
