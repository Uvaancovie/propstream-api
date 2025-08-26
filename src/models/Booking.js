import { getSQL } from '../config/neon.js';

export class Booking {
  static async create(bookingData) {
    const sql = getSQL();
    const {
      property_id,
      guest_name,
      guest_email,
      guest_phone,
      start_date,
      end_date,
      total_price,
      status = 'confirmed',
      platform = 'manual'
    } = bookingData;

    const result = await sql`
      INSERT INTO bookings (
        property_id, guest_name, guest_email, guest_phone,
        start_date, end_date, total_price, status, platform
      )
      VALUES (
        ${property_id}, ${guest_name}, ${guest_email}, ${guest_phone},
        ${start_date}, ${end_date}, ${total_price}, ${status}, ${platform}
      )
      RETURNING *
    `;

    return result[0];
  }

  static async findByPropertyId(propertyId) {
    const sql = getSQL();
    
    const result = await sql`
      SELECT b.*, p.name as property_name
      FROM bookings b
      LEFT JOIN properties p ON b.property_id = p.id
      WHERE b.property_id = ${propertyId}
      ORDER BY b.start_date DESC
    `;
    
    return result;
  }

  static async findByUserId(userId) {
    const sql = getSQL();
    
    const result = await sql`
      SELECT b.*, p.name as property_name
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      WHERE p.user_id = ${userId}
      ORDER BY b.start_date DESC
    `;
    
    return result;
  }

  static async findById(id) {
    const sql = getSQL();
    
    const result = await sql`
      SELECT b.*, p.name as property_name
      FROM bookings b
      LEFT JOIN properties p ON b.property_id = p.id
      WHERE b.id = ${id}
    `;
    
    return result[0] || null;
  }

  static async updateById(id, updates) {
    const sql = getSQL();
    const {
      guest_name,
      guest_email,
      guest_phone,
      start_date,
      end_date,
      total_price,
      status
    } = updates;

    const result = await sql`
      UPDATE bookings 
      SET 
        guest_name = ${guest_name},
        guest_email = ${guest_email},
        guest_phone = ${guest_phone},
        start_date = ${start_date},
        end_date = ${end_date},
        total_price = ${total_price},
        status = ${status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    
    return result[0] || null;
  }

  static async deleteById(id) {
    const sql = getSQL();
    
    const result = await sql`
      DELETE FROM bookings WHERE id = ${id}
      RETURNING id
    `;
    
    return result[0] || null;
  }

  static async findByDateRange(propertyId, startDate, endDate) {
    const sql = getSQL();
    
    const result = await sql`
      SELECT * FROM bookings 
      WHERE property_id = ${propertyId}
      AND start_date <= ${endDate}
      AND end_date >= ${startDate}
      AND status = 'confirmed'
      ORDER BY start_date ASC
    `;
    
    return result;
  }
}

export default Booking;
