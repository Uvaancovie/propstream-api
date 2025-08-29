-- PropStream Simple Seed Data
-- Quick seed data that matches the frontend localStorage data

-- Note: This assumes your database schema is already set up
-- Run this after your tables are created

-- Users (matching the frontend seed data)
INSERT INTO users (id, name, email, password_hash, role, phone) VALUES
(1, 'John Smith', 'realtor@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'realtor', '+27 11 123 4567'),
(2, 'Sarah Johnson', 'sarah@properties.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'realtor', '+27 21 987 6543'),
(3, 'Mike Client', 'client@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', '+27 82 123 4567'),
(4, 'Alice Walker', 'alice@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', '+27 83 765 4321')
ON CONFLICT (email) DO NOTHING;

-- Properties (matching frontend seedData.js)
INSERT INTO properties (
    id, user_id, name, description, address, city, 
    price_per_night, max_guests, bedrooms, bathrooms, 
    amenities, images, property_type, 
    realtor_name, realtor_email, realtor_phone, realtor_id, is_available
) VALUES
(1, 1, 'Luxury Beachfront Villa', 
 'Beautiful oceanfront villa with stunning views and modern amenities. Perfect for a relaxing getaway.',
 '123 Ocean Drive', 'Cape Town', 
 2500.00, 8, 4, 3, 
 '["WiFi", "Swimming Pool", "Ocean View", "Kitchen", "Parking"]',
 '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
 'villa',
 'John Smith', 'realtor@test.com', '+27 11 123 4567', 1, true),

(2, 1, 'Modern City Apartment',
 'Stylish apartment in the heart of the city with all modern conveniences.',
 '456 Main Street', 'Johannesburg',
 1200.00, 4, 2, 2,
 '["WiFi", "Gym", "Concierge", "Kitchen", "Air Conditioning"]',
 '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
 'apartment',
 'John Smith', 'realtor@test.com', '+27 11 123 4567', 1, true),

(3, 2, 'Cozy Mountain Cabin',
 'Peaceful cabin surrounded by mountains, perfect for nature lovers.',
 '789 Mountain View', 'Stellenbosch',
 800.00, 6, 3, 2,
 '["WiFi", "Fireplace", "Mountain View", "Kitchen", "Hiking Trails"]',
 '["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
 'cabin',
 'Sarah Johnson', 'sarah@properties.com', '+27 21 987 6543', 2, true)
ON CONFLICT (id) DO NOTHING;

-- Bookings (matching frontend seedData.js)
INSERT INTO bookings (
    id, property_id, guest_name, guest_email, guest_phone,
    start_date, end_date, total_price, status, guest_count
) VALUES
(1, 1, 'Mike Client', 'client@test.com', '+27 82 123 4567',
 '2025-09-15', '2025-09-20', 12500.00, 'confirmed', 4),

(2, 2, 'Alice Walker', 'alice@email.com', '+27 83 765 4321',
 '2025-09-10', '2025-09-12', 2400.00, 'pending', 2)
ON CONFLICT (id) DO NOTHING;

-- Newsletter subscriptions
INSERT INTO newsletter_subscriptions (email) VALUES
('client@test.com'),
('alice@email.com')
ON CONFLICT (email) DO NOTHING;

-- Update sequences to prevent ID conflicts
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('properties_id_seq', (SELECT MAX(id) FROM properties));
SELECT setval('bookings_id_seq', (SELECT MAX(id) FROM bookings));

-- Verify data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Properties', COUNT(*) FROM properties  
UNION ALL
SELECT 'Bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'Newsletter', COUNT(*) FROM newsletter_subscriptions;
