class Loan {
    constructor(id, requestedAmount, loanAmount, requestedTerm, monthlyPayment, totalOwnedAmount, interestRate, lenderName, status="progress") {
        this.id = id;
        this.requestedAmount = requestedAmount;
        this.loanAmount = loanAmount;
        this.requestedTerm = requestedTerm;
        this.monthlyPayment = monthlyPayment;
        this.totalOwnedAmount = totalOwnedAmount;
        this.interestRate = interestRate;
        this.lenderName = lenderName;
        this.status = status;
    }
}