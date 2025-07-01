// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Custom error classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

// Request logging middleware (placed before routes)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// 🔐 Authentication Middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== 'mysecretapikey') {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }
  next();
};

// ✅ Validation Middleware
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || typeof price !== 'number' || !category || typeof inStock !== 'boolean') {
    return res.status(400).json({ error: 'Validation Error: Missing or invalid fields' });
  }
  next();
};

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// GET /api/products - Get all products with filtering and pagination
app.get('/api/products', (req, res) => {
  try {
    let filteredProducts = [...products];
    
    // Filter by category
    if (req.query.category) {
      filteredProducts = filteredProducts.filter(p => p.category === req.query.category);
    }
    
    // Filter by inStock
    if (req.query.inStock !== undefined) {
      const inStock = req.query.inStock === 'true';
      filteredProducts = filteredProducts.filter(p => p.inStock === inStock);
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    res.json({
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredProducts.length / limit),
        totalItems: filteredProducts.length,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/search - Search products by name
app.get('/api/products/search', (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      throw new ValidationError('Search query parameter "q" is required');
    }
    
    const searchResults = products.filter(product => 
      product.name.toLowerCase().includes(q.toLowerCase()) ||
      product.description.toLowerCase().includes(q.toLowerCase())
    );
    
    res.json({ products: searchResults, query: q });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/stats - Get product statistics
app.get('/api/products/stats', (req, res, next) => {
  try {
    const stats = {
      totalProducts: products.length,
      inStock: products.filter(p => p.inStock).length,
      outOfStock: products.filter(p => !p.inStock).length,
      categories: {},
      averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length
    };
    
    // Count by category
    products.forEach(product => {
      stats.categories[product.category] = (stats.categories[product.category] || 0) + 1;
    });
    
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create a new product (with authentication and validation)
app.post('/api/products', authenticate, validateProduct, (req, res, next) => {
  try {
    const newProduct = {
      id: uuidv4(),
      ...req.body
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id - Update a product (with authentication and validation)
app.put('/api/products/:id', authenticate, validateProduct, (req, res, next) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      throw new NotFoundError('Product not found');
    }
    
    products[productIndex] = { ...products[productIndex], ...req.body };
    res.json(products[productIndex]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Delete a product (with authentication)
app.delete('/api/products/:id', authenticate, (req, res, next) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      throw new NotFoundError('Product not found');
    }
    
    const deletedProduct = products.splice(productIndex, 1)[0];
    res.json({ message: 'Product deleted successfully', deletedProduct });
  } catch (error) {
    next(error);
  }
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error(`Error: ${error.message}`);
  
  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  }
  
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.message });
  }
  
  // Handle other types of errors
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 