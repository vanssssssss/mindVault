import { Router } from "express";
import { getAllNotes,createNote,getNote,updateNote,deleteNote } from "../controller/notes.js";
import { verifyToken } from "../middleware/auth.js";

const route = Router();

route.post('/',verifyToken,createNote);
route.get('/',verifyToken,getAllNotes);
route.get('/:id',verifyToken,getNote);
route.patch('/:id',verifyToken,updateNote);
route.delete('/:id',verifyToken,deleteNote);

export default route;