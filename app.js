// Firebase config (بدّلها باللي خديتي من Project Firebase)
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// العناصر
const loginSection = document.getElementById('login-section');
const mainSection = document.getElementById('main-section');
const loginBtn = document.getElementById('google-login');
const logoutBtn = document.getElementById('logout');
const helpForm = document.getElementById('help-form');
const requestsList = document.getElementById('requests-list');
const nameInput = document.getElementById('name');

// تسجيل الدخول بحساب Google
loginBtn.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
});

// تسجيل الخروج
logoutBtn.addEventListener('click', () => {
  auth.signOut();
});

// متابعة حالة المستخدم
auth.onAuthStateChanged(user => {
  if (user) {
    loginSection.style.display = 'none';
    mainSection.style.display = 'block';
    nameInput.value = user.displayName;
    loadRequests();
  } else {
    loginSection.style.display = 'block';
    mainSection.style.display = 'none';
  }
});

// إرسال الطلب
helpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const request = {
    name: nameInput.value,
    type: document.getElementById('help-type').value,
    description: document.getElementById('description').value,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  db.collection('helpRequests').add(request)
    .then(() => {
      helpForm.reset();
      nameInput.value = auth.currentUser.displayName;
    });
});

// عرض الطلبات
function loadRequests() {
  requestsList.innerHTML = '';
  db.collection('helpRequests').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    requestsList.innerHTML = '';
    snapshot.forEach(doc => {
      const li = document.createElement('li');
      li.textContent = `${doc.data().name} - ${doc.data().type}: ${doc.data().description}`;
      requestsList.appendChild(li);
    });
  });
}