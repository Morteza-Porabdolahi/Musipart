// the available modes for alert : error,done,loading,warning
function showAlert(mode,text) {
  const alertContainer = document.querySelector('.alert-container');

  alertContainer.lastElementChild.textContent = text;

  // first hide all icons and then display the correct icon
  alertContainer.querySelectorAll('i').forEach(icon => icon.style.display = 'none');
  alertContainer.querySelector(`i.${mode}`).style.display = 'inline';

  alertContainer.classList.add('active');
}

function hideAlert() {
  const alertContainer = document.querySelector('.alert-container');

  alertContainer.classList.remove('active');
}


