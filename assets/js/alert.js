/*
* Shows an Alert
* @function showAlert
* @param {string} mode - the mode of the alert (done,error,warning,loading)
* @param {string} text - the text you want to show on the alert
*/

function showAlert(mode, text) {
  const alertContainer = document.querySelector('.alert-container');

  alertContainer.lastElementChild.textContent = text;

  // first hide all icons and then display the correct icon
  alertContainer
      .querySelectorAll('img')
      .forEach((icon) => (icon.style.display = 'none'));
  alertContainer.querySelector(`img.${mode}`).style.display = 'inline';

  alertContainer.classList.add('active');
}

/*
* hides the Alert
* @function hideAlert
*/

function hideAlert() {
  const alertContainer = document.querySelector('.alert-container');

  alertContainer.classList.remove('active');
}
