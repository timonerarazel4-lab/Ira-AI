# Firebase Setup Guide for Ira AI

## Why Firebase?
Firebase provides:
- ✅ Free authentication (login/signup)
- ✅ Free database (Firestore) to store chat history
- ✅ No backend server needed
- ✅ Works great on mobile
- ✅ Scalable and reliable

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `ira-ai-chat-app`
4. Click "Continue"
5. Disable Google Analytics (optional) - click "Create project"
6. Wait for project creation to complete

## Step 2: Enable Authentication

1. In Firebase Console, click your project
2. Go to **Authentication** (left menu)
3. Click "Get started"
4. Select "Email/Password"
5. Toggle "Enable"
6. Click "Save"

## Step 3: Create Firestore Database

1. Go to **Firestore Database** (left menu)
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select your region (closest to you)
5. Click "Create"

## Step 4: Get Your Firebase Config

1. Go to **Project Settings** (⚙️ icon, top left)
2. Scroll to "Your apps" section
3. Click "Web" (</> icon)
4. Copy your Firebase config
5. Update the `firebaseConfig` in [src/chat.js](../src/chat.js)

Your config should look like:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## Step 5: Set Firestore Rules (Security)

1. In Firestore Database, go to **Rules**
2. Replace with this:
```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/chats/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```
3. Click "Publish"

## Step 6: Deploy Ira

Now you can deploy Ira to production on Vercel:

1. Push your changes to GitHub:
```bash
git add .
git commit -m "Add Firebase authentication and chat history"
git push
```

2. Go to [Vercel](https://vercel.com)
3. Import your Ira-AI GitHub repo
4. Deploy! 🚀

Your app will be live at something like: `ira-ai.vercel.app`

## Step 7: Use Ira!

On your iPhone:
1. Open your Ira app URL
2. Sign up with email and password
3. Add your OpenAI API key in settings
4. Start chatting!
5. Click 📋 to view saved conversations

## Testing Locally

Before deploying, test on your computer:

```bash
node server.js
```

Then visit `http://localhost:3000` in your browser.

## Troubleshooting

**"Firebase is not defined"**
- Make sure the Firebase SDK is loading in index.html
- Check browser console (F12) for errors

**"Cannot read property 'auth' of undefined"**
- Verify firebaseConfig is correct in chat.js
- Check that Firebase project is created

**"Permission denied" when saving chats**
- Make sure Firestore Rules are published correctly
- Check that user is authenticated

**Chat history not loading**
- Verify Firestore database is created
- Check that you're logged in
- Look at browser console for errors

## Firebase Free Tier Limits

- 50,000 reads/day (free)
- 20,000 writes/day (free)
- 1 GB storage (free)

These limits are plenty for personal use! If you exceed them, you'll be notified before charges apply.

## Next Steps

After Firebase is set up:
1. Update [chat.js](../src/chat.js) with your config
2. Commit and push to GitHub
3. Deploy to Vercel
4. Share your Ira app with friends! 🎉

Need help? Check the [README](../README.md) or [QUICKSTART](../QUICKSTART.md).
