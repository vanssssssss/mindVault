import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login(){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent){
        e.preventDefault();

        console.log({
            email,
            password
        });
    }

    return(
        <div className="container">

            <div className="form-container">

                <div className="form-toggle">

                    <button
                        type="button"
                        className="active"
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        className="inactive"
                        onClick={()=>navigate("/register")}
                    >
                        Register
                    </button>

                </div>

                <form className="form" onSubmit={handleSubmit}>

                    <h2>Login form</h2>

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                    />

                    {/* <a className="forgot">Forgot password</a> */}

                    <button className="submit-btn">
                        Login
                    </button>

                    <p className="signup-text">
                        Not a member?
                        <span onClick={()=>navigate("/register")}>
                            Signup Now
                        </span>
                    </p>

                </form>

            </div>

        </div>
    )
}

export default Login;