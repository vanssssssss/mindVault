import type { AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";
import { pool } from "../db/db.js";

//get notes title, content, tag 
//insert in db
//for tags - >check if tag exist -> if not add mising tag-> insert in note_tag table
export async function createNote(req: AuthRequest, res:Response){
    const userId = req.user_id;
    const {title, content, tags} = req.body;
    const client = await pool.connect();

    if(!title && !content){
        return res.status(400).json({message:"Can't create an empty note"});
    }

    const normalisedTags = tags?.map((t:string) =>
        t.trim().toLowerCase()
    ) ?? [];

    const uniqueTags = [...new Set(normalisedTags)];

    try{
        await client.query("BEGIN");
        const result = await client.query(`INSERT INTO notes (user_id,title,content) VALUES ($1,$2,$3) RETURNING notes_id`,[userId,title,content]);

        const noteId = result.rows[0].notes_id;
        if(uniqueTags && uniqueTags.length){
            for(const tagName of uniqueTags){
                let tagId = await client.query(`SELECT tag_id FROM tags WHERE tag_name = $1 AND user_id = $2`,[tagName,userId]);
                if(!tagId.rowCount){
                    tagId = await client.query(`INSERT INTO tags(user_id,tag_name) VALUES ($1,$2) RETURNING tag_id`,[userId,tagName]);
                }

                await client.query(`INSERT INTO notes_tags (notes_id,tags_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,[noteId,tagId.rows[0].tag_id]);

            }
        }
        await client.query("COMMIT");
        return res.status(200).json({message:"Note added successfully",notes:result.rows[0]});
    }catch(err:any){
        await client.query("ROLLBACK");
        return res.status(400).json({message:"Failed to create note",err});
    }finally{
        client.release();
    }
}

//get user id from req
//get all notes with their tags
export async function getAllNotes(req: AuthRequest, res:Response){
    const userId = req.user_id;

    const notes = await pool.query(
        `SELECT 
            n.notes_id,n.title, n.content, 
            COALESCE (array_agg(t.tag_name) FILTER (WHERE t.tag_name IS NOT NULL),'{}') as tags
        FROM notes n
        LEFT JOIN notes_tags nt ON n.notes_id = nt.notes_id
        LEFT JOIN tags t ON nt.tags_id = t.tag_id
        WHERE n.user_id = $1
        GROUP BY n.notes_id
        ORDER BY n.updated_at;`
        ,[userId]);

    return res.status(200).json({message:"Notes retrieved successfully",notes:notes.rows});
}

export async function getNote(req: AuthRequest, res:Response){
    const noteId = req.params.id;
    const userId = req.user_id;

    const note = await pool.query(
        `SELECT 
            n.notes_id,n.title, n.content, 
            COALESCE (array_agg(t.tag_name) FILTER (WHERE t.tag_name IS NOT NULL),'{}') as tags
        FROM notes n
        LEFT JOIN notes_tags nt ON n.notes_id = nt.notes_id
        LEFT JOIN tags t ON nt.tags_id = t.tag_id
        WHERE n.notes_id = $1 
        AND n.user_id = $2
        GROUP BY n.notes_id;`
        ,[noteId,userId]);

    if(!note.rowCount){
        return res.status(400).json({message:"Note not found"});
    }

    return res.status(200).json({message:"Note retrieved successfully",notes:note.rows[0]});
}

//update title, update content, update tags;
export async function updateNote(req: AuthRequest, res:Response){
    const {title,content,tags} = req.body;
    const userId = req.user_id;
    const noteId = req.params.id;
    
    const normalisedTags = tags?.map((t:string) =>
        t.trim().toLowerCase()
    ) ?? [];

    const uniqueTags = [...new Set(normalisedTags)];
    const client = await pool.connect();
    try{

        await client.query("BEGIN");

        const result = await client.query(`
            UPDATE notes 
            SET title = COALESCE($1,title),
            content = COALESCE($2,content),
            updated_at = now()
            WHERE notes_id = $3 AND user_id = $4 RETURNING notes_id`,
        [title ?? null,content ?? null,noteId,userId]);

        if(!result.rowCount){
            await client.query("ROLLBACK");
            return res.status(400).json({message:"Note not found"});
        }

        if(uniqueTags && uniqueTags.length){
            await client.query(`
                DELETE FROM notes_tags WHERE notes_id = $1`,
            [noteId]);

            for(const tagName of uniqueTags){
                let tagId = await client.query(`SELECT tag_id FROM tags WHERE tag_name = $1 AND user_id = $2`,[tagName,userId]);
                if(!tagId.rowCount){
                    tagId = await client.query(`INSERT INTO tags(user_id,tag_name) VALUES ($1,$2) RETURNING tag_id`,[userId,tagName]);
                }
                await client.query(`INSERT INTO notes_tags(notes_id,tags_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,[noteId,tagId.rows[0].tag_id]);
            }
        }

        await client.query("COMMIT");
        return res.status(200).json({message:"Note updated successfully"});

    }catch(err:any){
        await client.query("ROLLBACK");
        return res.status(400).json({message:"Failed to update note"});
    }finally{
        await client.release();

    }
}

export async function deleteNote(req: AuthRequest, res:Response){
    const noteId = req.params.id;
    const userId = req.user_id;

    const result = await pool.query(`
        DELETE FROM notes 
        WHERE notes_id = $1 
        AND user_id = $2;
    `,[noteId,userId]);

    if(!result.rowCount){
        return res.status(404).json({message:"Note not found"});
    }

    return res.status(200).json({message:"Note deleted successfully"});
}



