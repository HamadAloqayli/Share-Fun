import {useContext, useEffect,useState,useRef} from 'react';
import { Link, Redirect } from 'react-router-dom';
import {userContext} from '../contexts/userContext';
import {IoAddCircleOutline} from 'react-icons/io5';
import {BsArrowLeft} from 'react-icons/bs';
import {TiDelete} from 'react-icons/ti';
import explore from '../img/explore.png';
import { v4 as uuidv4 } from 'uuid';
import Spinner from 'react-bootstrap/Spinner';

const Groups = () => {

    const [loading,setLoading] = useState(true);
    const [loadingData,setLoadingData] = useState(true);
    const [showForm,setShowForm] = useState(false);
    const [updateData,setUpdateData] = useState(true);
    const [errMessage,setErrMessage] = useState('');
    const [sucMessage,setSucMessage] = useState('');
    const {user,setUser,userData,setUserData,getUserData,firebase,auth,firestore} = useContext(userContext);

    const groupName = useRef('');
    const userNames = useRef([]);
    const userForms = useRef([]);

    const [groups,setGroups] = useState([]);
    const [groupsIDs,setGroupsIDs] = useState([]);
    const [users,setUsers] = useState([]);

    useEffect(() => {
        authState();
      },[]);


      const authState = () => {
        auth.onAuthStateChanged((user) => {
          if(user)
          {
              setUser(user);
              getUserData(user.uid);
              
              getGroupsAndUsers(user);
          }
          else
          {
              setUser(null);
              setUserData({});
          }
          setLoading(false);
          setLoadingData(false);
        });
      }

      const resetData = () => {
        setGroups([]);
        setUsers([]);
      }

      const getGroupsAndUsers = async (user) => {

        resetData();
        let userName = '';

         firestore.collection('Users').get()
            .then(collection => {
                for(let i = 0; i < collection.docs.length; i++)
                {
                    if(collection.docs[i].id === user.uid)
                    {
                        userName = collection.docs[i].data().username
                    }
                }
         })
         .catch(res => console.log(res));

            let groupList = firestore.collection('Groups');
            
            groupList.get()
                .then(collection => {

                    let Groups = collection.docs;

                    for(let i = 0; i < Groups.length; i++)
                    {
                    groupList.doc(Groups[i].id).collection('users').get()
                        .then(result => {

                            for(let k = 0; k < result.docs.length; k++)
                            {
                                if(result.docs[k].data().username === userName)
                                {
                                    setGroups(groups => [...groups,collection.docs[i]]);

                                    for(let z = 0; z < result.docs.length; z++)
                                    {
                                        setUsers(users => [...users,result.docs[z]]);
                                    }

                                    setLoadingData(false);
                                }
                            }
                    })
                    .catch(res => {setLoadingData(false);console.log(res)});
                    } 
            })
            .catch(res => {setLoadingData(false);console.log(res)});
      }


      const addGroup = async () => {

        setLoadingData(true);
        let gName = groupName.current.value.trim();
          
        if(gName !== '')
        {
            if(groups.length === 0)
            {
                console.log(user.uid);
               await firestore.collection("Groups").add({
                    name: gName,
                    createdBy: user.uid,
                    createdAt: new Date().getTime()
                })
                .then((docRef) => {
                    
                    firestore.collection('Groups').doc(docRef.id).collection('users').doc(user.uid).set({
                        username: userData.username
                    }).then(res => {console.log(res);tempShowMessage('Group added successfuly','suc');})
                    .catch(res => {console.log(res);tempShowMessage('somthing went wrong!','err');});
    
                    groupName.current.value = '';
                    setShowForm(false);
                })
                .catch((error) => {
                    console.error(error);
                    tempShowMessage('somthing went wrong!','err');
                });
            }
            else
            {
                let found = [];

                for(let i = 0; i < groups.length; i++)
                {
                    (groups[i].data().name === gName)?found.push(true):found.push(false);
                }

                if(!found.includes(true))
                {
                   await firestore.collection("Groups").add({
                        name: gName,
                        createdBy: user.uid,
                        createdAt: new Date().getTime()
                    })
                    .then((docRef) => {
                        
                       firestore.collection('Groups').doc(docRef.id).collection('users').doc(user.uid).set({
                            username: userData.username
                        }).then(res => {console.log(res);tempShowMessage('Group added successfuly','suc');})
                        .catch(res => {console.log(res);tempShowMessage('somthing went wrong!','err');});
        
        
                        groupName.current.value = '';
                        setShowForm(false);
                    })
                    .catch((error) => {
                        console.error(error);
                        tempShowMessage('somthing went wrong!','err');
                    });
                }
                else
                {
                    tempShowMessage('This group name used before','err');
                }
            }

            resetData();
            getGroupsAndUsers(user);
        }

        setLoadingData(false);
      }

      const addUser = async (gName) => {

        setLoadingData(true);
        let uName = '';
        let gID = '';

        for(let i = 0; i < userForms.current.length; i++)
        {
            if(userForms.current[i] !== null && userForms.current[i].dataset.type === gName)
            {
               uName = userNames.current[i].value.trim();
            }
        }

          
        if(uName !== '')
        {
            let found = [];
            
           await firestore.collection('Users').get()
            .then(collection => {

                for(let i = 0; i < collection.docs.length;i++)
                {
                    (collection.docs[i].data().username === uName)?found.push(true):found.push(false);
                }
                
                if(found.includes(true))
                {
                    for(let i = 0; i < groups.length; i++)
                    {
                        if(groups[i].data().name === gName)
                        {
                            gID = groups[i].id;
                        }
                    }

                    let groupsList = firestore.collection('Groups');

                    groupsList.doc(gID).collection('users').where('username','==',uName).get()
                    .then(res => {

                        if(res.empty)
                        {
                            groupsList.doc(gID).collection('users').add({
                                username: uName
                            }).then(res => {console.log(res);tempShowMessage('User added successfuly','suc');})
                            .catch(res => {console.log(res);tempShowMessage('somthing went wrong!','err');})
                        }
                        else
                        {
                            tempShowMessage('This username in the group already','err');
                            console.log(res.empty);
                        }

                    })
                    .catch(res => {console.log(res);tempShowMessage('somthing went wrong!','err');});
                }
                else
                {
                    tempShowMessage('There is no username called '+uName,'err');
                }
            })
            .catch(res => {console.log(res);tempShowMessage('somthing went wrong!','err');});

            resetData();
            getGroupsAndUsers(user);
        }
        setLoadingData(false);
      }

      const removeForm = (element) => {
        
        for(let i = 0; i < userForms.current.length; i++)
        {
            if(userForms.current[i] !== null && userForms.current[i].dataset.type === element)
            {
                userForms.current[i].style = "left: 100%";
                userNames.current[i].value = '';
            }
        }
    }

    const getForm = (element) => {

        for(let i = 0; i < userForms.current.length; i++)
        {
            if(userForms.current[i] !== null && userForms.current[i].dataset.type === element)
            {
                userForms.current[i].style = "left: 0";
            }
        }
      }

      const deleteGroup = async (group) => {

       await firestore.collection('Groups').doc(group.id).delete()
        .then(res => tempShowMessage(`${group.data().name} group was deleted successfully`,'suc'))
        .catch(res => tempShowMessage('something went wrong!','err'))

        resetData();
        getGroupsAndUsers(user);
        setLoadingData(false);
      }

      const tempShowMessage = (msg,type) => {

        (type === 'suc')?setSucMessage(msg):setErrMessage(msg);

        setTimeout(() => {

            setSucMessage('');
            setErrMessage('');
        },5000);
    }


      if(loading)
        return   <Spinner animation="border" variant="success" />


        if(!user || sessionStorage.getItem('id').length === 0)
        return <Redirect to="/" />

        return ( 
            <div className="groupsHero pt-5">
                <div className="groupsContainer container">
            <div className="parentAlert" style={(!errMessage)?{display:'none'}:{display:'block'}}>
                    <div className="alert alert-danger" role="alert">
                        <span>{errMessage}</span>
                    </div>
            </div>
            <div className="parentAlert" style={(!sucMessage)?{display:'none'}:{display:'block'}}>
                    <div className="alert alert-success" role="alert">
                        <span>{sucMessage}</span>
                    </div>
            </div>
                    <div className="row justify-content-center align-items-center">
                        
                    {(!loadingData)?groups.sort((a,b) => {
                            if(a.data().createdAt > b.data().createdAt)
                                return -1;
                            else
                                return 1;
                        }).map(group => (
                                <div key={uuidv4()} className="col my-4 d-flex justify-content-center">
                                    <div className="groupCardHolder">
                                            <div className="groupCard groupCardAdd1 usersGroup">
                                            {(group.data().createdBy === user.uid) && <TiDelete onClick={() => deleteGroup(group)} style={leftIcon} />}
                                                    <p>{group.data().name}</p>

                                                    <div className="listOfUsers">
                                                        {users.map(user => (
                                                            <div key={uuidv4()}>
                                                                {((user.ref.parent.parent.id === group.id)?<span key={uuidv4()}>{user.data().username}</span>:'')}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="inviteUser">
                                                        <p onClick={() => getForm(group.data().name)}>+ Invite user</p>
                                                    </div>
                                                        <div className="exploreG">
                                                            <Link to={`/Group/${group.id}`}>
                                                                <img src={explore} alt=""/>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div ref={(element) => userForms.current.push(element)} data-type={group.data().name} className="groupCard groupCardForm addUserGroup">
                                                    <BsArrowLeft onClick={() => removeForm(group.data().name)} style={leftIcon} />
                                                    <p>Username</p>
                                                    <input ref={(element) => userNames.current.push(element)} type="text" className="form__field" />
                                                    <button className="form-control mt-4" onClick={() => addUser(group.data().name)}>invite</button>
                                                    
                                                    </div>
                                        </div>
                                  </div>
                                            )):<Spinner animation="border" variant="success" />}

                        <div className="col my-4 d-flex justify-content-center">
                            <div className="groupCardHolder">
                                <div className="groupCard groupCardAdd" onClick={() => setShowForm(true)}>
                                        <IoAddCircleOutline  />
                                        <p>Create a group</p>
                                </div>
                                <div className="groupCard groupCardForm" style={(showForm)?{left:'0'}:{}}>
                                    <BsArrowLeft onClick={() => {setShowForm(false);groupName.current.value = '';}} style={leftIcon} />
                                    <p>Group name</p>
                                    <input ref={groupName} type="text" className="form__field" />
                                    <button className="form-control mt-4" onClick={addGroup}>create</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
}

const leftIcon = {
    position:'absolute',
    left:'20px',
    top:'20px',
    color: '#f4f4f4',
    fontSize: '2rem',
    cursor: 'pointer'
}
 
export default Groups;