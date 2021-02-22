import {useContext} from 'react';
import {userContext} from '../contexts/userContext';
import Movies from './Movies';
import Series from './Series';

const Home = () => {

    const {user,selection} = useContext(userContext);


    if(selection === "M")
    return ( 
        <>

            <Movies />

        </>
     );

     else
     return ( 
         <>

            <Series />
            
         </>
      );
}
 
export default Home;