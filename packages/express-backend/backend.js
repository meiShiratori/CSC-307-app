// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};



const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};



const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

function generateId() {
  let newId = '';
  
  for (let i = 0; i < 3; i++) {
    const randomASCII = Math.floor(Math.random() * (122 - 97 + 1)) + 97;
    const randomChar = String.fromCharCode(randomASCII);
    newId += randomChar;
  }
  
  for (let i = 0; i < 3; i++) {
    const randomInt = Math.floor(Math.random() * 10);
    newId += randomInt;
  }
  
  return newId;
}

const addUser = (user) => {
    user["id"] = generateId();
  users["users_list"].push(user);
  return user;
};

const deleteUser = (id) => {
    const index = users.users_list.findIndex(user => user.id === id);
    if (index !== -1){
        users.users_list.splice(index, 1);
        return true;
    } 
    return false;
    
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});


app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined && job != undefined) {
    let result = users.users_list.filter(user => user.name === name && user.job === job);
    if (result.length === 0) {
      res.status(404).send({ message: "No users found with the provided name and job." });
    } 
    else {
      res.send({ users_list: result });
    }
  } 
  else if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } 
  else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; 
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const addedUser = addUser(userToAdd);
  res.status(201).send(addedUser);
});

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    const success = deleteUser(id);
    if (success) {
        res.status(200).send("Deleted user: " + id );
    } else {
        res.status(404).send("User not found.");
    }
});



