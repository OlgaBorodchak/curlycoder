export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = [
    {
      input: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate: (value) => value.trim() !== '',
    },
    {
      input: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    },
    {
      input: document.getElementById('message'),
      error: document.getElementById('message-error'),
      validate: (value) => value.trim() !== '',
    },
  ];

  function showError(field) {
    field.error.classList.add('is-visible');
    field.input.setAttribute('aria-invalid', 'true');
  }

  function hideError(field) {
    field.error.classList.remove('is-visible');
    field.input.setAttribute('aria-invalid', 'false');
  }

  fields.forEach((field) => {
    // hide errors initially
    hideError(field);

    field.input.addEventListener('input', () => {
      if (field.validate(field.input.value)) {
        hideError(field);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;

    fields.forEach((field) => {
      const valid = field.validate(field.input.value);

      if (!valid) {
        showError(field);
        isValid = false;
      } else {
        hideError(field);
      }
    });

    const status = document.getElementById('form-status');
    const submitButton = form.querySelector('.contact-submit');

    if (!isValid) {
      status.textContent = 'Please fix the errors above and try again.';
      status.className = 'contact-status contact-status-error is-visible';
      return;
    }

    submitButton.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        status.textContent = 'Thanks! Your message has been sent — I will get back to you soon.';
        status.className = 'contact-status contact-status-success is-visible';

        form.reset();
        fields.forEach(hideError);
      } else {
        status.textContent = 'Something went wrong. Please try again or email me directly.';
        status.className = 'contact-status contact-status-error is-visible';
      }
    } catch {
      status.textContent = 'Something went wrong. Please try again or email me directly.';
      status.className = 'contact-status contact-status-error is-visible';
    } finally {
      submitButton.disabled = false;
    }
  });
}