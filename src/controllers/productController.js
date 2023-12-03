const productModel = require("../models/productModel");
const validators = require("../validators/validator");
const mongoose = require("mongoose");
const categoryModel = require("../models/categoryModel");

//*********************************************** CREATE PRODUCT ************************************ */

const createProduct = async function (req, res) {
  try {
    let data = req.body;
    if (!validators.isValidBody(data))
      return res
        .status(400)
        .send({
          status: false,
          message: "Please Provide input in request body",
        });

    let {
      title,
      description,
      price,
      currencyId,
      currencyFormat,
      isFreeShipping,
      style,
      availableSizes,
      installments,
      categoryId,
    } = data;

    //TITLE
    if (!title)
      return res
        .status(400)
        .send({ status: false, message: "Title is required" });
    if (!validators.isValid(title))
      return res
        .status(400)
        .send({ status: false, message: "Title is not valid string" });
    if (!validators.IsValidStr(title))
      return res
        .status(400)
        .send({ status: false, message: "Title is only alphabetical" });
    let productTitle = await productModel.findOne({ title });
    if (productTitle)
      return res
        .status(409)
        .send({ status: false, message: "Product title is already exists" });

    //DESCRIPTION
    if (!description)
      return res
        .status(400)
        .send({ status: false, message: "Description is required" });
    if (!validators.isValid(description))
      return res
        .status(400)
        .send({ status: false, message: "description is not valid string" });
    if (!validators.IsValidStr(description))
      return res
        .status(400)
        .send({ status: false, message: "Description is only alphabetical" });

    // CATEGORYId

    if (!categoryId)
      return res
        .status(400)
        .send({
          status: false,
          message: "categoryId must be present in request body",
        });
    if (!mongoose.isValidObjectId(categoryId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid categoryId" });
    }
    const searchCategory = await categoryModel.findOne({ _id: categoryId });
    if (!searchCategory) {
      return res
        .status(404)
        .send({ status: false, message: `category doesn't exists` });
    }

    //PRICE
    if (!price)
      return res
        .status(400)
        .send({ status: false, message: "Price is required" });
    if (price == "" || price <= 0)
      return res
        .status(400)
        .send({
          status: false,
          message: "Please provide some number in price",
        });
    if (price.includes(" ")) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Please remove any empty spaces from price",
        });
    }
    if (!validators.isValidPrice(price))
      return res
        .status(400)
        .send({
          status: false,
          message: "Please Provide Valid price(price should be Number/Decimal)",
        });

    //CURRENCY id
    if (!currencyId)
      return res
        .status(400)
        .send({ status: false, message: "currencyId is required" });
    if (!validators.isValid(currencyId))
      return res
        .status(400)
        .send({
          status: false,
          message: "currencyId is not valid and It should be INR",
        });
    if (!/INR/.test(currencyId))
      return res
        .status(400)
        .send({
          status: false,
          message: "Currency Id of product should be in uppercase 'INR' format",
        });

    // Currerce format
    if (!currencyFormat)
      return res
        .status(400)
        .send({ status: false, message: "currencyFormat must be present" });
    if (!validators.isValid(currencyFormat))
      return res
        .status(400)
        .send({
          status: false,
          message: "Please provide Currency format in String",
        });
    if (!/₹/.test(currencyFormat))
      return res
        .status(400)
        .send({
          status: false,
          message: "Currency format/symbol of product should be in '₹' ",
        });

    //  isFreeShipping
    if (isFreeShipping) {
      if (isFreeShipping == "")
        return res
          .status(400)
          .send({
            status: false,
            message: "please provide some data in isFreeShipping",
          });
      isFreeShipping = isFreeShipping.toLowerCase();
      if (isFreeShipping == "true" || isFreeShipping == "false") {
        isFreeShipping = JSON.parse(isFreeShipping); //convert from string to boolean
      } else {
        return res
          .status(400)
          .send({
            status: false,
            message: "Enter a valid value for isFreeShipping",
          });
      }
      if (typeof isFreeShipping != "boolean")
        return res
          .status(400)
          .send({
            status: false,
            message: "isFreeShipping must be a boolean value",
          });
    }

    //STYLE
    if (style) {
      if (!validators.isValid(style))
        return res
          .status(400)
          .send({ status: false, message: "style is required" });
      if (!validators.IsValidStr(style))
        return res
          .status(400)
          .send({ status: false, message: "Style is only alphabetical" });
    }
    //INSTALLMENTS

    if (installments) {
      if (installments == "")
        return res
          .status(400)
          .send({
            status: false,
            message: "please provide some data in installments",
          });
      if (!validators.isValidNum(installments))
        return res
          .status(400)
          .send({ status: false, message: "installments not valid " });
    }

    //AVAILABLESIZES

    if (!availableSizes)
      return res
        .status(400)
        .send({ status: false, message: "AvailableSize is required" });

    if (!validators.isValid(availableSizes))
      return res
        .status(400)
        .send({
          status: false,
          message: "Please provide availableSizes in string format",
        });
    if (
      availableSizes
        .toUpperCase()
        .trim()
        .split(",")
        .map((value) => validators.isValidEnum(value))
        .filter((item) => item === false).length !== 0
    ) {
      return res
        .status(400)
        .send({ status: false, message: "Enum should be valid" });
    }

    const Size = availableSizes
      .toUpperCase()
      .trim()
      .split(",")
      .map((value) => value.trim()); //converting in array

    let value = {
      title,
      description,
      price,
      currencyId,
      currencyFormat,
      isFreeShipping,
      style,
      availableSizes: Size,
      installments,
      categoryId,
    };

    let savedProductData = await productModel.create(value);
    return res
      .status(201)
      .send({
        status: true,
        message: "Product created successfully",
        data: savedProductData,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//**********************************************GET PRODUCT BY QUERY PARAMS ***************************************** */

const getProductByQuery = async function (req, res) {
  try {
    let data = req.query;

    let { size, name, priceGreaterThan, priceLessThan, priceSort, categoryId } =
      data;

    /// size validation //
    let obj1 = {};

    if (size) {
      if (!validators.isValid(size)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide availableSize" });
      } else {
        let sizes = data.size.split(",").map((x) => x.trim());
        obj1.availableSizes = { $all: sizes };
      }
    }

    // name validation//

    if (name) {
      if (!validators.isValid(name))
        return res
          .status(400)
          .send({ status: false, message: "Please enter correct name" });
      else obj1.title = { $regex: name, $options: "i" };
    }

    //price validation //
    if (priceGreaterThan) {
      let greater = parseInt(priceGreaterThan);
      if (typeof greater !== "number")
        return res
          .status(400)
          .send({ status: false, message: "Please enter price in number" });
      else obj1.price = { $gt: `${greater}` };
    }

    if (priceLessThan) {
      let lesser = parseInt(priceLessThan);
      if (typeof lesser !== "number")
        return res
          .status(400)
          .send({ status: false, message: "Please enter price in number" });
      else obj1.price = { $lt: `${lesser}` };
    }

    if (priceGreaterThan && priceLessThan) {
      let greater = parseInt(priceGreaterThan);
      let lesser = parseInt(priceLessThan);
      obj1.price = { $gt: `${greater}`, $lt: `${lesser}` };
    }

    obj1.isDeleted = false;

    if (validators.isValid(priceSort)) {
      if (!(priceSort == 1 || priceSort == -1))
        return res
          .status(400)
          .send({ status: false, message: "priceSort Should be 1 or -1" });

      let result = await productModel.find(obj1).sort({ price: priceSort });

      if (Array.isArray(result) && result.length === 0) {
        return res
          .status(404)
          .send({ status: false, message: "No Product found" });
      }

      return res
        .status(200)
        .send({ status: true, message: "Product List", data: result });
    }

    if (categoryId) {
      if (!mongoose.isValidObjectId(categoryId)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid categoryId" });
      }
      const searchCategory = await categoryModel.findOne({ _id: categoryId });
      if (!searchCategory) {
        return res
          .status(404)
          .send({ status: false, message: `category doesn't exists` });
      }
      obj1.categoryId = categoryId
    }

    let result = await productModel.find(obj1);

    if (Array.isArray(result) && result.length === 0) {
      return res
        .status(404)
        .send({ status: false, message: "No Product found" });
    }

    res
      .status(200)
      .send({
        status: true,
        message: "Product found Successfully",
        data: result,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//*******************************************  GET PRODUCT BY ID********************************************* */

const getProductByParams = async function (req, res) {
  try {
    const productId = req.params.productId;
    if (!productId)
      return res
        .status(400)
        .send({ status: false, message: "ProductId must be present" });
    if (!mongoose.isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid productId" });
    }

    const data = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!data) {
      return res
        .status(404)
        .send({ status: false, message: "Product not found" });
    }

    res
      .status(200)
      .send({
        status: true,
        message: "Product Found successfully",
        data: data,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};

//_+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//***************************************  UPDATE PRODUCT ************************************************************ */

const updateProduct = async function (req, res) {
  try {
    let data = req.body;
    let productId = req.params.productId;

    if (!(Object.keys(data).length))
      return res
        .status(400)
        .send({
          status: false,
          message: "Please provide some data for update",
        });

    if (!productId)
      return res
        .status(400)
        .send({ status: false, message: "Please provide productId in params" });

    if (!mongoose.isValidObjectId(productId))
      return res
        .status(400)
        .send({ status: false, message: "productId is not valid" });

    const findProduct = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!findProduct)
      return res
        .status(404)
        .send({ status: false, message: "productId does not exists" });

    let {
      title,
      description,
      price,
      currencyId,
      currencyFormat,
      isFreeShipping,
      style,
      availableSizes,
      installments,
      categoryId
    } = data;

    let update = {};

    //TITLE
    if (title) {
      if (!validators.isValid(title))
        return res
          .status(400)
          .send({ status: false, message: "Title is not valid string" });
      if (!validators.IsValidStr(title))
        return res
          .status(400)
          .send({ status: false, message: "Title is only alphabetical" });
      let productTitle = await productModel.findOne({ title });
      if (productTitle)
        return res
          .status(409)
          .send({ status: false, message: "Product title is already exists" });
      update.title = title;
    }

    // categoryId

    if (categoryId) {
        if (!mongoose.isValidObjectId(categoryId)) {
          return res
            .status(400)
            .send({ status: false, message: "Invalid categoryId" });
        }
        const searchCategory = await categoryModel.findOne({ _id: categoryId });
        if (!searchCategory) {
          return res
            .status(404)
            .send({ status: false, message: `category doesn't exists` });
        }
        update.categoryId = categoryId
      }

    //DESCRIPTION
    if (description) {
      if (!validators.isValid(description))
        return res
          .status(400)
          .send({ status: false, message: "description is not valid string" });
      if (!validators.IsValidStr(description))
        return res
          .status(400)
          .send({ status: false, message: "Description is only alphabetical" });
      update.description = description;
    }
    //PRICE
    if (price) {
      if (price == "" || price <= 0)
        return res
          .status(400)
          .send({
            status: false,
            message: "Please provide some number in price",
          });
      if (price.includes(" ")) {
        return res
          .status(400)
          .send({
            status: false,
            message: "Please remove any empty spaces from price",
          });
      }
      if (!validators.isValidPrice(price))
        return res
          .status(400)
          .send({
            status: false,
            message:
              "Please Provide Valid price(price should be Number/Decimal)",
          });
      update.price = price;
    }
    //CURRENCY id

    if (currencyId) {
      if (!validators.isValid(currencyId))
        return res
          .status(400)
          .send({
            status: false,
            message: "currencyId is not valid and It should be INR",
          });
      if (!/INR/.test(currencyId))
        return res
          .status(400)
          .send({
            status: false,
            message:
              "Currency Id of product should be in uppercase 'INR' format",
          });

      update.currencyId = currencyId;
    }

    // Currerce format
    if (currencyFormat) {
      if (!validators.isValid(currencyFormat))
        return res
          .status(400)
          .send({
            status: false,
            message: "Please provide Currency format in String",
          });
      if (!/₹/.test(currencyFormat))
        return res
          .status(400)
          .send({
            status: false,
            message: "Currency format/symbol of product should be in '₹' ",
          });

      update.currencyFormat = currencyFormat;
    }

    //  isFreeShipping
    if (isFreeShipping) {
      if (isFreeShipping == "")
        return res
          .status(400)
          .send({
            status: false,
            message: "please provide some data in isFreeShipping",
          });
      isFreeShipping = isFreeShipping.toLowerCase();
      if (isFreeShipping == "true" || isFreeShipping == "false") {
        isFreeShipping = JSON.parse(isFreeShipping); //convert from string to boolean
      } else {
        return res
          .status(400)
          .send({
            status: false,
            message: "Enter a valid value for isFreeShipping",
          });
      }
      if (typeof isFreeShipping != "boolean")
        return res
          .status(400)
          .send({
            status: false,
            message: "isFreeShipping must be a boolean value",
          });
      update.isFreeShipping = isFreeShipping;
    }

    //STYLE
    if (style) {
      if (!validators.isValid(style))
        return res
          .status(400)
          .send({ status: false, message: "style is required" });
      if (!validators.IsValidStr(style))
        return res
          .status(400)
          .send({ status: false, message: "Style is only alphabetical" });
      update.style = style;
    }
    //INSTALLMENTS

    if (installments) {
      if (!validators.isValidNum(installments))
        return res
          .status(400)
          .send({ status: false, message: "installments not valid " });
      if (installments == "")
        return res
          .status(400)
          .send({
            status: false,
            message: "please provide some data in installments",
          });
      update.installments = installments;
    }

    //AVAILABLESIZES
    if (availableSizes) {
      if (!validators.isValid(availableSizes))
        return res
          .status(400)
          .send({ status: false, message: "Please provide availableSize" });
      if (
        availableSizes
          .toUpperCase()
          .trim()
          .split(",")
          .map((value) => validators.isValidEnum(value))
          .filter((item) => item === false).length !== 0
      )
        return res
          .status(400)
          .send({ status: false, message: "Enum should be valid" });

      const availableSize = availableSizes
        .toUpperCase()
        .trim()
        .split(",")
        .map((value) => value.trim()); //converting in array
      availableSizes = availableSize;
    }

    const updatedProduct = await productModel.findOneAndUpdate(
      { _id: productId },
      { $set: { ...update }, $addToSet: { availableSizes } },
      { new: true }
    );
    return res
      .status(200)
      .send({
        status: true,
        message: "Product updated Successfully",
        data: updatedProduct,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//***************************************** DELETE PRODUCT ********************************************************* */

const deleteProduct = async function (req, res) {
  try {
    let productId = req.params.productId;
    if (!productId)
      return res
        .status(400)
        .send({ status: false, message: " ProductId must be present." });
    if (!mongoose.isValidObjectId(productId))
      return res
        .status(400)
        .send({ status: false, message: " ProductId is invalid." });

    let data = await productModel.findOne({ _id: productId });
    if (!data)
      return res
        .status(404)
        .send({ status: false, message: "No such product found" });

    if (data.isDeleted === true)
      return res
        .status(404)
        .send({ status: false, message: "Product data already deleted" });

    await productModel.findOneAndUpdate(
      { _id: productId },
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "successfully deleted product" });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", Error: err.message });
  }
};

module.exports = {
  createProduct,
  getProductByQuery,
  getProductByParams,
  updateProduct,
  deleteProduct,
};
