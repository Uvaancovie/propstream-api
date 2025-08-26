import { getSQL } from '../config/neon.js';

export class Property {
  static async create(propertyData) {
    const sql = getSQL();
    const {
      user_id,
      name,
      description,
      address,
      city,
      price_per_night,
      max_guests,
      bedrooms,
      bathrooms,
      amenities = [],
      images = []
    } = propertyData;

    const result = await sql`
      INSERT INTO properties (
        user_id, name, description, address, city, 
        price_per_night, max_guests, bedrooms, bathrooms, 
        amenities, images
      )
      VALUES (
        ${user_id}, ${name}, ${description}, ${address}, ${city},
        ${price_per_night}, ${max_guests}, ${bedrooms}, ${bathrooms},
        ${JSON.stringify(amenities)}, ${JSON.stringify(images)}
      )
      RETURNING *
    `;

    return result[0];
  }

  static async findByUserId(userId) {
    const sql = getSQL();
    
    const result = await sql`
      SELECT * FROM properties 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    
    return result;
  }

  static async findAll() {
    const sql = getSQL();
    
    const result = await sql`
      SELECT * FROM properties 
      ORDER BY created_at DESC
    `;
    
    return result;
  }

  static async findById(id) {
    const sql = getSQL();
    
    const result = await sql`
      SELECT * FROM properties WHERE id = ${id}
    `;
    
    return result[0] || null;
  }

  static async updateById(id, updates) {
    const sql = getSQL();
    const {
      name,
      description,
      address,
      city,
      price_per_night,
      max_guests,
      bedrooms,
      bathrooms,
      amenities,
      images
    } = updates;

    const result = await sql`
      UPDATE properties 
      SET 
        name = ${name},
        description = ${description},
        address = ${address},
        city = ${city},
        price_per_night = ${price_per_night},
        max_guests = ${max_guests},
        bedrooms = ${bedrooms},
        bathrooms = ${bathrooms},
        amenities = ${JSON.stringify(amenities || [])},
        images = ${JSON.stringify(images || [])},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    
    return result[0] || null;
  }

  static async deleteById(id) {
    const sql = getSQL();
    
    const result = await sql`
      DELETE FROM properties WHERE id = ${id}
      RETURNING id
    `;
    
    return result[0] || null;
  }
}

export default Property;
