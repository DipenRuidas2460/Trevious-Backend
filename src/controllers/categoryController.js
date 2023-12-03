const validators = require("../validators/validator");
const mongoose = require("mongoose");
const categoryModel = require("../models/categoryModel");

//*********************************************** CREATE Category ************************************ */

const createCategory = async function (req, res) {
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
      categoryName,
      categoryDescription,
      categoryType
    } = data;

    // Category Name
    if (!categoryName)
      return res
        .status(400)
        .send({ status: false, message: "categoryName is required" });
    if (!validators.isValid(categoryName))
      return res
        .status(400)
        .send({ status: false, message: "categoryName is not valid string" });
    if (!validators.IsValidStr(categoryName))
      return res
        .status(400)
        .send({ status: false, message: "categoryName is only alphabetical" });
    let categoryNameList = await categoryModel.findOne({ categoryName });
    if (categoryNameList)
      return res
        .status(409)
        .send({ status: false, message: "Category Na,e is already exists" });

    //Category DESCRIPTION
    if (!categoryDescription)
      return res
        .status(400)
        .send({ status: false, message: "Category description is required" });
    if (!validators.isValid(categoryDescription))
      return res
        .status(400)
        .send({ status: false, message: "Category description is not valid string" });
    if (!validators.IsValidStr(categoryDescription))
      return res
        .status(400)
        .send({ status: false, message: "Category description is only alphabetical" });

    //Category Type
    if (!categoryType)
      return res
        .status(400)
        .send({ status: false, message: "Category type is required" });
    if (!validators.isValid(categoryType))
      return res
        .status(400)
        .send({ status: false, message: "Category type is not valid string" });
    if (!validators.IsValidStr(categoryType))
      return res
        .status(400)
        .send({ status: false, message: "Category type is only alphabetical" });

    let value = {
      categoryName,
      categoryDescription,
      categoryType
    };

    let savedCategoryData = await categoryModel.create(value);
    return res
      .status(201)
      .send({
        status: true,
        message: "Category created successfully",
        data: savedCategoryData,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//*******************************************  GET Category BY ID********************************************* */

const getCategoryByParams = async function (req, res) {
  try {
    const categoryId = req.params.categoryId;
    if (!categoryId)
      return res
        .status(400)
        .send({ status: false, message: "categoryId must be present" });
    if (!mongoose.isValidObjectId(categoryId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid categoryId" });
    }

    const data = await categoryModel.findOne({
      _id: categoryId,
      isDeleted: false,
    });
    if (!data) {
      return res
        .status(404)
        .send({ status: false, message: "Category not found" });
    }

    res
      .status(200)
      .send({
        status: true,
        message: "Category Found successfully",
        data: data,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};

// ---------------- Fetch All Category List------------------------------------------------------------------------------------------------------------

const getAllCategoryList = async function (req, res) {
    try {
      const data = await categoryModel.find({
        isDeleted: false,
      });
      if (data.length === 0) {
        return res
          .status(404)
          .send({ status: false, message: "Category not found" });
      }
  
      res
        .status(200)
        .send({
          status: true,
          message: "All Category List Found successfully",
          data: data,
        });
    } catch (err) {
      return res
        .status(500)
        .send({ status: false, message: "Error", error: err.message });
    }
  };

//_+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//***************************************  UPDATE Category ************************************************************ */

const updateCategory = async function (req, res) {
  try {
    let data = req.body;
    let categoryId = req.params.categoryId;

    if (!(Object.keys(data).length))
      return res
        .status(400)
        .send({
          status: false,
          message: "Please provide some data for update",
        });

    if (!categoryId)
      return res
        .status(400)
        .send({ status: false, message: "Please provide categoryId in params" });

    if (!mongoose.isValidObjectId(categoryId))
      return res
        .status(400)
        .send({ status: false, message: "categoryId is not valid" });

    const findCategory = await categoryModel.findOne({
      _id: categoryId,
      isDeleted: false,
    });
    if (!findCategory)
      return res
        .status(404)
        .send({ status: false, message: "category does not exists" });

    let {
      categoryName,
      categoryDescription,
      categoryType
    } = data;

    let update = {};

    // Category Name
    if (categoryName) {
      if (!validators.isValid(categoryName))
        return res
          .status(400)
          .send({ status: false, message: "categoryName is not valid string" });
      if (!validators.IsValidStr(categoryName))
        return res
          .status(400)
          .send({ status: false, message: "categoryName is only alphabetical" });
      let categoryNameList = await categoryModel.findOne({ categoryName });
      if (categoryNameList)
        return res
          .status(409)
          .send({ status: false, message: "Category Na,e is already exists" });
      update.categoryName = categoryName;
    }

    // Category DESCRIPTION
    if (categoryDescription) {
        if (!validators.isValid(categoryDescription))
        return res
          .status(400)
          .send({ status: false, message: "Category description is not valid string" });
      if (!validators.IsValidStr(categoryDescription))
        return res
          .status(400)
          .send({ status: false, message: "Category description is only alphabetical" });
  
      update.categoryDescription = categoryDescription;
    }

    if(categoryType){
        if (!validators.isValid(categoryType))
      return res
        .status(400)
        .send({ status: false, message: "Category type is not valid string" });
    if (!validators.IsValidStr(categoryType))
      return res
        .status(400)
        .send({ status: false, message: "Category type is only alphabetical" });
       update.categoryType = categoryType
    }

    const updatedCategory = await categoryModel.findOneAndUpdate(
      { _id: categoryId },
      update,
      { new: true }
    );
    return res
      .status(200)
      .send({
        status: true,
        message: "Category updated Successfully",
        data: updatedCategory,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//***************************************** DELETE PRODUCT ********************************************************* */

const deleteCategory = async function (req, res) {
  try {
    let categoryId = req.params.categoryId;
    if (!categoryId)
      return res
        .status(400)
        .send({ status: false, message: "CategoryId must be present." });
    if (!mongoose.isValidObjectId(categoryId))
      return res
        .status(400)
        .send({ status: false, message: "CategoryId is invalid." });

    let data = await categoryModel.findOne({ _id: categoryId });
    if (!data)
      return res
        .status(404)
        .send({ status: false, message: "No such category found" });

    if (data.isDeleted === true)
      return res
        .status(404)
        .send({ status: false, message: "Category List already deleted" });

    await categoryModel.findOneAndUpdate(
      { _id: categoryId },
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "successfully deleted category list" });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", Error: err.message });
  }
};

module.exports = {
  createCategory,
  getAllCategoryList,
  getCategoryByParams,
  updateCategory,
  deleteCategory,
};
