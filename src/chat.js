// Ira AI Chat Application with Firebase Authentication

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAkO3R5evKFfV3kRhB_bvXkhwR89r1PIZg",
    authDomain: "ira-chat-ai.firebaseapp.com",
    projectId: "ira-chat-ai",
    storageBucket: "ira-chat-ai.firebasestorage.app",
    messagingSenderId: "330951731036",
    appId: "1:330951731036:web:f4d225ebba75b519e80399",
    measurementId: "G-0GYFHT1449"
};

// Global variables for Firebase
let auth;
let db;
let firebaseReady = false;

// Initialize Firebase with proper error handling
function initializeFirebase() {
    try {
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase SDK not loaded');
            setTimeout(initializeFirebase, 500); // Retry after 500ms
            return;
        }
        
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
        
        auth = firebase.auth();
        db = firebase.firestore();
        firebaseReady = true;
        console.log('✅ Firebase initialized successfully');
        
        // Start the chat app after Firebase is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startChatApp);
        } else {
            startChatApp();
        }
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        console.error('Error details:', error.message);
    }
}

class IraChat {
    constructor() {
        console.log('📱 Initializing IraChat class...');
        
        this.apiKey = localStorage.getItem('ira_api_key') || '';
        this.model = localStorage.getItem('ira_model') || 'gpt-3.5-turbo';
        this.temperature = parseFloat(localStorage.getItem('ira_temperature') || '0.7');
        this.conversationHistory = [];
        this.isLoading = false;
        this.currentUser = null;
        this.currentChatId = null;

        this.initializeElements();
        this.setupAuthListener();
        this.setupAuthTabListeners();
        
        console.log('✅ IraChat initialized');
    }

    initializeElements() {
        console.log('🔍 Initializing DOM elements...');
        
        // Auth elements
        this.authModal = document.getElementById('authModal');
        this.chatContainer = document.getElementById('chatContainer');
        
        if (!this.authModal) {
            console.error('❌ authModal not found!');
        } else {
            console.log('✅ authModal found');
        }
        
        if (!this.chatContainer) {
            console.error('❌ chatContainer not found!');
        } else {
            console.log('✅ chatContainer found');
        }
        
        // Login elements
        this.loginEmailInput = document.getElementById('loginEmail');
        this.loginPasswordInput = document.getElementById('loginPassword');
        this.loginBtn = document.getElementById('loginBtn');
        this.loginError = document.getElementById('loginError');

        // Signup elements
        this.signupEmailInput = document.getElementById('signupEmail');
        this.signupPasswordInput = document.getElementById('signupPassword');
        this.signupNameInput = document.getElementById('signupName');
        this.signupBtn = document.getElementById('signupBtn');
        this.signupError = document.getElementById('signupError');

        // Chat elements
        this.messagesContainer = document.getElementById('messagesContainer');
        this.chatForm = document.getElementById('chatForm');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');

        // Button elements
        this.settingsBtn = document.getElementById('settingsBtn');
        this.historyBtn = document.getElementById('historyBtn');
        this.profileBtn = document.getElementById('profileBtn');

        // Modal elements
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
        this.historyModal = document.getElementById('historyModal');
        this.closeHistoryBtn = document.getElementById('closeHistoryBtn');
        this.profileModal = document.getElementById('profileModal');
        this.closeProfileBtn = document.getElementById('closeProfileBtn');

        // Settings elements
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.modelSelect = document.getElementById('modelSelect');
        this.temperatureInput = document.getElementById('temperatureInput');
        this.saveChatBtn = document.getElementById('saveChatBtn');
        this.saveChatName = document.getElementById('saveChatName');

        // Profile elements
        this.userEmail = document.getElementById('userEmail');
        this.userName = document.getElementById('userName');
        this.userSince = document.getElementById('userSince');
        this.logoutBtn = document.getElementById('logoutBtn');

        // Tab elements
        this.tabBtns = document.querySelectorAll('.tab-btn');
        
        console.log('✅ All DOM elements initialized');
    }

