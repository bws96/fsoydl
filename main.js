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
                <div class="feedback-form">
                    <h3>We value your feedback</h3>
                    <p>Help us improve Flow State. Let us know what you think!</p>
                    <form id="feedbackForm" onsubmit="event.preventDefault(); alert('Thank you! Your feedback has been sent (Simulation).'); document.getElementById('feedback-modal-overlay').classList.remove('active'); document.body.style.overflow = '';">
                        <div class="form-group">
                            <label for="email">Email (Optional)</label>
                            <input type="email" id="email" name="email" placeholder="you@example.com">
                        </div>
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

    // 2. Event Listeners
    const feedbackBtn = document.getElementById('feedback-btn');
    const modalOverlay = document.getElementById('feedback-modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const feedbackForm = document.getElementById('feedbackForm');

    // Open Modal
    feedbackBtn.addEventListener('click', () => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // Close Modal Function
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close on X button
    modalClose.addEventListener('click', closeModal);

    // Close on clicking outside the modal box
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle Form Submission (Simulation for now)
    feedbackForm.addEventListener('submit', (e) => {
        // e.preventDefault(); // Uncomment this if you want to handle via AJAX
        // For now, let it submit naturally or alert
        // alert('Thank you for your feedback!');
        // closeModal();
    });
});