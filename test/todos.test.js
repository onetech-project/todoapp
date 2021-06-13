import app from "../app.js";
import mongoose from "mongoose";
import supertest from "supertest";
import assert from "assert";

const user1 = {
  email: "someones@domain.com",
  username: "someones",
  password: "somepassword",
};

const user2 = {
  email: "sometwo@domain.com",
  username: "sometwo",
  password: "somepassword",
};

let todo = {
  title: "Task 1",
};

let auth1 = {};
let auth2 = {};

const signupAndLoginUser = async (done) => {
  await supertest(app).post("/api/signup").send(user1).set("Accept", "application/json");
  await supertest(app).post("/api/signup").send(user2).set("Accept", "application/json");
  const res1 = await supertest(app).post("/api/login").send(user1).set("Accept", "application/json");
  const res2 = await supertest(app).post("/api/login").send(user2).set("Accept", "application/json");
  auth1.token = res1.body.token;
  auth2.token = res2.body.token;
  done();
};

beforeAll((done) => {
  mongoose.connect("mongodb://localhost:27017/testDB", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () =>
    signupAndLoginUser(done)
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
    .expect(500)
    .expect({ code: "00", message: "todo validation failed: title: title cannot be empty" });
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
      const error = [];
      if (!("todo" in res.body)) error.push("missing todo key");
      if (!Array.isArray(res.body.todo)) error.push("property todo is not array type, expected to be array type");
      if (!res.body.todo.length) error.push("todo length = 0, expected 1");
      if (!("_id" in res.body.todo[0])) error.push("Missing _id key in todo object");
      if (!("title" in res.body.todo[0])) error.push("Missing title key in todo object");
      if (!("userid" in res.body.todo[0])) error.push("Missing userid key in todo object");
      if (!("isDone" in res.body.todo[0])) error.push("Missing isDone key in todo object");
      if (!("startDate" in res.body.todo[0])) error.push("Missing startDate key in todo object");
      if (res.body.todo[0].title !== "Task 1") error.push("todo title is wrong, expected 'Task 1'");
      if (error.length) throw new Error(error);
      else todo = res.body.todo[0];
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
      const error = [];
      if (!("todo" in res.body)) error.push("missing todo key");
      if (!Array.isArray(res.body.todo)) error.push("property todo is not array type, expected to be array type");
      if (res.body.todo.length) error.push("todo length > 0, expected 0");
      if (error.length) throw new Error(error);
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
