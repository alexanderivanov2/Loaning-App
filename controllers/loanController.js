class LoanController {
    constructor(userManager, loanManager, overviewController) {
        this.userManager = userManager;
        this.loanManager = loanManager;
        this.overviewController = overviewController;
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
        // TODO VALIDATE SALARY
        const {isValidForm, errors }= validateSubmitLoanForm(formData);
        
        if (isValidForm) {
            location.hash = "overview";

            this.loanManager.handleLoanRequest(formData)
            .then(res => {
                console.log(res);
                this.overviewController.renderTableLoanRequestBody();
            })

            
        } else {
            alert("Wrong data!");
        }
    }
}