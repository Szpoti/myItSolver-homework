require("dotenv").config();

import typeorm = require("typeorm");
import express = require("express");
const app = express();
import jwt = require("jsonwebtoken");
import {Requester} from "./src/entity/Requesters";

app.use(express.json());

app.post("/renew_token", (req, res) => {
  const accessToken = req.body.token;
  if (accessToken == null) return res.sendStatus(401);
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, platform) => {
    if (err) return res.sendStatus(403);

    const repo = typeorm.getManager().getRepository(Requester);
    let requester = await repo.findOneOrFail({token:accessToken});
    requester.remainings = 5;
    await repo.save(requester);
    //reset tokens remainings to 5
    res.json({ remaining: 5 });
  });
});

app.post("/token", async (req, res) => {
  // Authenticate

  const platformName = req.body.platform;
  const platform = { name: platformName };

  const accessToken = generateAccessToken(platform);
  const requestersRepo = typeorm.getRepository(Requester);
  const requester = requestersRepo.create({
    token: accessToken,
    remainings: 5,
  });

  await requestersRepo.save(requester).catch((err) => {
    throw err;
  });

  res.json({
    accessToken: accessToken,
    remaining: 5,
  });
});

function generateAccessToken(platform) {
  return jwt.sign(platform, process.env.ACCESS_TOKEN_SECRET);
}

app.listen(4000, () => {
  console.log("Listening on port 4000...");
  typeorm.createConnection().then(() =>{
    console.log("Connection to database created!");
  }).catch(err => {
    throw err;
  });
});
