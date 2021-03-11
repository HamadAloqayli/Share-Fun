import { useEffect, useState } from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import firebase, {auth,firestore,storage} from './Firebase';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Groups from './components/Groups';
import Group from './components/Group';
import Favorite from './components/Favorite';
import {userContext} from './contexts/userContext';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import "../node_modules/jquery/dist/jquery.min.js";
// import "bootstrap/dist/js/bootstrap.min.js";
// import "../node_modules/react-popper/dist/index.umd";
import './css/style.css';

function App() {

  const [user,setUser] = useState(null);
  const [userData,setUserData] = useState({});
  const [selection,setSelection] = useState("M");


  useEffect(() => {
    authState();
  },[]);

  const authState = () => {
    auth.onAuthStateChanged((user) => {
      if(user)
      {

          setUser(user);
          getUserData(user.uid);
      }
      else
      {
          setUser(null);
          setUserData({});
      }
    });
  }

  const getUserData = (UID) => {

    firestore.collection("Users").doc(UID).get()
    .then((res) => {

      setUserData({
        username: res.data().username,
        email: res.data().email,
        gender: res.data().gender
      });

    })
    .catch((res) => {
      console.log('no data');
    });

  }


  return (
    <userContext.Provider value={{user,setUser,userData,setUserData,getUserData,firebase,auth,firestore,storage,selection,setSelection}}>
        <Router>
              <Route path="/" component={NavBar} />
          <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/Login" component={Login} />
              <Route exact path="/Signup" component={Signup} />
              <Route exact path="/Profile" component={Profile} />
              <Route exact path="/Groups" component={Groups} />
              <Route exact path="/Group/:id" component={Group} />
              <Route exact path="/Favorite" component={Favorite} />

              <Route path="/:notFound" render={() => <Redirect to='/' />} />

          </Switch>
        </Router>
    </userContext.Provider>
  );
}

export default App;
