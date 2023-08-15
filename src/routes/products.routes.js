import { Router } from "express";
import __dirname from "../utils.js";
import { getProducts, getProductsById, addProduct, updateProduct, deleteProduct } from "../dao/dbManagers/productManager.js";

const router = Router();

router.get("/", async (req, res) => {
  try{
    const limit = parseInt(req.query.limit);
    const products = await getProducts()
    if (limit && limit < products.length) {
      const productsLimited = products.splice(0, limit);
      res.json({ message: "success", data: productsLimited, quantity: limit });
    } else {
      res.json({
        message: "success",
        data: products,
        quantity: products.length,
      });
    }
  } catch {
    res.status(500).json({ message: "Something went wrong", error: err });
  }
})

router.get("/:pid", async (req, res) => {
  try {
    const {pid} = req.params;
    const product = await getProductsById(pid)
    res.json({ message: "success", data: product });
  }
  catch(err) {
    res.json({message: "El ID buscado no se encontro en la BBDD", error: err})
  }
});

router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  const newProduct = {};

  if ((!title, !description, !code, !price, !stock, !category)) {
    res.status(400).send("Faltan datos para poder postear el producto");
  } else {
    (newProduct.title = title),
      (newProduct.description = description),
      (newProduct.code = code),
      (newProduct.price = price),
      (newProduct.status =
        !status || typeof status !== "boolean" ? true : status),
      (newProduct.stock = stock),
      (newProduct.category = category),
      (newProduct.thumbnails = !thumbnails ? [] : thumbnails)
  }

  try {
    const response = await addProduct(newProduct)
    res.json({ message: "producto agregado", product: response });
  } catch (err) {
    res.status(500).send("problemas con el servidor.");
  }
});

router.put("/:pid", async (req, res) => {
    try {
        const {pid} = req.params

    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      } = req.body;

      const newProduct = {title, description, code, price, status, stock, category, thumbnails}

      const response = await updateProduct(pid, newProduct)
      res.json({message: "success. Producto actualizado", data: response})
    }
    catch (err){
      console.log(err)
        res.json({message: "No se pudo actualizar el producto", error: err})
    }
})

router.delete("/:pid", async (req, res) => {
    const {pid} = req.params

    const response = await deleteProduct(pid)
    res.json({message: "success. El producto se ha elimiado", data: response})
})

export default router;