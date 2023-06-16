import { _ } from "./utils/general.js";
import { registerUser } from "./api/user-api.js";
import { showAlert } from "./utils/alert.js";

const formsToggleBtns = _.querySelectorAll(".toggle-button");
const forms = _.querySelectorAll(".forms__form");

forms.forEach((form) => {
  handleInputLabels(form);
  form.addEventListener("submit", handleFormsSubmit);
});

formsToggleBtns.forEach((formsToggleBtn) => {
  formsToggleBtn.addEventListener("click", handleFormsClass);
});

function handleFormsClass() {
  const targetForm = _.getElementById(this.dataset.form);

  formsToggleBtns.forEach((formsToggleBtn) =>
    formsToggleBtn.classList.remove("active-toggle")
  );
  forms.forEach((form) => form.classList.remove("active-form"));

  targetForm.classList.add("active-form");
  this.classList.add("active-toggle");
}

function handleFormsSubmit(e) {
  e.preventDefault();

  if (this.id === "login") {
    handleLoginForm(this);
  } else {
    handleRegisterForm(this);
  }
}

function handleLoginForm(loginForm) {}

function handleRegisterForm(registerForm) {
  const registerFormData = new FormData(registerForm);
  const formDataAsObj = Object.fromEntries(registerFormData.entries());
  const validationObj = validateForm(formDataAsObj, registerForm);

  if (validationObj.err) {
    showErrors(validationObj, registerForm);
  } else {
    sendUserDataToServer(validationObj);
  }
}

async function sendUserDataToServer(userObj = {}) {
  try {
    const {message} = await registerUser(userObj);

    forms.forEach(form => form.classList.remove('active-form'));
    _.querySelector('#login').classList.add('active-form');

    showAlert("done", message , 2000);
  } catch (e) {
    showAlert("error", e.message, 2000);
  }
}

function handleInputLabels(form) {
  const formInputs = Array.from(form.elements).filter(
    (elem) => elem.nodeName === "INPUT" && elem.computedRole !== "radio"
  );

  formInputs.forEach((input) => input.addEventListener("input", handleLabels));

  function handleLabels(e) {
    if (e.target.value) {
      e.target.nextElementSibling.style.transform = "translate(-4%, -180%)";
      e.target.nextElementSibling.style.color = "var(--color-slate-300);";
    } else {
      e.target.nextElementSibling.style.transform = "translate(0, -50%)";
    }
  }
}

function showErrors(errorObj = {}, form) {
  const formElems = form.elements;

  clearInputErrors(form);
  for (let key in errorObj.err) {
    if (key === "gender") {
      formElems.male.closest(".form__radios").lastElementChild.textContent =
        errorObj.err[key];
    } else {
      formElems[key].parentElement.lastElementChild.textContent =
        errorObj.err[key];
    }
  }
}

function clearInputErrors(form) {
  const formInputs = Array.from(form.elements).filter(
    (elem) => elem.nodeName === "INPUT"
  );

  formInputs.forEach((input) => {
    if (input.computedRole === "radio") {
      input.closest(".form__radios").lastElementChild.textContent = "";
    } else {
      input.parentElement.lastElementChild.textContent = "";
    }
  });
}

function validateForm(formDatasObj = {}, form) {
  const selectedGender = form.querySelector('input[name="gender"]:checked'),
    userData = { ...formDatasObj, gender: selectedGender?.value },
    errors = {};

  let trimmedValue;

  for (let key in userData) {
    trimmedValue = userData[key]?.trim();

    if (key === "username") {
      if (trimmedValue.length < 6 || trimmedValue.length > 10) {
        errors[key] = "Username must be between 6 to 10 characters !";
      }
    } else if (key === "password") {
      if (!validatePassword(trimmedValue)) {
        errors[key] =
          "Password must be between 1-12 characters and it should contain uppercase, lowercase and special characters";
      }
    } else if (key === "confirmPass") {
      if (userData.password !== trimmedValue) {
        errors[key] = "Passwords did not match !";
      }
    } else if (key === "email") {
      if (!validateEmail(trimmedValue)) {
        errors[key] = "Please enter a valid email address !";
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
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])\S{1,12}$/;

  return passRegex.test(pass);
}
