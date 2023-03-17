class StatisticsController {
    constructor(loanManager) {
        this.loanManager = loanManager;
        this.loanStatisticsTable = document.querySelector(".loan-statistics-table");
        this.loanStatisticsTableBody = this.loanStatisticsTable.querySelector("tbody");
        this.divStats = document.querySelector(".overall-stats");
    }

    setUpStatisticsPage() {
        this.loanManager.loans.forEach(loan => console.log(loan));
        this.renderLoanStatisticsTable();
        this.renderOverallTable();
    }

    renderLoanStatisticsTable() {
        const loans = this.loanManager.loans;

        const loanRows = loans.map(loan => {
            const trEl = createElement("tr", {className: "request-loan-row"});

            trEl.append(createElement("td", {textContent: loan.id}));
            trEl.append(createElement("td", {textContent: loan.loanAmount}));
            trEl.append(createElement("td", {textContent: loan.requestedTerm}));
            trEl.append(createElement("td", {textContent: loan.status}));
            trEl.append(createElement("td", {textContent: loan.totalOwnedAmount}));

            return trEl;
        });

        if (loanRows.length) {
            this.loanStatisticsTableBody.replaceChildren(...loanRows);
        } else {
            const trEl = createElement("tr", {className: "request-loan-row"});
            const tdEl = createElement("td", {textContent: "You don't have any applications"})
            tdEl.setAttribute("colspan", 5);
            trEl.append(tdEl);
            
            this.loanStatisticsTableBody.replaceChildren(trEl);
        }
    }

    renderOverallTable() {
        const statistics = this.getOverallStatistics();
        console.log(statistics);

        const eligibleLoanApps = createElement("p", {
            textContent: `Eligible Loan Applications: ${statistics.eligibleLoanApplicatons}`});
        const rejectedLoanApplicatons = createElement("p", {
            textContent: `Rejected Loan Applications: ${statistics.rejectedLoanApplicatons}`});
            //TODO AFTER CLEAR THIS POINT...
            // const numberLoanAppLenders = createElement("p", {
        //     textContent: `: ${statistics.numberLoanAppLenders}`});
        const totalLoanAmountRequested = createElement("p", {
            textContent: `Total Loan Amount Requested: ${statistics.totalLoanAmountRequested}`});
        const totalLoanAmountApproved = createElement("p", {
            textContent: `Total Loan Amount Approved: ${statistics.totalLoanAmountApproved}`});
        const totalMonthlyPaymentForAllLoans = createElement("p", {
            textContent: `Total Monthly Payment For All Loans: ${statistics.totalMonthlyPaymentForAllLoans}`});
        const totalNumberLoanApplications = createElement("p", {
            textContent: `Total Number Of Loan Applications: ${statistics.totalNumberLoanApplications}`});
    
        this.divStats.replaceChildren(eligibleLoanApps, rejectedLoanApplicatons, totalLoanAmountRequested, totalLoanAmountApproved, totalMonthlyPaymentForAllLoans, totalNumberLoanApplications);
    }

    getOverallStatistics() {
        const eligibleLoanApplicatons = this.loanManager.loanApplications.filter(loanApp => {
            return loanApp.status !== "rejected";
        }).length;
        
        const rejectedLoanApplicatons = this.loanManager.loanApplications.length - eligibleLoanApplicatons;
        
        const numberLoanAppLenders = {};
        
        const totalLoanAmountRequested = this.loanManager.loanApplications.reduce((acc, curr) => {
            return acc + curr.requestedAmount
        }, 0);
        
        const totalLoanAmountApproved = this.loanManager.loans.reduce((acc, curr) => {
            return acc + curr.loanAmount
        }, 0);

        const totalMonthlyPaymentForAllLoans = this.loanManager.loans.reduce((acc, curr) => {
            return acc + curr.monthlyPayment
        }, 0);

        const totalNumberLoanApplications = this.loanManager.loanApplications.length;

        const data = {
            eligibleLoanApplicatons,
            rejectedLoanApplicatons,
            numberLoanAppLenders,
            totalLoanAmountRequested,
            totalLoanAmountApproved,
            totalMonthlyPaymentForAllLoans,
            totalNumberLoanApplications,
        };
        
        return data;
    }
}