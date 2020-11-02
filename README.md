# A MyItSolver homework from Balázs Faragó

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Create a .env file.
 3.1. Inside the .env file, create a variable ACCESS_TOKEN_SECRET;
 3.2. Give it a random value. For good security, use crypto.randomBytes(16).toString('hex') to get a string to use as a secret.
4. Run `npm run devStart` to start the server.ts
5. Run `npm run devStartAuth` to start the authServer.ts

## Technologies

- NodeJs: "v12.18.0"
- Crypto: "^1.0.1",
- Dotenv: "^8.2.0",
- Express: "^4.17.1",
- Jsonwebtoken: "^8.5.1",
- Multer: "^1.4.2",
- Mysql: "^2.18.1",
- Nodemon: "^2.0.6",
- Typeorm: "0.2.28"

##Swagger documentation
https://app.swaggerhub.com/apis-docs/Szpoti/Szpoti_MyItSolver_homework/1.0.0

