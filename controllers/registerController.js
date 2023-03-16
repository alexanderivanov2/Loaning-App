class RegisterController {
    constructor(userManager) {
        this.userManager = userManager;
        this.registerPage = document.querySelector(".register");
        this.registerForm = this.registerPage.querySelector(".register-form");
        this.submitBtn = this.registerForm.querySelector("input[type='submit']");
    }

    setUpRegister = () => {
        this.registerForm.reset();
        this.submitBtn.disabled = true;

        this.registerForm.oninput = this.handleRegisterFormInput;
        this.registerForm.onsubmit = this.handleRegisterFormSubmit;
    }

    handleRegisterFormInput = () => {
        const formData = Object.fromEntries(new FormData(this.loginForm));
    
        // TODO: ADD REGISTER INPUT FUNCTIONALITY
        // const formValuesArr = getLoginFormValuesInArray(formData);
        // const isFilledInputs = validateInputAllFilled(formValuesArr);
        
        // const disabledValue = isFilledInputs ? "" : true;

        // this.submitBtn.disabled = disabledValue;
    }

    handleRegisterFormSubmit = (e) => {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(this.loginForm));

        // TODO: ADD REGISTER SUBMIT FUNCTIONALITY
        // const formValuesArr = getLoginFormValuesInArray(formData);
        // const isFilledInputs = validateInputAllFilled(formValuesArr);
        
        // if (!isFilledInputs) {
        //     alert("You should fill all input fields!");
        //     return
        // }

        // const loginResult = this.userManager.login(formData);
       
        // if (loginResult === "Wrong Credentials!") {
        //     alert(loginResult);
        //     return
        // }
       
        // location.hash = "";
    }
}