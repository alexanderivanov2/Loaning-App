class LoginController {
    constructor(userManager) {
        this.userManager = userManager;
        this.loginPage = document.querySelector(".login");
        this.loginForm = this.loginPage.querySelector(".login-form");
        this.submitBtn = this.loginForm.querySelector("input[type='submit']");
        this.loginLoader = this.loginPage.querySelector(".login-load");
    }

    setUpLogin = () => {
        this.loginForm.reset();
        this.submitBtn.disabled = true;

        this.loginForm.oninput = this.handleLoginFormInput;
        this.loginForm.onsubmit = this.handleLoginFormSubmit;
    }

    handleLoginFormInput = () => {
        const formData = Object.fromEntries(new FormData(this.loginForm));
    
        const formValuesArr = getLoginFormValuesInArray(formData);
        const isFilledInputs = validateInputAllFilled(formValuesArr);
        
        const disabledValue = isFilledInputs ? "" : true;

        this.submitBtn.disabled = disabledValue;
    }

    handleLoginFormSubmit = (e) => {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(this.loginForm));

        const formValuesArr = getLoginFormValuesInArray(formData);
        const isFilledInputs = validateInputAllFilled(formValuesArr);
        
        if (!isFilledInputs) {
            alert("You should fill all input fields!");
            return
        }

        this.loginLoader.classList.add("loader");
        this.loginForm.classList.add("hide");

        this.userManager.handleLogin(formData)
            .then(res => {
                if (res === "Wrong Credentials!") {
                    alert(res);
                } else {
                    const hashValue  = getUserType() === "admin" ? "statistics" : "loan";
                    location.hash = hashValue;
                }
            })
            .catch(err => alert("Wrong Credentials"))
            .finally(() => {
                this.loginForm.classList.remove("hide");
                this.loginLoader.classList.remove("loader")
            });
    }
}