    setupAuthTabListeners() {
        console.log('🔄 Setting up auth tab listeners...');
        
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Tab clicked:', e.target.dataset.tab);
                
                const tab = e.target.dataset.tab;
                
                // Remove active class from all buttons and tabs
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Add active class to corresponding tab
                const tabContent = document.getElementById(tab + 'Tab');
                if (tabContent) {
                    tabContent.classList.add('active');
                    console.log('✅ Switched to', tab, 'tab');
                } else {
                    console.error('❌ Tab content not found:', tab + 'Tab');
                }
            });
        });
    }

    setupAuthListener() {
        console.log('🔐 Setting up auth listener...');
        
        if (!firebaseReady) {
            console.error('❌ Firebase not ready');
            if (this.authModal) {
                this.authModal.classList.add('active');
            }
            if (this.chatContainer) {
                this.chatContainer.style.display = 'none';
            }
            return;
        }

        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('✅ User logged in:', user.email);
                this.currentUser = user;
                if (this.authModal) {
                    this.authModal.classList.remove('active');
                }
                if (this.chatContainer) {
                    this.chatContainer.style.display = 'flex';
                }
                this.setupChatListeners();
                this.loadSettings();
                this.showNewChatWelcome();
            } else {
                console.log('ℹ️ User not authenticated');
                this.currentUser = null;
                if (this.authModal) {
                    this.authModal.classList.add('active');
                }
                if (this.chatContainer) {
                    this.chatContainer.style.display = 'none';
                }
            }
        });
    }

    setupChatListeners() {
        this.chatForm.addEventListener('submit', (e) => this.handleSendMessage(e));
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.historyBtn.addEventListener('click', () => this.openHistory());
        this.closeHistoryBtn.addEventListener('click', () => this.closeHistory());
        this.profileBtn.addEventListener('click', () => this.openProfile());
        this.closeProfileBtn.addEventListener('click', () => this.closeProfile());
        this.saveChatBtn.addEventListener('click', () => this.saveCurrentChat());
        this.logoutBtn.addEventListener('click', () => this.logout());

        // Auto-save settings
        this.apiKeyInput.addEventListener('change', () => this.saveSettings());
        this.modelSelect.addEventListener('change', () => this.saveSettings());
        this.temperatureInput.addEventListener('change', () => this.saveSettings());

        // Auth modal listeners
        this.loginBtn.addEventListener('click', () => this.handleLogin());
        this.signupBtn.addEventListener('click', () => this.handleSignup());

        // Modal closing
        if (this.settingsModal) {
            this.settingsModal.addEventListener('click', (e) => {
                if (e.target === this.settingsModal) this.closeSettings();
            });
        }
        if (this.historyModal) {
            this.historyModal.addEventListener('click', (e) => {
                if (e.target === this.historyModal) this.closeHistory();
            });
        }
        if (this.profileModal) {
            this.profileModal.addEventListener('click', (e) => {
                if (e.target === this.profileModal) this.closeProfile();
            });
        }
    }

    async handleLogin() {
        console.log('🔐 Login attempt...');
        const email = this.loginEmailInput.value.trim();
        const password = this.loginPasswordInput.value.trim();

        if (!email || !password) {
            this.loginError.textContent = 'Please fill in all fields';
            return;
        }

        try {
            await auth.signInWithEmailAndPassword(email, password);
            this.loginEmailInput.value = '';
            this.loginPasswordInput.value = '';
            this.loginError.textContent = '';
            console.log('✅ Login successful');
        } catch (error) {
            console.error('❌ Login error:', error.message);
            this.loginError.textContent = error.message;
        }
    }

    async handleSignup() {
        console.log('📝 Signup attempt...');
        const email = this.signupEmailInput.value.trim();
        const password = this.signupPasswordInput.value.trim();
        const name = this.signupNameInput.value.trim();

        if (!email || !password || !name) {
            this.signupError.textContent = 'Please fill in all fields';
            return;
        }

        if (password.length < 6) {
            this.signupError.textContent = 'Password must be at least 6 characters';
            return;
        }

        try {
            await auth.createUserWithEmailAndPassword(email, password);
            await auth.currentUser.updateProfile({ displayName: name });
            
            this.signupEmailInput.value = '';
            this.signupPasswordInput.value = '';
            this.signupNameInput.value = '';
            this.signupError.textContent = '';
            console.log('✅ Signup successful');
        } catch (error) {
            console.error('❌ Signup error:', error.message);
            this.signupError.textContent = error.message;
        }
    }

    openSettings() {
        if (this.settingsModal) {
            this.settingsModal.classList.add('active');
        }
    }

    closeSettings() {
        if (this.settingsModal) {
            this.settingsModal.classList.remove('active');
        }
    }

    openHistory() {
        if (this.historyModal) {
            this.historyModal.classList.add('active');
            this.loadChatHistory();
        }
    }

    closeHistory() {
        if (this.historyModal) {
            this.historyModal.classList.remove('active');
        }
    }

    openProfile() {
        if (this.profileModal) {
            this.profileModal.classList.add('active');
            this.displayProfile();
        }
    }

    closeProfile() {
        if (this.profileModal) {
            this.profileModal.classList.remove('active');
        }
    }

    displayProfile() {
        this.userEmail.textContent = this.currentUser.email;
        this.userName.textContent = this.currentUser.displayName || 'Not set';
        const createdDate = new Date(this.currentUser.metadata.creationTime).toLocaleDateString();
        this.userSince.textContent = createdDate;
    }

    async loadChatHistory() {
        const historyList = document.getElementById('chatHistoryList');
        historyList.innerHTML = '<p class="text-light">Loading...</p>';

        try {
            const snapshot = await db.collection('users').doc(this.currentUser.uid)
                .collection('chats').orderBy('timestamp', 'desc').get();

            if (snapshot.empty) {
                historyList.innerHTML = '<p class="text-light">No saved conversations yet</p>';
                return;
            }

            historyList.innerHTML = '';
            snapshot.forEach((doc) => {
                const data = doc.data();
                const date = new Date(data.timestamp.toDate()).toLocaleString();
                const item = document.createElement('div');
                item.className = 'history-item';
                item.innerHTML = `
                    <div class="history-item-title">${data.name}</div>
                    <div class="history-item-date">${date}</div>
                    <button class="history-item-delete" onclick="window.ira.deleteChat('${doc.id}')">🗑️</button>
                `;
                item.addEventListener('click', () => this.loadChat(doc.id));
                historyList.appendChild(item);
            });
        } catch (error) {
            historyList.innerHTML = `<p class="text-light">Error: ${error.message}</p>`;
        }
    }

    async saveCurrentChat() {
        const chatName = this.saveChatName.value.trim();
        
        if (!chatName) {
            this.showNotification('❌ Please enter a name for the chat');
            return;
        }

        if (this.conversationHistory.length === 0) {
            this.showNotification('❌ No messages to save');
            return;
        }

        try {
            await db.collection('users').doc(this.currentUser.uid)
                .collection('chats').add({
                    name: chatName,
                    messages: this.conversationHistory,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });

            this.saveChatName.value = '';
            this.closeSettings();
            this.showNotification('✅ Chat saved successfully!');
        } catch (error) {
            this.showNotification('❌ Error saving chat: ' + error.message);
        }
    }

    async loadChat(chatId) {
        try {
            const doc = await db.collection('users').doc(this.currentUser.uid)
                .collection('chats').doc(chatId).get();

            if (doc.exists) {
                this.conversationHistory = doc.data().messages || [];
                this.currentChatId = chatId;
                this.messagesContainer.innerHTML = '';
                
                this.conversationHistory.forEach((msg) => {
                    this.addMessageToUI(msg.role, msg.content);
                });

                this.closeHistory();
                this.showNotification('✅ Chat loaded!');
            }
        } catch (error) {
            this.showNotification('❌ Error loading chat: ' + error.message);
        }
    }

    async deleteChat(chatId) {
        if (confirm('Are you sure you want to delete this chat?')) {
            try {
                await db.collection('users').doc(this.currentUser.uid)
                    .collection('chats').doc(chatId).delete();
                this.loadChatHistory();
                this.showNotification('✅ Chat deleted');
            } catch (error) {
                this.showNotification('❌ Error deleting chat: ' + error.message);
            }
        }
    }

    async logout() {
        try {
            await auth.signOut();
            this.conversationHistory = [];
            this.currentChatId = null;
        } catch (error) {
            this.showNotification('❌ Error logging out: ' + error.message);
        }
    }

    loadSettings() {
        this.apiKeyInput.value = this.apiKey;
        this.modelSelect.value = this.model;
        this.temperatureInput.value = this.temperature;
    }

    saveSettings() {
        this.apiKey = this.apiKeyInput.value;
        this.model = this.modelSelect.value;
        this.temperature = parseFloat(this.temperatureInput.value);

        localStorage.setItem('ira_api_key', this.apiKey);
        localStorage.setItem('ira_model', this.model);
        localStorage.setItem('ira_temperature', this.temperature);

        this.showNotification('⚙️ Settings saved!');
    }

    showNewChatWelcome() {
        this.conversationHistory = [];
        this.currentChatId = null;
        this.messagesContainer.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">💬</div>
                <h2>Welcome to Ira</h2>
                <p>Start a conversation with your AI assistant. Your chats will be saved for later!</p>
            </div>
        `;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #10a37f;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 2000;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease-in-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    async handleSendMessage(e) {
        e.preventDefault();

        const message = this.messageInput.value.trim();
        if (!message) return;

        if (!this.apiKey) {
            this.showNotification('❌ Please add your OpenAI API key in settings');
            this.openSettings();
            return;
        }

        this.messageInput.value = '';
        this.sendBtn.disabled = true;
        this.isLoading = true;

        this.addMessageToUI('user', message);

        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        this.showLoadingIndicator();

        try {
            const response = await this.getAIResponse();
            this.removeLoadingIndicator();
            this.addMessageToUI('ai', response);
            this.conversationHistory.push({
                role: 'assistant',
                content: response
            });
        } catch (error) {
            this.removeLoadingIndicator();
            console.error('Error:', error);
            this.addMessageToUI('ai', `❌ Error: ${error.message}`);
        } finally {
            this.sendBtn.disabled = false;
            this.isLoading = false;
            this.messageInput.focus();
        }
    }

    async getAIResponse() {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: this.conversationHistory,
                temperature: this.temperature,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to get response from OpenAI');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    addMessageToUI(role, content) {
        const welcome = this.messagesContainer.querySelector('.welcome-message');
        if (welcome) welcome.remove();

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = this.formatMessageContent(content);

        messageDiv.appendChild(contentDiv);
        this.messagesContainer.appendChild(messageDiv);

        this.scrollToBottom();
    }

    formatMessageContent(content) {
        let html = content;

        html = html.replace(/&/g, '&amp;')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;');

        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        html = html.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*([\s\S]*?)\*/g, '<em>$1</em>');
        html = html.replace(/\n/g, '<br>');
        html = html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match, code) => {
            code = code.replace(/<br>/g, '\n');
            return `<pre><code>${code}</code></pre>`;
        });

        return html;
    }

    showLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.id = 'loadingIndicator';
        loadingDiv.innerHTML = '<span></span><span></span><span></span>';
        this.messagesContainer.appendChild(loadingDiv);
        this.scrollToBottom();
    }

    removeLoadingIndicator() {
        const loading = document.getElementById('loadingIndicator');
        if (loading) loading.remove();
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 0);
    }
}

// Function to start the chat app
function startChatApp() {
    console.log('🚀 Starting chat app...');
    if (!window.ira) {
        window.ira = new IraChat();
    }
}

// Prevent accidental page navigation
window.addEventListener('beforeunload', (e) => {
    if (window.ira && window.ira.conversationHistory.length > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Initialize Firebase when this script loads
console.log('📄 chat.js loaded, initializing Firebase...');
initializeFirebase();
