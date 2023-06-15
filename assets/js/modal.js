import { _ } from "./utils/general";

const modalContainer = _.querySelector(".modal-container");

// using the event bubbling
_.documentElement.addEventListener("click", handleClickedElements);

/*
 * handles clicks using event bubbling
 * @function handleClickedElements
 * @param {object} e - event Object
 */
function handleClickedElements(e) {
  const clickedElementClass = e.target.classList;

  if (clickedElementClass.contains("close-modal")) {
    e.target.addEventListener("click", hideModal);
  } else if (clickedElementClass.contains("load-more")) {
    e.target.addEventListener("click", showModal);
  } else {
    e.target.addEventListener("click", handleModalClose);
  }
}

/*
 * handles modal Close when clicked "outside" of modal
 * @function handleModalClose
 * @param {object} e - event Object
 */
function handleModalClose(e) {
  // get the modal content
  const modal = modalContainer.firstElementChild;

  // if clicked Element does not inside the modal content then hide the Modal
  if (e.target.contains(modal)) {
    hideModal();
  }
}

function showModal() {
  modalContainer.style.display = "block";
}

function hideModal() {
  modalContainer.style.display = "none";
}
