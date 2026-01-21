
// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTev_jDhBJiInMt2bUt-5LRJvyBF_wcc0",
  authDomain: "emailservice-f8523.firebaseapp.com",
  projectId: "emailservice-f8523",
  storageBucket: "emailservice-f8523.firebasestorage.app",
  messagingSenderId: "512561339969",
  appId: "1:512561339969:web:5becb01678549d7978b0c0"
};

// Replace with YOUR email address to receive feedback.
const OWNER_EMAIL = "bws96g@gmail.com"; 

let auth;
let app;

// Initialize Firebase
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
} catch (e) {
    console.error("Firebase Initialization Error:", e);
}


document.addEventListener('DOMContentLoaded', () => {
    console.log('Flow State site loaded successfully.');

    // 1. Inject Feedback Widget HTML
    const feedbackHTML = `
        <!-- Floating Feedback Button -->
        <div id="feedback-btn" class="feedback-btn" title="Send Feedback">
            <i class="fa-regular fa-comment-dots"></i>
        </div>

        <!-- Feedback Modal -->
        <div id="feedback-modal-overlay" class="feedback-modal-overlay">
            <div class="feedback-modal">
                <button id="modal-close" class="modal-close">&times;</button>
                
                <div class="feedback-header">
                    <h3>We value your feedback</h3>
                    <p>Help us improve Flow State.</p>
                </div>

                <!-- Step 1: Login -->
                <div id="login-step" style="display: block;">
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">
                        Please sign in with Google to send feedback.
                    </p>
                    <button id="google-signin-btn" class="btn-google">
                        <i class="fa-brands fa-google"></i> Sign in with Google
                    </button>
                </div>

                <!-- Step 2: Form (Hidden initially) -->
                <div id="feedback-form-step" style="display: none;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                        <span id="user-display" style="font-size:0.85rem; color:var(--text-muted);"></span>
                        <a href="#" id="sign-out-link" style="font-size:0.8rem; color:var(--secondary); text-decoration:underline;">Sign out</a>
                    </div>

                    <form id="feedbackForm">
                        <!-- FormSubmit Configuration -->
                        <input type="hidden" name="_subject" value="New Feedback from Flow State">
                        <input type="hidden" name="_captcha" value="false">
                        <input type="hidden" name="_template" value="table">
                        <!-- Reply-to will be set dynamically -->
                        <input type="hidden" id="reply-to" name="_replyto" value="">

                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" placeholder="Tell us what you like or what we can fix..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary feedback-submit-btn">Send Feedback</button>
                    </form>
                </div>

            </div>
        </div>
    `;
    
    // Append to body
    document.body.insertAdjacentHTML('beforeend', feedbackHTML);

    // 2. DOM Elements
    const feedbackBtn = document.getElementById('feedback-btn');
    const modalOverlay = document.getElementById('feedback-modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const loginStep = document.getElementById('login-step');
    const formStep = document.getElementById('feedback-form-step');
    const googleBtn = document.getElementById('google-signin-btn');
    const signOutLink = document.getElementById('sign-out-link');
    const userDisplay = document.getElementById('user-display');
    const feedbackForm = document.getElementById('feedbackForm');
    const replyToInput = document.getElementById('reply-to');

    // 3. Modal Logic
    const openModal = () => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    feedbackBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // 4. Auth Logic
    if (auth) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                loginStep.style.display = 'none';
                formStep.style.display = 'block';
                userDisplay.textContent = `Signed in as ${user.displayName || user.email}`;
                replyToInput.value = user.email; // Set reply-to
            } else {
                // User is signed out
                loginStep.style.display = 'block';
                formStep.style.display = 'none';
                replyToInput.value = '';
            }
        });

        googleBtn.addEventListener('click', async () => {
            const provider = new GoogleAuthProvider();
            try {
                await signInWithPopup(auth, provider);
            } catch (error) {
                console.error("Login Failed:", error);
                alert("Login failed: " + error.message);
            }
        });

        signOutLink.addEventListener('click', (e) => {
            e.preventDefault();
            signOut(auth);
        });
    } else {
        // Fallback if config is missing
        googleBtn.addEventListener('click', () => {
            alert("Firebase Setup Required: Please update main.js with your Firebase Config.");
        });
    }

    // 5. Form Submission (via FormSubmit.co)
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (OWNER_EMAIL.includes("YOUR_EMAIL")) {
            alert("Configuration Required: Please update OWNER_EMAIL in main.js to receive emails.");
            return;
        }

        const submitBtn = feedbackForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        const formData = new FormData(feedbackForm);
        
        // Use Fetch to send without redirect
        fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert("Thank you! Your feedback has been sent successfully.");
            feedbackForm.reset();
            closeModal();
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Oops! Something went wrong. Please try again.");
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
});
