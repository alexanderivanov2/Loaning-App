class LoanController {
    constructor(userManager, loanManager) {
        this.userManager = userManager;
        this.loanManager = loanManager;
        this.borrowForm = document.querySelector(".loan-form");
        this.borrowNameInput = this.borrowForm.querySelector("input[name='borrowerName']");
        this.borrowIncomeInput = this.borrowForm.querySelector("input[name='borrowerIncome']");
    }

    setUpLoanPage = () => {
        const {username:name} = this.userManager.logged;

        this.borrowNameInput.value = name;

        this.borrowForm.oninput = this.handleInputLoanForm;
        this.borrowForm.onsubmit = this.handleSubmitLoanForm;
    }

    handleInputLoanForm = () => {
        //TODO ADD INPUT FUNCTIONALITY
    }

    handleSubmitLoanForm = (e) => {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(this.borrowForm));
        
        Object.assign(formData, {
            username: this.userManager.logged.username,
        });
        
        formatLoanFormData(formData);
        // console.log(formData);
        const {isValidForm, errors }= validateSubmitLoanForm(formData);
        // TODO VALIDATE SALARY
        if (isValidForm) {
            this.loanManager.handleLoanRequest(formData);

            location.hash = "overview";
        } else {
            alert("Wrong data!");
        }
    }
}