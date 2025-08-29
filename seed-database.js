#!/usr/bin/env node

/**
 * PropStream Database Seeding Script
 * Simple Node.js script to populate PostgreSQL with demo data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🌱 PropStream Database Seeding Script');
console.log('=====================================');

// Check if SQL files exist
const seedSimplePath = path.join(__dirname, 'seed-simple.sql');
const seedSqlPath = path.join(__dirname, 'seed-sql.sql');

if (!fs.existsSync(seedSimplePath) || !fs.existsSync(seedSqlPath)) {
    console.error('❌ Error: Seed SQL files not found. Please run this script from the propstream-api directory.');
    process.exit(1);
}

// Get database URL
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is required.');
    console.log('💡 Make sure you have a .env file with DATABASE_URL=your_postgres_connection_string');
    process.exit(1);
}

// Initialize database connection
const sql = neon(DATABASE_URL);

async function runSqlFile(filePath, description) {
    try {
        console.log(`📝 ${description}...`);
        const sqlContent = fs.readFileSync(filePath, 'utf8');
        
        // Split SQL content into individual statements and execute them
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        for (const statement of statements) {
            if (statement.trim()) {
                await sql(statement);
            }
        }
        
        console.log(`✅ ${description} completed successfully!`);
        return true;
    } catch (error) {
        console.error(`❌ ${description} failed:`, error.message);
        return false;
    }
}

async function runSeeding() {
    try {
        console.log('🚀 Connecting to database...\n');

        // Test connection
        await sql`SELECT 1 as test`;
        console.log('✅ Database connection successful!\n');

        // Menu options
        console.log('Choose seeding option:');
        console.log('1. Simple seed (matches frontend localStorage data)');
        console.log('2. Comprehensive seed (full demo data with more properties/bookings)');
        console.log('3. Both (simple first, then comprehensive)\n');

        // For now, let's run option 1 (simple) by default
        // You can modify this to add interactive input if needed
        const choice = process.argv[2] || '1';

        switch (choice) {
            case '1':
                console.log('🌱 Running simple seed...');
                await runSqlFile(seedSimplePath, 'Simple seed');
                break;
                
            case '2':
                console.log('🌱 Running comprehensive seed...');
                await runSqlFile(seedSqlPath, 'Comprehensive seed');
                break;
                
            case '3':
                console.log('🌱 Running both seed files...');
                const simpleSuccess = await runSqlFile(seedSimplePath, 'Step 1: Simple seed');
                if (simpleSuccess) {
                    await runSqlFile(seedSqlPath, 'Step 2: Comprehensive seed');
                    console.log('✅ Both seed files executed successfully!');
                }
                break;
                
            default:
                console.error('❌ Invalid choice. Use: node seed-database.js [1|2|3]');
                process.exit(1);
        }

        // Verify seeding
        console.log('\n🔍 Verifying seeded data...');
        const users = await sql`SELECT COUNT(*) as count FROM users`;
        const properties = await sql`SELECT COUNT(*) as count FROM properties`;
        const bookings = await sql`SELECT COUNT(*) as count FROM bookings`;
        
        console.log('\n🎉 Seeding completed! Your database now contains:');
        console.log(`   • ${users[0].count} users (realtors and clients)`);
        console.log(`   • ${properties[0].count} sample properties`);
        console.log(`   • ${bookings[0].count} booking examples`);
        console.log('   • Newsletter subscriptions');
        
        console.log('\n🔐 Test login credentials:');
        console.log('   Realtor: realtor@test.com / password123');
        console.log('   Client:  client@test.com / password123');
        
        console.log('\n🚀 Start your servers and test the functionality!');

    } catch (error) {
        console.error('❌ Error during seeding:', error.message);
        console.log('\n💡 Troubleshooting tips:');
        console.log('   - Verify your DATABASE_URL is correct');
        console.log('   - Check if your database tables exist (run database-setup.js first)');
        console.log('   - Make sure you have the required dependencies installed');
        process.exit(1);
    }
}

// Run the seeding
runSeeding();
