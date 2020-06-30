FROM ruby:2.5.1-alpine3.7

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
	python \
	tzdata \
	yarn \
	nodejs

RUN gem update --system
RUN gem install --default bundler -v 2.1.4
RUN mkdir /myapp
WORKDIR /myapp

COPY ./project ./
COPY ./project/Gemfile ./project/Gemfile.lock ./
RUN bundle config build.nokogiri --use-system-libraries
RUN bundle check || bundle install

COPY ./project/package.json ./project/yarn.lock ./
RUN yarn install --ignore-engines

EXPOSE 3000
# Add a script to be executed every time the container starts.
ENTRYPOINT ["/bin/sh", "./entrypoint.sh"]
# ENTRYPOINT ["/bin/sh"]
