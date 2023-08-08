import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRouter from "./routes/productRoute.js";
import seedRouter from "./routes/seedRoute.js";
import userRouter from "./routes/userRoute.js";
import orderRouter from "./routes/orderRoute.js";
import uploadRouter from "./routes/upload.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/keys/google", (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || "" });
});

app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "/frontend/build")));
// app.get("*", (req, res) =>
//   res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
// );

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
