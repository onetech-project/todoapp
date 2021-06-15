import app from "../app.js";
import mongoose from "mongoose";
import supertest from "supertest";
import assert from "assert";
import { config } from "dotenv";

config();

const user = {
	email: "someones@domain.com",
	username: "someones",
	password: "somepassword",
};

beforeAll((done) => {
	mongoose.connect(
		process.env.MONGODBTESTURL,
		{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true },
		() => done()
	);
});

afterAll((done) => {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => done());
	});
});

test("Test Signup Endpoint, user created", async () => {
	await supertest(app).post("/api/auth/signup").send(user).set("Accept", "application/json").expect("Content-Type", /json/).expect(201);
});

test("Test Negative Signup Endpoint, user already exist", async () => {
	await supertest(app).post("/api/auth/signup").send(user).set("Accept", "application/json").expect("Content-Type", /json/).expect(409);
});

test("Test Negative Signup Endpoint, email wrong format", async () => {
	await supertest(app)
		.post("/api/auth/signup")
		.send({ ...user, email: "adwawdwa" })
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.expect(400)
		.expect((res) => {
			assert(res.body.message, "Enter a valid email address.");
		});
});

test("Test Negative Signup Endpoint, Username wrong length", async () => {
	await supertest(app)
		.post("/api/auth/signup")
		.send({ ...user, username: "aaaa", email: "aa@aa.com" })
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.expect(400)
		.expect((res) => {
			assert(res.body.message, "Username should be at least 8 characters.");
		});
});

test("Test Negative Signup Endpoint, Username wrong format", async () => {
	await supertest(app)
		.post("/api/auth/signup")
		.send({ ...user, username: "()()*awda", email: "aa@aa.com" })
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.expect(400)
		.expect((res) => {
			assert(res.body.message, "Username may only contain letters and numbers.");
		});
});

test("Test Negative Signup Endpoint, Password wrong format", async () => {
	await supertest(app)
		.post("/api/auth/signup")
		.send({ username: "aaaaaaaa", password: "aaaa", email: "aa@aa.com" })
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.expect(400)
		.expect((res) => {
			assert(res.body.message, "Password should be at least 8 characters.");
		});
});

test("Test Negative Signup Endpoint, no argument sent", async () => {
	await supertest(app).post("/api/auth/signup").set("Accept", "application/json").expect("Content-Type", /json/).expect(400);
});

test("Test Login Endpoint", async () => {
	await supertest(app).post("/api/auth/login").send(user).set("Accept", "application/json").expect("Content-Type", /json/).expect(200);
});

test("Test Negative Login Endpoint", async () => {
	await supertest(app)
		.post("/api/auth/login")
		.send({ ...user, password: "123123" })
		.set("Accept", "application/json")
		.expect("Content-Type", /json/)
		.expect(400)
		.expect((res) => {
			assert(res.body.message, "Username and password does not match");
		});
});

test("Test Logout Endpoint", async () => {
	let auth = {};
	await loginUser(auth);
	await supertest(app).post("/api/auth/logout").set("Accept", "application/json").set("Authorization", auth.token).expect(200);
});

test("Test Negative Logout Endpoint, without authorization", async () => {
	await supertest(app).post("/api/auth/logout").set("Accept", "application/json").expect(401);
});

const loginUser = async (auth) => {
	const res = await supertest(app).post("/api/auth/login").send(user).set("Accept", "application/json").expect("Content-Type", /json/).expect(200);
	auth.token = res.body.token;
};
