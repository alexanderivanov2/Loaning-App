class OverviewController {
    constructor(userManager, loanManager) {
        this.userManager = userManager;
        this.loanManager = loanManager;
        this.loanRequestsTable = document.querySelector(".loan-requests");
        this.tableBody = this.loanRequestsTable.querySelector("tbody");
        this.intervalID = null;
        
    }

    setUpOverviewPage() {
        clearInterval(this.intervalID);
        // TODO CORRECT TO 60000
        this.intervalID = setInterval(() => {
            this.renderTableLoanRequestBody(this.loanManager.getLoans(this.userManager.logged.loanIDs))
        }, 10000)
        this.renderTableLoanRequestBody(this.loanManager.getLoans(this.userManager.logged.loanIDs));
    }

    renderTableLoanRequestBody(loans) {
        const newRows = loans.map(loan => {

            const trEl = createElement("tr", {className: "request-loan-row"});

            trEl.append(createElement("td", {textContent: loan.id}));
            trEl.append(createElement("td", {textContent: loan.requestedAmount}));
            trEl.append(createElement("td", {textContent: loan.requestedTerm}));
            trEl.append(createElement("td", {textContent: loan.status}));
            
            const tdEl = createElement("td");
            const btn = createElement("button", {textContent: "Cancel"});
            tdEl.append(btn);
            if (loan.status === "pending") {
                const btn = createElement("button", {textContent: "Cancel"});
                btn.onclick = () => {};
            } else if (loan.status === "approved") {
                btn.textContent = "View Offers";
                btn.onclick = () => {};
            } else if (loan.status === "rejected") {
                tdEl.replaceChildren("No");
            }
            

            trEl.append(tdEl);


            return trEl;
        });
        
        this.tableBody.replaceChildren(...newRows);
    }
}