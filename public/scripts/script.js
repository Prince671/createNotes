
    let deleteForm = null;
    let deleteCard = null;

    // Enhanced delete animation
    function confirmDelete(form, card) {
      deleteForm = form;
      deleteCard = card;
      document.getElementById('confirmModal').classList.remove('hidden');
    }

    function cancelDelete() {
      deleteForm = null;
      deleteCard = null;
      document.getElementById('confirmModal').classList.add('hidden');
    }

    function proceedDelete() {
      if (deleteCard) {
        deleteCard.style.transform = 'scale(0.8) rotate(10deg)';
        deleteCard.style.opacity = '0.3';
        deleteCard.style.transition = 'all 0.6s cubic-bezier(0.6, -0.28, 0.735, 0.045)';

        setTimeout(() => {
          if (deleteForm) deleteForm.submit();
        }, 600);
      }
      document.getElementById('confirmModal').classList.add('hidden');
    }

    // Enhanced modal functions
    function openModal(buttonElement) {
  const modal = document.getElementById("noteModal");
  const modalContent = document.getElementById("modalContent");

  // Retrieve content from the data attribute
  const content = buttonElement.getAttribute('data-desc') || '';

  // Safely insert the content (escaped by server or stored as text)
  modalContent.textContent = content;

  // Show the modal
  modal.classList.remove("hidden");

  // Optional: Focus trap (accessibility)
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length > 0) {
    setTimeout(() => {
      focusableElements[0].focus();
    }, 100); // Slight delay for smooth UX
  }
}


    function closeModal() {
      const modal = document.getElementById("noteModal");
      modal.style.opacity = '0';
      modal.style.transform = 'scale(0.95)';

      setTimeout(() => {
        modal.classList.add("hidden");
        modal.style.opacity = '';
        modal.style.transform = '';
      }, 200);
    }

    function openEditModal(filename) {
      const modal = document.getElementById('editModal');
      const modalContent = document.getElementById('editModalContent');

      // Show loading state
      modalContent.innerHTML = `
        <div class="text-center py-8">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 rotate-float">
            <svg class="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
          <p class="text-white/70">Loading<span class="loading-dots"></span></p>
        </div>
      `;

      modal.classList.remove('hidden');

      fetch(`/editfilename/${filename}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        })
        .then(html => {
          modalContent.innerHTML = html;
        })
        .catch(err => {
          modalContent.innerHTML = `
            <div class="text-center py-8">
              <div class="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <p class="text-white mb-4">Failed to load edit form</p>
              <button onclick="closeEditModal()" class="btn-primary px-6 py-2 rounded-xl">Close</button>
            </div>
          `;
        });
    }

    function closeEditModal() {
      const modal = document.getElementById('editModal');
      modal.style.opacity = '0';
      modal.style.transform = 'scale(0.95)';

      setTimeout(() => {
        modal.classList.add('hidden');
        modal.style.opacity = '';
        modal.style.transform = '';
      }, 200);
    }

    // Enhanced click outside modal functionality
    window.onclick = function (event) {
      const noteModal = document.getElementById('noteModal');
      const editModal = document.getElementById('editModal');
      const confirmModal = document.getElementById('confirmModal');

      if (event.target == noteModal) {
        closeModal();
      }
      if (event.target == editModal) {
        closeEditModal();
      }
      if (event.target == confirmModal) {
        cancelDelete();
      }
    }

    // Keyboard navigation
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        if (!document.getElementById('noteModal').classList.contains('hidden')) {
          closeModal();
        }
        if (!document.getElementById('editModal').classList.contains('hidden')) {
          closeEditModal();
        }
        if (!document.getElementById('confirmModal').classList.contains('hidden')) {
          cancelDelete();
        }
      }
    });

    // Enhanced form validation with visual feedback
    document.addEventListener('DOMContentLoaded', function () {
      const titleInput = document.getElementById('title');
      const detailsInput = document.getElementById('details');
      const form = document.querySelector('form[action="/create"]');

      function addValidationFeedback(input) {
        input.addEventListener('blur', function () {
          if (this.value.trim() === '') {
            this.style.borderColor = '#ef4444';
            this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
          } else {
            this.style.borderColor = '#10b981';
            this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2)';
          }
        });

        input.addEventListener('focus', function () {
          this.style.borderColor = '#667eea';
          this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)';
        });
      }

      addValidationFeedback(titleInput);
      addValidationFeedback(detailsInput);

      // Enhanced form submission with loading state
      form.addEventListener('submit', function (e) {
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = `
          <svg class="w-5 h-5 mr-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Creating<span class="loading-dots"></span>
        `;
        submitBtn.disabled = true;

        // Re-enable if form validation fails
        setTimeout(() => {
          if (titleInput.value.trim() === '' || detailsInput.value.trim() === '') {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
        }, 100);
      });

      // Add stagger animation to existing notes
      const noteCards = document.querySelectorAll('.card-hover');
      noteCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
      });

      // Add intersection observer for scroll animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
          }
        });
      }, observerOptions);

      document.querySelectorAll('.glass-card').forEach(card => {
        observer.observe(card);
      });
    });

    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add touch feedback for mobile
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', function (e) {
        if (e.target.closest('.btn-primary, .btn-danger, .card-hover')) {
          e.target.closest('.btn-primary, .btn-danger, .card-hover').style.transform = 'scale(0.98)';
        }
      });

      document.addEventListener('touchend', function (e) {
        if (e.target.closest('.btn-primary, .btn-danger, .card-hover')) {
          setTimeout(() => {
            e.target.closest('.btn-primary, .btn-danger, .card-hover').style.transform = '';
          }, 100);
        }
      });
    }
  