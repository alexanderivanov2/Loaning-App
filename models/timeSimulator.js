class TimeSimulator {
    constructor(userManager) {
        this.userManager = userManager;
        this.simulatorId = null;
    }

    startTimeSimulator = () => {
        clearInterval(this.simulatorId);
        this.simulatorId = setInterval(this.simulateOneMonth, 30000);
    }

    simulateOneMonth = () => {
        console.log("new month => " + new Date().toLocaleTimeString());

        this.userManager.users.forEach(user => {
            user.ownedMoney += user.monthlyIncome;
        });

        localStorage.setItem("users", JSON.stringify(this.userManager.users));
    }
}