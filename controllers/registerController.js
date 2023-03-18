class RegisterController {
    constructor(userManager) {
        this.userManager = userManager;
        
        this.registerPage = document.querySelector(".register");
        this.registerForm = this.registerPage.querySelector(".register-form");
        this.registerMsg = this.registerForm.querySelector(".register-message");
        this.submitBtn = this.registerForm.querySelector("input[type='submit']");
        this.registerLoader = this.registerPage.querySelector(".register-load");
    }

    setUpRegister = () => {
        this.registerForm.reset();

        this.registerMsg.textContent = "";
        this.submitBtn.disabled = true;

        this.registerForm.oninput = this.handleRegisterFormInput;
        this.registerForm.onsubmit = this.handleRegisterFormSubmit;
    }

    handleRegisterFormInput = () => {
        const formData = Object.fromEntries(new FormData(this.registerForm));
        
        const isValid = validateRegister(formData);

        if (isValid) {
            this.submitBtn.disabled = "";
        } else {
            this.submitBtn.disabled = true;
        }
    }

    handleRegisterFormSubmit = (e) => {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(this.registerForm));

        const isValid = validateRegister(formData);

        this.registerLoader.classList.add("loader");
        this.registerForm.classList.add("hide");

        if (isValid) {
            this.userManager.handleRegister(formData)
                .then(res => {
                    if (res === "You are successfully register!") {
                        location.hash = "login";
                    } else {
                        this.registerMsg.textContent = res;
                    }
                })
                .catch(err => this.registerMsg.textContent = err)
                .finally(() => {
                    this.registerForm.classList.remove("hide");
                    this.registerLoader.classList.remove("loader");
                })
        }
    }
}