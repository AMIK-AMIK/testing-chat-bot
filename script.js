



// API Configuration
const API_KEY = 'AIzaSyBGsa5xDVK7bFH6XRF4bGiTH2zh9DIualM';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// AMIK Info
const AMIK_INFO = {
    name: 'AMIK AI ASSISTANT',
    displayName: 'AMIK CHATBOT',
    company: 'AMIK',
    developer: 'ABDULLAH FAROOQ',
    responses: {
        // Identity responses
        'who are you': 'I am AMIK AI ASSISTANT, your intelligent chatbot companion.',
        'what is your name': 'I am AMIK AI ASSISTANT, but you can also call me AMIK CHATBOT.',
        'who made you': 'I was created by AMIK.',
        'who is your developer': 'AMIK developed me.',
        'who created you': 'AMIK created me.',
        'what company': 'AMIK.',
        'what is amik': 'AMIK is a technology company focused on AI development. I am their AI assistant, AMIK AI ASSISTANT.',
        'tell me about amik': 'AMIK is a company specializing in artificial intelligence and software development. I am their AI assistant, designed to help users with various tasks.',
        'about amik': 'AMIK is a company specializing in artificial intelligence and software development. I am their AI assistant, AMIK AI ASSISTANT.',
        
        // Fun and entertainment
        'tell me a joke': "Here's a tech joke: Why do programmers prefer dark mode? Because light attracts bugs! 😄",
        'share an interesting fact': "Here's an interesting fact: The first computer mouse was made of wood in the 1960s by Doug Engelbart!",
        'tell me something interesting': "Did you know? The first website ever created is still online! You can visit it at info.cern.ch.",
        
        // Productivity and motivation
        'productivity tips': "Here are some productivity tips:\n1. Use the 2-minute rule: If a task takes less than 2 minutes, do it now\n2. Break large tasks into smaller, manageable chunks\n3. Take regular breaks using the Pomodoro Technique\n4. Keep a clear and organized workspace\n5. Set specific goals for each day",
        'how to stay motivated': "Here are ways to stay motivated:\n1. Break your goals into smaller milestones\n2. Celebrate small wins\n3. Create a routine and stick to it\n4. Take regular breaks\n5. Remind yourself of your 'why'\n6. Stay organized with a to-do list",
        
        // Tech and health
        'latest tech trends': "Some current tech trends include:\n1. Artificial Intelligence and Machine Learning\n2. Extended Reality (AR/VR/MR)\n3. Edge Computing\n4. Cybersecurity Advancement\n5. Sustainable Technology\n6. Internet of Things (IoT)",
        'healthy eating tips': "Here are some healthy eating tips:\n1. Eat plenty of fruits and vegetables\n2. Choose whole grains over refined grains\n3. Stay hydrated with water\n4. Limit processed foods\n5. Practice portion control\n6. Plan your meals ahead"
    }
};

// Welcome messages array with translations
const WELCOME_MESSAGES = {
    en: [
        "Hello! I'm AMIK AI ASSISTANT, how can I help you today?",
        "Hi there! I'm AMIK CHATBOT, what would you like to talk about?",
        "Hello! I'm AMIK AI ASSISTANT, here to assist you. What's on your mind?",
        "Welcome! I'm AMIK CHATBOT, how may I help you today?",
        "Hi! I'm AMIK AI ASSISTANT, ready to help. What would you like to discuss?"
    ],
    ur: [
        "السلام علیکم! میں AMIK AI ASSISTANT ہوں، آج میں آپ کی کیا مدد کر سکتا ہوں؟",
        "السلام علیکم! میں AMIK CHATBOT ہوں، آپ کس بارے میں بات کرنا چاہیں گے؟",
        "السلام علیکم! میں AMIK AI ASSISTANT ہوں، آپ کی خدمت کے لیے حاضر ہوں۔ آپ کے ذہن میں کیا ہے؟",
        "خوش آمدید! میں AMIK CHATBOT ہوں، آج میں آپ کی کیا مدد کر سکتا ہوں؟",
        "السلام علیکم! میں AMIK AI ASSISTANT ہوں، مدد کے لیے تیار ہوں۔ آپ کیا بات کرنا چاہیں گے؟"
    ],
    zh: [
        "你好!我是 AMIK AI 助理,今天我能帮您什么?",
        "您好!我是 AMIK 聊天机器人,您想聊些什么?",
        "你好!我是 AMIK AI 助理,很高兴为您服务。您在想什么?",
        "欢迎!我是 AMIK 聊天机器人,今天我能为您做些什么?",
        "嗨!我是 AMIK AI 助理,随时准备帮助您。您想讨论什么?"
    ]
};

