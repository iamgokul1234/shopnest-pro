import Product from "../models/Product.js";

// ─── @route   GET /api/products ───────────────────────────────────
// @desc    Get all products with optional search and category filter
// @access  Public
export const getProducts = async (req, res) => {
  const { search, category, page = 1, limit = 20 } = req.query;

  // Build filter object dynamically
  const filter = {};

  // If search query provided, use regex for case-insensitive search
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  // If category provided, filter by category
  if (category) {
    filter.category = category.toLowerCase();
  }

  // Calculate how many documents to skip for pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get total count for pagination info
  const total = await Product.countDocuments(filter);

  // Fetch products with filter, pagination
  const products = await Product.find(filter)
    .sort({ createdAt: -1 }) // newest first
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    products,
  });
};

// ─── @route   GET /api/products/:id ──────────────────────────────
// @desc    Get single product by ID
// @access  Public
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    product,
  });
};

// ─── @route   POST /api/products ─────────────────────────────────
// @desc    Create a new product
// @access  Admin only
export const createProduct = async (req, res) => {
  const { title, description, price, thumbnail, category, stock, rating } =
    req.body;

  // Validate required fields
  if (!title || !description || !price || !thumbnail || !category) {
    res.status(400);
    throw new Error(
      "Please provide title, description, price, thumbnail and category",
    );
  }

  const product = await Product.create({
    title,
    description,
    price,
    thumbnail,
    category,
    stock: stock || 0,
    rating: rating || 0,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
};

// ─── @route   PUT /api/products/:id ──────────────────────────────
// @desc    Update an existing product
// @access  Admin only
export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // findByIdAndUpdate returns the updated document
  // new: true means return updated version not original
  // runValidators: true means run schema validation on update
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
  });
};

// ─── @route   DELETE /api/products/:id ───────────────────────────
// @desc    Delete a product
// @access  Admin only
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};
