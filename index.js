const express = require("express");
const uuid = require("uuid");

const app = express();
const port = 3003;
app.use(express.json());

const users = [];

const checkUserId = (request, response, next) => {
  const { id } = request.params;
  const index = users.findIndex((user) => user.id === id);
  if (index < 0) {
    return response.status(400).json({ message: "user not found" });
  }

  request.userIndex = index;
  request.userId = id;

  next();
};

app.get("/users", (request, response) => {
  return response.json(users);
});

app.post("/users", (request, response) => {
  const { order, name } = request.body;
  const user = { id: uuid.v4(), order, name };
  users.push(user);
  return response.status(201).json(user);
});

app.put("/users/:id", checkUserId, (request, response) => {
  const { order, name } = request.body;
  const id = request.userId;
  const index = request.userIndex;

  const updateUsers = { id, order, name };

  users[index] = updateUsers;

  return response.json(updateUsers);
});

app.delete("/users/:id", checkUserId, (request, response) => {
  const id = request.userId;
  const index = request.userIndex;

  users.splice(index, 1);

  return response.status(204).json({ message: "user deleted" });
});

app.listen(port, () => {
  console.log("server started on port 3003");
});
