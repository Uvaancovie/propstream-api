import express from 'express';
import { authRequired } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

const router = express.Router();

// List bookings for an owner across properties (optionally by property)
router.get('/', authRequired, async (req, res) => {
  try {
    const { propertyId } = req.query;
    
    let bookings;
    if (propertyId) {
      bookings = await Booking.findByPropertyId(propertyId);
    } else {
      bookings = await Booking.findByUserId(req.user.id);
    }
    
    // Convert date fields and format response
    const formattedBookings = bookings.map(booking => ({
      ...booking,
      start: booking.start_date,
      end: booking.end_date,
      guestName: booking.guest_name,
      guestEmail: booking.guest_email,
      guestPhone: booking.guest_phone,
      totalPrice: booking.total_price,
      propertyName: booking.property_name
    }));
    
    res.json({
      message: bookings.length > 0 ? `✅ Found ${bookings.length} bookings` : "📅 No bookings yet",
      count: bookings.length,
      bookings: formattedBookings,
      filter: propertyId ? `Filtered by property: ${propertyId}` : "All properties",
      hints: bookings.length === 0 ? [
        "Create a manual booking: POST /api/bookings",
        "Sample booking: { property_id: 'your-property-id', start_date: '2024-01-01', end_date: '2024-01-07' }"
      ] : [
        "Update a booking: PUT /api/bookings/:id",
        "Delete a booking: DELETE /api/bookings/:id"
      ]
    });
  } catch (error) {
    res.status(500).json({ 
      message: "❌ Failed to fetch bookings", 
      error: error.message 
    });
  }
});

// Create manual booking block
router.post('/', authRequired, async (req, res) => {
  try {
    const { propertyId, property_id, start, end, start_date, end_date, guestName, guest_name, guestEmail, guest_email, guestPhone, guest_phone, totalPrice, total_price } = req.body;
    
    // Support both camelCase and snake_case for compatibility
    const bookingData = {
      property_id: property_id || propertyId,
      start_date: start_date || start,
      end_date: end_date || end,
      guest_name: guest_name || guestName,
      guest_email: guest_email || guestEmail,
      guest_phone: guest_phone || guestPhone,
      total_price: total_price || totalPrice
    };
    
    if (!bookingData.property_id || !bookingData.start_date || !bookingData.end_date) {
      return res.status(400).json({
        message: "❌ Missing required fields",
        required: ["property_id", "start_date", "end_date"],
        received: { 
          property_id: !!bookingData.property_id, 
          start_date: !!bookingData.start_date, 
          end_date: !!bookingData.end_date 
        },
        example: {
          property_id: "1",
          start_date: "2024-01-01",
          end_date: "2024-01-07",
          guest_name: "John Doe",
          guest_email: "john@example.com"
        }
      });
    }
    
    // Verify property exists and belongs to user
    const property = await Property.findById(bookingData.property_id);
    if (!property || property.user_id !== req.user.id) {
      return res.status(404).json({
        message: "❌ Property not found",
        hint: "Make sure the property exists and belongs to you"
      });
    }
    
    const booking = await Booking.create(bookingData);
    
    res.status(201).json({
      message: "✅ Booking created successfully!",
      booking: {
        ...booking,
        start: booking.start_date,
        end: booking.end_date,
        guestName: booking.guest_name,
        guestEmail: booking.guest_email,
        guestPhone: booking.guest_phone,
        totalPrice: booking.total_price
      },
      nextSteps: [
        "View all bookings: GET /api/bookings",
        "Update booking: PUT /api/bookings/" + booking.id,
        "Delete booking: DELETE /api/bookings/" + booking.id
      ]
    });
  } catch (error) {
    res.status(500).json({ 
      message: "❌ Failed to create booking", 
      error: error.message 
    });
  }
});

// Update booking
router.put('/:id', authRequired, async (req, res) => {
  try {
    const { guest_name, guest_email, guest_phone, start_date, end_date, total_price, status } = req.body;
    
    const booking = await Booking.updateById(req.params.id, {
      guest_name,
      guest_email,
      guest_phone,
      start_date,
      end_date,
      total_price,
      status
    });
    
    if (!booking) {
      return res.status(404).json({ message: "❌ Booking not found" });
    }
    
    res.json({
      message: "✅ Booking updated successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ 
      message: "❌ Failed to update booking", 
      error: error.message 
    });
  }
});

// Delete booking
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const booking = await Booking.deleteById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "❌ Booking not found" });
    }
    
    res.json({
      message: "✅ Booking deleted successfully",
      ok: true
    });
  } catch (error) {
    res.status(500).json({ 
      message: "❌ Failed to delete booking", 
      error: error.message 
    });
  }
});

export default router;
