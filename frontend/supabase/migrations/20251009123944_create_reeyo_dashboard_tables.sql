/*
  # Reeyo Platform Dashboard Schema

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text)
      - `email` (text, unique)
      - `total_orders` (integer, default 0)
      - `status` (text, default 'Active')
      - `city` (text)
      - `loyalty_points` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `vendors`
      - `id` (uuid, primary key)
      - `restaurant_name` (text)
      - `contact_person` (text)
      - `phone` (text)
      - `email` (text, unique)
      - `commission_rate` (numeric, default 15.0)
      - `city` (text)
      - `rating` (numeric, default 0)
      - `status` (text, default 'Pending')
      - `operating_hours` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `riders`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text)
      - `email` (text, unique)
      - `vehicle_type` (text)
      - `status` (text, default 'Offline')
      - `availability` (text, default 'Available')
      - `total_deliveries` (integer, default 0)
      - `rating` (numeric, default 0)
      - `license_verified` (boolean, default false)
      - `vehicle_verified` (boolean, default false)
      - `city` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `customer_orders`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `vendor_id` (uuid, foreign key)
      - `rider_id` (uuid, foreign key)
      - `order_total` (numeric)
      - `status` (text)
      - `created_at` (timestamptz)

    - `customer_addresses`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `address_line` (text)
      - `city` (text)
      - `is_default` (boolean, default false)
      - `created_at` (timestamptz)

    - `vendor_payouts`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, foreign key)
      - `amount` (numeric)
      - `status` (text)
      - `created_at` (timestamptz)

    - `rider_earnings`
      - `id` (uuid, primary key)
      - `rider_id` (uuid, foreign key)
      - `amount` (numeric)
      - `delivery_id` (uuid)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin access
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text UNIQUE NOT NULL,
  total_orders integer DEFAULT 0,
  status text DEFAULT 'Active',
  city text,
  loyalty_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_name text NOT NULL,
  contact_person text NOT NULL,
  phone text NOT NULL,
  email text UNIQUE NOT NULL,
  commission_rate numeric DEFAULT 15.0,
  city text,
  rating numeric DEFAULT 0,
  status text DEFAULT 'Pending',
  operating_hours jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create riders table
CREATE TABLE IF NOT EXISTS riders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text UNIQUE NOT NULL,
  vehicle_type text,
  status text DEFAULT 'Offline',
  availability text DEFAULT 'Available',
  total_deliveries integer DEFAULT 0,
  rating numeric DEFAULT 0,
  license_verified boolean DEFAULT false,
  vehicle_verified boolean DEFAULT false,
  city text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customer_orders table
CREATE TABLE IF NOT EXISTS customer_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  vendor_id uuid REFERENCES vendors(id) ON DELETE SET NULL,
  rider_id uuid REFERENCES riders(id) ON DELETE SET NULL,
  order_total numeric NOT NULL,
  status text DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

-- Create customer_addresses table
CREATE TABLE IF NOT EXISTS customer_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  address_line text NOT NULL,
  city text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create vendor_payouts table
CREATE TABLE IF NOT EXISTS vendor_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  status text DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

-- Create rider_earnings table
CREATE TABLE IF NOT EXISTS rider_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id uuid REFERENCES riders(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  delivery_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rider_earnings ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated admin access
CREATE POLICY "Admin can view all customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view all vendors"
  ON vendors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can update vendors"
  ON vendors FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can insert vendors"
  ON vendors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view all riders"
  ON riders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can update riders"
  ON riders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can insert riders"
  ON riders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view all orders"
  ON customer_orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can view all addresses"
  ON customer_addresses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can view all vendor payouts"
  ON vendor_payouts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can view all rider earnings"
  ON rider_earnings FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample data for customers
INSERT INTO customers (name, phone, email, total_orders, status, city, loyalty_points) VALUES
('John Doe', '+237670123456', 'john.doe@example.com', 15, 'Active', 'Douala', 150),
('Mary Smith', '+237671234567', 'mary.smith@example.com', 8, 'Active', 'Yaoundé', 80),
('Paul Ngong', '+237672345678', 'paul.ngong@example.com', 23, 'Active', 'Douala', 230),
('Sarah Manga', '+237673456789', 'sarah.manga@example.com', 0, 'Blocked', 'Yaoundé', 0),
('Peter Fon', '+237674567890', 'peter.fon@example.com', 12, 'Active', 'Bamenda', 120)
ON CONFLICT (email) DO NOTHING;

-- Insert sample data for vendors
INSERT INTO vendors (restaurant_name, contact_person, phone, email, commission_rate, city, rating, status) VALUES
('Mama''s Kitchen', 'Grace Atanga', '+237680111111', 'mamas.kitchen@example.com', 15.0, 'Douala', 4.5, 'Active'),
('Le Bistro', 'Jean-Paul Mbah', '+237680222222', 'lebistro@example.com', 12.0, 'Yaoundé', 4.8, 'Active'),
('Afro Fusion', 'Stella Ndongo', '+237680333333', 'afrofusion@example.com', 18.0, 'Douala', 4.2, 'Pending'),
('Quick Bites', 'Samuel Tabi', '+237680444444', 'quickbites@example.com', 15.0, 'Bamenda', 4.0, 'Active'),
('Spice Garden', 'Rose Ashu', '+237680555555', 'spicegarden@example.com', 20.0, 'Yaoundé', 3.9, 'Suspended')
ON CONFLICT (email) DO NOTHING;

-- Insert sample data for riders
INSERT INTO riders (name, phone, email, vehicle_type, status, availability, total_deliveries, rating, license_verified, vehicle_verified, city) VALUES
('Michel Kamga', '+237690111111', 'michel.kamga@example.com', 'Motorcycle', 'Online', 'Available', 342, 4.7, true, true, 'Douala'),
('Emmanuel Biya', '+237690222222', 'emmanuel.biya@example.com', 'Motorcycle', 'Online', 'On-delivery', 156, 4.5, true, true, 'Yaoundé'),
('David Ekema', '+237690333333', 'david.ekema@example.com', 'Bicycle', 'Offline', 'Available', 89, 4.2, true, false, 'Douala'),
('Frank Ndi', '+237690444444', 'frank.ndi@example.com', 'Motorcycle', 'Online', 'Available', 201, 4.9, false, true, 'Bamenda'),
('George Fuh', '+237690555555', 'george.fuh@example.com', 'Car', 'Offline', 'Available', 67, 3.8, true, true, 'Yaoundé')
ON CONFLICT (email) DO NOTHING;