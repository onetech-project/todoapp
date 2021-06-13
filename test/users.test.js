import app from "../app.js";
import mongoose from "mongoose";
import supertest from "supertest";

const user = {
  email: "someone@domain.com",
  username: "someone",
  password: "somepassword",
};

beforeAll((done) => {
  mongoose.connect("mongodb://localhost:27017/testDB", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => done());
});

afterAll((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

test("Test Signup Endpoint, user created", async () => {
  await supertest(app).post("/api/signup").send(user).set("Accept", "application/json").expect("Content-Type", /json/).expect(201);
});

test("Test Negative Signup Endpoint, user already exist", async () => {
  await supertest(app).post("/api/signup").send(user).set("Accept", "application/json").expect("Content-Type", /json/).expect(500);
});

test("Test Negative Signup Endpoint, email wrong format", async () => {
  await supertest(app)
    .post("/api/signup")
    .send({ ...user, email: "adwawdwa" })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(500)
    .expect({ code: "00", message: "user validation failed: email: adwawdwa is not a valid email!" });
});

test("Test Negative Signup Endpoint, no argument sent", async () => {
  await supertest(app)
    .post("/api/signup")
    .send({})
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(400)
    .expect({
      code: "00",
      message: ["either email or username is prohibited to be empty", "password is prohibited to be empty"],
    });
});

test("Test Login Endpoint", async () => {
  await supertest(app).post("/api/login").send(user).set("Accept", "application/json").expect("Content-Type", /json/).expect(200);
});

test("Test Negative Login Endpoint", async () => {
  await supertest(app)
    .post("/api/login")
    .send({ ...user, password: "123123" })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect({ message: "Username or Password does not match", code: "00" });
});

test("Test Logout Endpoint", async () => {
  let auth = {};
  await loginUser(auth);
  await supertest(app).post("/api/logout").send().set("Accept", "application/json").set("Authorization", auth.token).expect(200);
});

test("Test Negative Logout Endpoint, without authorization", async () => {
  await supertest(app).post("/api/logout").send().set("Accept", "application/json").expect(401);
});

const loginUser = async (auth) => {
  const res = await supertest(app).post("/api/login").send(user).set("Accept", "application/json").expect("Content-Type", /json/).expect(200);
  auth.token = res.body.token;
};
