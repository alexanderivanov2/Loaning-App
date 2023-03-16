class LoanManager{
    constructor(userManager, {loans, lenders}) {
        this.userManager = userManager;
        this.idGenerator = new IdGenerator(localStorage.getItem("freeId"));
        this.loans = loans;
        this.lenders = lenders;
    }

    handleLoanRequest ({borrowerIncome, requestedAmount, requestedTerm}) {
        this.userManager.setMonthlyIncomeForUser(borrowerIncome);

        const requesterStats = this.getRequesterStats(borrowerIncome, requestedAmount, requestedTerm)
        const id = this.idGenerator.getId();

        const monthlyPayment = requestedAmount / requestedTerm;
        const requestLoan = new Loan(id, requestedAmount, requestedTerm, monthlyPayment);
        
        this.loans.push(requestLoan);
        saveInLocalStorage({"loans": this.loans});
        this.userManager.setLoanId(id);

        //  CAN BE SEPERATED
        const pendingLoan = new Promise((resolve, reject) => {
            if (requesterStats.isEligibilit) {
                setTimeout(() => resolve([requesterStats, requestLoan]), 10000);
            } else {
                setTimeout(() => reject(id), 10000);
            }
        });

        pendingLoan      
        .then(([requesterStats, requestLoan]) => {
            this.approveLoan(requesterStats, requestLoan.id);
        })
        .catch(err => {
            this.rejected(err);
        })
    }

    approveLoan(requesterStats, id) {
        console.log(id);
        const loan = this.getLoan(id);
        loan.status = "approved";
        loan.offers = this.getOffers(requesterStats, loan);
        saveInLocalStorage({"loans": this.loans});
    }

    rejected(id) {
        const loan = this.getLoan(id);
        loan.status = "rejected";
        saveInLocalStorage({"loans": this.loans});
    }

    getLoan(id) {
        return this.loans.find(loan => loan.id === id);
    }

    getLoans(ids=this.userManager.loanIDs) {
        return this.loans.filter(loan => ids.includes(loan.id));
    }

    getOffers({interestRate, requestedAmount, requestedTerm, monthlyPayment}) {
        const offers = [];
    
        this.lenders.forEach(lender => {
            let isOffer = interestRate <= lender.maxInterestRate;
            // TODO NUMBER OF APPLICATIONS CREATE
            if (isOffer) {
                const loanAmount = requestedAmount > lender.maxLoanAmount ? lender.maxLoanAmount : requestedAmount;
                offers.push(new Offer(interestRate, loanAmount, monthlyPayment, requestedTerm));
            }
        })

        return offers
    }


    getRequesterStats = (borrowerIncome, requestedAmount, requestedTerm) => {
        const yearIncome = borrowerIncome * 12;
        const interestRate = this.calculateInterestRate(yearIncome);
        const isEligibilit = this.calculateEligibility(yearIncome, requestedAmount, requestedTerm);
        return {yearIncome, interestRate, isEligibilit}
    }

    calculateInterestRate(yearIncome) {
        if (yearIncome <= 20000) {
            return 10
        } else if (yearIncome <= 50000) {
            return 8
        } else {
            return 6
        }
    }

    calculateEligibility(yearIncome, requestedAmount, requestedTerm) {
        const halfYearIncome = yearIncome * 0.5;

        if (halfYearIncome >= requestedAmount) {
            return true
        } else if (yearIncome >= requestedAmount && requestedTerm <= 24) {
            return true
        } else {
            return false
        }
    }
}
