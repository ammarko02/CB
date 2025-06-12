-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('super_admin', 'hr', 'supplier', 'employee');
CREATE TYPE offer_status AS ENUM ('pending', 'approved', 'rejected', 'expired');
CREATE TYPE offer_category AS ENUM ('food', 'fitness', 'entertainment', 'travel', 'retail', 'technology', 'other');
CREATE TYPE redemption_status AS ENUM ('active', 'used', 'expired');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'employee',
  department VARCHAR(100),
  company_name VARCHAR(255),
  employee_id VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  phone VARCHAR(20),
  points_balance INTEGER DEFAULT 1000,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offers table
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  original_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  category offer_category NOT NULL,
  expiry_date DATE NOT NULL,
  image_url TEXT,
  status offer_status NOT NULL DEFAULT 'pending',
  supplier_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points_cost INTEGER NOT NULL CHECK (points_cost > 0),
  location VARCHAR(255),
  terms_conditions TEXT,
  max_redemptions INTEGER,
  remaining_redemptions INTEGER,
  views INTEGER DEFAULT 0,
  redemptions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Redemptions table
CREATE TABLE redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points_used INTEGER NOT NULL,
  status redemption_status NOT NULL DEFAULT 'active',
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(offer_id, employee_id)
);

-- Activity logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_category ON offers(category);
CREATE INDEX idx_offers_supplier_id ON offers(supplier_id);
CREATE INDEX idx_offers_expiry_date ON offers(expiry_date);
CREATE INDEX idx_offers_created_at ON offers(created_at);

CREATE INDEX idx_redemptions_employee_id ON redemptions(employee_id);
CREATE INDEX idx_redemptions_offer_id ON redemptions(offer_id);
CREATE INDEX idx_redemptions_status ON redemptions(status);
CREATE INDEX idx_redemptions_redeemed_at ON redemptions(redeemed_at);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for offer images
INSERT INTO storage.buckets (id, name, public) VALUES ('offer-images', 'offer-images', true);

-- Create storage policy for offer images
CREATE POLICY "Anyone can view offer images" ON storage.objects FOR SELECT USING (bucket_id = 'offer-images');
CREATE POLICY "Authenticated users can upload offer images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'offer-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'offer-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Super admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "HR can view employees" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('hr', 'super_admin'))
  OR role = 'employee'
);

-- Offers policies
CREATE POLICY "Everyone can view approved offers" ON offers FOR SELECT USING (status = 'approved');
CREATE POLICY "Suppliers can view their own offers" ON offers FOR SELECT USING (supplier_id = auth.uid());
CREATE POLICY "Super admins can view all offers" ON offers FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "Suppliers can create offers" ON offers FOR INSERT WITH CHECK (supplier_id = auth.uid());
CREATE POLICY "Suppliers can update their own offers" ON offers FOR UPDATE USING (supplier_id = auth.uid());
CREATE POLICY "Super admins can update any offer" ON offers FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
);

-- Redemptions policies
CREATE POLICY "Users can view their own redemptions" ON redemptions FOR SELECT USING (employee_id = auth.uid());
CREATE POLICY "Employees can create redemptions" ON redemptions FOR INSERT WITH CHECK (
  employee_id = auth.uid() AND 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'employee')
);
CREATE POLICY "Super admins can view all redemptions" ON redemptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
);

-- Activity logs policies
CREATE POLICY "Users can view their own activity" ON activity_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Super admins can view all activity" ON activity_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Insert sample data
INSERT INTO users (id, email, first_name, last_name, role, department) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@company.com', 'محمد', 'أحمد', 'super_admin', NULL),
('00000000-0000-0000-0000-000000000002', 'hr@company.com', 'فاطمة', 'علي', 'hr', 'Human Resources'),
('00000000-0000-0000-0000-000000000003', 'supplier@example.com', 'عبدالله', 'محمد', 'supplier', NULL),
('00000000-0000-0000-0000-000000000004', 'employee@company.com', 'سارة', 'خالد', 'employee', 'Engineering');

-- Note: You'll need to manually create auth users in Supabase Auth for these profiles to work
-- Or handle user creation through the registration flow in your app
