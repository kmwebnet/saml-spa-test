FROM node:14.17.3-stretch-slim

ENV PORT 4000
EXPOSE 4000

WORKDIR /usr/src/app

COPY . .

# for setting full module to develop
#RUN yarn install
#RUN yarn build

#for only setting dependency module
RUN yarn add express express-session passport passport-saml

CMD [ "node", "index.js" ]
#CMD ["/bin/bash"]
#CMD [ "DEBUG=express:*", "node", "index.js" ]