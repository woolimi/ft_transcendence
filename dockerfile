FROM ruby:2.7.1-alpine3.12

ENV BUNDLER_VERSION=2.1.4
RUN apk add --update --no-cache \
	binutils-gold \
	build-base \
	curl \
	file \
	g++ \
	gcc \
	git \
	less \
	libstdc++ \
	libffi-dev \
	libc-dev \ 
	linux-headers \
	libxml2-dev \
	libxslt-dev \
	libgcrypt-dev \
	make \
	netcat-openbsd \
	openssl \
	pkgconfig \
	postgresql-dev \
	tzdata \
	yarn \
	nodejs

RUN mkdir /myapp
WORKDIR /myapp

RUN gem update --system
# remove this later
RUN gem install rails -v 6.0.3.2
RUN gem install --default bundler -v 2.1.4

COPY ./project/Gemfile ./project/Gemfile.lock ./
RUN bundle install

COPY ./project/package.json ./
COPY ./project/yarn.lock ./
COPY ./project ./

EXPOSE 3000

# Add a script to be executed every time the container starts.
ENTRYPOINT ["/bin/sh", "./entrypoint.sh"]
# ENTRYPOINT ["/bin/sh"]
