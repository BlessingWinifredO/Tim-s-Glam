# Email Verification & Password Reset System

This application uses a code-based verification system for email verification and password reset.

## How It Works

### Email Verification Flow
1. User signs up with email and password
2. A 6-digit verification code is generated and stored in Firestore (`verificationCodes` collection)
3. User is redirected to `/verify-email` page to enter the code
4. After entering the correct code, user is marked as verified and can sign in

### Password Reset Flow
1. User clicks "Forgot password?" on sign-in page
2. Redirected to `/forgot-password` page to enter email
3. A 6-digit reset code is generated and stored in Firestore (`resetCodes` collection)
4. User is redirected to `/reset-password` page to enter code and new password
5. After verification, password is reset

## Current Implementation Status

### ✅ Completed
- Code generation and storage in Firestore
- Verification pages UI
- Code validation logic
- Email verification workflow
- Password reset UI workflow

### ⚠️ Requires Configuration
- **Email service**: Codes are currently logged to console only
- **Firebase Admin SDK**: Required for password reset functionality
- **Firestore Rules**: Need to allow access to verification and reset code collections

## Setting Up Email Sending

### Step 1: Install Dependencies
```bash
# Install email service (choose one)
npm install nodemailer          # For SMTP
npm install @sendgrid/mail      # For SendGrid
npm install mailgun-js          # For Mailgun
```

### Step 2: Configure Environment Variables
Create/update `.env.local`:
```env
# Email Service Configuration
EMAIL_SERVICE=sendgrid           # or smtp, mailgun
EMAIL_FROM=noreply@yourdomain.com

# SendGrid
SENDGRID_API_KEY=your_sendgrid_key

# OR SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Step 3: Create Email API Routes
Update these files to send emails:
- `src/context/AuthContext.js` (search for TODO comments)
- Create email templates for verification and reset codes

### Step 4: Set Up Firebase Admin SDK (for Password Reset)

#### Install Firebase Admin
```bash
npm install firebase-admin
```

#### Create Service Account
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Project Settings → Service Accounts
3. Generate new private key
4. Save the JSON file securely (DO NOT commit to git)

#### Create Admin Config
Create `src/lib/firebase-admin.js`:
```javascript
import admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

export const adminAuth = admin.auth()
export const adminDb = admin.firestore()
```

#### Update Password Reset API
Edit `src/app/api/reset-password/route.js`:
```javascript
import { adminAuth } from '@/lib/firebase-admin'

export async function POST(request) {
  const { email, newPassword } = await request.json()
  
  try {
    const user = await adminAuth.getUserByEmail(email)
    await adminAuth.updateUser(user.uid, { password: newPassword })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

#### Add Environment Variables
```env
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

### Step 5: Update Firestore Security Rules

Add these rules to allow verification code access:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Verification codes
    match /verificationCodes/{email} {
      allow read, write: if true; // Temporarily permissive for testing
      // In production, add user authentication checks
    }
    
    // Reset codes
    match /resetCodes/{email} {
      allow read, write: if true; // Temporarily permissive for testing
      // In production, add user authentication checks
    }
    
    // ... rest of your rules
  }
}
```

## Testing (Development Mode)

For testing without email service:
1. Sign up as a new user
2. Check browser console for the verification code
3. Check Firestore console for stored codes in `verificationCodes` collection
4. Use the code on the verification page

## Security Considerations

### Production Recommendations:
1. **Never log codes to console** - Remove all `console.log` statements
2. **Rate limiting** - Implement limits on code generation requests
3. **Code expiration** - Codes expire in 10 minutes (already implemented)
4. **One-time use** - Codes can only be used once (already implemented)
5. **Firestore rules** - Restrict access to authenticated users only
6. **HTTPS only** - Ensure all traffic uses HTTPS
7. **Environment variables** - Never commit sensitive keys to git

## Troubleshooting

### Codes not generating
- Check Firestore rules allow writes to `verificationCodes` and `resetCodes`
- Check browser console for errors

### Email not sending
- Verify email service configuration in `.env.local`
- Check API key/credentials are correct
- Look at server logs for email sending errors

### Password reset fails
- Ensure Firebase Admin SDK is configured
- Check service account has proper permissions
- Verify environment variables are loaded correctly

## Files Modified/Created

- `/src/app/verify-email/page.js` - Email verification page
- `/src/app/forgot-password/page.js` - Forgot password page
- `/src/app/reset-password/page.js` - Reset password page
- `/src/app/api/reset-password/route.js` - Password reset API
- `/src/context/AuthContext.js` - Updated auth functions
- `/src/app/account/page.js` - Updated sign-in/signup flow

## Next Steps

1. Configure email service for production
2. Set up Firebase Admin SDK
3. Update Firestore security rules
4. Test complete flow end-to-end
5. Remove console.log statements
6. Add rate limiting
7. Set up monitoring/logging
