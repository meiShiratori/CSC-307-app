import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userServices from './user-services.js';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Data Base Page');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/users', (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name !== undefined && job !== undefined) {
    let result = userServices.getUsers(name, job);
    if (result.length === 0) {
      res.status(404).send({ message: 'No users found with the provided name and job.' });
    } 
    else {
      res.send({ users_list: result.map(user => ({ id: user._id, name: user.name, job: user.job })) });
    }
  } 
  else if (name !== undefined) {
    userServices.findUserByName(name)
    .then(user => res.send({ id: user._id, name: user.name, job: user.job }))
    .catch(error => res.status(500).send(error.message));
  } 
  else {
    userServices.getUsers()
    .then(users => res.send({ users_list: users.map(user => ({ id: user._id, name: user.name, job: user.job })) }))
    .catch(error => res.status(500).send(error.message));
  }
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  userServices.findUserById(id)
  .then(user => {
      if (user) {
          const userResponse = { id: user._id, name: user.name, job: user.job };
          res.send(userResponse);
      } 
      else {
          res.status(404).send('Not Found: ' + id);
      }
  })
  .catch(error => {
      res.status(500).send(error.message);
  });
});

app.post('/users', async (req, res) => {
  const userToAdd = req.body;
  userServices.addUser(userToAdd)
  .then(result => res.status(201).send({ id: result._id, name: result.name, job: result.job }))
  .catch(error => res.status(500).send(error.message));
});

app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  userServices.findByIdAndDelete(id)
  .then(deleted => {
      if (deleted) res.status(200).send('Deleted user: ' + id);
      else res.status(404).send('User not found.');
  })
  .catch(error => res.status(500).send(error.message));
});

