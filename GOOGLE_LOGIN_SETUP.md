# Google Login Setup Guide

Your MyPokéDex GO app now has Google login functionality set up with Firebase! Here's how to complete the configuration:

## 🔥 Firebase Setup

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or use an existing one
3. Enable Google Analytics (optional)
4. Wait for the project to be created

### 2. Enable Authentication
1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click on the **Sign-in method** tab
3. Enable **Google** as a sign-in provider
4. Add your domain to authorized domains:
   - `localhost` (for development)
   - Your production domain when you deploy

### 3. Get Your Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select **Web** (</>) 
4. Register your app with a nickname (e.g., "MyPokedex GO")
5. Copy the configuration object

### 4. Update Environment Variables
Edit your `.env.local` file and replace the placeholder values with your actual Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🎮 Demo Mode
If you want to test without setting up Firebase:
- Keep `NEXT_PUBLIC_FIREBASE_API_KEY=demo` in your `.env.local`
- The app will run in demo mode with mock authentication

## 🚀 How to Use

### Available Routes:
- `/` - Home page (redirects to login or dashboard)
- `/login` - Google login page
- `/dashboard` - Main app (requires authentication)

### Components Available:
- `GoogleLoginSection` - Complete login/logout UI component
- `useAuth()` hook - Access user state and auth functions

### Example Usage:
```tsx
import { useAuth } from "@/contexts/AuthContext"
import GoogleLoginSection from "@/components/GoogleLoginSection"

function MyComponent() {
  const { user, loading, signInWithGoogle, logout } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  if (!user) {
    return <GoogleLoginSection />
  }
  
  return (
    <div>
      <h1>Welcome, {user.displayName}!</h1>
      <button onClick={logout}>Sign Out</button>
    </div>
  )
}
```

## 🔧 Testing
1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. You'll be redirected to `/login`
4. Click "Sign in with Google"
5. If Firebase is configured: real Google login
6. If in demo mode: creates a mock user

## 🛠️ Troubleshooting

### Common Issues:
1. **"Firebase not configured"** - Check your `.env.local` file
2. **"Unauthorized domain"** - Add your domain in Firebase console
3. **Popup blocked** - Allow popups for your domain
4. **Network errors** - Check internet connection and Firebase status

### Getting Help:
- Check browser console for detailed error messages
- Verify Firebase configuration in the console
- Ensure all environment variables are properly set

## ✅ Next Steps
Your Google login is ready! You can now:
- Customize the login UI styling
- Add user profile management
- Implement user data persistence
- Add more authentication providers (optional)

Happy coding! 🎯
