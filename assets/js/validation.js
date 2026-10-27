/**
 * NUTRICENTER - Form Validation Utility Functions
 */

const Validation = {
  /**
   * Validate Email Format
   */
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  /**
   * Validate Password (Min 6 chars)
   */
  isValidPassword(password) {
    return password && password.trim().length >= 6;
  },

  /**
   * Validate Non-empty string
   */
  isNotEmpty(value) {
    return value !== null && value !== undefined && value.trim() !== '';
  },

  /**
   * Validate Positive Number
   */
  isPositiveNumber(val) {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  },

  /**
   * Validate Form Element and display errors inline
   */
  validateField(inputEl, condition, errorMessage) {
    let errorEl = inputEl.parentNode.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      inputEl.parentNode.appendChild(errorEl);
    }

    if (!condition) {
      inputEl.classList.add('is-invalid');
      errorEl.textContent = errorMessage;
      errorEl.style.display = 'block';
      return false;
    } else {
      inputEl.classList.remove('is-invalid');
      errorEl.style.display = 'none';
      return true;
    }
  }
};
