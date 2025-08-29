import { getSQL } from '../config/neon.js';
import bcrypt from 'bcryptjs';

export class User {
  static async create({ name, email, password, role = 'client' }) {
    const sql = getSQL();
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${passwordHash}, ${role})
      RETURNING id, name, email, role, created_at, updated_at
    `;
    
    console.log('✅ User created successfully:', result[0]);
    return result[0];
  }

  static async findByEmail(email) {
    const sql = getSQL();
    
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    
    return result[0] || null;
  }

  static async findById(id) {
    const sql = getSQL();
    
    const result = await sql`
      SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ${id}
    `;
    
    return result[0] || null;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateById(id, updates) {
    const sql = getSQL();
    const { name, email } = updates;
    
    const result = await sql`
      UPDATE users 
      SET name = ${name}, email = ${email}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, name, email, created_at, updated_at
    `;
    
    return result[0] || null;
  }

  static async deleteById(id) {
    const sql = getSQL();
    
    const result = await sql`
      DELETE FROM users WHERE id = ${id}
      RETURNING id
    `;
    
    return result[0] || null;
  }
}

export default User;
