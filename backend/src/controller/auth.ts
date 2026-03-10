import type { Request, Response } from "express";
import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// i/p - name email password
// validate
// email validate
// see if user already exists - if no, return
// if yes - get user
// create token

export async function login(req: Request, res: Response){
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({error:"Missing feilds!"});
    }

    const regrex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!regrex.test(email)){
        return res.status(400).json({error:"Invalid mail"});
    }

    const user = await pool.query(`SELECT user_id,password_hash FROM users WHERE email = $1`, [email]);

    if(!user.rowCount){
        return res.status(400).json({error:"Wrong email or password"});
    }

    const validPassword = await bcrypt.compare(password,user.rows[0].password_hash);

    if(!validPassword){
        return res.status(400).json({error:"Wrong email or password"});
    }


    if(!process.env.JWT_SECRET_KEY){
        return res.status(400).json({error:"Missing jwt key"});
    }
    const jwt_secret = process.env.JWT_SECRET_KEY

    const token = await jwt.sign({user_:user.rows[0].user_id},jwt_secret,{expiresIn:"3d"});

    return res.status(200).json({message:"User logged in successfully",user:user.rows[0].user_id,token});
}


// i/p - name email password
// validate
// email validate
// see if user already exists - if yes, return
// if no - hash password->insert into table
// create token

export async function register(req: Request, res: Response){
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({error:"Missing feilds!"});
    }

    const regrex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!regrex.test(email)){
        return res.status(400).json({error:"Invalid mail"});
    }

    const existUser = await pool.query(`SELECT user_id FROM users WHERE email = $1`, [email]);

    if(existUser.rowCount){
        return res.status(400).json({error:"User already exists"});
    }

    const passwordHash = await bcrypt.hash(password,10);

    const result = await pool.query(`INSERT INTO users(username,email,password_hash) VALUES ($1,$2,$3)`,[name,email,passwordHash]);

    const user = await pool.query(`SELECT user_id FROM users WHERE email = $1`, [email]);

    if(!process.env.JWT_SECRET_KEY){
        return res.status(400).json({error:"Missing jwt key"});
    }
    const jwt_secret = process.env.JWT_SECRET_KEY

    const token = await jwt.sign({userId:user.rows[0].user_id},jwt_secret,{expiresIn:"3d"});

    return res.status(200).json({message:"User created successfully",user:user.rows[0].user_id,token});
}

