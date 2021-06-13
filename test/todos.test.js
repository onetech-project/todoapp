import app from "../app.js";
import mongoose from "mongoose";
import supertest from "supertest";
import assert from "assert";
import { config } from "dotenv";

config();

const user1 = {
  email: "someones@domain.com",
  username: "someones",
  password: "somepassword",
};

const user2 = {
  email: "sometwos@domain.com",
  username: "sometwos",
  password: "somepassword",
};

let todo = {
  title: "Task 1",
};

let auth1 = {};
let auth2 = {};

const signupAndLoginUser = async (done) => {
  await supertest(app).post("/api/auth/signup").send(user1).set("Accept", "application/json");
  await supertest(app).post("/api/auth/signup").send(user2).set("Accept", "application/json");
  const res1 = await supertest(app).post("/api/auth/login").send(user1).set("Accept", "application/json");
  const res2 = await supertest(app).post("/api/auth/login").send(user2).set("Accept", "application/json");
  auth1.token = res1.body.token;
  auth2.token = res2.body.token;
  done();
};

beforeAll((done) => {
  mongoose.connect(
    process.env.MONGODBTESTURL,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true },
    () => signupAndLoginUser(done)
  );
});

afterAll((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

test("Test Create Todo Endpoint, with user1 credential", async () => {
  await supertest(app)
    .post("/api/todo")
    .send(todo)
    .set("Accept", "application/json")
    .set("Authorization", auth1.token)
    .expect("Content-Type", /json/)
    .expect(201);
});

test("Test Negative Create Todo Endpoint, no argument sent", async () => {
  await supertest(app)
    .post("/api/todo")
    .set("Accept", "application/json")
    .set("Authorization", auth1.token)
    .expect("Content-Type", /json/)
    .expect(400);
});

test("Test Negative Create Todo Endpoint, no authorization sent", async () => {
  await supertest(app).post("/api/todo").send(todo).set("Accept", "application/json").expect("Content-Type", /json/).expect(401);
});

test("Test Get Todo Endpoint, with user1 credential", async () => {
  await supertest(app)
    .get("/api/todo")
    .set("Accept", "application/json")
    .set("Authorization", auth1.token)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      assert("todo" in res.body, true);
      assert(Array.isArray(res.body.todo), true);
      assert(res.body.todo.length, 1);
      assert("_id" in res.body.todo[0], true);
      assert("userid" in res.body.todo[0], true);
      assert("title" in res.body.todo[0], true);
      assert("isDone" in res.body.todo[0], true);
      assert("startDate" in res.body.todo[0], true);
      assert(res.body.todo[0].title, "Task 1");
      todo = res.body.todo[0];
    });
});

test("Test Get Todo Endpoint, with user2 credential", async () => {
  await supertest(app)
    .get("/api/todo")
    .set("Accept", "application/json")
    .set("Authorization", auth2.token)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      assert("todo" in res.body, true);
      assert(Array.isArray(res.body.todo), true);
      assert(res.body.todo.length, 1);
    });
});

test("Test Update Todo Endpoint, with user1 credential", async () => {
  await supertest(app)
    .put(`/api/todo/${todo._id}`)
    .send({ title: todo.title, isDone: true })
    .set("Accept", "application/json")
    .set("Authorization", auth1.token)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      assert(res.body.code, "01");
      assert(res.body.message, "SUCCESS");
    });
});

test("Test Delete Todo Endpoint, with user1 credential", async () => {
  await supertest(app)
    .delete(`/api/todo/${todo._id}`)
    .set("Accept", "application/json")
    .set("Authorization", auth1.token)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      assert(res.body.code, "01");
      assert(res.body.message, "SUCCESS");
    });
});

test("Test Negative Update Todo Endpoint, with user2 credential but use user1 todo id", async () => {
  await supertest(app)
    .put(`/api/todo/${todo._id}`)
    .send({ title: todo.title, isDone: true })
    .set("Accept", "application/json")
    .set("Authorization", auth2.token)
    .expect("Content-Type", /json/)
    .expect(404)
    .expect((res) => {
      assert(res.body.code, "404");
      assert(res.body.message, "Data Not Found");
    });
});

test("Test Delete Todo Endpoint, with user2 credential but use user1 todo id", async () => {
  await supertest(app)
    .delete(`/api/todo/${todo._id}`)
    .set("Accept", "application/json")
    .set("Authorization", auth2.token)
    .expect("Content-Type", /json/)
    .expect(404)
    .expect((res) => {
      assert(res.body.code, "404");
      assert(res.body.message, "Data Not Found");
    });
});
