import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB44XooyObApKIWN0laMPhzIap-dSwP27A",
    authDomain: "authentication-1d078.firebaseapp.com",
    projectId: "authentication-1d078",
    storageBucket: "authentication-1d078.appspot.com",
    messagingSenderId: "545350516965",
    appId: "1:545350516965:web:a434c76db8ae189b76540c"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = document.getElementById('email');
const password = document.getElementById('password');
const signUpBtn = document.getElementById('signup-btn');
// const userProfile = document.querySelector('.userProfile');
const wrapper = document.querySelector('.wrapper');
const signUpForm = document.getElementById('signup-form');
const UIemail = document.getElementById('user-email');
const spinLoading = document.getElementById('spin-loading');
const loginForm = document.getElementById('login-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password')
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginErrorMessage = document.getElementById('login-error-message');
const signupErrorMessage = document.getElementById('signup-error-message');
const signupLink = document.getElementById('signup-link');
const loginLink = document.getElementById('login-link');
let userCredentail;


onAuthStateChanged(auth, (user) => {
    console.log('onAuthStateChanged: ', user);
    if (user) {
        spinLoading.style.display = 'none'
        signUpForm.style.display = 'none';
        loginForm.style.display = 'none';
        // userProfile.style.display = 'block';
        wrapper.style.display = 'flex'
        UIemail.innerHTML = user.email;
    } else {
        spinLoading.style.display = 'none'
        // signUpForm.style.display = 'block';
        loginForm.style.display = 'block';
        // userProfile.style.display = 'none';
        wrapper.style.display = 'none'
    }
})

const signUpButtonPressed = async (e) => {
    e.preventDefault();
    try {
        userCredentail = await createUserWithEmailAndPassword(auth, email.value, password.value);
        console.log('tryBLock: ', userCredentail)

    } catch (error) {
        console.log(error.code);
        loginErrorMessage.innerHTML = formatErrorMessage(error.code, 'signup');
        signupErrorMessage.classList.add('visible');
    }
}

const loginButtonPressed = async (e) => {
    e.preventDefault();
    console.log(loginEmail.value)
    console.log(loginPassword.value);
    try {
        await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
        loginEmail.value = '';
        loginPassword.value = '';
    } catch (error) {
        console.log(error.code);
        console.log(formatErrorMessage(error.code, 'login'))
        loginErrorMessage.innerHTML = formatErrorMessage(error.code, 'login');
        loginErrorMessage.classList.add('visible');
    }
}

const logoutButtonPressed = async() => {
    await signOut(auth)
}



signUpBtn.addEventListener('click', signUpButtonPressed);
logoutBtn.addEventListener('click', logoutButtonPressed);
loginBtn.addEventListener('click', loginButtonPressed);

signupLink.addEventListener('click', function(e){
    e.preventDefault();
    loginForm.style.display = 'none'
    signUpForm.style.display = 'block'
})

loginLink.addEventListener('click', function(e){
    e.preventDefault()
    loginForm.style.display = 'block';
    signUpForm.style.display = 'none'
})


const formatErrorMessage = (errorCode, action) => {
    let message = '';
    if (action === 'signup') {
        if (
            errorCode === 'auth/invalid-email'
            || errorCode === 'auth/missing-password'
        ) {
            message = 'Please Enter a valid Email';
        } else if (
            errorCode === 'auth/missing-password' ||
            errorCode === 'auth/weak-password'
        ) {
            message = 'Password must be atleast 6 character long';
        } else if (
            errorCode === 'auth/email-already-in-use'
        ) {
            message = 'Email is already Taken';
        }
    } else if (action === 'login') {
        if (
            errorCode === 'auth/invalid-email' ||
            errorCode === 'auth/missing-password' ||
            errorCode === 'auth/invalid-credential'
        ) {
            message = 'Email or Password is incorrect';
        } else if (errorCode === 'auth/user-not-found') {
            message = 'our system was unable to verify your email or password';
        }
    }
    return message;
}