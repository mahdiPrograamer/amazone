import express from "express";
import Product from "../models/productModel.js";
import data from "../data.js";
import User from "../models/userModel.js";

const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  await Product.removeAllListeners({});
  const createdProducts = await Product.insertMany(data.products);

  res.send({ createdProducts });
});
export default seedRouter;