class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.monthlyIncome = generateRandomIncome();
        this.ownedMoney = 0;
        this.loanIDs = [];
    }
}