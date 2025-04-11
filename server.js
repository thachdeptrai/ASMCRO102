const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB URI
mongoose.connect("mongodb://sv1.nrosaitama.click:27017/plantaApp");

// Schema + model
const productSchema = new mongoose.Schema({
  id: String,
  image: String,
  name: String,
  price: String,
  onffo: String,
  status: String,
  size: String,
  origin: String,
});
const Tree = mongoose.model("Tree", productSchema, "product_tree");
const Pot = mongoose.model("Pot", productSchema, "product_pot");
const Tool = mongoose.model("Tool", productSchema, "product_tools");

// Routes
app.get("/product_trees", async (req, res) => {
  const trees = await Tree.find();
  res.json(trees);
});

app.get("/product_pots", async (req, res) => {
  const pots = await Pot.find();
  res.json(pots);
});

app.get("/product_tools", async (req, res) => {
  const tools = await Tool.find();
  res.json(tools);
});
const svername = "sv1.nrosaitama.click";
app.listen(3000, svername,() => console.log("Server chạy tại http://" + svername + ":3000"));
