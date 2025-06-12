# Happy Perks Hub - Supabase Setup Guide

This guide will help you set up Supabase as the backend for your Happy Perks Hub application.

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `happy-perks-hub`
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest to your users
6. Click "Create new project"

### 2. Set Up the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the entire contents of `supabase_schema.sql` from your project root
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create:

- All necessary tables (users, offers, redemptions, etc.)
- Proper relationships and constraints
- Row Level Security (RLS) policies
- Storage bucket for offer images
- Sample data for testing

### 3. Configure Environment Variables

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy your project URL and anon public key
3. Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Enable Email Authentication

1. Go to **Authentication** > **Settings**
2. Configure your email settings or use Supabase's email service
3. Optionally set up custom SMTP for production

### 5. Configure Storage

1. Go to **Storage**
2. Verify that the `offer-images` bucket was created
3. The bucket should be public for image viewing

## 🔐 Authentication Setup

### Demo Users Setup

The schema includes sample user profiles, but you need to create corresponding auth users:

1. Go to **Authentication** > **Users**
2. Click **Add user** and create these accounts:

| Email                | Password    | Role        | Name         |
| -------------------- | ----------- | ----------- | ------------ |
| admin@company.com    | password123 | Super Admin | محمد أحمد    |
| hr@company.com       | password123 | HR Manager  | فاطمة علي    |
| supplier@example.com | password123 | Supplier    | عبدالله محمد |
| employee@company.com | password123 | Employee    | سارة خالد    |

**Note**: After creating auth users, you need to update the user profiles in the `users` table with the correct UUIDs from the auth.users table.

### Production Users

For production, users will register through the app, which will:

1. Create an auth user in Supabase Auth
2. Create a corresponding profile in the `users` table
3. Handle role assignment (employees by default, others need admin approval)

## 📊 Data Structure

### Tables Created

1. **users** - User profiles and roles
2. **offers** - Supplier offers and deals
3. **redemptions** - Employee redemption history
4. **activity_logs** - System activity tracking
5. **notifications** - User notifications

### Row Level Security (RLS)

RLS policies are automatically applied to ensure:

- Users can only see their own data
- Employees can only see approved offers
- Suppliers can only manage their own offers
- Admins have full access
- HR can manage employee data

## 🖼️ Image Upload

### Storage Setup

The storage bucket `offer-images` is configured for:

- Public read access (anyone can view images)
- Authenticated upload access (logged-in users can upload)
- User-specific update permissions

### Upload Flow

1. User selects an image file
2. App uploads to Supabase Storage
3. Public URL is returned and stored in the offers table

## 🔄 Real-time Features

Supabase provides real-time capabilities out of the box. You can enable real-time updates for:

1. Go to **Database** > **Replication**
2. Enable replication for tables you want to sync in real-time
3. Use Supabase's real-time subscriptions in your React components

Example for real-time offers:

```typescript
useEffect(() => {
  const subscription = supabase
    .channel("offers-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "offers" },
      (payload) => {
        // Handle real-time updates
        console.log("Offer updated:", payload);
      },
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

## 🚦 Testing the Integration

### 1. Start Your Development Server

```bash
npm run dev
```

### 2. Test Login

1. Navigate to the login page
2. Use one of the demo accounts
3. Verify that role-based dashboards work correctly

### 3. Test Core Features

- **Supplier**: Create and manage offers
- **Admin**: Approve/reject offers
- **Employee**: Browse and redeem offers
- **HR**: Manage employee accounts

### 4. Verify Database Operations

Check your Supabase dashboard to see:

- New users being created
- Offers being added and updated
- Redemptions being tracked
- Points being deducted

## 🔧 Advanced Configuration

### Custom Domains

For production, set up custom domains in Supabase:

1. Go to **Settings** > **Custom Domains**
2. Add your domain and follow the verification steps

### Email Templates

Customize authentication emails:

1. Go to **Authentication** > **Email Templates**
2. Customize the confirmation and reset password emails

### Database Functions

You can add custom PostgreSQL functions for complex business logic:

1. Go to **SQL Editor**
2. Create functions for calculations, validations, etc.

### Webhooks

Set up webhooks for external integrations:

1. Go to **Database** > **Webhooks**
2. Configure endpoints for events like new users, offers, etc.

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**

   - Ensure `.env.local` is in the project root
   - Restart your development server
   - Check that variables start with `VITE_`

2. **RLS Policy Errors**

   - Verify that you're authenticated
   - Check that the user has the correct role
   - Review the RLS policies in the SQL editor

3. **Image Upload Failures**

   - Verify storage bucket permissions
   - Check file size limits (5MB default)
   - Ensure file types are allowed

4. **Authentication Issues**
   - Check that email confirmation is disabled for development
   - Verify that the user exists in both auth.users and public.users
   - Ensure RLS policies allow the user's role

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Discord](https://discord.supabase.com)
- Review the Supabase logs in your dashboard

## 🎯 Next Steps

1. **Deploy to Production**: Use Vercel, Netlify, or another platform
2. **Set up Monitoring**: Use Supabase's built-in monitoring tools
3. **Add Analytics**: Implement detailed tracking and reporting
4. **Performance Optimization**: Add database indexes and query optimization
5. **Security Review**: Audit RLS policies and authentication flows

Your Happy Perks Hub is now fully integrated with Supabase! 🎉
