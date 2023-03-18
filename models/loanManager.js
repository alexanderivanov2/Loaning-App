class LoanManager{
    constructor(userManager, {loanApplications, loans, lenders}) {
        this.userManager = userManager;
        this.idGenerator = new IdGenerator(localStorage.getItem("freeId"));
        this.loanApplications = loanApplications;
        this.loans = loans;
        this.lenders = lenders;
    }

    handleLoanApplication ({borrowerIncome, requestedAmount, requestedTerm}) {
        this.userManager.setMonthlyIncomeForUser(borrowerIncome);

        const applicatorStats = this.getApplicationStats(borrowerIncome, requestedAmount, requestedTerm)
        const id = this.idGenerator.getId();

        const monthlyPayment = requestedAmount / requestedTerm;

        const loanApplication = new LoanApplication(id, requestedAmount, requestedTerm, monthlyPayment);
        this.loanApplications.push(loanApplication);
        
        this.userManager.setLoanId(id);
        saveInLocalStorage({"loanApplications": this.loanApplications});
        
        const pendingLoan = new Promise((resolve, reject) => {

            setTimeout(() => {
                const status = applicatorStats.isEligibilit ? "approved" : "rejected"
                
                if (status === "approved") {
                    this.approveLoanApplication(applicatorStats, id);
                } else {
                    this.rejectedLoanApplication(id);
                }

                resolve(id);
            }, 10000);
        });

        return pendingLoan      
    }

    approveLoanApplication(applicatorStats, id) {
        const loanApp = this.getLoanApplication(id);

        if (loanApp) {
            loanApp.status = "approved";
            loanApp.offers = this.getOffers(applicatorStats.interestRate, loanApp.requestedAmount, loanApp.requestedTerm);
            saveInLocalStorage({"loanApplications": this.loanApplications});
        }
    }

    rejectedLoanApplication(id) {
        const loanApp = this.getLoanApplication(id);

        if (loanApp) {
            loanApp.status = "rejected";
            saveInLocalStorage({"loanApplications": this.loanApplications});
        }
    }

    getLoanApplication(id) {
        return this.loanApplications.find(loan => loan.id === id);
    }
    
    getLoanApplications(ids=this.userManager.logged.loanIDs) {
        const result = this.loanApplications.filter(loan => ids.includes(loan.id));

        return new Promise((res, rej) => {
            setTimeout(() => res(result), 1000);
        }) 
    }

    removeLoanApplication(id) {
        const loanApplication= this.getLoanApplication(id);

        loanApplication.state = "cancelled";
        saveInLocalStorage({"loanApplications": this.loanApplications});
    }

    getLoan(id) {
        return this.loans.find(loan => loan.id === id);
    }

    getLoans(ids=this.userManager.logged.loanIDs) {
        const result = this.loans.filter(loan => ids.includes(loan.id));
        return new Promise((res, rej) => {
            setTimeout(() => res(result), 1000);
        })
    }

    acceptOffer(loanApplication, offer) {
        const {id, requestedAmount, requestedTerm, monthlyPayment} = loanApplication;
        const {interestRate, lenderName, loanAmount} = offer;

        loanApplication.state = "accepted";

        const totalOwnedAmount =  loanAmount + (loanAmount * (interestRate/100));
        
        const loan = new Loan(id, requestedAmount, loanAmount, requestedTerm, monthlyPayment, totalOwnedAmount, interestRate, lenderName);
        this.loans.push(loan);

        saveInLocalStorage({
            "loans": this.loans,
            "loanApplications": this.loanApplications,
        });

        return loan;
    }

    repaidLoan(id) {
        const loan = this.getLoan(id);
        const isActualUser = this.userManager.logged.loanIDs.includes(id);

        const response = {
            isRepaid:false,
        }

        if (isActualUser) {
            const ownedMoney = this.userManager.logged.ownedMoney;

            if (ownedMoney >= loan.loanAmount) {
                loan.status = "repaid";
                response.isRepaid = true;
                this.userManager.logged.ownedMoney -= loan.loanAmount;

                saveInLocalStorage({
                    "logged": this.userManager.logged,
                    "users": this.userManager.users,
                    "loans": this.loans,
                });
            } else {
                response.alert = "You don't have enough money to repaid the loan!";
            }

        } else {
            response.alert = "You don't have enough money to repaid the loan!";
        }

        return response;
    }

    getOffers(interestRate, requestedAmount, requestedTerm) {
        const offers = [];
    
        this.lenders.forEach(lender => {
            let isOffer = interestRate <= lender.maxInterestRate;
            if (isOffer) {
                const loanAmount = requestedAmount > lender.maxLoanAmount ? lender.maxLoanAmount : requestedAmount;
      
                const monthlyPayment = loanAmount / requestedTerm;

                const offer = new Offer(interestRate, requestedAmount, loanAmount, monthlyPayment, requestedTerm, lender.name);
                offers.push(offer);
            }
        })

        return offers
    }

    getApplicationStats = (borrowerIncome, requestedAmount, requestedTerm) => {
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