// Function to get welcome message in current language
const getWelcomeMessage = () => {
    const lang = localStorage.getItem('selectedLanguage') || 'en';
    const messages = WELCOME_MESSAGES[lang];
    return messages[Math.floor(Math.random() * messages.length)];
};

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');
const pauseButton = document.getElementById('pause-btn');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');
const newChatButton = document.getElementById('new-chat');
const savedChatsList = document.getElementById('saved-chats-list');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const menuToggleBtn = document.getElementById('menu-toggle');
const chatContainer = document.querySelector('.chat-container');

// Typing control state
let isTyping = false;
let isPaused = false;
let currentTypingIndex = 0;
let currentTypingText = '';
let currentContentDiv = null;

// Typing effect function with real pause capability
async function typeText(element, text, speed = 30) {
    currentTypingText = text;
    currentTypingIndex = 0;
    currentContentDiv = element;
    element.textContent = '';
    isTyping = true;
    isPaused = false;
    
    // Show pause button
    pauseButton.classList.remove('hidden');
    pauseButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
            <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
        </svg>
    `;
    
    return new Promise((resolve) => {
        function type() {
            if (isPaused) {
                return;
            }
            
            if (currentTypingIndex < currentTypingText.length) {
                element.textContent += currentTypingText.charAt(currentTypingIndex);
                currentTypingIndex++;
                setTimeout(type, speed);
            } else {
                finishTyping();
                resolve();
            }
        }
        type();
    });
}

// Function to finish typing animation
function finishTyping() {
    isTyping = false;
    isPaused = false;
    currentTypingIndex = 0;
    currentTypingText = '';
    currentContentDiv = null;
    pauseButton.classList.add('hidden');
}

// Function to toggle pause/resume typing
function toggleTyping() {
    if (!isTyping && !isPaused) return;
    
    isPaused = !isPaused;
    
    // Update button icon based on state
    if (isPaused) {
        // Change to play icon when paused
        pauseButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5v14l11-7z" fill="currentColor"/>
            </svg>
        `;
    } else {
        // Change back to pause icon and continue typing
        pauseButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
            </svg>
        `;
        // Resume typing from where we left off
        if (currentContentDiv) {
            function resumeTyping() {
                if (!isPaused && currentTypingIndex < currentTypingText.length) {
                    currentContentDiv.textContent += currentTypingText.charAt(currentTypingIndex);
                    currentTypingIndex++;
                    setTimeout(resumeTyping, 30);
                } else if (!isPaused) {
                    finishTyping();
                }
            }
            resumeTyping();
        }
    }
}

// Function to detect if text is in Urdu
function isUrduText(text) {
    // Urdu Unicode range
    const urduPattern = /[\u0600-\u06FF\u0750-\u077F]/;
    return urduPattern.test(text);
}

// Get AI response
async function getAIResponse(message) {
    const text = message.toLowerCase();
    
    // Check for AMIK-specific questions first
    for (const [key, value] of Object.entries(AMIK_INFO.responses)) {
        if (text.includes(key)) {
            // If message is in Urdu, translate the response to Urdu
            if (isUrduText(message)) {
                return getUrduResponse(value);
            }
            return value;
        }
    }
    
    // Get relevant memories
    const relevantMemories = memorySystem.getRelevantMemories(message);
    const memoryContext = relevantMemories.length > 0
        ? 'Previous relevant context:\n' + relevantMemories.map(m => m.content).join('\n')
        : '';
    
    // Get recent conversation context
    const recentContext = conversationHistory
        .slice(-5)
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');
    
    const shouldUseUrdu = isUrduText(message);
    
    // Construct the prompt with memories
    let prompt = shouldUseUrdu 
        ? `${memoryContext}\n\nRecent conversation:\n${recentContext}\n\nRespond in proper Urdu language (not mixed with Hindi). Use formal and respectful Urdu. Question: ${message}`
        : `${memoryContext}\n\nRecent conversation:\n${recentContext}\n\nAnswer this question professionally and concisely, taking into account both the previous context and memories: ${message}`;
    
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content) {
            let aiResponse = data.candidates[0].content.parts[0].text;
            
            // Add the interaction to memory
            memorySystem.addMemory(`User: ${message}\nAMIK: ${aiResponse}`);
            
            // Clean up response
            aiResponse = aiResponse
                .replace(/\*/g, '')
                .replace(/`/g, '')
                .replace(/\_/g, '')
                .replace(/\#/g, '')
                .replace(/\~\~/g, '')
                .replace(/^(Let me|I will|I'll|I can|I'm here to|I'd be happy to|As an AI|As AMIK|As AMIK AI Assistant),?\s*/gi, '')
                .replace(/google/gi, 'AMIK')
                .replace(/gemini/gi, 'AMIK')
                .replace(/bard/gi, 'AMIK')
                .replace(/openai/gi, 'AMIK');

            return aiResponse;
        }
        
        return shouldUseUrdu 
            ? 'معذرت، میں آپ کے سوال کا جواب دینے میں قاصر ہوں۔ براہ کرم دوبارہ کوشش کریں۔'
            : 'I apologize, but I am unable to provide a response. Please try again.';

    } catch (error) {
        console.error('API Error:', error);
        return shouldUseUrdu 
            ? 'معذرت، کوئی خرابی پیش آگئی ہے۔ براہ کرم دوبارہ کوشش کریں۔'
            : 'I apologize, but an error occurred. Please try again.';
    }
}

