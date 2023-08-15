import productsModel from "../models/products.models.js";

const getProducts = async () => {
    const response = await productsModel.find()
    return response
}

const getProductsById = async (id) => {
    const response = await productsModel.findById(id)
    return response
}

const addProduct = async (product) => {
    await productsModel.create(product)
    return product
}

const updateProduct = async (id, product) => {
    await productsModel.findByIdAndUpdate(id, product)
    return product
}

const deleteProduct = async (id) => {
    const response = await productsModel.findByIdAndDelete(id)
    return response
}


export {getProducts, getProductsById, addProduct, updateProduct, deleteProduct}