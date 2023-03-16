class Lender {
    constructor(name, maxInterestRate, maxLoanAmount) {
        this.name = name;
        this.maxInterestRate = maxInterestRate;
        this.maxLoanAmount = maxLoanAmount;
    }

    canMakeOffer({interestRate, requestedAmount}) {
        return interestRate <= this.maxInterestRate && requestedAmount <= this.requestedAmount 
    }
}