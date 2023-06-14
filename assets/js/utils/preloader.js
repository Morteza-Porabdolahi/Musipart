import { _ } from './general.js';

const preloader = _.querySelector(".preloader-container");

/*
 * hides the Preloader
 * @function hidePreloader
 */
function hidePreloader() {
  preloader.style.display = "none";
}

/*
 * shows the Preloader
 * @function showPreloader
 */
function showPreloader() {
  preloader.style.display = "block";
}

export { hidePreloader, showPreloader };
