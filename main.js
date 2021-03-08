class AuthApp {

  API_URL = 'https://supercode-auth-demo.herokuapp.com/';

  formElem = document.querySelector("form");
  usernameElem = document.querySelector("[name=username]");
  passwordElem = document.querySelector("[name=password]");
  formErrorsElem = document.querySelector(".form-errors");
  modalElem = document.querySelector(".modal-overlay");
  userElem = document.querySelector(".user-name");
  logOutLink = document.querySelector(".logout-link");

  constructor() {
    this.init();
  }

  init() {
    const authUser = this.getCookie("authUser");

    if (authUser) {
      this.modalElem.style.display = "none";
      this.printUserName(authUser);
    }

    this.formElem.addEventListener("submit", (e) => this.login(e));
    this.logOutLink.addEventListener("click", (e) => this.logout(e));
  }

  login(e) {
    e.preventDefault();
    this.clearErrors();

    const userName = this.usernameElem.value.toLowerCase();
    const password = this.passwordElem.value;

    fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name: userName,
        secret: password,
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response.success) {
        this.setCookie("authUser", response.user);
        this.printUserName(response.user);
        this.hideLogin();
      } else {
        this.printError(response.message);
      }
    });
  }

  logout() {
    this.deleteCookie("authUser");
    location.reload();
  }

  printUserName(name) {
    this.userElem.innerHTML = name;
  }

  printError(errorMsg, inputElem = null) {
    this.formErrorsElem.innerHTML = `<div class="error">${errorMsg}</div>`;
    if (inputElem) {
      inputElem.style.color = "red";
    }
  }

  clearErrors() {
    this.usernameElem.style.color = "";
    this.passwordElem.style.color = "";
    this.formErrorsElem.innerHTML = "";
  }

  setCookie(name, value) {
    document.cookie = name + "=" + value;
  }

  getCookie(name) {
    let cookie = {};
    document.cookie.split(";").forEach(el => {
      let [k, v] = el.split("=");
      cookie[k.trim()] = v;
    });
    return cookie[name];
  }

  deleteCookie(name) {
    document.cookie =
      name + "=false" + "; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }

  hideLogin() {
    this.modalElem.classList.remove("show");
  }
}

const app = new AuthApp();
