import type { AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";
import { pool } from "../db/db.js";

//get all tags where user id = !
export async function getAllTags(req: AuthRequest, res: Response){
    const userId = req.user_id;

    try{
        const result = await pool.query(`SELECT tag_id,tag_name FROM tags WHERE user_id = $1 ORDER BY tag_name`,[userId]);
        return res.status(200).json({message:"Tags retrieved successfully",tags:result.rows});
    }catch(err:any){
        return res.status(500).json({message:"Failed to fetch tags"});
    }
    
}

export async function deleteTag(req: AuthRequest, res: Response){
    const userId = req.user_id;
    const tagId = req.params.id;

    if(!tagId){
        return res.status(400).json({message:"tag id is required"});
    }

    try{
        const result = await pool.query(`DELETE FROM tags WHERE user_id = $1 AND tag_id = $2`,[userId,tagId]);

        if(!result.rowCount){
            return res.status(404).json({message:"Tag not found"});
        }
        return res.status(200).json({message:"Tags deleted successfully"});
    }catch(err:any){
        return res.status(500).json({message:"Failed to delete tags"});
    }

}