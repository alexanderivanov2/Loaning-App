class OverviewController {
    constructor(userManager, loanManager) {
        this.userManager = userManager;
        this.loanManager = loanManager;

        this.loanRequestsTable = document.querySelector(".loan-requests");
        this.LoanApplicationstableBody = this.loanRequestsTable.querySelector("tbody");
        this.loanTable = document.querySelector(".loan-table");
        this.loanTableBody = this.loanTable.querySelector("tbody");
        this.offersDiv = document.querySelector(".offers-wrapper");
        
        this.intervalID = null;
        
    }

    setUpOverviewPage() {
        // clearInterval(this.intervalID);
        // TODO CORRECT TO 60000
        // this.intervalID = setInterval(() => {
        //     this.renderTableLoanRequestBody()
        // }, 10000)

        this.offersDiv.replaceChildren();
        this.renderTableLoanRequestBody();
        this.renderTableLoans();
    }

    renderTableLoanRequestBody() {
        const loanApplications = this.loanManager
                .getLoanApplications(this.userManager.logged.loanIDs)
                .filter(loanApplication => !["cancalled", "accepted"].includes(loanApplication.status));
        const newRows = loanApplications.map(loanApplication => {

            const trEl = createElement("tr", {className: "request-loan-row"});

            trEl.append(createElement("td", {textContent: loanApplication.id}));
            trEl.append(createElement("td", {textContent: loanApplication.requestedAmount}));
            trEl.append(createElement("td", {textContent: loanApplication.requestedTerm}));
            trEl.append(createElement("td", {textContent: loanApplication.status}));
            
            const tdEl = createElement("td");
            const btn = createElement("button", {textContent: "Cancel"});
            tdEl.append(btn);

            if (loanApplication.status !== "approved") {
                btn.onclick = (e) => {
                    console.log("click");
                    this.loanManager.removeLoanApplication(loanApplication.id);
                    console.log(e.currentTarget.parentElement.parentElement)
                    // e.currentTarget.parentElement.parentElement.remove();
                    trEl.remove();
                };
            } else if (loanApplication.status === "approved") {
                btn.textContent = "View Offers";
                btn.onclick = () => this.renderOffers(loanApplication.offers, loanApplication, trEl);
            } else if (loanApplication.status === "rejected") {
                tdEl.replaceChildren("No");
            }

            trEl.append(tdEl);


            return trEl;
        });
        
        this.LoanApplicationstableBody.replaceChildren(...newRows);
    }

    renderTableLoans() {
        const loans = this.loanManager.getLoans();

        const loanRows = loans.map(loan => {
            const trEl = createElement("tr", {className: "request-loan-row"});

            trEl.append(createElement("td", {textContent: loan.id}));
            trEl.append(createElement("td", {textContent: loan.requestedAmount}));
            trEl.append(createElement("td", {textContent: loan.requestedTerm}));
            trEl.append(createElement("td", {textContent: loan.status}));
            
            const tdEl = createElement("td");
            const btn = createElement("button", {textContent: "Repay In Full"});

            btn.onclick = () => {
                console.log("hi");
            }
            tdEl.append(btn);
            trEl.append(tdEl);
            
            trEl.append(createElement("td", {textContent: loan.totalOwnedAmount}));

            return trEl;
        });

        this.loanTableBody.replaceChildren(...loanRows);
    }

    renderOffers(offers, loanApplication, trEl) {
        console.log(offers);

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
                this.loanManager.acceptOffer(loanApplication, offer)
                trEl.remove();
                this.offersDiv.replaceChildren();
            }; 
            divEl.append(buttton);

            return divEl;
        });

        this.offersDiv.replaceChildren(...offerCards);
    }
}