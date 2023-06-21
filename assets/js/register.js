import { _ } from "./utils/general.js";
import { loginUser, registerUser } from "./api/user-api.js";
import { showAlert } from "./utils/alert.js";

const formsToggleBtns = _.querySelectorAll(".toggle-button");
const forms = _.querySelectorAll(".forms__form");

forms.forEach((form) => {
  handleInputLabels(form);
  form.addEventListener("submit", handleFormSubmit);
});

formsToggleBtns.forEach((formsToggleBtn) => {
  formsToggleBtn.addEventListener("click", handleFormClass);
  formsToggleBtn.addEventListener("click", handleToggleBtnClass);
});

function handleToggleBtnClass() {
  if (!this.classList.contains("active-toggle")) {
    const activeBtn = _.querySelector(".toggle-button.active-toggle");

    activeBtn.classList.remove("active-toggle");
    this.classList.add("active-toggle");
  }
}

function handleFormClass() {
  const targetForm = _.getElementById(this.dataset.form);

  if (!targetForm.classList.contains("active-form")) {
    const activeForm = _.querySelector(".forms__form.active-form");

    activeForm.classList.remove("active-form");
    targetForm.classList.add("active-form");
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const formDataObj = Object.fromEntries(formData.entries());
  const validationObj = validateForm(formDataObj, this);

  clearInputErrors(this);

  if (validationObj.err) {
    showErrors(validationObj, this);
  } else {
    clearInputValues(this);

    if (this.id === "login") {
      handleUserLogin(validationObj);
    } else {
      handleUserRegister(validationObj);
    }
  }
}

async function handleUserLogin(userObj = {}) {
  try {
    const { token } = await loginUser(userObj);

    localStorage.setItem("token", token);
    location.href = "/";
  } catch (e) {
    showAlert("error", e.message, 2000);
  }
}

async function handleUserRegister(userObj) {
  try {
    const { message } = await registerUser(userObj);

    changeClasses();

    showAlert("done", message, 2000);
  } catch (e) {
    showAlert("error", e.message, 2000);
  }
}

function changeClasses() {
  _.querySelector("#register").classList.remove("active-form");
  _.querySelector("#login").classList.add("active-form");

  _.querySelector('[data-form="register"]').classList.remove("active-toggle");
  _.querySelector('[data-form="login"]').classList.add("active-toggle");
}

function handleInputLabels(form) {
  const formInputs = Array.from(form.elements).filter(
    (elem) => elem.nodeName === "INPUT" && elem.type !== "radio"
  );

  formInputs.forEach((input) => input.addEventListener("input", handleLabels));
}

function handleLabels(e) {
  if (e.target.value) {
    e.target.nextElementSibling.style.transform = "translate(-4%, -180%)";
  } else {
    e.target.nextElementSibling.style.transform = "translate(0, -50%)";
  }
}

function showErrors(errorObj = {}, form) {
  const formElems = form.elements;

  for (let key in errorObj.err) {
    if (key !== "gender") {
      formElems[key].parentElement.lastElementChild.textContent =
        errorObj.err[key];
    } else {
      formElems.male.closest(".form__radios").lastElementChild.textContent =
        errorObj.err[key];
    }
  }
}

function clearInputErrors(form) {
  const formInputs = filterFormInputs(form.elements);

  formInputs.forEach((input) => {
    if (input.type !== "radio") {
      input.parentElement.lastElementChild.textContent = "";
    } else {
      input.closest(".form__radios").lastElementChild.textContent = "";
    }
  });
}

function validateForm(formDatasObj = {}, form) {
  const selectedGender = form.querySelector('input[name="gender"]:checked'),
    userData = { ...formDatasObj },
    errors = {};

  let trimmedValue;

  if (form.id === "register") {
    userData.gender = selectedGender?.value;
  }

  for (let key in userData) {
    trimmedValue = userData[key]?.trim();

    if (key === "email") {
      if (!validateEmail(trimmedValue)) {
        errors[key] = "Please enter a valid email address !";
      }
    } else if (key === "password") {
      if (!validatePassword(trimmedValue)) {
        errors[key] =
          "Password must be between 7-12 characters and it should contain uppercase, lowercase and special characters";
      }
    } else if (key === "confirmPass") {
      if (userData.password !== trimmedValue) {
        errors[key] = "Passwords did not match !";
      }
    } else if (key === "username") {
      if (trimmedValue.length < 6 || trimmedValue.length > 10) {
        errors[key] = "Username must be between 6 to 10 characters !";
      }
    } else if (key === "phone") {
      if (trimmedValue.length <= 0 || trimmedValue.length > 11) {
        errors[key] = "Please enter a valid phone number !";
      }
    } else if (key === "gender" && trimmedValue === undefined) {
      errors[key] = "Please select one of the above !";
    }
  }

  return Object.entries(errors).length <= 0 ? userData : { err: errors };
}

function validateEmail(email = "") {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  return emailRegex.test(email);
}

function validatePassword(pass = "") {
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])\S{7,12}$/;

  return passRegex.test(pass);
}

function clearInputValues(form) {
  const formInputs = filterFormInputs(form.elements);

  formInputs.forEach((input) => {
    if (input.type === "radio" && input.checked) {
      input.checked = false;
    } else {
      input.value = "";
    }
  });
}

function filterFormInputs(formElems = []) {
  return Array.from(formElems).filter((elem) => elem.nodeName === "INPUT");
}
