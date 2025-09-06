const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // saves files in /uploads


router.get('/products', async (req, res) => {
  try {
    const listings = await prisma.product.findMany({
      include: {
        user: {
          select: { id: true, username: true, email: true } // include owner info if needed
        }
      }
    });
    res.json({ listings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});
router.get('/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },  // use the :id from the route
      include: {
        user: {
          select: { id: true, username: true, email: true } // include owner info if needed
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});


router.post('/products', auth, upload.single('image'), async (req, res) => {
  const { title, description, category, price } = req.body;
  const ownerId = req.user.id;

  const imagePath = req.file ? `/uploads/${req.file.filename}` : 'https://via.placeholder.com/150';

  const product = await prisma.product.create({
    data: {
      title,
      description,
      price: parseFloat(price),
      category,
      image: imagePath,
      userId:ownerId,
      
    }
  });

  res.status(201).json({ message: 'Listing created', listing: product });
});


router.patch('/products/:id', auth, async (req, res) => {
  const productId =req.params.id; // or keep string if id is String in schema

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Make sure the logged-in user is the owner
    if (product.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Allow only specific fields to be updated
    const allowedFields = ['title', 'description', 'category', 'price', 'image', 'location', 'condition'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Update only allowed fields
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updates,
    });

    res.json({ message: 'Listing updated', product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/products/:id', auth, async (req, res) => {
  const productId = req.params.id;

  try {
    // 1. Find the product
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // 2. Check ownership (make sure you're comparing the right field!)
    if (product.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // 3. Delete it
    await prisma.product.delete({
      where: { id: productId }
    });

    res.json({ message: 'Listing deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});


module.exports = router;