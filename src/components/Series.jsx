import {useState,useEffect, useRef, useContext} from 'react';
import axios from 'axios';
import { MdStar } from "react-icons/md";
import { BiSearch } from 'react-icons/bi';
import { MdGroup } from "react-icons/md";
import {BsArrowLeft} from 'react-icons/bs';
import { v4 as uuidv4 } from 'uuid';
import {userContext} from '../contexts/userContext';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import {AiOutlineVerticalLeft,AiOutlineVerticalRight,AiOutlineLeft,AiOutlineRight} from 'react-icons/ai';

const Series = () => {

    const tmdbKey = '6500ae4de9339a92cbef501c636fc2c0';
    const [movies,setMovies] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [groups,setGroups] = useState([]);
    const [errMessage,setErrMessage] = useState('');
    const [sucMessage,setSucMessage] = useState('');
    const [pageCount,setPageCount] = useState(0);

    const {user,setUser,userData,setUserData,getUserData,auth,firestore} = useContext(userContext);

    const inputMovie = useRef('');
    const groupsList = useRef([]);
    const menusList = useRef([]);
    const paginate = useRef('');

    useEffect(() => {

        window.scrollTo(0,0);
        getPopularMovie();

    },[currentPage]);


    useEffect(() => {
        authState();
      },[]);


      const authState = () => {
        auth.onAuthStateChanged((user) => {
          if(user)
          {
              setUser(user);
              getUserData(user.uid);
              
              getGroups(user);
          }
          else
          {
              setUser(null);
              setUserData({});
          }
        //   setLoading(false);
        //   setLoadingData(false);
        });
      }


    const getPopularMovie = () => {

        axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${tmdbKey}&page=${currentPage}`)
        .then(res => {console.log(res.data); setMovies(res.data.results); setPageCount(res.data.total_pages)})
        .catch(res => console.log(res));
    }

    const getMovie = () => {

        let findMovie = inputMovie.current.value;
        handlePageChanging(1);

        if(findMovie.trim() !== '')
        {
            axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${tmdbKey}&query=${findMovie}&page=1`)
            .then(res => {console.log(res.data); setMovies(res.data.results); setPageCount(res.data.total_pages)})
            .catch(res => console.log(res));
        }
        else
        {
            getPopularMovie();
        }

    }

    const getGroups = async (user) => {

        let userName = '';

        await firestore.collection('Users').get()
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

                 for(let i = 0; i < collection.docs.length; i++)
                 {
                 groupList.doc(collection.docs[i].id).collection('users').get()
                     .then(result => {

                         for(let k = 0; k < result.docs.length; k++)
                         {
                             if(result.docs[k].data().username === userName)
                             {
                                 setGroups(groups => [...groups,collection.docs[i]]);
                             }
                         }
                 })
                 .catch(res => console.log(res));
                 } 
         })
         .catch(res => console.log(res));
    }

    const showGroups = (mov) => {

        for(let i = 0; i < groupsList.current.length; i++)
        {
            if(groupsList.current[i] !== null && groupsList.current[i].dataset.type === mov.id.toString())
            {
                groupsList.current[i].style = "left: 0";
                menusList.current[i].style = "left: 200%";
            }
            else if(groupsList.current[i] !== null)
            {
                groupsList.current[i].style = "left: 100%";
                menusList.current[i].style = "left: 50%";
            }
        }

    }
    const hideGroups = (mov) => {

        for(let i = 0; i < groupsList.current.length; i++)
        {
            if(groupsList.current[i] !== null && groupsList.current[i].dataset.type === mov.id.toString())
            {
                groupsList.current[i].style = "left: 100%";
                menusList.current[i].style = "left: 50%";
            }
        }

    }

    const shareWithGroup = (groupID,groupName,movie) => {

        firestore.collection('Groups').doc(groupID).collection('series').where('id','==',movie.id).get()
        .then(res => {
            
            if(res.empty)
            {
                firestore.collection('Groups').doc(groupID).collection('series').add({
                    id: movie.id,
                    poster_path: movie.poster_path,
                    title: movie.name,
                    vote_average: movie.vote_average,
                    createdBy: user.uid,
                    createdAt: new Date().getTime()
                })
                .then(res => {
                    hideGroups(movie);
                    tempShowMessage(`${movie.name} series shared with ${groupName} group`,'suc');
                })
                .catch(res => {
                    tempShowMessage('something went wrong!','err');
                });
            }
            else
            {
                tempShowMessage(`${movie.name} series is already exists in ${groupName} group`,'err');
            }
            
        })
        .catch(res => {
            tempShowMessage('somethig went wrong!','err');
        });
    }

    const addToFavorite = (movie) => {
    
        if(user)
        {
            firestore.collection('Users').doc(user.uid).collection('series').where('id','==',movie.id).get()
            .then(res => {
    
                if(res.empty)
                {
                    firestore.collection('Users').doc(user.uid).collection('series').add({
                        id: movie.id,
                        poster_path: movie.poster_path,
                        title: movie.name,
                        vote_average: movie.vote_average,
                        createdBy: user.uid,
                        createdAt: new Date().getTime()
                    })
                    .then(res => {
                        tempShowMessage(`${movie.name} series added successfuly to favorite`,'suc');
                    })
                    .catch(res => tempShowMessage('somethign went wrong!','err'));
                }
                else
                {
                    tempShowMessage(`${movie.name} series is already exists in favorite`,'err');;
                }
            })
            .catch(res => tempShowMessage('somethign went wrong!','err'));
        }
        else
            tempShowMessage(<><Link to="/Login" className="loginBTN btn btn-link">Login</Link> <span>to use this feature</span></>,'err')
    }

    const handleChangePage = ({selected}) => {

        setCurrentPage(selected+1);
    }
    const handlePageChanging = (selected) => {
        console.log(selected);
        if(selected > 0 && selected < pageCount+1)
        {
        setCurrentPage(selected);
        paginate.current.state.selected = selected-1
        console.log(paginate.current.state.selected);
        }
    }

    const tempShowMessage = (msg,type) => {

        (type === 'suc')?setSucMessage(msg):setErrMessage(msg);

        setTimeout(() => {

            setSucMessage('');
            setErrMessage('');
        },5000);
    }

    return (
        <div className="moviesHero text-center">
            <div className="moviesContainer text-center py-4 px-lg-5 container-fluid">
            <div className="parentAlert" style={(!sucMessage)?{display:'none'}:{display:'block'}}>
                    <div className="alert alert-success" role="alert">
                        <span>{sucMessage}</span>
                    </div>
            </div>
            <div className="parentAlert" style={(!errMessage)?{display:'none'}:{display:'block'}}>
                    <div className="alert alert-danger" role="alert">
                        <span>{errMessage}</span>
                    </div>
            </div>
                <div className="searchMovie my-4">
                    <label className="sr-only" htmlFor="inlineFormInputGroup">Username</label>
                    <div className="input-group mb-2">
                        <div className="input-group-prepend">
                             <div className="input-group-text"><BiSearch style={{color: '#3C3C3C',fontSize:'1.5rem'}} /></div>
                        </div>
                        <input type="text" ref={inputMovie} onChange={getMovie} className="form-control" id="inlineFormInputGroup" placeholder="Find your series ..." />
                    </div>
                </div>

                <div className="row text-center py-4 px-lg-5">
                        {movies.sort((a,b) => {
                            if(a.popularity > b.popularity)
                                return -1;
                            else
                                return 1;
                        }).map(movie => {
                            if(movie.vote_average > 0 && movie.vote_count > 0 && movie.poster_path !== null)
                            return(
                            <div className="movieCard my-4 text-center col position-relative" key={Math.random()}>
                                <div className="text-center MCSon">
                                <div className="movieOptions">
                                    <div className="movieOptionsCover"></div>
                                    <span className="movieOptionsMenu navbar-toggler-icon"></span>
                                    <ul className="groupsMenu" ref={(elm) => menusList.current.push(elm)}>
                                        <li onClick={() => showGroups(movie)}><MdGroup className="ml-4 mr-2 mb-1" style={iconsStyle} />Share with groups</li>
                                        <li onClick={() => addToFavorite(movie)}><MdStar className="ml-4 mr-2 mb-1" style={iconsStyle} />Add to favorite</li>
                                    </ul>
                                    {(user)?<ul ref={(elm) => groupsList.current.push(elm)} data-type={movie.id} className="groupsList">
                                    <BsArrowLeft onClick={() => hideGroups(movie)}  style={leftIcon} />
                                        {groups.map(group => (
                                            
                                                <li key={uuidv4()} onClick={() => shareWithGroup(group.id,group.data().name,movie)}>{group.data().name}</li>
                                            
                                                ))}
                                    </ul>:<ul ref={(elm) => groupsList.current.push(elm)} data-type={movie.id} className="groupsList d-flex flex-column justify-content-center align-items-center">
                                    <BsArrowLeft onClick={() => hideGroups(movie)}  style={leftIcon} />
                                            <Link to="/Login" className="loginBTN btn">Login</Link> <span>to use this feature</span>
                                    </ul>}
                                </div>
                                    <img src={(movie.poster_path !== null)?`https://image.tmdb.org/t/p/w300/${movie.poster_path}`:''} alt=""/>
                                    <p className="movieDetail">{movie.name}</p>
                                    <span className="movieDetail"><MdStar className="mb-1 mr-1" style={{color:'gold'}} />{movie.vote_average}</span>
                                </div>
                            </div>)
                        })}
                </div>

                <nav aria-label="Page navigation example" className="mt-4">
                    <ul className="pagination justify-content-center">
                        <AiOutlineVerticalRight className='btnClassName mr-2' onClick={() => handlePageChanging(1)} />
                        <AiOutlineLeft className='btnClassName' onClick={() => handlePageChanging(currentPage - 1)} />
                    <ReactPaginate
                            ref={paginate} 
                            pageCount={pageCount} 
                            pageRangeDisplayed={2} 
                            marginPagesDisplayed={2}

                            previousLabel={''}
                            nextLabel={''}

                            breakClassName={'bClassName'}
                            previousClassName={'pClassName'}
                            nextClassName={'nClassName'}

                            activeClassName={'activeClassName'}
                            onPageChange={handleChangePage}
                             />
                             <AiOutlineRight className='btnClassName' onClick={() => handlePageChanging(currentPage + 1)} />
                        <AiOutlineVerticalLeft className='btnClassName ml-2' onClick={() => handlePageChanging(pageCount)} />

                    </ul>
                    
                </nav>
                
            </div>
        </div>
     );
}

const paginationStyle = {
    color: '#3C3C3C',
    backgroundColor: '#f4f4f4'
}
const iconsStyle = {
    fontSize: '1.3rem'
}
const leftIcon = {
    position:'absolute',
    left:'10px',
    top:'-10px',
    color: '#f4f4f4',
    fontSize: '2rem',
    cursor: 'pointer'
}
 
export default Series;