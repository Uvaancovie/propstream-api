import express from 'express';
import { authRequired, realtorOnly } from '../middleware/auth.js';
import Property from '../models/Property.js';

const router = express.Router();

// Public route - Get all properties (no auth required)
router.get('/public', async (req, res) => {
  try {
    const props = await Property.findAll();
    
    // Convert PostgreSQL JSON fields back to arrays and remove sensitive info
    const properties = props.map(prop => ({
      _id: prop.id,   // Use prop.id from database
      id: prop.id,    // Use prop.id from database
      name: prop.name,
      address: prop.address,
      city: prop.city,
      description: prop.description,
      pricePerNight: prop.price_per_night,
      maxGuests: prop.max_guests,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      amenities: typeof prop.amenities === 'string' ? JSON.parse(prop.amenities) : prop.amenities,
      images: typeof prop.images === 'string' ? JSON.parse(prop.images) : prop.images,
      created_at: prop.created_at
    }));
    
    res.json({
      message: properties.length > 0 ? `✅ Found ${properties.length} public properties` : "📝 No properties available",
      count: properties.length,
      properties: properties
    });
  } catch (error) {
    res.status(500).json({ 
      message: "❌ Failed to fetch public properties", 
      error: error.message 
    });
  }
});

// Public route - Get single property by ID (no auth required)
router.get('/public/:id', async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Convert PostgreSQL JSON fields back to arrays and remove sensitive info
    const property = {
      _id: prop.id,   // Use prop.id from database
      id: prop.id,    // Use prop.id from database
      name: prop.name,
      address: prop.address,
      city: prop.city,
      description: prop.description,
      pricePerNight: prop.price_per_night,
      maxGuests: prop.max_guests,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      amenities: typeof prop.amenities === 'string' ? JSON.parse(prop.amenities) : prop.amenities,
      images: typeof prop.images === 'string' ? JSON.parse(prop.images) : prop.images,
      created_at: prop.created_at
    };

    res.json({
      message: "✅ Property found",
      property
    });
  } catch (error) {
    res.status(500).json({ 
      message: "❌ Failed to fetch property", 
      error: error.message 
    });
  }
});

// Create (temporarily without realtor restriction for demo)
router.post('/', authRequired, async (req, res) => {
  try {
    const { 
      name, address, city, description, 
      pricePerNight, maxGuests, bedrooms, bathrooms,
      amenities, images 
    } = req.body;
    
    if (!name) {
      return res.status(400).json({
        message: "❌ Property name is required",
        hint: "Please provide a name for your property"
      });
    }
    
    const property = await Property.create({ 
      user_id: req.user.id, 
      name,
      address,
      city,
      description, 
      price_per_night: pricePerNight, 
      max_guests: maxGuests, 
      bedrooms, 
      bathrooms,
      amenities: amenities || [], 
      images: images || []
    });
    
    res.status(201).json({
      message: "✅ Property created successfully!",
      property,
      nextSteps: [
        "Create bookings: POST /api/bookings",
        "View your properties: GET /api/properties"
      ]
    });
  } catch (error) {
    res.status(500).json({ 
      message: "❌ Failed to create property", 
      error: error.message 
    });
  }
});

// List (owner)
router.get('/', authRequired, async (req, res) => {
  try {
    const props = await Property.findByUserId(req.user.id);
    
    // Convert PostgreSQL JSON fields back to arrays and transform field names
    const properties = props.map(prop => ({
      _id: prop.id,  // Use prop.id from database
      id: prop.id,   // Use prop.id from database
      name: prop.name,
      address: prop.address,
      city: prop.city,
      description: prop.description,
      pricePerNight: prop.price_per_night,
      maxGuests: prop.max_guests,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      amenities: typeof prop.amenities === 'string' ? JSON.parse(prop.amenities) : prop.amenities,
      images: typeof prop.images === 'string' ? JSON.parse(prop.images) : prop.images,
      houseRules: prop.house_rules,
      user_id: prop.user_id,
      created_at: prop.created_at,
      updated_at: prop.updated_at
    }));
    
    res.json({
      message: properties.length > 0 ? `✅ Found ${properties.length} properties` : "📝 No properties yet",
      count: properties.length,
      properties: properties,
      hints: properties.length === 0 ? [
        "Create your first property: POST /api/properties",
        "Sample property: { name: 'My Beach House', address: '123 Ocean Drive' }"
      ] : [
        "Add bookings to properties: POST /api/bookings",
        "View property details: GET /api/properties/:id"
      ]
    });
  } catch (error) {
    res.status(500).json({ 
      message: "❌ Failed to fetch properties", 
      error: error.message 
    });
  }
});

// Read
router.get('/:id', authRequired, async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop || prop.user_id !== req.user.id) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Convert PostgreSQL JSON fields back to arrays and transform field names
    const property = {
      _id: prop.id,  // Use prop.id from database
      id: prop.id,   // Use prop.id from database
      name: prop.name,
      address: prop.address,
      city: prop.city,
      description: prop.description,
      pricePerNight: prop.price_per_night,
      maxGuests: prop.max_guests,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      amenities: typeof prop.amenities === 'string' ? JSON.parse(prop.amenities) : prop.amenities,
      images: typeof prop.images === 'string' ? JSON.parse(prop.images) : prop.images,
      houseRules: prop.house_rules,
      user_id: prop.user_id,
      created_at: prop.created_at,
      updated_at: prop.updated_at
    };

    res.json({
      message: "✅ Property retrieved successfully",
      property
    });
  } catch (error) {
    res.status(500).json({ 
      message: "❌ Failed to fetch property", 
      error: error.message 
    });
  }
});

// Update property
router.put('/:id', authRequired, realtorOnly, async (req, res) => {
  try {
    const { 
      name, address, city, description, 
      pricePerNight, maxGuests, bedrooms, bathrooms,
      amenities, images 
    } = req.body;

    const property = await Property.updateById(req.params.id, {
      name,
      address,
      city,
      description,
      price_per_night: pricePerNight,
      max_guests: maxGuests,
      bedrooms,
      bathrooms,
      amenities: amenities || [],
      images: images || []
    });

    if (!property || property.user_id !== req.user.id) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({
      message: "✅ Property updated successfully",
      property
    });
  } catch (error) {
    res.status(500).json({ 
      message: "❌ Failed to update property", 
      error: error.message 
    });
  }
});

// Delete
router.delete('/:id', authRequired, realtorOnly, async (req, res) => {
  try {
    const property = await Property.deleteById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ 
      message: "✅ Property deleted successfully",
      ok: true 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "❌ Failed to delete property", 
      error: error.message 
    });
  }
});

export default router;
