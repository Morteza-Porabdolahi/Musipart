const modalContainer = document.querySelector('.modal-container');

// using the event phases
document.documentElement.addEventListener('click', handleClickedElements);

function handleClickedElements(e) {
  const clickedElementClass = e.target.classList;

  if(clickedElementClass.contains('close-modal')){
    e.target.addEventListener('click',hideModal);

  }else if(clickedElementClass.contains('load-more')){
    e.target.addEventListener('click',showModal);

  }else{
    e.target.addEventListener('click', handleModalClose);

  }
  
}

function handleModalClose(e){
  // get the modal content
  const modal = modalContainer.firstElementChild;

  // if clicked Element does not inside the modal content then hide the Modal
  if(e.target.contains(modal)){
    hideModal();
  }
}

function showModal(){
  modalContainer.style.display = 'block';
}

function hideModal(){
  modalContainer.style.display = 'none';
}


