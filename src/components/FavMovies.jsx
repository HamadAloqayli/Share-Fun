import {useEffect, useState} from 'react';
import axios from 'axios';
import { MdStar } from "react-icons/md";
import {v4 as uuidv4} from 'uuid';
import { BiError } from 'react-icons/bi';

const FavMovies = (props) => {

    const {user,firestore} = props;

    const tmdbKey = '6500ae4de9339a92cbef501c636fc2c0';
    const [movies,setMovies] = useState([]);

    useEffect(() => {

        getMovies();
    },[]);

    const getMovies = () => {

        firestore.collection('Users').doc(user.uid).collection('movies').onSnapshot(collection => {

            setMovies(collection.docs);
        })
    }


    return ( 
        <div className="moviesHero text-center">
            <div className="moviesContainer text-center py-4 px-lg-5 container-fluid">
                    <div className="row text-center py-4 px-lg-5">
                            {(movies.length !== 0)?movies.map(movie => (
                                <div className="movieCard my-4 text-center col position-relative" key={uuidv4()}>
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
 
export default FavMovies;