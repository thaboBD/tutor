FROM node:latest

WORKDIR /app

RUN npm install -g sequelize-cli
COPY package*.json ./

RUN npm install
COPY . .

# Copy the startup script into the container
COPY startup.sh .

# Make the script executable
RUN chmod +x startup.sh

# Run the startup script
CMD ["./startup.sh"]