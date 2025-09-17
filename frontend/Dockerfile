FROM node:20-alpine

WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
