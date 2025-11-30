console.log('Hello world')

const forms = document.querySelectorAll('form');

forms.forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
  });
});

