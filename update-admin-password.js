const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin with credentials from env
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  ?.replace(/^"|"$/g, '')
  .replace(/\\\\n/g, '\n')
  .replace(/\\n/g, '\n')
  .replace(/\r/g, '');

console.log('🔍 Checking credentials...');
console.log('Project ID:', projectId ? '✅' : '❌');
console.log('Client Email:', clientEmail ? '✅' : '❌');
console.log('Private Key:', privateKey ? '✅ (length: ' + privateKey.length + ')' : '❌');

if (!projectId || !clientEmail || !privateKey) {
  console.error('❌ Missing Firebase Admin credentials');
  process.exit(1);
}

const serviceAccount = {
  projectId,
  clientEmail,
  privateKey,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminEmail = 'winniewizzyb@gmail.com';
const newPassword = 'Wini123&&&1';

async function updateAdminPassword() {
  try {
    console.log(`🔄 Updating password for ${adminEmail}...`);
    
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(adminEmail);
    console.log(`✅ Found user: ${userRecord.uid}`);
    
    // Update password
    await admin.auth().updateUser(userRecord.uid, {
      password: newPassword,
    });
    
    console.log(`✅ Password updated successfully!`);
    console.log(`📧 Admin Email: ${adminEmail}`);
    console.log(`🔑 New Password: ${newPassword}`);
    console.log(`\n🎯 Ready to test admin signin at: http://localhost:3001/admin-signin`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating password:', error.message);
    process.exit(1);
  }
}

updateAdminPassword();
