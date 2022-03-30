
import {React, useState}  from 'react';
import Login from './Login'
import './App.css';
import './Dashboard'
import Dashboard from './Dashboard';



export class User{
  username;
  password;
  isLoggedIn;
  secQuestion;
  secAnswer;

  constructor(uname,pass){
    this.username =uname;
    this.password = pass;
    this.isLoggedIn = true;
    this.secQuestion="Whats is the course number of Design of mechatronics systems 1?";
    this.secAnswer = "41028"
  };

  setUsername(uname){
    this.username=uname;
    return
  }
  setPassword(pass){
    this.password=pass;
    return
  }

  toggleLoggedIn(){
    this.isLoggedIn= !(this.isLoggedIn);
  }
  
  setSecQuestion(secQ){
    this.secQuestion=secQ;
  }

}

function App() {
  const [user, setUser] = useState(undefined);

  if (typeof user ==="undefined" || user.isLoggedIn===false){
    return (<Login setUser={setUser} /> );
  }
  else if(user instanceof User && user.isLoggedIn === true){
    return(<Dashboard user={user}  setUser={setUser} />); 
  }
  else {return <p>FUBAR  </p>; }
}

export default App;

