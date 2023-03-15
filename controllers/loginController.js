class LoginController {
    constructor(userManager) {
        this.userManager = userManager;
        this.loginPage = document.querySelector(".login");
        this.loginForm = this.loginPage.querySelector(".login-form");
        this.submitBtn = this.loginForm.querySelector("input[type='submit']");
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

        const loginResult = this.userManager.login(formData);
       
        if (loginResult === "Wrong Credentials!") {
            alert(loginResult);
            return
        }
       
        location.hash = "";
    }
}