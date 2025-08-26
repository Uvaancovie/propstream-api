import express from 'express';
import { authRequired } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

const router = express.Router();

/**
 * @route   GET /api/bookings
 * @desc    List bookings for an owner across properties (optionally by property)
 * @access  Private
 */
router.get('/', authRequired, async (req, res) => {
  try {
    const { propertyId, startDate, endDate, status } = req.query;
    
    // Build filter object based on query parameters
    const filter = {};
    
    // Filter by property if specified
    if (propertyId) {
      filter.propertyId = propertyId;
      
      // Verify the property belongs to the requesting user
      const property = await Property.findById(propertyId);
      if (!property || property.ownerId.toString() !== req.user.id) {
        return res.status(403).json({
          message: "❌ You don't have permission to view bookings for this property",
          error: "Forbidden"
        });
      }
    } else {
      // If no property specified, get all properties owned by user
      const userProperties = await Property.find({ ownerId: req.user.id }).select('_id');
      filter.propertyId = { $in: userProperties.map(p => p._id) };
    }
    
    // Filter by date range if specified
    if (startDate) filter.end = { $gte: new Date(startDate) };
    if (endDate) filter.start = { $lte: new Date(endDate) };
    
    // Filter by status if specified
    if (status && ['confirmed', 'cancelled', 'pending'].includes(status)) {
      filter.status = status;
    }
    
    // Performance optimization: use projection to return only needed fields
    const bookings = await Booking.find(filter)
      .select('propertyId platform start end guestName status notes createdAt')
      .sort({ start: 1 })
      .limit(500)
      .lean();
    
    res.json({
      message: bookings.length > 0 ? `✅ Found ${bookings.length} bookings` : "📅 No bookings yet",
      count: bookings.length,
      bookings,
      filter: Object.keys(filter).length > 0 ? `Applied ${Object.keys(filter).length} filters` : "All bookings",
      hints: bookings.length === 0 ? [
        "Create a manual booking: POST /api/bookings",
        "Import from platform calendars: POST /api/calendar/import",
        "Sample booking: { propertyId: 'your-property-id', start: '2024-01-01', end: '2024-01-07' }"
      ] : [
        "Cancel a booking: POST /api/bookings/:id/cancel",
        "Export calendar: GET /api/platforms/:propertyId/ics-export"
      ]
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ 
      message: "❌ Failed to fetch bookings", 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private
 */
router.post('/', authRequired, async (req, res) => {
  try {
    const { propertyId, start, end, guestName, guestEmail, notes, platform = 'manual', status = 'confirmed' } = req.body;
    
    if (!propertyId || !start || !end) {
      return res.status(400).json({
        message: "❌ Missing required fields",
        required: ["propertyId", "start", "end"],
        received: { propertyId: !!propertyId, start: !!start, end: !!end },
        example: {
          propertyId: "your-property-id",
          start: "2024-01-01T15:00:00Z",
          end: "2024-01-07T11:00:00Z",
          guestName: "John Doe",
          guestEmail: "john@example.com",
          notes: "Guest requested early check-in"
        }
      });
    }
    
    // Verify the property belongs to the requesting user
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        message: "❌ Property not found",
        error: "Not Found"
      });
    }
    
    if (property.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "❌ You don't have permission to create bookings for this property",
        error: "Forbidden"
      });
    }
    
    // Validate dates
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({
        message: "❌ Invalid date format",
        error: "Bad Request",
        example: {
          start: "2024-01-01T15:00:00Z",
          end: "2024-01-07T11:00:00Z"
        }
      });
    }
    
    if (endDate <= startDate) {
      return res.status(400).json({
        message: "❌ End date must be after start date",
        error: "Bad Request"
      });
    }
    
    // Check for booking conflicts
    const conflictingBooking = await Booking.findOne({
      propertyId,
      status: 'confirmed',
      $or: [
        { start: { $lt: endDate }, end: { $gt: startDate } },
        { start: { $gte: startDate, $lt: endDate } },
        { end: { $gt: startDate, $lte: endDate } }
      ]
    });
    
    if (conflictingBooking) {
      return res.status(409).json({
        message: "❌ Booking conflict detected",
        error: "Conflict",
        conflictingBooking: {
          id: conflictingBooking._id,
          start: conflictingBooking.start,
          end: conflictingBooking.end,
          guestName: conflictingBooking.guestName
        }
      });
    }
    
    // Create booking
    const booking = await Booking.create({
      propertyId,
      platform,
      start: startDate,
      end: endDate,
      guestName,
      guestEmail,
      status,
      notes
    });
    
    res.status(201).json({
      message: "✅ Booking created successfully!",
      booking,
      nextSteps: [
        "View all bookings: GET /api/bookings",
        `Cancel if needed: POST /api/bookings/${booking._id}/cancel`,
        `Export calendar: GET /api/platforms/${propertyId}/ics-export`
      ]
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      message: "❌ Failed to create booking", 
      error: error.message 
    });
  }
});

// Keep existing routes...

export default router;
