import { _ } from "./general.js";

/*
 * Shows an Alert
 * @function showAlert
 * @param {string} type - The type of the alert ( done, error, warning, loading )
 * @param {string} text - The message that should be appear in alert
 * @param {number} ms - How long the alert should be displayed in milliseconds
 */

function showAlert(type, text , ms) {
  const alertContainer = _.querySelector(".alert-container");

  alertContainer.lastElementChild.textContent = text;

  // first hide all icons and then display the icon 
  alertContainer
    .querySelectorAll("img")
    .forEach((icon) => (icon.style.display = "none"));
  alertContainer.querySelector(`img.${type}`).style.display = "inline";

  alertContainer.classList.add("active");
  
  if(ms){
    setTimeout(hideAlert, ms);
  }
}

/*
 * hides the Alert
 * @function hideAlert
 */

function hideAlert() {
  const alertContainer = _.querySelector(".alert-container");

  alertContainer.classList.remove("active");
}

export { hideAlert, showAlert };
