const addPlayListBtn = document.querySelector('.load-more');
const closeModalBtn = document.querySelector('.close-modal');
const modalContainer = document.querySelector('.container__modal');

closeModalBtn.addEventListener('click',hideModal);
addPlayListBtn.addEventListener('click',showModal);
modalContainer.addEventListener('click', handleModalClose);

function handleModalClose(e){
  const modal = modalContainer.firstElementChild;

  // if clicked Element does not inside the modal then hide the Modal
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


