import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";

function AppRouter(){
    return(
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>

            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;