const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    quantity: req.body.quantity,
  });
  try {
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.imageUrl = req.body.imageUrl || product.imageUrl;
    product.price = req.body.price || product.price;
    product.quantity = req.body.quantity || product.quantity;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.deleteOne({
      _id: req.params.id,
    });
    if (product.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
