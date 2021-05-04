import {useContext,useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import {userContext} from '../contexts/userContext';
import FavMovies from './FavMovies';
import FavSeries from './FavSeries';

const Favorite = () => {

    const {user,setUser,userData,setUserData,getUserData,auth,firestore,selection} = useContext(userContext);

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

    
     if(!user || sessionStorage.getItem('id') !== null && sessionStorage.getItem('id').length === 0)
        return <Redirect to="/" />


    if(selection === "M")
    return ( 
        <>
                <FavMovies user={user} firestore={firestore} />
        </>
     );

     else
     return ( 
         <>
                <FavSeries user={user} firestore={firestore} />
         </>
      );

}
 
export default Favorite;