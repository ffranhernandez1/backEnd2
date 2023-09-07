import { Router } from "express";
import cartsModels from "../dao/models/carts.models.js";
import { addCart, getCart, getCartById, addProductToCart } from "../dao/dbManagers/cartManager.js";


const router = Router()

router.get("/", async (req, res) => {
    try{
        const response = await getCart()
        res.json({message: "success", data: response})
    }
    catch(err) {
        res.status(500).json({message: "algo salió mal al traer los carritos :(", error: err})
    }
})

router.get("/:cid", async (req, res) => {
    try{
        const {cid} = req.params
        const response = await getCartById(cid)
        res.json({message: "success al traer el carrito por ID", data: response})
    }
    catch(err) {
        res.status(500).json({message: "algo salió mal al traer el carrito requerido:(", error: err})
    }
})

router.post("/", async (req, res) => {
    try{
        const response = await addCart()
        res.json({message: "success. Nuevo carrito creado", data: response})
    }
    catch (err) {
        res.status(500).json({message: "algo salió mal al crear el carrito :(", error: err})
    }
})

router.post("/:cid/product/:pid", async (req, res) => { 
    try{
        const {cid, pid} = req.params
        const response = await addProductToCart(cid, pid)
        res.json({message: "success. El producto se agrego correctamente al carrito", data: response})
    }
    catch(err) {
        res.status(500).json({message: "Algo salío mal al agregar el producto al carrito :(", error: err})
    }
})

export default router;