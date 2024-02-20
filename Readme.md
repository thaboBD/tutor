# Thabo Chatbot

## Technologies Used
- **Node.js**: Twilio interacts with Node.js.
- **Google Dialogflow**: Node.js pushes the request to Dialogflow.
- **FastAPI**: Dialogflow class associated fulfillments to FastAPI.
- **Twilio**: A service that gathers and forwards messages from whatsapp to node and back.
- **AWS**: AWS EC2 for container deployment.

### How It Works
1. Get your number registered through the Thabo Chatbot admin panel.
2. Start interacting with the chatbot through WhatsApp. The chatbot waits for 5 seconds to get the fulfillment result:
   - If Dialogflow gets the result in 5 seconds from FastAPI, Dialogflow responds directly to the caller (Node.js).
   - Otherwise, a webhook is called manually from FastAPI to Node.js that then responds to the initial caller. `senderNumber` is persisted throughout this cycle (Node-Dialogflow-FastAPI-Node).

## Code Structure
We have three sub-repos, each focusing on its dedicated work:
- **node-integrator**
- **fastapi-tutor**
- **react-admin-app** (Only accessible by super admin)

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://<your-github-access-token>@github.com/thaboBD/tutor.git
   ```
2. Create a sub-branch from `chatbot-integration`.
3. Create a PR and merge it into `chatbot-integration` after approval from `thabodube`.
4. Build Docker containers:
   ```bash
   docker-compose -f docker-compose-local.yml build
   ```
5. Start all servers locally:
   ```bash
   docker-compose -f docker-compose-local.yml up

   ```

### Deployment Process
1. SSH into the EC2 container:
   ```bash
   ssh -i "chatbot.pem" ubuntu@ec2-54-225-46-103.compute-1.amazonaws.com
   ```
   Note: `chatbot.pem` is a private certificate shared privately with `thabodube` to access the EC2 instance.
2. Navigate to the `tutor` directory:
   ```bash
   cd tutor
   ```
3. Stop existing Docker containers:
   ```bash
   sudo docker-compose -f docker-compose-prod.yml kill
   ```
4. Pull the latest changes from the `chatbot-integration` branch:
   ```bash
   git pull origin chatbot-integration
   ```
5. Build Docker containers for the updated services:
   ```bash
   sudo docker-compose -f docker-compose-prod.yml build <service-name>
   ```
   (See `docker-compose-prod.yml` for service names)
6. Run the updated containers in detached mode:
   ```bash
   sudo docker-compose -f docker-compose-prod.yml up -d
   ```

## Accessing the Web on the Server
- **Caddy server** with NIB is used to deploy our services to TLS/SSL certifications for secure access.
- The `Caddyfile` is the root of our EC2 instance:
  ```
  node-app.54.225.46.103.nip.io
  react-admin-app.54.225.46.103.nip.io
  fast-api.54.225.46.103.nip.io
  ```

### Managing Secrets

**Local Environment:**
- For local secrets, set them in the related environments and get going. Each subproject has its own `.env` file for managing its specific configuration.

**Production Environment:**
- All secrets are stored inside the `secrets/` directory at the root following their names. Make any necessary changes inside them as needed for the production environment.

