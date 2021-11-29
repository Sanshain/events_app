# This dockerfile utilizes components licensed by their respective owners/authors.
# Prior to utilizing this file or resulting images please review the respective licenses at: https://github.com/django/django/blob/master/LICENSE

FROM python
LABEL Description="Django Preact" Vendor="Django Software Foundation" Version="3.2.9"

EXPOSE 8000
WORKDIR /app
ENV APP_ROOT /app

COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

