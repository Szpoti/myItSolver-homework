require("dotenv").config();
import typeorm = require("typeorm");
import express = require("express");
const app = express();
import jwt = require("jsonwebtoken");
import {Article} from "./src/entity/Article";
import { type } from "os";
import { Requester } from "./src/entity/Requesters";
import { parse } from "querystring";
import util = require("util");
import multer = require("multer");
import cors = require("cors");
import controller = require("./src/controller/file.controller");
const globalAny:any = global;
globalAny.__basedir = __dirname;
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());


app.post("/detailed", authenticateToken, async (req, res) => {
  console.log("Detailed article");
  
  const articleId = req.body.id;

  const article = await typeorm.getManager().getRepository(Article).findOne(articleId);
  
  res.json(article);
});

app.get("/list/:page/:pageSize", async (req, res) => {
  const pageSize = parseInt(req.params.pageSize) < 1 ? 1 : parseInt(req.params.pageSize);
  const page = parseInt(req.params.page);
  const from = (pageSize * page) - pageSize;
  const to = pageSize * page;

  const articleRepo = typeorm.getRepository(Article);
  const [articles, count] = await articleRepo.findAndCount({skip: from, take: to});
  const pageCount = Math.ceil(count/pageSize);
  res.json({
    list: articles,
    meta: {
      pageSize: pageSize,
      page: page,
      pageCount: pageCount,
      count: count
    }
  });
});

app.get("/src/images/uploads/:name", (req,res) => {
  const imageName = req.params.name;
  console.log(globalAny.__basedir + "/src/images/uploads/" + imageName);
  res.sendFile(globalAny.__basedir + "/src/images/uploads/" + imageName)
})


app.post("/create_article", async (req, res) => {
  const imageUrl = await controller.upload(req,res);
  const title = req.body.title;
  const description = req.body.description;

  const articleRepo = typeorm.getManager().getRepository(Article);
  const article = articleRepo.create({
    title: title,
    description: description,
    imageUrl: imageUrl,
  });

  await articleRepo.save(article).catch(
    err => {
      throw err;
    }
  )

  res.json({
    title: title,
    imageUrl: imageUrl,
    description: description,
    id: article.id,
  });
  });

app.post("/upload", controller.upload);

app.get("/files/:name", controller.download)

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("Authenticate token");
  
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, platform) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }

    if (await isThereAnyRemainingsLeft(token)) {
      decreaseRemainings(token);
      req.platform = platform;
      next();
    } else {
      return res.sendStatus(401);
    }
  });
}

async function decreaseRemainings(token) {
  const repo = typeorm.getManager().getRepository(Requester);
  let requester = await repo.findOne({token: token}).catch(err => {
    throw err;
  });
  requester.remainings -= 1;
  repo.save(requester);
}

async function isThereAnyRemainingsLeft(token) {
  const repo = typeorm.getManager().getRepository(Requester);
  const requester = await repo.findOne({token: token}).catch(err => {
    throw err;
  });
  console.log(requester.remainings);
  const isThereAnyRemainingsLeft = requester.remainings > 0;
  
  
  return requester.remainings > 0;
}

app.listen(3000, () => {
  console.log("Listening on port 3000...");
  typeorm.createConnection().then(() =>{
    console.log("Connection to database created!");
  }).catch(err => {
    throw err;
  });
});
