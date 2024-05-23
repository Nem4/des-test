import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { findAllUsers, findUserById, addUser, updateUser, deleteUserById } from "./users.js";

import { auth, requiredScopes } from "express-oauth2-jwt-bearer";

export const app = express();

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: "http://localhost:3000",
  issuerBaseURL: `YOUR_ISSUER_URL`,
});

// enforce on all endpoints
app.use(checkJwt);

const checkScopes = requiredScopes("read:users");
app.use(checkScopes);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Desjardins test");
});

app.get("/users", (req, res) => {
  res.send(findAllUsers());
});

app.get("/users/:id", (req, res) => {
  // if ID is not a valid number -> return 404
  if (isNaN(req.params.id)) res.status(404).send("User not found");

  // +string returns the numeric value of the string
  const userId = +req.params.id;
  const user = findUserById(userId);

  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send("User not found");
  }
});

app.post("/users", (req, res) => {
  // Check that all the values are valid
  if (Boolean(req.body.name) && Boolean(req.body.username) && Boolean(req.body.password)) {
    addUser(req.body);
    res.status(200).send("User successfully created");
  } else {
    res.status(400).send("Invalid input");
  }
});

app.put("/users/:id", (req, res) => {
  // if ID is not a valid number -> return 404
  if (isNaN(req.params.id)) res.status(404).send("User not found");

  // +string returns the numeric value of the string
  const userId = +req.params.id;

  if (updateUser(userId, req.body)) {
    res.status(200).send("User successfully updated");
  } else {
    res.status(404).send("User not found");
  }
});

app.delete("/users/:id", (req, res) => {
  // if ID is not a valid number -> return 404
  if (isNaN(req.params.id)) res.status(404).send("User not found");

  // +string returns the numeric value of the string
  const userId = +req.params.id;
  const user = findUserById(userId);

  if (!user) {
    res.status(404).send("User not found");
  } else {
    deleteUserById(userId);
    res.status(200).send("User successfully deleted");
  }
});
