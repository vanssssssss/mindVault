import { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

function Register(){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");

    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent){
        e.preventDefault();

        if(password !== confirmPassword){
            alert("Passwords do not match");
            return;
        }

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
                        className="inactive"
                        onClick={()=>navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        className="active"
                    >
                        Register
                    </button>

                </div>

                <form className="form" onSubmit={handleSubmit}>

                    <h2>Signup form</h2>

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

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        required
                    />

                    <button className="submit-btn">
                        Register
                    </button>

                </form>

            </div>

        </div>
    )
}

export default Register;