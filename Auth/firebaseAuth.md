# 🔥 Firebase Authentication (JS + Modular v9+)

This guide covers everything I learned while building **Signup, Login, and Logout functionality** using Firebase Authentication in JavaScript.

---

## 🚀 1. Setup Firebase

### ✅ Step 1: Import Firebase Modules

```js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
```

We import only what we need.  
Firebase v9+ uses **modular syntax**, so everything is imported as functions.

---

### ✅ Step 2: Initialize Firebase

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
```

- `initializeApp()` connects your app with your Firebase project.  
- `getAuth(app)` sets up the Authentication service for your app.

---

## 🧾 2. DOM Elements

We connect buttons and input fields using `document.getElementById()` and `querySelector()` so we can interact with the UI:

```js
const email = document.getElementById('email');
const password = document.getElementById('password');
const signUpBtn = document.getElementById('signup-btn');
const userProfile = document.querySelector('.userProfile');
const signUpForm = document.querySelector('.signup-form');
const UIemail = document.getElementById('user-email');
const spinLoading = document.getElementById('spin-loading');
const loginForm = document.getElementById('login-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginErrorMessage = document.getElementById('login-error-message');
```

---

## 👤 3. Signup (Create Account)

```js
const signUpButtonPressed = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log('Signup successful:', userCredential);
  } catch (error) {
    console.log(error.code);
  }
};

signUpBtn.addEventListener('click', signUpButtonPressed);
```

- `createUserWithEmailAndPassword()` creates a new user in Firebase Authentication.
- If successful, Firebase automatically logs the user in.

---

## 🔑 4. Login (Sign In)

```js
const loginButtonPressed = async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
  } catch (error) {
    console.log(error.code);
    loginErrorMessage.innerHTML = formatErrorMessage(error.code, 'login');
    loginErrorMessage.classList.add('visible');
  }
};

loginBtn.addEventListener('click', loginButtonPressed);
```

- `signInWithEmailAndPassword()` verifies the email and password in Firebase.
- On success, Firebase updates the **current logged-in user**.
- On failure, we handle errors and display custom messages.

---

## 🚪 5. Logout (Sign Out)

```js
const logoutButtonPressed = async () => {
  await signOut(auth);
};

logoutBtn.addEventListener('click', logoutButtonPressed);
```

- `signOut()` clears the **current session** (removes the logged-in user).
- After sign-out, `onAuthStateChanged()` automatically triggers with `user = null`.

---

## 🧠 6. onAuthStateChanged() — The Real-Time Auth Listener

```js
onAuthStateChanged(auth, (user) => {
  console.log('Auth State Changed:', user);
  if (user) {
    spinLoading.style.display = 'none';
    loginForm.style.display = 'none';
    userProfile.style.display = 'block';
    UIemail.innerHTML = user.email;
  } else {
    spinLoading.style.display = 'none';
    loginForm.style.display = 'block';
    userProfile.style.display = 'none';
  }
});
```

### 💡 What it does:
- Runs **automatically** whenever the user's authentication state changes (login, signup, logout, refresh).
- If `user` exists → the person is logged in.
- If `user` is `null` → the person is logged out.
- This is why we don’t need to manually redirect after logout — Firebase handles it via this listener.

---

## 🧾 7. Handling Error Messages

```js
const formatErrorMessage = (errorCode, action) => {
  let message = '';
  if (action === 'signup') {
    if (errorCode === 'auth/invalid-email' || errorCode === 'auth/missing-password') {
      message = 'Please enter a valid email';
    } else if (errorCode === 'auth/weak-password') {
      message = 'Password must be at least 6 characters long';
    } else if (errorCode === 'auth/email-already-in-use') {
      message = 'Email is already taken';
    }
  } else if (action === 'login') {
    if (errorCode === 'auth/invalid-email' || errorCode === 'auth/missing-password') {
      message = 'Email or password is incorrect';
    } else if (errorCode === 'auth/user-not-found') {
      message = 'Our system could not verify your credentials';
    }
  }
  return message;
};
```

---

## 🧩 8. Understanding `user`, `auth.currentUser`, and Sessions

- When logged in → `onAuthStateChanged()` gives a **user object**.
- When logged out → it gives `null`.
- You can also access the logged-in user anywhere using:

```js
const currentUser = auth.currentUser;
console.log(currentUser?.email);
```

⚠️ Note: This works **only after login is complete**.

---

## 🔍 9. userCredential vs user

- `createUserWithEmailAndPassword()` and `signInWithEmailAndPassword()` return an object like:

```js
{
  user: { uid, email, emailVerified, ... },
  _tokenResponse: {...}
}
```

- `userCredential.user` → current user info at that moment.
- `onAuthStateChanged()` → automatically triggers when that user logs in/out.

---

## ✅ 10. Key Takeaways

- `initializeApp()` → connects your Firebase project.  
- `getAuth()` → enables authentication service.  
- `createUserWithEmailAndPassword()` → creates & logs in a new user.  
- `signInWithEmailAndPassword()` → logs in existing users.  
- `signOut()` → logs out the current user.  
- `onAuthStateChanged()` → listens for any login/logout changes in real-time.  
- `auth.currentUser` → gives currently logged-in user.
