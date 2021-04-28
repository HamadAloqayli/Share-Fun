import {useContext} from 'react';
import { Link } from 'react-router-dom';
import {userContext} from '../contexts/userContext';

import logo from '../img/logo.png';
import movieIcon from '../img//movie.png';
import songIcon from '../img/song.png';
import profileImgMale from '../img/profileImg_male.png';
import profileImgFemale from '../img/profileImg_female.png';
import { MdHome } from 'react-icons/md';
import { MdGroup } from "react-icons/md";
import { MdStar } from "react-icons/md";
import { MdPerson } from "react-icons/md";


const NavBar = () => {

    const {user,userData,auth,selection,setSelection} = useContext(userContext);

    const pathName = window.location.pathname.substr(1);

    if(!user)
    return (


<nav className="navbar navbar-expand-md sticky-top">
        <Link className="navbar-brand ml-4" to="/"><img src={logo} alt=""/></Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse text-right" id="navbarSupportedContent">
        <div className='pageName'>
                        <h1 className="text-center">{(pathName === '' || pathName === 'Favorite' || pathName.slice(0,6) === 'Group/')?<div className="selection">
                            <ul>
                                <li>
                                    <div>
                                        <img src={movieIcon} alt=""/>
                                        <span onClick={() => setSelection("M")} style={((selection === "M")?underLineStyle:{})}>Movies</span>
                                    </div>
                                </li>
                                 <li>
                                     <div>
                                        <img src={songIcon} alt=""/>
                                        <span onClick={() => setSelection("S")} style={((selection === "S")?underLineStyle:{})}>Series</span>
                                    </div>
                                </li>
                            </ul>
                        </div>:<div className="mb-3">{pathName}</div>}</h1>
            </div>
            <div className="my-3 mx-0 ml-auto">

<div className="DD">
    <div className="DDM">
                            <Link to="/Login"><button className="btn my-2 my-sm-0 ml-3" >Login</button></Link>
                            <Link to="/Signup"><button className="btn my-2 my-sm-0 ml-3" >Sign up</button></Link>
    </div>
</div>

            </div>
        </div>
</nav>

     );



     if(user)
     return (
        <nav className="navbar navbar-expand-md sticky-top">
        <Link className="navbar-brand ml-4" to="/"><img src={logo} alt=""/></Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse text-right" id="navbarSupportedContent">
        <div className='pageName'>
                        <h1 className="text-center">{(pathName === '' || pathName === 'Favorite' || pathName.slice(0,6) === 'Group/')?<div className="selection">
                            <ul>
                                <li>
                                    <div>
                                        <img src={movieIcon} alt=""/>
                                        <span onClick={() => setSelection("M")} style={((selection === "M")?underLineStyle:{})}>Movies</span>
                                    </div>
                                </li>
                                 <li>
                                     <div>
                                        <img src={songIcon} alt=""/>
                                        <span onClick={() => setSelection("S")} style={((selection === "S")?underLineStyle:{})}>Series</span>
                                    </div>
                                </li>
                            </ul>
                        </div>:<div className="mb-3">{pathName}</div>}</h1>
            </div>
            <div className="my-3 mx-0 ml-auto">

                <div className="dropdown text-right mr-5">
                        <button className="btn btn-secondary text-center dropdown-toggle userBtn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src={(userData.gender === "Male")?profileImgMale:profileImgFemale} alt=""/>
                            <span className="mx-2">{userData.username}</span>
                        </button>
                        <div className="dropdown-menu mt-3" aria-labelledby="dropdownMenuButton">
                            <Link className="dropdown-item" to="/"><MdHome className="ml-4 mr-3 mb-1" style={iconsStyle} />Home</Link>
                            <Link className="dropdown-item" to="/Groups"><MdGroup className="ml-4 mr-3 mb-1" style={iconsStyle} />Groups</Link>
                            <Link className="dropdown-item" to="/Favorite"><MdStar className="ml-4 mr-3 mb-1" style={iconsStyle} />Favorite</Link>
                            <Link className="dropdown-item" to="/Profile"><MdPerson className="ml-4 mr-3 mb-1" style={iconsStyle} />Profile</Link>
                            <div className="dropdown-divider"></div>
                                <Link className="dropdown-item text-center" to="/"><button onClick={() => auth.signOut()} className="btn logOutBtn" >Logout</button></Link>
                        </div>

                </div>
            </div>
        </div>
</nav>
      );
}

const iconsStyle = {
    fontSize: '1.3rem'
}

const underLineStyle = {
    borderBottom: '2px solid #f4f4f4',
    paddingBottom: '3px'
}
 
export default NavBar;