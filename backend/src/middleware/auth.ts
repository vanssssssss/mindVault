import type { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";

//take token from authorization header - Bearer <token>
//atke out token from it. -> split bearer and token
//then verify token with jwt

export interface AuthRequest extends Request{
    user_id?:string;
}
export async function verifyToken(req: AuthRequest, res: Response, next: NextFunction){
    try{

        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(400).json({message:"Unauthorized access"});
        }

        const token = authHeader.split(" ")[1];

        if(!token){
            return res.status(400).json({message:"Token missing"});
        }

        if(!process.env.JWT_SECRET_KEY){
            return res.status(400).json({message:"jwt secret key missing"});
        }

        const jwt_secret = process.env.JWT_SECRET_KEY;

        const decoded = jwt.verify(token,jwt_secret) as {user_id : string};
        req.user_id = decoded.user_id;
        next();
    }catch(err:any){
        return res.status(400).json({message:"Invalid or expired token"});
    }
    
}