const translations = {
	en: {
		newChat: 'New Chat',
		amikAssistant: 'AMIK AI ASSISTANT',
		askAnything: 'Ask AMIK AI anything...',
		amikCanMakeMistakes: 'AMIK can make mistakes. Consider checking important information.',
		savedChats: 'Saved Chats',
		chatHistory: 'Chat History',
		welcomeMessage: 'Hello! How can I assist you today?',
		today: 'Today',
		yesterday: 'Yesterday',
		deleteChat: 'Delete chat',
		discussion: 'Discussion',
		chat: 'Chat'
	},
	ur: {
		newChat: 'نیا چیٹ',
		amikAssistant: 'اے ام آئی کے اے آئی اسسٹنٹ',
		askAnything: 'اے ام آئی کے اے آئی سے کچھ بھی پوچھیں...',
		amikCanMakeMistakes: 'اے ام آئی کے غلطیاں کر سکتا ہے۔ اہم معلومات چیک کرنے پر غور کریں۔',
		savedChats: 'محفوظ چیٹس',
		chatHistory: 'چیٹ ہسٹری',
		welcomeMessage: 'السلام علیکم! میں آپ کی کیا مدد کر سکتا ہوں؟',
		today: 'آج',
		yesterday: 'کل',
		deleteChat: 'چیٹ حذف کریں',
		discussion: 'بات چیت',
		chat: 'چیٹ'
	},
	zh: {
		newChat: '新聊天',
		amikAssistant: 'AMIK AI 助理',
		askAnything: '问 AMIK AI 任何问题...',
		amikCanMakeMistakes: 'AMIK 会犯错。请考虑检查重要信息。',
		savedChats: '保存的聊天',
		chatHistory: '聊天历史',
		welcomeMessage: '你好!我能为您做些什么?',
		today: '今天',
		yesterday: '昨天',
		deleteChat: '删除聊天',
		discussion: '讨论',
		chat: '聊天'
	}
};

let currentLang = localStorage.getItem('selectedLanguage') || 'en';

function addTransitionToElements() {
	const elements = document.querySelectorAll('[data-i18n], .message-content, .chat-title');
	elements.forEach(el => {
		el.style.transition = 'opacity 0.3s ease';
	});
}

function translate(lang) {
	currentLang = lang;
	localStorage.setItem('selectedLanguage', lang);
	document.documentElement.lang = lang;
	
	// Add transition effect
	const elements = document.querySelectorAll('[data-i18n], .message-content, .chat-title');
	elements.forEach(el => el.style.opacity = '0');
	
	setTimeout(() => {
		// Translate static elements
		const staticElements = document.querySelectorAll('[data-i18n]');
		staticElements.forEach(el => {
			const key = el.dataset.i18n;
			if (el.tagName.toLowerCase() === 'input' && el.hasAttribute('placeholder')) {
				el.placeholder = translations[lang][key];
			} else {
				el.textContent = translations[lang][key];
			}
		});

		// Translate chat messages
		const chatMessages = document.querySelectorAll('.message-content');
		chatMessages.forEach(msg => {
			const originalText = msg.dataset.originalText || msg.textContent;
			if (!msg.dataset.originalText) {
				msg.dataset.originalText = originalText;
			}
			if (translations[lang][originalText]) {
				msg.textContent = translations[lang][originalText];
			}
		});

		// Translate chat history items
		const chatTitles = document.querySelectorAll('.chat-title');
		chatTitles.forEach(title => {
			const originalText = title.dataset.originalText || title.textContent;
			if (!title.dataset.originalText) {
				title.dataset.originalText = originalText;
			}
			if (translations[lang][originalText]) {
				title.textContent = translations[lang][originalText];
			}
		});

		// Handle RTL for Urdu
		if (lang === 'ur') {
			document.body.dir = 'rtl';
			document.body.classList.add('rtl');
		} else {
			document.body.dir = 'ltr';
			document.body.classList.remove('rtl');
		}

		// Show elements with transition
		elements.forEach(el => el.style.opacity = '1');

		// Dispatch language change event
		document.dispatchEvent(new CustomEvent('languageChanged', { 
			detail: { language: lang }
		}));
	}, 300);
}

document.addEventListener('DOMContentLoaded', () => {
	const langToggle = document.getElementById('lang-toggle');
	const langDropdown = document.getElementById('lang-dropdown');
	const langOptions = document.querySelectorAll('.lang-option');

	// Add transition to elements
	addTransitionToElements();

	langToggle.addEventListener('click', () => {
		langDropdown.classList.toggle('active');
	});

	langOptions.forEach(option => {
		option.addEventListener('click', () => {
			translate(option.dataset.lang);
			langDropdown.classList.remove('active');
		});
	});

	document.addEventListener('click', (e) => {
		if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
			langDropdown.classList.remove('active');
		}
	});

	// Initialize with saved language
	translate(currentLang);
});