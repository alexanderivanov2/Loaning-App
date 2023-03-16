class LoanController {
    constructor(userManager) {
        this.userManager = userManager;
        this.borrowForm = document.querySelector(".loan-form");
        this.borrowNameInput = this.borrowForm.querySelector("input[name='borrowerName']");
        this.borrowIncomeInput = this.borrowForm.querySelector("input[name='borrowerIncome']");
    }

    setUpLoanPage = () => {
        const {username:name, monthlyIncome: income} = this.userManager.logged;

        this.borrowNameInput.value = name;
        this.borrowIncomeInput.value = income;

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
            monthlyIncome: this.userManager.logged.monthlyIncome,
        });
        console.log(formData);
    }
}