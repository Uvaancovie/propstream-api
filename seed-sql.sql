-- PropStream Database Seed Data
-- Run this script to populate your PostgreSQL database with demo data

-- =====================================================
-- 1. USERS (Realtors and Clients)
-- =====================================================

-- Insert demo users (realtors and clients)
INSERT INTO users (id, name, email, password_hash, role, phone, created_at, updated_at) VALUES
-- Realtors
(1, 'John Smith', 'realtor@test.com', '$2b$10$XmAoHXAi7mF9k3Lm.T8zPOEhqU5QVRzKm4YjA6Xx8K5PqLmZ1JnI2', 'realtor', '+27 11 123 4567', '2025-08-01 10:00:00', '2025-08-01 10:00:00'),
(2, 'Sarah Johnson', 'sarah@properties.com', '$2b$10$XmAoHXAi7mF9k3Lm.T8zPOEhqU5QVRzKm4YjA6Xx8K5PqLmZ1JnI2', 'realtor', '+27 21 987 6543', '2025-08-01 11:00:00', '2025-08-01 11:00:00'),
(3, 'David Wilson', 'david@realtygroup.com', '$2b$10$XmAoHXAi7mF9k3Lm.T8zPOEhqU5QVRzKm4YjA6Xx8K5PqLmZ1JnI2', 'realtor', '+27 31 456 7890', '2025-08-01 12:00:00', '2025-08-01 12:00:00'),

-- Clients
(4, 'Mike Client', 'client@test.com', '$2b$10$XmAoHXAi7mF9k3Lm.T8zPOEhqU5QVRzKm4YjA6Xx8K5PqLmZ1JnI2', 'client', '+27 82 123 4567', '2025-08-05 09:00:00', '2025-08-05 09:00:00'),
(5, 'Alice Walker', 'alice@email.com', '$2b$10$XmAoHXAi7mF9k3Lm.T8zPOEhqU5QVRzKm4YjA6Xx8K5PqLmZ1JnI2', 'client', '+27 83 765 4321', '2025-08-05 14:30:00', '2025-08-05 14:30:00'),
(6, 'Robert Brown', 'robert@vacation.com', '$2b$10$XmAoHXAi7mF9k3Lm.T8zPOEhqU5QVRzKm4YjA6Xx8K5PqLmZ1JnI2', 'client', '+27 84 987 6543', '2025-08-10 16:00:00', '2025-08-10 16:00:00'),
(7, 'Emma Davis', 'emma@travel.com', '$2b$10$XmAoHXAi7mF9k3Lm.T8zPOEhqU5QVRzKm4YjA6Xx8K5PqLmZ1JnI2', 'client', '+27 85 234 5678', '2025-08-12 11:30:00', '2025-08-12 11:30:00');

-- Reset sequence for users table
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- =====================================================
-- 2. PROPERTIES 
-- =====================================================

-- Insert demo properties with proper schema fields
INSERT INTO properties (
    id, user_id, name, description, address, city, 
    price_per_night, max_guests, bedrooms, bathrooms, 
    amenities, images, property_type, available_from, available_to,
    realtor_name, realtor_email, realtor_phone, realtor_id, is_available,
    created_at, updated_at
) VALUES
-- John Smith's Properties
(1, 1, 'Luxury Beachfront Villa', 
 'Beautiful oceanfront villa with stunning views and modern amenities. Perfect for a relaxing getaway with family or friends. Features include private beach access, infinity pool, and gourmet kitchen.',
 '123 Ocean Drive', 'Cape Town', 
 2500.00, 8, 4, 3, 
 '["WiFi", "Swimming Pool", "Ocean View", "Kitchen", "Parking", "Beach Access", "BBQ Area"]',
 '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
 'villa', '2025-01-01', '2025-12-31',
 'John Smith', 'realtor@test.com', '+27 11 123 4567', 1, true,
 '2025-08-01 10:30:00', '2025-08-01 10:30:00'),

(2, 1, 'Modern City Apartment',
 'Stylish apartment in the heart of the city with all modern conveniences. Perfect for business travelers and couples. Walking distance to restaurants, shopping, and entertainment.',
 '456 Main Street', 'Johannesburg',
 1200.00, 4, 2, 2,
 '["WiFi", "Gym", "Concierge", "Kitchen", "Air Conditioning", "City View", "Parking"]',
 '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
 'apartment', '2025-01-01', '2025-12-31',
 'John Smith', 'realtor@test.com', '+27 11 123 4567', 1, true,
 '2025-08-01 11:00:00', '2025-08-01 11:00:00'),

