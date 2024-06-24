const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const verifyToken = require("../middlewares/auth");

router.post("/", verifyToken, productController.addProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", verifyToken, productController.updateProduct);
router.delete("/:id", verifyToken, productController.deleteProduct);

module.exports = router;
