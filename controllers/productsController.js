const { Product } = require("../models/product");
const { Review } = require("../models/review");
const {
  productValidation,
  updateProductValidation,
} = require("../validations/productsValidations");
const mongoose = require("mongoose");

async function createProduct(req, res) {
  try {
    const thumbnail = req.files.thumbnail[0].path;
    const images = req.files.images.map((item) => item.path);

    const { error, value } = productValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const owner = {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
    };

    const product = { ...value, thumbnail, images, owner };

    const finProduct = await Product.create(product);

    res
      .status(201)
      .json({ message: "Product created", product_details: finProduct });
  } catch (error) {
    res.status(500).json({ message: "Please fill all required fields!" });
  }
}

async function getAllProducts(req, res) {
  const { page = 1, limit = 10, minPrice, maxPrice } = req.query;

  const query = {};

  if (minPrice || maxPrice) {
    query.price = {};

    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }

  const skip = (page - 1) * limit;
  const products = await Product.find(query).skip(skip).limit(limit);
  const total = await Product.countDocuments();

  res
    .status(200)
    .json({ message: "all products", data: { skip, limit, total, products } });
}

async function searchBar(req, res) {
  try {
    const { search, page = 1, limit = 100 } = req.query;

    if (!search) {
      return res
        .status(400)
        .json({ message: "please enter something to search" });
    }

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
      if (mongoose.Types.ObjectId.isValid(search)) {
        query.$or.push({ _id: search });
      }
    }

    const skip = (page - 1) * limit;
    const total = await Product.find(query).countDocuments();

    const products = await Product.find(query).skip(skip).limit(limit);

    res.status(200).json({
      message: "search results",
      data: { skip, limit, total, products },
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}

async function getProductsByCategory(req, res) {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const total = await Product.find({ category: category }).countDocuments();

    const products = await Product.find({ category: category })
      .skip(skip)
      .limit(limit);
    if (products.length == 0) {
      return res.status(404).json({ message: "category not found" });
    }

    res.status(200).json({
      message: `${category} products`,
      data: { skip, limit, total, products },
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}

async function getSingleProductWithReviews(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({ message: "product not found" });
    }

    const reviews = await Review.find(
      { prod_id: id },
      "reviewer comment rating createdAt"
    );

    res.status(200).json({ message: "product found", data: product, reviews });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(400).json({ message: "product not found" });
    }

    const reviews = await Review.deleteMany({ prod_id: id });

    res.status(200).json({ message: "product deleted" });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const { error, value } = updateProductValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const product = await Product.findByIdAndUpdate(id, value);

    if (!product) {
      return res.status(400).json({ message: "product not found" });
    }

    console.log(product);
    res.status(200).json({ message: "product updated" });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProductWithReviews,
  deleteProduct,
  updateProduct,
  searchBar,
  getProductsByCategory,
};
