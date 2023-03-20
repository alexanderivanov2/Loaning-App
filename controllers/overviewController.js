class OverviewController {
    constructor(userManager, loanManager) {
        this.userManager = userManager;
        this.loanManager = loanManager;

        this.loanRequestsTable = document.querySelector(".loan-requests");
        this.LoanApplicationstableBody = this.loanRequestsTable.querySelector("tbody");
        this.loanTable = document.querySelector(".loan-table");
        this.loanTableBody = this.loanTable.querySelector("tbody");
        this.offersDiv = document.querySelector(".offers-wrapper");
    }

    setUpOverviewPage() {
        this.offersDiv.replaceChildren();

        this.renderTableLoanApplicationsBody();
        this.renderTableLoans();
    }

    renderTableLoanApplicationsBody() {
        this.LoanApplicationstableBody.replaceChildren(this.createTableLoader(5));
        this.loanManager
                .getLoanApplications(this.userManager.logged.loanIDs)
                .then(resData => {
                    const loanApplications = resData
                        .filter(loanApplication => loanApplication.state === "wait");

                    const newRows = loanApplications.map(loanApplication => {

                        const trEl = this.createTableLoanApplicationsRow(loanApplication);
            
                        return trEl;
                    });
                    
                    if (newRows.length) {
                        this.LoanApplicationstableBody.replaceChildren(...newRows);
                    } else {
                        const trEl = createElement("tr", {className: "request-loan-row"});
                        const tdEl = createElement("td", {textContent: "You don't have any applications"})
                        tdEl.setAttribute("colspan", 5);
                        trEl.append(tdEl)
                        this.LoanApplicationstableBody.replaceChildren(trEl);
                    }
                });
    }

    createTableLoanApplicationsRow(loanApplication) {
        const trEl = createElement("tr", {className: `request-loan-row application-${loanApplication.id}`});

            trEl.append(createElement("td", {textContent: loanApplication.id}));
            trEl.append(createElement("td", {textContent: loanApplication.requestedAmount}));
            trEl.append(createElement("td", {textContent: loanApplication.requestedTerm}));
            
            const tdStatus = createElement("td");
            const pStatus = createElement("p", {textContent: loanApplication.status, className: "td-p-status"});
            const spanDotStatus = createElement("span");
            let color = "yellow";

            if (loanApplication.status === "rejected") {
                color = "orangered";
            } else if (loanApplication.status === "approved") {
                color = "green";
            }

            spanDotStatus.className = `dot-status dot-color-${color}`;
            pStatus.prepend(spanDotStatus);
            tdStatus.append(pStatus)
            trEl.append(tdStatus);
            
            const tdEl = createElement("td");
            tdEl.style.width = "200px";

            if (loanApplication.status === "approved") {
                const btnOffers = createElement("button", {textContent: "View Offers"});
                btnOffers.style.marginRight = "10px";
                
                btnOffers.onclick = () => {
                    this.renderOffers(loanApplication.offers, loanApplication, trEl);
                }

                tdEl.append(btnOffers);
            }

            const btn = createElement("button", {textContent: "Cancel"});

            btn.onclick = () => {
                this.loanManager.removeLoanApplication(loanApplication.id);
                trEl.remove();
            }

            tdEl.append(btn);
            trEl.append(tdEl);

            return trEl;
    }

    updateApplicationStatus(id) {
        const className = `application-${id}`;
        const application = this.loanManager.getLoanApplication(id);

        const trEl = this.LoanApplicationstableBody.querySelector(`.${className}`);
        const newTrEl = this.createTableLoanApplicationsRow(application);
        
        if (trEl) {
            this.LoanApplicationstableBody.replaceChild(newTrEl, trEl);
        }
    }

    renderTableLoans() {
        this.loanTableBody.replaceChildren(this.createTableLoader(6));

        this.loanManager.getLoans()
            .then(resData => {
                const loanRows = resData.map(loan => this.createTableLoanRow(loan));
        
                if (loanRows.length) {
                    this.loanTableBody.replaceChildren(...loanRows);
                } else {
                    const trEl = createElement("tr", {className: "request-loan-row no-loans"});
                    const tdEl = createElement("td", {textContent: "You don't have any Loans"})
                    tdEl.setAttribute("colspan", 6);
                    trEl.append(tdEl);
        
                    this.loanTableBody.replaceChildren(trEl);
                }
            })
    }

    createTableLoanRow(loan) {
        const trEl = createElement("tr", {className: `request-loan-row loan-row-${loan.id}`});
        
        trEl.append(createElement("td", {textContent: loan.id}));
        trEl.append(createElement("td", {textContent: loan.requestedAmount}));
        trEl.append(createElement("td", {textContent: loan.requestedTerm}));
        trEl.append(createElement("td", {textContent: loan.status}));
                    
                
        const tdEl = createElement("td");
                    
        if (loan.status === "progress") {
            const btn = createElement("button", {textContent: "Repay In Full"});
            
            btn.onclick = () => {
                const response = this.loanManager.repaidLoan(loan.id);
            
                if (response.isRepaid) {
                    this.loanTableBody.replaceChild(this.createTableLoanRow(loan), trEl);
                } else {
                    alert(response.alert);
                }
            }
            tdEl.append(btn);
        } else {
            tdEl.textContent = "No Action";
        }

        trEl.append(tdEl);
                    
        trEl.append(createElement("td", {textContent: loan.totalOwnedAmount}));
        
        return trEl;
    }

    renderOffers(offers, loanApplication, trEl) {
        const offerCards = offers.map(offer => {
            const divEl = createElement("div", {className: "offer-card"});

            divEl.append(createElement("h2", {textContent: "Offer"}));
            divEl.append(createElement("p", {textContent: `Lender Name: ${
                offer.lenderName
            }`}));
            divEl.append(createElement("p", {textContent: `Interest Rate: ${offer.interestRate
            }%`}));
            divEl.append(createElement("p", {textContent: `Loan Amount: ${offer.loanAmount.toFixed(2)}`}));
            divEl.append(createElement("p", {textContent: `Monthly Payment: ${offer.monthlyPayment.toFixed(2)}`}));
            divEl.append(createElement("p", {textContent: `Loan Term: ${offer.loanTerm}`}));
            const buttton = createElement("button", {textContent: "Accept Offer"});
        
            buttton.onclick = () => {
                const loan = this.loanManager.acceptOffer(loanApplication, offer)
                trEl.remove();
                this.offersDiv.replaceChildren();

                if (this.loanTableBody.querySelector(".no-loans")) {
                    this.loanTableBody.replaceChildren();
                }
                this.loanTableBody.append(this.createTableLoanRow(loan));
            }; 
            divEl.append(buttton);

            return divEl;
        });

        this.offersDiv.replaceChildren(...offerCards);
    }

    createTableLoader(colspan) {
        const trLoader = createElement("tr");
        trLoader.style.height = 200;
        
        const tdLoader = createElement("td",);
        tdLoader.setAttribute("colspan", colspan);
        
        const pLoader = createElement("p", {className: "loader"});
        pLoader.style.margin = "auto";
        tdLoader.append(pLoader);
        

        trLoader.append(tdLoader);

        return trLoader
    }
}