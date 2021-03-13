import {useEffect, useState} from 'react';
import axios from 'axios';
import { MdStar } from "react-icons/md";
import {v4 as uuidv4} from 'uuid';
import { BiError } from 'react-icons/bi';
import deleteIcon from '../img/delete.png';

const GroupMovies = (props) => {

    const {user,firestore,groupID} = props;

    const [movies,setMovies] = useState([]);
    const [sucMessage,setSucMessage] = useState('');
    const [errMessage,setErrMessage] = useState('');

    useEffect(() => {

        getMovies();
    },[]);

    const getMovies = () => {

        firestore.collection('Groups').doc(groupID).collection('movies').onSnapshot(collection => {

            setMovies(collection.docs);
        })
    }

    const deleteMovie = (movie) => {

        firestore.collection('Groups').doc(groupID).collection('movies').doc(movie.id).delete()
        .then(res => tempShowMessage(`${movie.data().title} movie was deleted successfully`,'suc'))
        .catch(res => tempShowMessage('something went wrong!','err'))
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
                    <div className="row text-center py-4 px-lg-5">
                            {(movies.length !== 0)?movies.sort((a,b) => {
                            if(a.data().createdAt > b.data().createdAt)
                                return -1;
                            else
                                return 1;
                        }).map(movie => (
                                <div className="movieCard my-4 text-center col position-relative" key={uuidv4()}>
                                    {(movie.data().createdBy === user.uid) && <div onClick={() => deleteMovie(movie)} className="deleteOption"><img src={deleteIcon} /></div>}
                                    <div className="text-center MCSon">
                                        <img src={`https://image.tmdb.org/t/p/w300/${movie.data().poster_path}`} alt=""/>
                                        <p className="movieDetail">{movie.data().title}</p>
                                        <span className="movieDetail"><MdStar className="mb-1 mr-1" style={{color:'gold'}} />{movie.data().vote_average}</span>
                                    </div>
                                </div>)
                            ):<div className="mx-auto mt-5 text-white-50"> <BiError style={{fontSize: '42px'}} className="mt-5 mb-3" />  <h5>Sorry, there is no data to display</h5>  </div>}
                    </div>
                </div>
            </div>
     );
}
 
export default GroupMovies;