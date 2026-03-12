import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { getAllTags,deleteTag } from "../controller/tags.js";

const route = Router();

route.get('/',verifyToken,getAllTags);
route.delete('/:id',verifyToken,deleteTag);


export default route;