import { Router } from "express";
import CartsModel from "../dao/models/carts.js";
import ProductsModel from "../dao/models/products.js";

const router = Router()

router.post("/",async(req,res)=>{
    const carrito = {
      products : []
    }
    let result = await CartsModel.insertMany([carrito])
    return res.json({message : "Carrito creado correctamente", data: result})
})

router.get("/:cid",async(req,res)=>{
    const {cid} = req.params
    let result = await CartsModel.findOne({_id: cid})
    return res.json({message: "Carrito seleccionado", data: result})
})

router.post("/:cid/product/:pid",async(req,res)=>{
  const { cid, pid } = req.params;
  let carrito = await CartsModel.findOne({_id:cid});
  
  if (carrito) {
      const productoEnCarrito = carrito.products.find(producto => producto.product.id === pid);
      
      if (productoEnCarrito) {
          let producto = await ProductsModel.findById(pid)
          producto.quantity++
          let result = await ProductsModel.findByIdAndUpdate(pid,producto)
      } else {
          const producto = await ProductsModel.findById(pid);
          producto.quantity = 1
          let result = await ProductsModel.findByIdAndUpdate(pid,producto)
          carrito.products.push({
              product: producto._id,
          });
      }
      
      const result = await carrito.save();
      return res.json({ message: "Producto agregado", data: result });
  } else {
      return res.status(404).json({ message: "Carrito no encontrado" });
  }
})

router.delete("/:cid/products/:pid",async(req,res)=>{
    const {cid,pid} = req.params
    let carrito = await CartsModel.findOne({_id: cid})
    let productos = carrito.products
    let producto = productos.findIndex((producto)=>producto.product.id === pid)
    if(producto !== -1){
      productos.splice(producto,1)
      let result = await CartsModel.findByIdAndUpdate(cid,carrito)
      return res.json({message: "Producto eliminado correctamente del carrito", data: result})
    }else{
      return res.status(404).json({message: "Producto no encontrado"})
    }
})

router.put("/:cid",async(req,res)=>{
    const {cid} = req.params
    const {data} = req.body
    let carrito = await CartsModel.findById(cid)
    carrito.products = data
    let result = await CartsModel.findByIdAndUpdate(cid,carrito)
    return res.json({message: "Carrito actualizado", data: result})
})

router.put("/:cid/products/:pid",async(req,res)=>{
     const {cid,pid} = req.params
     const {cantidad} = req.body
     let carrito = await CartsModel.findOne({_id: cid})
     let productos = carrito.products
     let producto = productos.findIndex((producto)=>producto.product.id === pid)
     if(producto !== -1){
      productos[producto].product.quantity = cantidad
      let result = await CartsModel.findByIdAndUpdate(cid,carrito)
      return res.json({message: "Cantidad de ejemplares actualizada", data: result})
     }else{
      return res.status(404).json({message: "Producto no encontrado"})
     }
})

router.delete("/:cid",async(req,res)=>{
    const {cid} = req.params
    let carrito = await CartsModel.findById(cid)
    carrito.products = []
    let result = await CartsModel.findByIdAndUpdate(cid,carrito)
    return res.json({message: "Carrito vacio", data: result})
})

export default router