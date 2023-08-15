import cartsModels from "../models/carts.models.js";

const addCart = async () => {
  const newCart = {
    products: [],
  };

  const cartAdded = await cartsModels.create(newCart);
  return cartAdded;
};

const getCart = async () => {
  const response = await cartsModels.find();
  return response;
};

const getCartById = async (id) => {
  const response = await cartsModels.findById(id);
  return response;
};

const addProductToCart = async (cid, pid) => {

  const cart = await cartsModels.findById(cid);

  const productIndex = cart.products.findIndex(
    (product) => product.product === pid
  );

  if (productIndex === -1) {
    const newProduct = {
      product: pid,
      quantity: 1,
    };

    cart.products.push(newProduct)
    const response = await cartsModels.findByIdAndUpdate(cid, {products: cart.products})
    return response;
  } else {

    let newQuantity = cart.products[productIndex].quantity
    newQuantity++;

    cart.products[productIndex].quantity = newQuantity;
    await cartsModels.findByIdAndUpdate(cid, {products: cart.products})
    const response = await cartsModels.findById(cid)
    return response;
  }
};

const updateCart = async (cid, cart) => {
  const response = cartsModels.findByIdAndUpdate(cid, cart);
  return response;
};

export { addCart, getCart, getCartById, addProductToCart, updateCart };