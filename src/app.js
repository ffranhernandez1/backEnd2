import express from "express";
import * as dotenv from "dotenv";
import __dirname from "./utils.js";
import { engine } from "express-handlebars";
import exphbs from "express-handlebars";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import realTimeProductsRouter from "./routes/realTimeProducts.routes.js";
import messagesRouter from "./routes/messages.routes.js";

import { Server } from "socket.io"; 

import { addProduct, deleteProduct } from "./dao/dbManagers/productManager.js";
import { addMessages, getMessages } from "./dao/dbManagers/messageManager.js";

import mongoose from "mongoose";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://coderhouse:123@cluster0.empwwtw.mongodb.net/ecommerce";

let dbConnect = mongoose.connect(MONGO_URI);
dbConnect.then(() => {
  console.log("conexion a la base de datos exitosa");
}),
  (error) => {
    console.log("Error en la conexion a la base de datos", error);
  };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const hbs = exphbs.create();

hbs.handlebars.registerHelper("prop", function (obj, key) {
  return obj[key];
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
app.use("/realtimeproducts", realTimeProductsRouter);
app.use("/messages", messagesRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente se ha conectado");

  socket.on("message", (data) => {
    console.log(data);
  });

  socket.emit("render", "Me estoy comunicando desde el servidor");

  socket.on("addProduct", (product) => {
    addProduct(product);
  });

  socket.on("delete-product", (productId) => {
    const { id } = productId;
    deleteProduct(id);
  });

  socket.on("user-message", (obj) => {
    addMessages(obj);
    socketServer.emit("new-message", obj)
  });
});