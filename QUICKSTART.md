# Quick Start Guide - Ira AI

## 🚀 Features

Ira now has **login & chat history saving!** 🎉

- ✅ Create an account and save chats across devices
- ✅ View all your previous conversations
- ✅ Continue conversations anytime
- ✅ Works on mobile (iPhone, Android, etc.)

## Step 1: Set Up Firebase (One-time setup)

Firebase stores your account and chat history for free.

**→ [Follow the Firebase Setup Guide](./FIREBASE_SETUP.md)**

This takes ~5 minutes. Once done, come back here!

## Step 2: Start the Server

```bash
node server.js
```

Then open `http://localhost:3000` in your browser (or your phone's IP:3000)

## Step 3: Sign Up or Login

1. On the login page, click "Sign Up"
2. Enter email, password (6+ chars), and name
3. Click "Create Account"
4. You're in! 🎉

## Step 4: Add Your OpenAI API Key

1. Click ⚙️ (settings)
2. Paste your OpenAI API key
3. Choose your model (GPT-3.5 or GPT-4)
4. Click outside the modal

**Get your API key from:** https://platform.openai.com/api-keys

## Step 5: Start Chatting!

Type messages and chat with Ira. Your conversation is automatically tracked.

## Saving Your Chat

To save a conversation:
1. Click ⚙️ (settings)
2. Enter a name (e.g., "Coding Help")
3. Click "Save"

## Viewing Your Chats

Click 📋 (history) to see all your saved conversations.

## Profile & Logout

Click 👤 to see your profile and logout.

## 💬 Example Prompts

- "Explain quantum computing like I'm 5"
- "Write a Python function to check if a number is prime"
- "Help me brainstorm startup ideas"
- "What are best practices for React?"
- "Tell me a joke"

## 📱 On Your iPhone

1. Deploy Ira to Vercel (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))
2. Open the Vercel URL on your iPhone
3. Sign up and start chatting!

## 🆘 Troubleshooting

**"Login page keeps showing"**
- Check browser console (F12) for Firebase errors
- Make sure firebaseConfig is set correctly in `src/chat.js`

**"Can't save chat"**
- Make sure you're logged in
- Check Firebase Firestore is created and Rules are published
- See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

**"Chat not loading"**
- Try refreshing the page
- Check browser console for errors

**"OpenAI error"**
- Verify your API key is valid
- Check you have credits on your OpenAI account

## 🚀 Deploy to Production

When you're ready to use on your iPhone permanently:

1. Commit your changes: `git add . && git commit -m "Firebase setup"`
2. Push to GitHub: `git push`
3. Go to [Vercel](https://vercel.com) and deploy
4. Share your app URL with friends! 🎉

## Next Steps

- Read [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed Firebase config
- Check [README.md](./README.md) for full documentation
- Deploy to Vercel for mobile access

Enjoy chatting with Ira! 🤖💬

