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
router.post('/', authRequired, realtorOnly, async (req, res) => {
  try {
    const { 
      title, location, description, 
      price_per_night, max_guests, bedrooms, bathrooms,
      amenities, image_url, property_type,
      available_from, available_to,
      realtor_name, realtor_email, realtor_phone
    } = req.body;
    
    if (!title || !location || !price_per_night) {
      return res.status(400).json({
        message: "❌ Title, location, and price per night are required",
        hint: "Please provide all required fields"
      });
    }
    
    // Convert amenities string to array if needed
    let amenitiesArray = [];
    if (amenities) {
      amenitiesArray = typeof amenities === 'string' 
        ? amenities.split(',').map(item => item.trim()).filter(item => item)
        : amenities;
    }
    
    // Create property with realtor information
    const property = await Property.create({ 
      user_id: req.user.id, 
      name: title,
      address: location,
      city: location.split(',')[1]?.trim() || location,
      description: description || '', 
      price_per_night: parseFloat(price_per_night), 
      max_guests: parseInt(max_guests) || 2, 
      bedrooms: parseInt(bedrooms) || 1, 
      bathrooms: parseFloat(bathrooms) || 1,
      amenities: amenitiesArray, 
      images: image_url ? [image_url] : [],
      property_type: property_type || 'apartment',
      available_from: available_from || null,
      available_to: available_to || null,
      realtor_name: realtor_name || req.user.name,
      realtor_email: realtor_email || req.user.email,
      realtor_phone: realtor_phone || '',
      is_available: true
    });
    
    res.status(201).json({
      success: true,
      message: "✅ Property created successfully!",
      property,
      nextSteps: [
        "View on browse properties page",
        "Manage bookings in calendar",
        "Update property details anytime"
      ]
    });
  } catch (error) {
    console.error('❌ Property creation error:', error);
    res.status(500).json({ 
      success: false,
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