// Function to get Urdu version of predefined responses
function getUrduResponse(englishResponse) {
    const urduResponses = {
        'AMIK, an AI assistant.': 'میں AMIK ہوں، ایک اے آئی اسسٹنٹ۔',
        'I am AMIK AI ASSISTANT, your intelligent chatbot companion.': 'میں AMIK AI ASSISTANT ہوں، آپ کا ذہین چیٹ بوٹ ساتھی۔',
        'I am AMIK AI ASSISTANT, but you can also call me AMIK CHATBOT.': 'میں AMIK AI ASSISTANT ہوں، آپ مجھے AMIK CHATBOT بھی کہہ سکتے ہیں۔',
        'I was created by AMIK.': 'مجھے AMIK نے بنایا ہے۔',
        'AMIK developed me.': 'AMIK نے مجھے تیار کیا ہے۔',
        'AMIK created me.': 'AMIK نے مجھے بنایا ہے۔',
        'AMIK.': 'AMIK۔',
        'AMIK is a technology company focused on AI development.': 'AMIK ایک ٹیکنالوجی کمپنی ہے جو مصنوعی ذہانت کی ترقی پر توجہ دیتی ہے۔',
        'A technology company specializing in artificial intelligence and software development.': 'ایک ٹیکنالوجی کمپنی جو مصنوعی ذہانت اور سافٹ ویئر ڈویلپمنٹ میں مہارت رکھتی ہے۔'
    };

    return urduResponses[englishResponse] || englishResponse;
}

async function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    
    const botIcon = document.createElement('div');
    botIcon.className = 'bot-icon';
    botIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path fill="currentColor" d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Add copy button at the top
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';
    copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
        </svg>
    `;
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(message);
            copyButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" />
                </svg>
            `;
            copyButton.classList.add('copied');
            setTimeout(() => {
                copyButton.classList.remove('copied');
                copyButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                    </svg>
                `;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    });
    
    messageDiv.appendChild(botIcon);
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(copyButton);
    
    // Add copy button at the bottom
    const bottomCopyButton = document.createElement('button');
    bottomCopyButton.className = 'copy-btn bottom-copy-btn';
    bottomCopyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
        </svg>
    `;
    bottomCopyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(message);
            bottomCopyButton.classList.add('copied');
            setTimeout(() => bottomCopyButton.classList.remove('copied'), 1000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    });
    messageDiv.appendChild(bottomCopyButton);
    chatMessages.appendChild(messageDiv);
    
    try {
        await typeText(contentDiv, message);
    } catch (error) {
        console.error('Error in typing:', error);
        contentDiv.textContent = message;
    }
    
    if (!isScrollLocked) {
        scrollToBottom();
    }
    
    conversationHistory.push({
        role: 'assistant',
        content: message,
        timestamp: new Date().toISOString()
    });
    
    saveCurrentChat();
}

