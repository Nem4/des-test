import request from "supertest";

import { app } from "../app.js";

const token = process.env.AUTH_TOKEN;
const noScopesToken = process.env.NO_SCOPES_TOKEN;

const testUserObject = { id: 0, name: "Test User1", username: "testuser1", password: "$2y$10$wyWEUqmT8kTRH9Lr/Ul/BOKAbNA0dUBEPiJaIJ7ZTD1tkS2Ez5dFa" };

describe("GET /", () => {
  it("Should return simple string from GET / (root) request", (done) => {
    request(app)
      .get("/")
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toMatch(/Desjardins test/);
        done();
      });
  });
  it("Should return 401 (token not provided) ", (done) => {
    request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });
  it("Should return 401 (wrong token was provided)", (done) => {
    request(app)
      .get("/")
      .set("Authorization", `Bearer ${"RANDOM TOKEN"}`)
      .then((response) => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });

  it("Should return 403 (a token with no scopes permissions was used)", (done) => {
    request(app)
      .get("/")
      .set("Authorization", `Bearer ${noScopesToken}`)
      .then((response) => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
});

describe("GET /users", () => {
  it("Should return the first user object", () => {
    return request(app)
      .get("/users/0")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        console.log(response.body);
        expect(response.body).toEqual(testUserObject);
      });
  });

  // User with ID=1 doesn't exist
  it("Should return 404 (User not found)", () => {
    return (
      request(app)
        .get("/users/1")
        .set("Authorization", `Bearer ${token}`)
        // .expect("Content-Type", /json/)
        .then((response) => {
          expect(response.statusCode).toBe(404);
          console.log("Text: ", response.text);
          expect(response.text).toMatch(/User not found/);
        })
    );
  });
});
