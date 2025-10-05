const { Product } = require("../models/product");
const {
  productValidation,
  updateProductValidation,
} = require("../validations/productsValidations");

async function createProduct(req, res) {
  try {
    const thumbnail = req.files.thumbnail[0].filename;
    const images = req.files.images.map((item) => item.filename);

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

    res.json({ message: "Product created", product_details: finProduct });
  } catch (error) {
    res.status(500).json({ message: "Please fill all required fields!" });
  }
}

async function getAllProducts(req, res) {
  const products = await Product.find();

  res.status(200).json({ message: "all products", data: products });
}

async function getSingleProduct(req, res) {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(400).json({ message: "product not found" });
    }

    res.status(200).json({ message: "product found", data: product });
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

    res.status(200).json({ message: "product deleted" });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const { error, value } = updateProductValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const product = await Product.findByIdAndUpdate(id, value)

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
  getSingleProduct,
  deleteProduct,
  updateProduct,
};
