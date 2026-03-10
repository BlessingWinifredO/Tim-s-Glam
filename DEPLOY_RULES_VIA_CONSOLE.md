## Quick Firestore Rules Deployment via Firebase Console

### Steps to Deploy Rules:

1. **Go to Firebase Console**
   - Open: https://console.firebase.google.com/
   - Select your project: `tims-glam`

2. **Navigate to Firestore**
   - Click: **Firestore Database** (left sidebar)

3. **Deploy the Rules**
   - Click the **Rules** tab at the top
   - Click **Edit Rules** button
   - Clear the existing rules
   - Copy the entire content from: `firestore.rules` (in your project root)
   - Paste it into the editor
   - Click **Publish**

### Rules to Copy (from your firestore.rules file):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Products collection - allow authenticated users to read/write
    match /products/{productId} {
      allow read: if true; // Anyone can read products
      allow write: if request.auth != null; // Only authenticated users can write
      allow delete: if request.auth != null; // Only authenticated users can delete
    }
    
    // Orders collection - allow public read for admin dashboard
    match /orders/{orderId} {
      allow read: if true; // Allow public read (admin needs access without Firebase auth)
      allow write: if request.auth != null; // Only authenticated users can write
      allow delete: if request.auth != null; // Only authenticated users can delete
    }
    
    // App Settings collection
    match /appSettings/{settingId} {
      allow read: if true; // Anyone can read settings
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Verification codes - allow read/write for email verification
    match /verificationCodes/{email} {
      allow read, write: if true; // Allow unauthenticated access for verification
      // Note: In production, consider adding IP-based rate limiting
    }
    
    // Password reset codes - allow read/write for password reset
    match /resetCodes/{email} {
      allow read, write: if true; // Allow unauthenticated access for reset
      // Note: In production, consider adding IP-based rate limiting
    }
    
    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. **Verify Deployment**
   - Look for a green checkmark ✓
   - Rules should now be live!
   - Test by trying to sign up a new user

### After Rules are Deployed:

return to development and continue with features. The verification code flow should now work!
