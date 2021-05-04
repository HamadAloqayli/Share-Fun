import {useRef,useState,useContext} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {userContext} from '../contexts/userContext';


const Signup = () => {

    const {user,auth,firestore} = useContext(userContext);

    const [message,setMessage] = useState('');

    const username = useRef('');
    const email = useRef('');
    const password = useRef('');
    const confirmPassword = useRef('');
    const gender1 = useRef('');
    const gender2 = useRef('');

    const handleSignup = async (e) => {
        e.preventDefault();

        let gender = "";
        let numDocs = 0;
        let users = [];
        let usernameVal = username.current.value;
        let emailVal = email.current.value;

        await firestore.collection("Users").get()
        .then((res) => {
            numDocs = res.docs.length;
            users = res.docs;
        });

        if(gender1.current.checked !== false || gender2.current.checked !== false)
        {
            if(gender1.current.checked === true)
            {
                gender = 'Male';
            }
            else
            {
                gender = 'Female';
            }
        }

        if(username.current.value.trim() === "" || email.current.value.trim() === "" || password.current.value.trim() === "" || confirmPassword.current.value.trim() === "" || gender.trim() === "")
        {
            setMessage('All fields are required!');
            return;
        }
        else if(password.current.value !== confirmPassword.current.value)
        {
            setMessage('The password and the confirmation must be identical');
            return;
        }
        
        for(let i = 0; i < numDocs; i++)
        {
            if(users[i].data().username === username.current.value)
            {
                setMessage('The username has been used already');
                return;
            }
        }

        auth.createUserWithEmailAndPassword(email.current.value,password.current.value)
        .then((res) => {

            console.log(res);
            console.log(res.user.uid);
            console.log('user has been created');

          firestore.collection("Users").doc(res.user.uid).set({
                username: usernameVal,
                email: emailVal,
                gender: gender
            });

            setMessage('');
            e.target.reset();
            return;
        })
        .catch((res) => {
            switch(res.code){
                case "auth/email-already-in-use":
                case "auth/invalid-email":
                    setMessage(res.message);
                    break;
                case "auth/weak-password":
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
            <h1 className="mb-5 display-4">Sign up</h1>

            <span style={{color:'#FF5F5C'}}>{message}</span>

            <form action="" onSubmit={handleSignup}>
            <div className="form__group field my-4 w-100">
                    <input ref={username} type="text" className="form__field" placeholder="Username" name="Username" id='Username'/>
                    <label htmlFor="Username" className="form__label">Username</label>
                </div>

                <div className="form__group field my-4 w-100">
                    <input ref={email} type="email" className="form__field" placeholder="Email" name="Email" id='Email'/>
                    <label htmlFor="Email" className="form__label">Email</label>
                </div>

                <div className="form__group field my-4 w-100">
                    <input ref={password} type="Password" className="form__field" placeholder="Password" name="Password" id='Password'/>
                    <label htmlFor="Password" className="form__label">Password</label>
                </div>

                <div className="form__group field my-4 w-100">
                    <input ref={confirmPassword} type="Password" className="form__field" placeholder="Confirm password" name="Confirm password" id='Confirm password'/>
                    <label htmlFor="Confirm password" className="form__label">Confirm password</label>
                </div>

            <div className='radioHolder my-4'>
                    <label>
                        <input ref={gender1} type="radio" value="Male" name="radio" id="radio1" />
                        <span className="design"></span>
                        <span className="text ml-2">Male</span>
                    </label>
    
                    <label>
                        <input ref={gender2} type="radio" value="Female" name="radio" id="radio2"  />
                        <span className="design"></span>
                        <span className="text ml-2">Female</span>
                    </label>
            </div>

            <span className="swichPage my-4">
                Have an account ? <Link className="logupBtn" to="/Login" style={{color:' #9b9b9b'}}>Login</Link>
            </span>

                <input className="form-control mt-4" type="submit" value="Submit"/>
            </form>

        </div>
</div>
     );
}
 
export default Signup;