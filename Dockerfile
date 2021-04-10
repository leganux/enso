FROM oscar86hsu/pm2:latest-stretch


# Bundle APP files
COPY . enso/
WORKDIR enso/app

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN  npm install --force

# Show current folder structure in logs
RUN ls -al -R

EXPOSE 8088
CMD [ "pm2-runtime", "start", "pm2.json" ]
