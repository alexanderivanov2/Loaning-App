class LoanController {
    constructor(userManager, loanManager, overviewController) {
        this.userManager = userManager;
        this.loanManager = loanManager;

        this.overviewController = overviewController;
        
        this.borrowForm = document.querySelector(".loan-form");
        this.formMsg = this.borrowForm.querySelector(".loan-form-message");
        this.borrowNameInput = this.borrowForm.querySelector("input[name='borrowerName']");
        this.borrowSubmitBtn = this.borrowForm.querySelector("input[type='submit']");
        this.borrowIncomeInput = this.borrowForm.querySelector("input[name='borrowerIncome']");
    }

    setUpLoanPage = () => {
        const {username:name} = this.userManager.logged;

        this.borrowForm.reset();
        this.borrowSubmitBtn.disabled = "true";

        this.borrowNameInput.value = name;

        this.borrowForm.oninput = this.handleInputLoanForm;
        this.borrowForm.onsubmit = this.handleSubmitLoanForm;
    }

    handleInputLoanForm = () => {
        const formData = Object.fromEntries(new FormData(this.borrowForm));
    
        Object.assign(formData, {
            username: this.userManager.logged.username,
        });
        
        formatLoanFormData(formData);

        const {isValidForm} = validateSubmitLoanForm(formData);

        if (isValidForm) {
            this.borrowSubmitBtn.disabled = "";
        } else {
            this.borrowSubmitBtn.disabled = "true";
        }
    }

    handleSubmitLoanForm = (e) => {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(this.borrowForm));
        
        Object.assign(formData, {
            username: this.userManager.logged.username,
        });
        
        formatLoanFormData(formData);
  
        const {isValidForm, errors } = validateSubmitLoanForm(formData);
        
        if (isValidForm) {
            location.hash = "overview";

            this.loanManager.handleLoanApplication(formData)
                .then(res => {
                    this.overviewController.updateApplicationStatus(res);
                })

        } else {
            this.formMsg.textContent = errors.join("\n");
        }
    }
} 