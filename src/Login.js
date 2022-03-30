
import { useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {User} from './App'


function Login(props){

    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessages] = useState(undefined);


    const database = [
        {
          username: "user1",
          password: "pass1"
        },
        {
          username: "user2",
          password: "pass2"
        }
      ];
    
      const errors = {
        uname: "invalid username",
        pass: "invalid password"
      };


    function validateForm() {
        return username.length > 0 && password.length > 0;
      }
    
    function handleSubmit(event) {
        event.preventDefault();

        const userData = database.find((entry) => entry.username === username);
        if (userData) {
            if (userData.password !== password) {
              // Invalid password
              setErrorMessages({ name: "pass", message: errors.pass});
            } else {
                    const user = new User(userData.username, userData.password);
                    props.setUser(user);
                setErrorMessages(undefined)
            }
          } else {
            // Username not found
            setErrorMessages({ name: "uname", message: errors.uname });
          }
    }


    return(
        <div className="App" >
            <div className="App-header"><h1>Welcome to the Smart Chindogu Belt </h1></div>
        
        <b/>
        <h3>Login:</h3>
      
      <Form onSubmit={handleSubmit}>
      <div className="myInput">
        <Form.Group controlId="Username">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            autoFocus
            type="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="Password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
           {errorMessage ? (<p>{" "}{errorMessage.name}: {errorMessage.message}</p>) : ("")}
        </Form.Group>
        </div>

          <button  size="lg" type="submit" disabled={!validateForm()}>
            Login
          </button>

      </Form>
        </div>
    );
}

export default Login