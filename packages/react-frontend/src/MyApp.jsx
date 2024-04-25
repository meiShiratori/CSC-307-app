// src/MyApp.jsx
import React, {useEffect, useState} from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);
  
  useEffect(() => {
  fetchUsers()
	  .then((res) => res.json())
	  .then((json) => setCharacters(json["users_list"]))
	  .catch((error) => { console.log(error); });
}, [] );

function updateList(person) { 
    postUser(person)
      .then(() => setCharacters([...characters, person]))
      .catch((error) => {
        console.log(error);
      })
}
  
const removeOneCharacter = (id) => {
    return fetch(`http://localhost:8000/users/${id}`, {
      method: 'DELETE',
  })
      .then(response => {
          if (response.status === 200) {
              setCharacters(prevCharacters => prevCharacters.filter(character => character.id !== id));
          } else if (response.status === 404) {
              throw new Error('User not found');
          }
      })
      .catch(error => {
          console.error('Delete failed:', error);
      });
};


  
function fetchUsers() {
    return fetch("http://localhost:8000/users");
}

  function postUser(person) {
      return fetch("Http://localhost:8000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
    })
        .then(response => {
            if (response.status === 201) {
                return response.json();
            } else {
                throw new Error('New user not created' + response.status);
            }
        })
        .then(data => {
            return data;
        });
  }
  

return (
  <div className="container">
    <Table
      characterData={characters}
      removeCharacter={removeOneCharacter}
    />
    <Form handleSubmit={updateList} /> 
  </div>
);
}



export default MyApp;
