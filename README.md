# ToDo App

Simple ToDo tracker application.

Stack:

- NodeJS
- Mongoose
- Express

Unit Test:

- Jest
- Supertest

Endpoint:

- Signup

```
URL: /api/signup
METHOD: POST
BODY: {
    "email":"someone@domain.com",
    "username":"someone",
    "password":"somepassword"
}
```

- Login

```
URL: /api/login
METHOD: POST
BODY: {
"email":"someone@domain.com",
"username":"someone",
"password":"somepassword"
}
```

- Logout

```
URL: /api/logout
METHOD: POST
HEADER: { "Authorization": "Bearer token" }
BODY: {}
```

- Add Todo

```
URL: /api/todo
METHOD: POST
HEADER: { "Authorization": "Bearer token" }
BODY: { "title": "some title" }
```

- Get Todo

```
URL: /api/todo
METHOD: GET
HEADER: { "Authorization": "Bearer token" }
BODY: {}
```

- Update Todo

```
URL: /api/todo/:_id
PARAM: todo id
METHOD: PUT
HEADER: { "Authorization": "Bearer token" }
BODY: { "title": "some title", "isDone": boolean }
```

- Delete Todo

```
URL: /api/todo/:_id
PARAM: todo id
METHOD: DELETE
HEADER: { "Authorization": "Bearer token" }
BODY: {}
```