class Loan {
    constructor(id, requestedAmount, requestedTerm, monthlyPayment, totalOwnedAmount, interestRate, lenderName, status="active") {
        this.id = id;
        this.requestedAmount = requestedAmount;
        this.requestedTerm = requestedTerm;
        this.monthlyPayment = monthlyPayment;
        this.totalOwnedAmount = totalOwnedAmount;
        this.interestRate = interestRate;
        this.lenderName = lenderName;
        this.status = status;
    }
}