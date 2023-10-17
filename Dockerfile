FROM node:alpine
WORKDIR /usr/pied-piper/
COPY . .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]
