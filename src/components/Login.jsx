import {useState,useRef,useContext} from 'react';
import {userContext} from '../contexts/userContext';
import {Link,Redirect} from 'react-router-dom';

const Login = () => {

    const {user,auth} = useContext(userContext);

    const [message,setMessage] = useState('');

    const email = useRef('');
    const password = useRef('');


    const handleLogin = (e) => {
        e.preventDefault();

        if(email.current.value.trim() === "" || password.current.value.trim() === "")
        {
            setMessage('All fields are required!');
            return;
        }

        auth.signInWithEmailAndPassword(email.current.value,password.current.value)
        .then((res) => {

            console.log(res);
            console.log('user has been loged In');

            setMessage('');
            e.target.reset();
            return;
        })
        .catch((res) => {
            switch(res.code){
                case "auth/invalid-email":
                case "auth/user-disabled":
                case "auth/user-not-found":
                    setMessage(res.message);
                    break;
                case "auth/wrong-password":
                    setMessage(res.message);
                    break;
            }
            return;
        });

    }

    if(user || sessionStorage.getItem('id') !== null && sessionStorage.getItem('id').length > 0)
        return <Redirect to='/' />

    return ( 
        <div className="loginHero">
                    <div className="loginContainer">
                        <h1 className="mb-5 display-4">Login</h1>
        
                        <span style={{color:'#FF5F5C'}}>{message}</span>

                        <form action="" onSubmit={handleLogin}>
                            <div className="form__group field my-4 w-100">
                                <input ref={email} type="email" className="form__field" placeholder="Email" name="Email" id='Email' required />
                                <label htmlFor="Email" className="form__label">Email</label>
                            </div>
        
                            <div className="form__group field my-4 w-100">
                                <input ref={password} type="Password" className="form__field" placeholder="Password" name="Password" id='Password' required />
                                <label htmlFor="Password" className="form__label">Password</label>
                            </div>

                            <span className="swichPage my-4">
                                Don't have an account ? <Link className="logupBtn" to="/Signup" style={{color:"#9b9b9b"}}>Sign up</Link>
                            </span>
        
                            <input className="form-control mt-4" type="submit" value="Submit"/>
                        </form>

                    </div>
        </div>
     );
}
 
export default Login;