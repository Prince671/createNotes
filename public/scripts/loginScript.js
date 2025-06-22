
    function togglePassword() {
      const passwordInput = document.getElementById('passwordInput');
      const passwordIcon = document.getElementById('passwordIcon');

      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.classList.remove('fa-eye');
        passwordIcon.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        passwordIcon.classList.remove('fa-eye-slash');
        passwordIcon.classList.add('fa-eye');
      }
    }

    function closeError() {
      const errorAlert = document.getElementById('errorAlert');
      errorAlert.style.animation = 'slideOutUp 0.5s ease-out forwards';
      setTimeout(() => {
        errorAlert.style.display = 'none';
      }, 500);
    }

    function handleSubmit(event) {
      const submitBtn = event.target.querySelector('.submit-btn');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');
      const btnIcon = submitBtn.querySelector('.btn-icon');

      // Show loading state
      btnText.style.opacity = '0';
      btnIcon.style.opacity = '0';
      btnLoader.style.opacity = '1';
      submitBtn.disabled = true;

      // Reset after 3 seconds (remove this in production)
      setTimeout(() => {
        btnText.style.opacity = '1';
        btnIcon.style.opacity = '1';
        btnLoader.style.opacity = '0';
        submitBtn.disabled = false;
      }, 3000);
    }

    // Add ripple effect to buttons
    document.addEventListener('click', function (e) {
      if (e.target.matches('.submit-btn, .social-btn, .register-link')) {
        const button = e.target;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          animation: ripple 0.6s linear;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      }
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      @keyframes slideOutUp {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-30px); }
      }
    `;
    document.head.appendChild(style);

    // Add smooth scrolling and form validation
    document.addEventListener('DOMContentLoaded', function () {
      // Enhanced form validation
      const inputs = document.querySelectorAll('.form-input');
      inputs.forEach(input => {
        input.addEventListener('blur', function () {
          if (this.value.trim() === '') {
            this.style.borderColor = 'rgba(239, 68, 68, 0.6)';
            this.style.background = 'rgba(239, 68, 68, 0.1)';
          } else {
            this.style.borderColor = 'rgba(34, 197, 94, 0.6)';
            this.style.background = 'rgba(34, 197, 94, 0.1)';
          }
        });

        input.addEventListener('focus', function () {
          this.style.borderColor = '#14b8a6';
          this.style.background = 'rgba(255, 255, 255, 0.15)';
        });
      });

      // Add floating label effect
      inputs.forEach(input => {
        input.addEventListener('input', function () {
          const label = this.parentElement.previousElementSibling;
          if (this.value) {
            label.classList.add('active');
          } else {
            label.classList.remove('active');
          }
        });
      });
    });
  