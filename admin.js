// Firebase configuration
const firebaseConfig = {
	apiKey: "YOUR_API_KEY",
	authDomain: "your-app.firebaseapp.com",
	projectId: "your-project-id",
	storageBucket: "your-app.appspot.com",
	messagingSenderId: "your-sender-id",
	appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const adminEmail = document.getElementById('admin-email');
const logoutBtn = document.getElementById('logout-btn');
const totalUsers = document.getElementById('total-users');
const totalChats = document.getElementById('total-chats');
const activeUsers = document.getElementById('active-users');
const usersList = document.getElementById('users-list');
const searchUsers = document.getElementById('search-users');
const filterType = document.getElementById('filter-type');
const chatContainer = document.getElementById('chat-container');

// Check authentication state
auth.onAuthStateChanged(async (user) => {
	if (user) {
		// Check if user is admin
		const userDoc = await db.collection('admins').doc(user.uid).get();
		if (!userDoc.exists) {
			auth.signOut();
			window.location.href = 'index.html';
			return;
		}
		
		adminEmail.textContent = user.email;
		loadDashboardData();
		setupRealTimeListeners();
	} else {
		window.location.href = 'index.html';
	}
});

// Logout handler
logoutBtn.addEventListener('click', () => {
	auth.signOut();
});

// Load dashboard data
async function loadDashboardData() {
	try {
		// Get total users
		const usersSnapshot = await db.collection('users').get();
		totalUsers.textContent = usersSnapshot.size;

		// Get total chats
		const chatsSnapshot = await db.collection('chats').get();
		totalChats.textContent = chatsSnapshot.size;

		// Get today's active users
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const activeUsersSnapshot = await db.collection('users')
			.where('lastActive', '>=', today)
			.get();
		activeUsers.textContent = activeUsersSnapshot.size;

		// Load initial users list
		loadUsersList();
	} catch (error) {
		console.error('Error loading dashboard data:', error);
	}
}

// Load users list
async function loadUsersList(filter = 'all') {
	usersList.innerHTML = '';
	try {
		let query = db.collection('users');
		
		// Apply filter
		if (filter !== 'all') {
			const date = new Date();
			switch(filter) {
				case 'today':
					date.setHours(0, 0, 0, 0);
					break;
				case 'week':
					date.setDate(date.getDate() - 7);
					break;
				case 'month':
					date.setMonth(date.getMonth() - 1);
					break;
			}
			query = query.where('lastActive', '>=', date);
		}
		
		const snapshot = await query.get();
		snapshot.forEach(doc => {
			const userData = doc.data();
			const row = document.createElement('tr');
			row.innerHTML = `
				<td>${userData.email}</td>
				<td>${new Date(userData.lastActive.toDate()).toLocaleString()}</td>
				<td>${userData.totalChats || 0}</td>
				<td>
					<button onclick="viewUserChats('${doc.id}')">View Chats</button>
				</td>
			`;
			usersList.appendChild(row);
		});
	} catch (error) {
		console.error('Error loading users:', error);
	}
}

// View user chats
async function viewUserChats(userId) {
	chatContainer.innerHTML = '';
	try {
		const snapshot = await db.collection('chats')
			.where('userId', '==', userId)
			.orderBy('timestamp', 'desc')
			.limit(50)
			.get();
		
		snapshot.forEach(doc => {
			const chatData = doc.data();
			const chatEntry = document.createElement('div');
			chatEntry.className = 'chat-entry';
			chatEntry.innerHTML = `
				<p><strong>${new Date(chatData.timestamp.toDate()).toLocaleString()}</strong></p>
				<p>${chatData.content}</p>
			`;
			chatContainer.appendChild(chatEntry);
		});
	} catch (error) {
		console.error('Error loading chats:', error);
	}
}

// Search users
searchUsers.addEventListener('input', (e) => {
	const searchTerm = e.target.value.toLowerCase();
	const rows = usersList.getElementsByTagName('tr');
	Array.from(rows).forEach(row => {
		const email = row.cells[0].textContent.toLowerCase();
		row.style.display = email.includes(searchTerm) ? '' : 'none';
	});
});

// Filter change handler
filterType.addEventListener('change', (e) => {
	loadUsersList(e.target.value);
});

// Setup real-time listeners
function setupRealTimeListeners() {
	// Listen for new users
	db.collection('users').onSnapshot(snapshot => {
		snapshot.docChanges().forEach(change => {
			if (change.type === 'added') {
				totalUsers.textContent = parseInt(totalUsers.textContent) + 1;
			}
		});
	});

	// Listen for new chats
	db.collection('chats').onSnapshot(snapshot => {
		snapshot.docChanges().forEach(change => {
			if (change.type === 'added') {
				totalChats.textContent = parseInt(totalChats.textContent) + 1;
			}
		});
	});
}