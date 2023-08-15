import {Router} from "express"
import {getMessages } from "../dao/dbManagers/messageManager.js"

const router = Router()

router.get("/", async (req, res) => {
        try{
                const messages = await getMessages()
                res.render("chat", {messages})
        }
        catch (err){
                res.status(500).json({message: "No se pudo conectar con la BBDD", error: err})
        }
        
})
export default router;