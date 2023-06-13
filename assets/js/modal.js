const modalContainer = document.querySelector(".modal-container");

// using the event bubbling
document.documentElement.addEventListener("click", handleClickedElements);

/*
 * handle Clicks using event event bubbling
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
 * handle modal Close when clicked outside of modal
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

/*
 * shows modal
 * @function showModal
 */
function showModal() {
  modalContainer.style.display = "block";
}

/*
 * hides modal
 * @function showModal
 */
function hideModal() {
  modalContainer.style.display = "none";
}
