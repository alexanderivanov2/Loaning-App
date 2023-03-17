class LoanManager{
    constructor(userManager, {loanApplications, loans, lenders}) {
        this.userManager = userManager;
        this.idGenerator = new IdGenerator(localStorage.getItem("freeId"));
        this.loanApplications = loanApplications;
        this.loans = loans;
        this.lenders = lenders;
    }

    handleLoanRequest ({borrowerIncome, requestedAmount, requestedTerm}) {
        this.userManager.setMonthlyIncomeForUser(borrowerIncome);

        const requesterStats = this.getApplicationStats(borrowerIncome, requestedAmount, requestedTerm)
        const id = this.idGenerator.getId();

        const monthlyPayment = requestedAmount / requestedTerm;

        const loanApplication = new LoanApplication(id, requestedAmount, requestedTerm, monthlyPayment);
        this.loanApplications.push(loanApplication);
        
        saveInLocalStorage({"loanApplications": this.loanApplications});
        
        this.userManager.setLoanId(id);

        //  CAN BE SEPERATED TO RETURN IN LOAN CONTROLLER AND CONNECT WITH OVERVIEW CONTROLLER
        const pendingLoan = new Promise((resolve, reject) => {
            if (requesterStats.isEligibilit) {
                setTimeout(() => resolve([requesterStats, loanApplication]), 10000);
            } else {
                setTimeout(() => reject(id), 10000);
            }
        });

        return pendingLoan      
        .then(([requesterStats, requestLoan]) => {
            this.approveLoanApplication(requesterStats, requestLoan.id);
            return true;
        })
        .catch(err => {
            this.rejectedLoanApplication(err);
            return false;
        });
    }

    approveLoanApplication(requesterStats, id) {
        const loan = this.getLoanApplication(id);

        if (loan) {
            loan.status = "approved";
            loan.offers = this.getOffers(requesterStats.interestRate, loan.requestedAmount, loan.requestedTerm, loan.monthlyPayment);
            saveInLocalStorage({"loanApplications": this.loanApplications});
        }
    }

    rejectedLoanApplication(id) {
        const loan = this.getLoanApplication(id);

        if (loan) {
            loan.status = "rejected";
            saveInLocalStorage({"loanApplications": this.loanApplications});
        }
    }

    getLoanApplication(id) {
        return this.loanApplications.find(loan => loan.id === id);
    }
    
    getLoanApplications(ids=this.userManager.logged.loanIDs) {
        return this.loanApplications.filter(loan => ids.includes(loan.id));
    }

    removeLoanApplication(id) {
        const loanApplication= this.getLoanApplication(id);

        loanApplication.status = "cancalled";
        saveInLocalStorage({"loanApplications": this.loanApplications});
    }

    getLoan(id) {
        return this.loans.find(loan => loan.id === id);
    }

    getLoans(ids=this.userManager.logged.loanIDs) {
        console.log(ids);
        return this.loans.filter(loan => ids.includes(loan.id));
    }

    acceptOffer(loanApplication, offer) {
        loanApplication.status = "accepted";
        const {id, requestedAmount, requestedTerm, monthlyPayment} = loanApplication;
        const {interestRate, lenderName, loanAmount} = offer;
        // MAKE RIGHT CALCULATIONS for totalOwned Money
        const totalOwnedAmount =  loanAmount + (loanAmount * (interestRate/100));
        
        const loan = new Loan(id, requestedAmount, loanAmount, requestedTerm, monthlyPayment, totalOwnedAmount, interestRate, lenderName);
        this.loans.push(loan);

        saveInLocalStorage({
            "loans": this.loans,
            "loanApplications": this.loanApplications,
        })
        // save in local storage
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

    getOffers(interestRate, requestedAmount, requestedTerm, monthlyPayment) {
        const offers = [];
    
        this.lenders.forEach(lender => {
            let isOffer = interestRate <= lender.maxInterestRate;
            // TODO NUMBER OF APPLICATIONS CREATE
            if (isOffer) {
                const loanAmount = requestedAmount > lender.maxLoanAmount ? lender.maxLoanAmount : requestedAmount;
                console.log(loanAmount, monthlyPayment, requestedTerm);
                const offer = new Offer(interestRate, requestedAmount, loanAmount, monthlyPayment, requestedTerm, lender.name);
                console.log(offer)
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
