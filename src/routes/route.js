const express = require("express");
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");
const middleWare = require("../middleware/auth");
const {
  createCategory,
  getAllCategoryList,
  getCategoryByParams,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const router = express.Router();

/**********************************************[USER API]************************************************/
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get(
  "/user/:userId/profile",
  middleWare.authenticate,
  middleWare.authorize,
  userController.getProfile
);
router.put(
  "/user/:userId/profile",
  middleWare.authenticate,
  middleWare.authorize,
  userController.updateUser
);

/**********************************************[PRODUCT API]************************************************/
router.post(
  "/products",
  middleWare.authenticate,
  middleWare.authorize,
  productController.createProduct
);

router.get(
  "/products",
  middleWare.authenticate,
  middleWare.authorize,
  productController.getProductByQuery
);

router.get(
  "/products/:productId",
  middleWare.authenticate,
  middleWare.authorize,
  productController.getProductByParams
);

router.put(
  "/products/:productId",
  middleWare.authenticate,
  middleWare.authorize,
  productController.updateProduct
);

router.delete(
  "/products/:productId",
  middleWare.authenticate,
  middleWare.authorize,
  productController.deleteProduct
);

/**********************************************[Category API]************************************************/
router.post(
  "/category/create",
  middleWare.authenticate,
  middleWare.authorize,
  createCategory
);

router.get(
  "/category/fetAll",
  middleWare.authenticate,
  middleWare.authorize,
  getAllCategoryList
);

router.get(
  "/category/:categoryId",
  middleWare.authenticate,
  middleWare.authorize,
  getCategoryByParams
);

router.put(
  "/category/:categoryId",
  middleWare.authenticate,
  middleWare.authorize,
  updateCategory
);

router.delete(
  "/category/:categoryId",
  middleWare.authenticate,
  middleWare.authorize,
  deleteCategory
);

/*****************************[CART API ]*********************************************************************/

router.post(
  "/users/:userId/cart",
  middleWare.authenticate,
  middleWare.authorize,
  cartController.AddToCart
);

router.put(
  "/users/:userId/cart",
  middleWare.authenticate,
  middleWare.authorize,
  cartController.updateCart
);

router.get(
  "/users/:userId/cart",
  middleWare.authenticate,
  middleWare.authorize,
  cartController.getCart
);

router.delete(
  "/users/:userId/cart",
  middleWare.authenticate,
  middleWare.authorize,
  cartController.deleteCart
);

/**********************************[ORDER API]*****************************************************************************/

router.post(
  "/users/:userId/orders",
  middleWare.authenticate,
  middleWare.authorize,
  orderController.createOrder
);

router.put(
  "/users/:userId/orders",
  middleWare.authenticate,
  middleWare.authorize,
  orderController.updateOrder
);

module.exports = router;