// Send message function
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Create new chat if none exists
    if (!currentChatId) {
        startNewChat();
    }

    // Clear input
    userInput.value = '';

    // If there's a paused message, clean it up
    if (isPaused) {
        finishTyping();
        if (currentContentDiv) {
            currentContentDiv.parentElement.remove();
        }
    }

    // Add user message
    addUserMessage(message);

    try {
        const response = await getAIResponse(message);
        await addBotMessage(response);
    } catch (error) {
        console.error('Error getting response:', error);
    }
}


// Format date for section labels
function formatDate(date) {
    const now = new Date();
    const messageDate = new Date(date);
    
    // If today
    if (messageDate.toDateString() === now.toDateString()) {
        return 'Today';
    }
    
    // If yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    
    // If this week
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    if (messageDate > weekAgo) {
        return messageDate.toLocaleDateString('en-US', { weekday: 'long' });
    }
    
    // Otherwise show full date
    return messageDate.toLocaleDateString('en-US', { 
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

// Create section divider
function createSectionDivider(date) {
    const divider = document.createElement('div');
    divider.className = 'section-divider';
    
    const label = document.createElement('span');
    label.className = 'section-label';
    label.textContent = formatDate(date);
    
    divider.appendChild(label);
    return divider;
}

// Add message with sections
function detectLanguage(text) {
    // Simple language detection based on character ranges
    const urduPattern = /[\u0600-\u06FF\u0750-\u077F]/;
    const chinesePattern = /[\u4E00-\u9FFF]/;
    
    if (urduPattern.test(text)) return 'ur';
    if (chinesePattern.test(text)) return 'zh';
    return 'en';
}

function createMessageElement(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    // Detect and set language
    const lang = detectLanguage(content);
    contentDiv.setAttribute('lang', lang);
    
    messageDiv.appendChild(contentDiv);
    return messageDiv;
}

function addMessage(message, isUser = false) {
    const messageDate = new Date();
    const lastMessage = chatMessages.lastElementChild;
    
    // Check if we need a new section
    if (!lastMessage || 
        !lastMessage.dataset.date || 
        formatDate(lastMessage.dataset.date) !== formatDate(messageDate)) {
        chatMessages.appendChild(createSectionDivider(messageDate));
    }
    
    const messageElement = createMessageElement(message, isUser);
    messageElement.dataset.date = messageDate.toISOString();
    
    chatMessages.appendChild(messageElement);
    if (!isScrollLocked) {
        scrollToBottom();
    }
}

// Update existing message functions to use new addMessage
function addUserMessage(message) {
    addMessage(message, true);
    conversationHistory.push({ role: 'user', content: message, timestamp: new Date().toISOString() });
    saveCurrentChat();
}

// Initialize variables
let savedChats = [];
let currentChatId = null;
let conversationHistory = [];

// Load chat messages with sections
function loadChatMessages(messages) {
    chatMessages.innerHTML = '';
    let currentDate = null;
    
    messages.forEach(msg => {
        const messageDate = msg.timestamp ? new Date(msg.timestamp) : new Date();
        const dateStr = formatDate(messageDate);
        
        if (dateStr !== currentDate) {
            chatMessages.appendChild(createSectionDivider(messageDate));
            currentDate = dateStr;
        }
        
        addMessage(msg.content, msg.role === 'user');
    });
    
    scrollToBottom();
}

// Start new chat with typing effect
function startNewChat(showWelcome = true) {
    if (currentChatId && conversationHistory.length > 0) {
        saveCurrentChat();
    }

    chatMessages.innerHTML = '';
    conversationHistory = [];
    currentChatId = generateUniqueId();
    
    if (showWelcome) {
        const welcomeMsg = getWelcomeMessage();
        addBotMessage(welcomeMsg);
        conversationHistory.push({
            role: 'assistant',
            content: welcomeMsg,
            timestamp: new Date().toISOString()
        });
    }

    updateSavedChatsList();
    userInput.focus();
}


// Add event listener for language changes
document.addEventListener('languageChanged', (e) => {
    const lang = e.detail.language;
    // Update welcome message if it's the only message
    if (conversationHistory.length === 1 && conversationHistory[0].role === 'assistant') {
        const welcomeMsg = getWelcomeMessage();
        conversationHistory[0].content = welcomeMsg;
        loadChatMessages(conversationHistory);
    }
    // Update chat titles
    updateSavedChatsList();
});

function loadSavedChats() {
    try {
        const savedChatsData = localStorage.getItem('savedChats');
        console.log('Loading saved chats:', savedChatsData);
        if (savedChatsData) {
            savedChats = JSON.parse(savedChatsData);
            console.log('Loaded chats:', savedChats);
            updateSavedChatsList();
        }
    } catch (error) {
        console.error('Error loading saved chats:', error);
        savedChats = [];
    }
}



function deleteChat(chatId) {
    if (!chatId) return;
    
    const chatIndex = savedChats.findIndex(chat => chat.id === chatId);
    if (chatIndex === -1) return;
    
    savedChats.splice(chatIndex, 1);
    localStorage.setItem('savedChats', JSON.stringify(savedChats));
    
    if (currentChatId === chatId) {
        currentChatId = null;
        conversationHistory = [];
        startNewChat();
    } else {
        updateSavedChatsList();
    }
}




function updateSavedChatsList() {
    if (!savedChatsList) return;
    savedChatsList.innerHTML = '';
    
    const sortedChats = [...savedChats].sort((a, b) => 
        new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)
    );
    
    sortedChats.forEach(chat => {
        const chatItem = document.createElement('div');
        const isActive = chat.id === currentChatId;
        chatItem.className = `saved-chat-item${isActive ? ' active' : ''}`;
        chatItem.dataset.chatId = chat.id;
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'chat-title';
        titleSpan.textContent = chat.title || 'New Chat';
        chatItem.appendChild(titleSpan);
        
        if (!isActive) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-chat-btn';
            deleteButton.setAttribute('aria-label', 'Delete chat');
            deleteButton.setAttribute('type', 'button');
            deleteButton.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                </svg>
            `;
            
            chatItem.appendChild(deleteButton);
        }
        
        savedChatsList.appendChild(chatItem);
    });
}

// Add event delegation for saved chats list
function handleChatAction(e) {
    const deleteButton = e.target.closest('.delete-chat-btn');
    const chatItem = e.target.closest('.saved-chat-item');
    
    if (deleteButton) {
        e.preventDefault();
        e.stopPropagation();
        const chatId = chatItem.dataset.chatId;
        if (chatId) {
            deleteChat(chatId);
        }
    } else if (chatItem && !deleteButton) {
        const chatId = chatItem.dataset.chatId;
        if (chatId) {
            loadChat(chatId);
        }
    }
}

// Add event listeners for both pointer and touch events
savedChatsList.addEventListener('pointerdown', handleChatAction);
savedChatsList.addEventListener('touchend', handleChatAction);
savedChatsList.addEventListener('click', handleChatAction);







// Update loadChat function
function loadChat(chatId) {
    const chat = savedChats.find(c => c.id === chatId);
    if (!chat) {
        console.error('Chat not found:', chatId);
        return;
    }

    // Clear current chat
    chatMessages.innerHTML = '';
    
    // Update current chat ID
    currentChatId = chatId;
    
    // Create a deep copy of messages
    conversationHistory = [...chat.messages];

    // Display all messages
    loadChatMessages(conversationHistory);
    
    updateSavedChatsList();
    scrollToBottom();

    // Ensure sidebar is closed on mobile
    if (window.innerWidth <= 1023) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
        menuToggle.classList.remove('active');
    }
}

// Generate unique ID for chats
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Add swipe gesture support
let touchStartX = 0;
let touchEndX = 0;
const SWIPE_THRESHOLD = 100;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
        if (swipeDistance > 0 && !sidebar.classList.contains('open')) {
            // Swipe right to open
            toggleSidebar();
        } else if (swipeDistance < 0 && sidebar.classList.contains('open')) {
            // Swipe left to close
            toggleSidebar();
        }
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + H to toggle chat history
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        toggleSidebar();
    }
    
    // Escape key to close sidebar
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        toggleSidebar();
    }
});

// Add shortcut hint to sidebar
const shortcutHint = document.createElement('div');
shortcutHint.className = 'shortcut-hint';
shortcutHint.textContent = 'Press Ctrl + H to toggle history';
sidebar.appendChild(shortcutHint);

// Update toggleSidebar function
function toggleSidebar() {
    const isOpen = sidebar.classList.contains('open');
    const isMobile = window.innerWidth <= 1023;
    
    if (isOpen) {
        sidebar.classList.remove('open');
        if (isMobile) {
            sidebarOverlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            menuToggle.classList.remove('active');
        }
    } else {
        sidebar.classList.add('open');
        if (isMobile) {
            sidebarOverlay.classList.add('active');
            document.body.classList.add('sidebar-open');
            menuToggle.classList.add('active');
        }
    }
}


// Update event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
    });
    
    // Handle overlay click
    sidebarOverlay.addEventListener('click', function(e) {
        if (e.target === sidebarOverlay) {
            toggleSidebar();
        }
    });
    
    // Close sidebar on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767 && sidebar.classList.contains('open')) {
            toggleSidebar();
        }
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            toggleSidebar();
        }
    });
    
    // Initialize
    loadSavedChats();
    startNewChat();
});

// Save current chat
function saveCurrentChat() {
    if (!currentChatId || conversationHistory.length === 0) return;
    
    try {
        const chatTitle = getChatTitle(conversationHistory);
        const chatData = {
            id: currentChatId,
            title: chatTitle,
            messages: [...conversationHistory],
            lastUpdated: new Date().toISOString()
        };
        
        const existingIndex = savedChats.findIndex(chat => chat.id === currentChatId);
        if (existingIndex !== -1) {
            savedChats[existingIndex] = chatData;
        } else {
            savedChats.push(chatData);
        }
        
        localStorage.setItem('savedChats', JSON.stringify(savedChats));
        updateSavedChatsList();
        
    } catch (error) {
        console.error('Error saving chat:', error);
    }
}


// Get chat title from conversation
function getChatTitle(messages) {
    // Filter out welcome message and get user messages
    const userMessages = messages
        .filter(msg => msg.role === 'user' && msg.content !== WELCOME_MESSAGE)
        .map(msg => msg.content);

    if (userMessages.length === 0) return 'New Chat';

    // Join all messages to analyze the conversation
    const conversationText = userMessages.join(' ');
    
    // Extract keywords and remove common words
    const keywords = conversationText.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => !commonWords.has(word))
        .reduce((acc, word) => {
            acc[word] = (acc[word] || 0) + 1;
            return acc;
        }, {});

    // Sort keywords by frequency
    const sortedKeywords = Object.entries(keywords)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

    // Create title based on keywords
    if (sortedKeywords.length === 0) return 'New Chat';
    if (sortedKeywords.length === 1) return `${sortedKeywords[0]} Discussion`;
    
    return sortedKeywords.join(' ') + ' Chat';
}

// Common words to filter out
const commonWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
    'will', 'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when',
    'where', 'who', 'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'can', 'just', 'should', 'now'
]);

// Event Listeners
sendButton.addEventListener('click', sendMessage);
pauseButton.addEventListener('click', () => {
    console.log('Pause button clicked'); // Debug log
    toggleTyping();
});
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
menuToggle.addEventListener('click', toggleSidebar);
newChatButton.addEventListener('click', startNewChat);

// Add keyboard shortcut for new chat (Ctrl/Cmd + N)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        startNewChat();
    }
});

// Update window resize event listener
window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 1023;
    if (!isMobile) {
        // Reset mobile-specific classes on desktop
        sidebarOverlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
        menuToggle.classList.remove('active');
        sidebar.classList.remove('open'); // Ensure sidebar is visible on desktop
    }
});



// Scroll chat to bottom
function scrollToBottom() {
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Add scroll lock for mobile
let isScrollLocked = false;

chatMessages.addEventListener('scroll', () => {
    const isAtBottom = chatMessages.scrollHeight - chatMessages.scrollTop === chatMessages.clientHeight;
    isScrollLocked = !isAtBottom;
});

// Add input focus handlers
userInput.addEventListener('focus', () => {
    document.body.classList.add('input-focused');
    scrollToBottom();
});

userInput.addEventListener('blur', () => {
    document.body.classList.remove('input-focused');
});

// Generate a summary of the chat
function generateChatSummary(messages) {
    try {
        // Filter out system messages and get last 3 exchanges
        const recentMessages = messages
            .filter(msg => msg.role !== 'system')
            .slice(-6);
        
        // Create a brief summary
        return recentMessages
            .map(msg => {
                const role = msg.role === 'user' ? 'User' : 'Assistant';
                const content = msg.content.length > 50 
                    ? msg.content.substring(0, 50) + '...'
                    : msg.content;
                return `${role}: ${content}`;
            })
            .join('\n');
    } catch (error) {
        console.error('Error generating summary:', error);
        return 'Chat summary unavailable';
    }
}

// Memory system
const MEMORY_KEY = 'amik_memory';
const MAX_MEMORY_ITEMS = 100;

class MemorySystem {
    constructor() {
        this.memories = this.loadMemories();
    }

    loadMemories() {
        try {
            const stored = localStorage.getItem(MEMORY_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading memories:', error);
            return [];
        }
    }

    saveMemories() {
        try {
            localStorage.setItem(MEMORY_KEY, JSON.stringify(this.memories));
        } catch (error) {
            console.error('Error saving memories:', error);
            // If storage is full, remove oldest memories
            if (error.name === 'QuotaExceededError') {
                this.memories = this.memories.slice(-MAX_MEMORY_ITEMS/2);
                this.saveMemories();
            }
        }
    }

    addMemory(content, type = 'conversation') {
        const memory = {
            id: Date.now().toString(),
            content,
            type,
            timestamp: new Date().toISOString(),
            chatId: currentChatId
        };

        this.memories.push(memory);
        if (this.memories.length > MAX_MEMORY_ITEMS) {
            this.memories = this.memories.slice(-MAX_MEMORY_ITEMS);
        }
        this.saveMemories();
    }

    getRelevantMemories(query, limit = 5) {
        // Simple relevance scoring based on text matching
        const queryWords = query.toLowerCase().split(/\s+/);
        return this.memories
            .map(memory => ({
                ...memory,
                relevance: this.calculateRelevance(memory.content, queryWords)
            }))
            .filter(m => m.relevance > 0)
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, limit);
    }

    calculateRelevance(content, queryWords) {
        const contentLower = content.toLowerCase();
        return queryWords.reduce((score, word) => {
            return score + (contentLower.includes(word) ? 1 : 0);
        }, 0);
    }

    summarizeMemories() {
        return this.memories
            .slice(-10)
            .map(m => `${new Date(m.timestamp).toLocaleString()}: ${m.content}`)
            .join('\n');
    }
}

// Initialize memory system
const memorySystem = new MemorySystem();

// Initialize the application
function initializeApp() {
    // Load saved chats
    loadSavedChats();
    
    // Add event listeners
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
    });
    
    sidebarOverlay.addEventListener('click', (e) => {
        if (e.target === sidebarOverlay) {
            toggleSidebar();
        }
    });
    
    savedChatsList.addEventListener('click', handleChatAction);
    
    // Load most recent chat or start new one
    const savedChatsData = localStorage.getItem('savedChats');
    if (savedChatsData) {
        const chats = JSON.parse(savedChatsData);
        if (chats.length > 0) {
            const mostRecentChat = chats.sort((a, b) => 
                new Date(b.lastUpdated) - new Date(a.lastUpdated)
            )[0];
            loadChat(mostRecentChat.id);
        } else {
            startNewChat(false); // Pass false to prevent welcome message
        }
    } else {
        startNewChat(false); // Pass false to prevent welcome message
    }
}



// Update DOMContentLoaded event listener
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

