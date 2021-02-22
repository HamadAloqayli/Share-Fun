import {useContext,useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import {userContext} from '../contexts/userContext';
import GroupMovies from './GroupMovies';
import GroupSeries from './GroupSeries';

const Group = (props) => {

    const {user,setUser,userData,setUserData,getUserData,auth,firestore,selection} = useContext(userContext);

    const groupID = props.match.params.id;
    const [loading,setLoading] = useState(true);

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
          setLoading(false);
        });
      }


      if(loading)
        return <h1>Loading ...</h1>

    
     if(!user)
        return <Redirect to="/" />


    if(selection === "M")
    return ( 
        <>
                <GroupMovies user={user} firestore={firestore} groupID={groupID} />
        </>
     );

     else
     return ( 
         <>
                <GroupSeries user={user} firestore={firestore} groupID={groupID} />
         </>
      );

}
 
export default Group;