import {useState,useEffect,useContext} from 'react';
import {userContext} from '../contexts/userContext';
import {Redirect} from 'react-router-dom';

import profileImgMaleB from '../img/profileImg_maleB.png';
import profileImgFemaleB from '../img/profileImg_femaleB.png';

const Profile = () => {

    const [loading,setLoading] = useState(true); 
    const [message,setMessage] = useState("");
    const {user,setUser,userData,setUserData,getUserData,auth} = useContext(userContext);

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

      const resetPassword = () => {


            auth.sendPasswordResetEmail(userData.email).then(function() {
                setMessage("We have sent you the reset password to your email");
            }).catch(function(error) {
                setMessage("Something went wrong!");
            });
      }

      if(loading)
        return <h1>Loading ...</h1>
        
        
            if(!user || sessionStorage.getItem('id') !== null && sessionStorage.getItem('id').length === 0)
                return <Redirect to='/' />

            return ( 
                    <div className="profileHero">
                        <div className="profileContainer">
                            
                            <img src={(userData.gender === 'Male')?profileImgMaleB:profileImgFemaleB} alt=""/>
    
                            <span style={{color:'#f4f4f4'}}>{message}</span>


                            <span className="mt-4 mb-1 ml-4">Username</span>
                            <p className="mx-auto py-2">{userData.username}</p>
    
                            <span className="mt-4 mb-1 ml-4">Email</span>
                            <p className="mx-auto py-2">{userData.email}</p>
    
                            <button type="button" className="btn resetPassword mt-4" data-toggle="modal" data-target="#exampleModal">Reset password</button>
                        </div>


                        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Reset password</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to reset your password ?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn" data-dismiss="modal">No</button>
                                <button type="button" className="btn" data-dismiss="modal" onClick={() => resetPassword()}>Yes</button>
                            </div>
                            </div>
                        </div>
                        </div>

                    </div>
                    
            );
        
}
 
export default Profile;