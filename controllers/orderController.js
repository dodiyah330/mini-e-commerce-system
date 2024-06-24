const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  const userId = req.user._id;
  const { products } = req.body;

  let totalPrice = 0;
  const orderProducts = [];

  try {
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${productId} not found` });
      }

      if (product.quantity < quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for product ${product.name}` });
      }

      totalPrice += product.price * quantity;
      orderProducts.push({ productId, quantity });

      product.quantity -= quantity;
      await product.save();
    }

    const order = new Order({
      userId,
      products: orderProducts,
      totalPrice,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate(
      "products.productId",
      "name price"
    );
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