-- Sarah Johnson's Properties
(3, 2, 'Cozy Mountain Cabin',
 'Peaceful cabin surrounded by mountains, perfect for nature lovers and those seeking tranquility. Features hiking trails, fireplace, and breathtaking mountain views.',
 '789 Mountain View', 'Stellenbosch',
 800.00, 6, 3, 2,
 '["WiFi", "Fireplace", "Mountain View", "Kitchen", "Hiking Trails", "Hot Tub", "Pet Friendly"]',
 '["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
 'cabin', '2025-01-01', '2025-12-31',
 'Sarah Johnson', 'sarah@properties.com', '+27 21 987 6543', 2, true,
 '2025-08-01 11:30:00', '2025-08-01 11:30:00'),

(4, 2, 'Wine Estate Cottage',
 'Charming cottage on a working wine estate with vineyard views. Includes wine tasting, cellar tours, and gourmet dining. Perfect for romantic getaways.',
 '321 Wine Route', 'Stellenbosch',
 1800.00, 4, 2, 1,
 '["WiFi", "Wine Tasting", "Vineyard View", "Kitchen", "Restaurant", "Spa", "Garden"]',
 '["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
 'cottage', '2025-01-01', '2025-12-31',
 'Sarah Johnson', 'sarah@properties.com', '+27 21 987 6543', 2, true,
 '2025-08-01 12:00:00', '2025-08-01 12:00:00'),

-- David Wilson's Properties  
(5, 3, 'Luxury Safari Lodge',
 'Exclusive safari lodge with game drives, luxury accommodations, and all-inclusive dining. Experience the Big Five in comfort and style.',
 '147 Game Reserve Road', 'Kruger National Park',
 5000.00, 6, 3, 3,
 '["WiFi", "Game Drives", "All Inclusive", "Spa", "Pool", "Restaurant", "Bar", "Laundry"]',
 '["https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
 'lodge', '2025-01-01', '2025-12-31',
 'David Wilson', 'david@realtygroup.com', '+27 31 456 7890', 3, true,
 '2025-08-01 12:30:00', '2025-08-01 12:30:00'),

(6, 3, 'Coastal Penthouse',
 'Stunning penthouse with panoramic ocean views, private terrace, and premium amenities. Located in prestigious Camps Bay area.',
 '789 Beach Road', 'Camps Bay',
 3500.00, 6, 3, 2,
 '["WiFi", "Ocean View", "Terrace", "Parking", "Concierge", "Pool", "Gym", "Security"]',
 '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"]',
 'penthouse', '2025-01-01', '2025-12-31',
 'David Wilson', 'david@realtygroup.com', '+27 31 456 7890', 3, true,
 '2025-08-01 13:00:00', '2025-08-01 13:00:00');

-- Reset sequence for properties table
SELECT setval('properties_id_seq', (SELECT MAX(id) FROM properties));

-- =====================================================
-- 3. BOOKINGS
-- =====================================================

-- Insert demo bookings with various statuses and dates
INSERT INTO bookings (
    id, property_id, guest_name, guest_email, guest_phone,
    start_date, end_date, total_price, status, platform,
    guest_count, notes, created_at, updated_at
) VALUES
-- Confirmed bookings
(1, 1, 'Mike Client', 'client@test.com', '+27 82 123 4567',
 '2025-09-15', '2025-09-20', 12500.00, 'confirmed', 'direct',
 4, 'Anniversary celebration trip', '2025-08-20 10:00:00', '2025-08-20 10:00:00'),

(2, 3, 'Robert Brown', 'robert@vacation.com', '+27 84 987 6543',
 '2025-09-25', '2025-09-30', 4000.00, 'confirmed', 'direct',
 2, 'Weekend hiking retreat', '2025-08-22 14:00:00', '2025-08-22 14:00:00'),

(3, 5, 'Emma Davis', 'emma@travel.com', '+27 85 234 5678',
 '2025-10-10', '2025-10-15', 25000.00, 'confirmed', 'direct',
 4, 'Safari adventure with family', '2025-08-25 09:00:00', '2025-08-25 09:00:00'),

-- Pending bookings
(4, 2, 'Alice Walker', 'alice@email.com', '+27 83 765 4321',
 '2025-09-10', '2025-09-12', 2400.00, 'pending', 'direct',
 2, 'Business trip to Johannesburg', '2025-08-25 14:30:00', '2025-08-25 14:30:00'),

