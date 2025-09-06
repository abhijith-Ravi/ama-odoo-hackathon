const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/products', (req, res) => {
  res.json({ listings: [] });
});

router.post('/products', auth, async (req, res) => {
  const { title, description, category, price, images, location, condition } = req.body;
  const ownerId = req.user.email; // or req.user.id

  // TODO: Save the listing to your database

  res.status(201).json({
    message: 'Listing created',
    listing: {
      title,
      description,
      category,
      price,
      images,
      location,
      condition,
      ownerId
    }
  });
});

router.get('/products/:id', (req, res) => {
  res.json({ listing: { id: req.params.id } });
});

router.patch('/products/:id', auth, async (req, res) => {
  const productId = req.params.id;

  async function getProductById(id) {
    // TODO: Replace with actual DB call
    return { };
  }

  async function updateProductById(id, updates) {
    // TODO: Replace with actual DB update logic
    return { ...updates, id };
  }

  const product = await getProductById(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  if (product.ownerId !== req.user.email) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  // Only allow certain fields to be updated
  const allowedFields = ['title', 'description', 'category', 'price', 'images', 'location', 'condition'];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }
  updates.ownerId = product.ownerId; // Prevent changing owner

  // Now update the database with only allowed fields
  const updatedProduct = await updateProductById(productId, { ...product, ...updates });

  res.json({ message: 'Listing updated', product: updatedProduct });
});

router.delete('/products/:id', auth, async (req, res) => {
  const productId = req.params.id;

  async function getProductById(id) {
    // TODO: Replace with actual DB call
    return {};
  }

  async function deleteProductById(id) {
    // TODO: Replace with actual DB delete logic
    return true; // Return true if deleted, false if not found
  }

  const product = await getProductById(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  if (product.ownerId !== req.user.email) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const deleted = await deleteProductById(productId);
  if (!deleted) {
    return res.status(500).json({ error: 'Failed to delete listing' });
  }

  res.json({ message: 'Listing deleted' });
});

module.exports = router;