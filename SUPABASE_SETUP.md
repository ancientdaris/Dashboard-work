# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication for your OSAS Dashboard application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created

## Step 1: Get Your Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (a long JWT token)

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root of your project with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values you copied from Supabase.

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Set Up Authentication in Supabase

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** authentication
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation and password reset emails

## Step 4: Configure Site URL (Important!)

1. Go to **Authentication** → **URL Configuration**
2. Add your site URL:
   - For development: `http://localhost:3000`
   - For production: Your actual domain
3. Add redirect URLs:
   - `http://localhost:3000/dashboard` (development)
   - `https://yourdomain.com/dashboard` (production)

## Step 5: Set Up User Metadata (Optional)

The signup form collects additional user data. To store this properly:

1. Go to **Authentication** → **Users**
2. User metadata will be automatically stored in the `raw_user_meta_data` field
3. You can create a custom `profiles` table to store additional information:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  mobile_number TEXT,
  business_type TEXT CHECK (business_type IN ('retailer', 'wholesaler')),
  business_name TEXT,
  gst_number TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);
```

## Step 6: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/signup`
3. Create a test account
4. Check your email for the confirmation link (if email confirmation is enabled)
5. Navigate to `http://localhost:3000/signin`
6. Sign in with your credentials
7. You should be redirected to `/dashboard` upon successful login

## Authentication Features Implemented

✅ **Sign Up** - User registration with email/password and business details
✅ **Sign In** - User login with email/password
✅ **Sign Out** - User logout
✅ **Password Reset** - Reset password functionality (hook ready)
✅ **Auto Redirect** - Automatic redirect to dashboard on successful login
✅ **Error Handling** - User-friendly error messages
✅ **Success Messages** - Confirmation messages for successful actions
✅ **Form Validation** - Client-side validation for all forms

## Authentication Hook Usage

The `useAuth` hook provides the following methods:

```typescript
const { user, loading, signUp, signIn, signOut, resetPassword } = useAuth();

// Sign up a new user
await signUp({
  email: 'user@example.com',
  password: 'password123',
  fullName: 'John Doe',
  mobileNumber: '+91 9876543210',
  businessType: 'retailer',
  businessName: 'My Store',
  gstNumber: '27AABCT1234H1Z0',
  city: 'Mumbai'
});

// Sign in
await signIn({
  email: 'user@example.com',
  password: 'password123'
});

// Sign out
await signOut();

// Reset password
await resetPassword('user@example.com');
```

## Troubleshooting

### Issue: "Invalid API key"
- Double-check your `.env.local` file
- Ensure you're using the **anon public** key, not the service role key
- Restart your development server after adding environment variables

### Issue: "Email not confirmed"
- Check Supabase **Authentication** → **Settings**
- Disable "Confirm email" if you want to skip email verification during development
- Or check your email inbox for the confirmation link

### Issue: "Redirect not working"
- Verify the redirect URLs in Supabase **Authentication** → **URL Configuration**
- Ensure the URLs match exactly (including protocol and port)

### Issue: "User not redirecting to dashboard"
- Check browser console for errors
- Verify the `/dashboard` route exists in your app
- Ensure the `useAuth` hook is properly imported

## Security Best Practices

1. ✅ Never commit `.env.local` to version control
2. ✅ Use Row Level Security (RLS) policies in Supabase
3. ✅ Validate user input on both client and server
4. ✅ Use HTTPS in production
5. ✅ Implement rate limiting for authentication endpoints
6. ✅ Enable email confirmation for production
7. ✅ Use strong password requirements

## Next Steps

- [ ] Set up user profiles table
- [ ] Add password strength indicator
- [ ] Implement "Remember Me" functionality
- [ ] Add social authentication (Google, GitHub, etc.)
- [ ] Set up email verification flow
- [ ] Add two-factor authentication (2FA)
- [ ] Create password reset page
- [ ] Add protected routes middleware

## Support

For more information, visit:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Documentation](https://nextjs.org/docs)