(5, 4, 'Mike Client', 'client@test.com', '+27 82 123 4567',
 '2025-10-20', '2025-10-22', 3600.00, 'pending', 'direct',
 2, 'Wine tasting weekend', '2025-08-26 11:00:00', '2025-08-26 11:00:00'),

-- Past completed bookings
(6, 1, 'Alice Walker', 'alice@email.com', '+27 83 765 4321',
 '2025-08-01', '2025-08-05', 10000.00, 'completed', 'direct',
 3, 'Summer beach vacation', '2025-07-15 16:00:00', '2025-08-05 12:00:00'),

(7, 3, 'Emma Davis', 'emma@travel.com', '+27 85 234 5678',
 '2025-07-20', '2025-07-25', 4000.00, 'completed', 'direct',
 2, 'Mountain hiking experience', '2025-07-10 10:30:00', '2025-07-25 11:00:00'),

-- Cancelled booking
(8, 6, 'Robert Brown', 'robert@vacation.com', '+27 84 987 6543',
 '2025-09-05', '2025-09-10', 17500.00, 'cancelled', 'direct',
 4, 'Family vacation - cancelled due to emergency', '2025-08-15 13:45:00', '2025-08-28 09:30:00');

-- Reset sequence for bookings table
SELECT setval('bookings_id_seq', (SELECT MAX(id) FROM bookings));

-- =====================================================
-- 4. NEWSLETTER SUBSCRIPTIONS
-- =====================================================

-- Insert newsletter subscriptions
INSERT INTO newsletter_subscriptions (email, subscribed_at, is_active) VALUES
('client@test.com', '2025-08-20 10:05:00', true),
('alice@email.com', '2025-08-25 14:35:00', true),
('robert@vacation.com', '2025-08-22 14:05:00', true),
('emma@travel.com', '2025-08-25 09:05:00', true),
('travel.lover@gmail.com', '2025-08-26 16:20:00', true),
('vacation.seeker@outlook.com', '2025-08-27 11:15:00', true),
('newsletter.subscriber@yahoo.com', '2025-08-28 08:45:00', true);

-- =====================================================
-- 5. PLATFORM LINKS (Optional - for calendar sync)
-- =====================================================

-- Insert platform integration examples
INSERT INTO platform_links (property_id, platform_name, external_property_id, import_url, export_url, sync_enabled, created_at, updated_at) VALUES
(1, 'Airbnb', 'airbnb-villa-123', 'https://calendar.airbnb.com/calendar/ical/villa123.ics', 'https://api.airbnb.com/export/villa123', true, '2025-08-01 10:45:00', '2025-08-01 10:45:00'),
(2, 'Booking.com', 'booking-apt-456', 'https://calendar.booking.com/ical/apt456.ics', 'https://api.booking.com/export/apt456', true, '2025-08-01 11:15:00', '2025-08-01 11:15:00'),
(3, 'Airbnb', 'airbnb-cabin-789', 'https://calendar.airbnb.com/calendar/ical/cabin789.ics', 'https://api.airbnb.com/export/cabin789', false, '2025-08-01 11:45:00', '2025-08-01 11:45:00');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify the data was inserted correctly
DO $$
BEGIN
    RAISE NOTICE '=== SEED DATA SUMMARY ===';
    RAISE NOTICE 'Users: % (% realtors, % clients)', 
        (SELECT COUNT(*) FROM users),
        (SELECT COUNT(*) FROM users WHERE role = 'realtor'),
        (SELECT COUNT(*) FROM users WHERE role = 'client');
    RAISE NOTICE 'Properties: %', (SELECT COUNT(*) FROM properties);
    RAISE NOTICE 'Bookings: % (% confirmed, % pending, % completed, % cancelled)',
        (SELECT COUNT(*) FROM bookings),
        (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed'),
        (SELECT COUNT(*) FROM bookings WHERE status = 'pending'), 
        (SELECT COUNT(*) FROM bookings WHERE status = 'completed'),
        (SELECT COUNT(*) FROM bookings WHERE status = 'cancelled');
    RAISE NOTICE 'Newsletter Subscriptions: %', (SELECT COUNT(*) FROM newsletter_subscriptions);
    RAISE NOTICE '========================';
END $$;

-- Sample queries to test the data
-- SELECT name, city, price_per_night FROM properties ORDER BY price_per_night DESC;
-- SELECT guest_name, start_date, end_date, status FROM bookings ORDER BY start_date DESC;
-- SELECT u.name as realtor, COUNT(p.id) as properties FROM users u LEFT JOIN properties p ON u.id = p.user_id WHERE u.role = 'realtor' GROUP BY u.id, u.name;

COMMIT;
