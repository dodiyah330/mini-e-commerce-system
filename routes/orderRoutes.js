const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const orderController = require("../controllers/orderController");

router.post("/", verifyToken, orderController.createOrder);
router.get("/", verifyToken, orderController.getUserOrders);

module.exports = router;
