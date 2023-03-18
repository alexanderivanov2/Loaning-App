class LoanApplication {
    constructor(id, requestedAmount, requestedTerm, monthlyPayment, status="pending", state="wait") {
        this.id = id;
        this.requestedAmount = requestedAmount;
        this.requestedTerm = requestedTerm;
        this.monthlyPayment = monthlyPayment;
        this.status = status;
        this.state = state;
    }
}