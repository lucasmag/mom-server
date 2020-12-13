FROM rabbitmq:3-management as rabbitmq

RUN rabbitmq-plugins enable rabbitmq_management

ADD rabbitmq.conf /etc/rabbitmq/

ENV RABBITMQ_CONFIG_FILE=/etc/rabbitmq/rabbitmq.conf
