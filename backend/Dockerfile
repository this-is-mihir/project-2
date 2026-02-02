# 1️⃣ Base machine (Node.js already installed)
FROM node:18

# 2️⃣ Container is inside working folder
WORKDIR /app

# 3️⃣ first copy the package.json 
COPY package*.json ./

# 4️⃣ npm install
RUN npm install

# 5️⃣ backend code copy all
COPY . .

# 6️⃣ Backend port expose
EXPOSE 4000

# 7️⃣ Server start command
CMD ["node", "server.js"]
