class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.monthlyIncome = 0;
        this.ownedMoney = generateRandomIncome();  
        this.loanIDs = [];
    }
}