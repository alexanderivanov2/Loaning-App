class UserManager {
    constructor({users, admins, logged}) {
        this.users = users;
        this.admins = admins;
        this.logged = logged && this.setReferenceUser(logged);
    }

    handleLogin(formData) {
        const loginPromise = new Promise((res, rej) => {
            setTimeout(() => res(this.login(formData)), 3000);
        });

        return loginPromise;
    }

    login = ({username, password}) => {
        if (this.logged) {
            return "You are already logged!"
        }
        
        const isAdminExist = this.admins.find(admin => admin.username === username && admin.password === password);

        if (!isAdminExist) {
            const isUserExist = this.users.find(user => user.username === username && user.password === password);
            
            if (!isUserExist) {
                return "Wrong Credentials!"
            }
   
            this.logged = isUserExist;
        } else {
            this.logged = isAdminExist;
        }
        
        saveInLocalStorage({"logged": this.logged});

        return "You are successfully logged in!"
    }

    register = ({username, password}) => {
        if (this.logged) {
            return "You should logout first!"
        }

        const isUsernameExist = this.users.find(user => user.username === username) ||
                                this.admins.find(admin => admin.username === username);
        
        if (isUsernameExist) {
            return "Username already exist!";
        }

        this.users.push(new User(username, password));
        saveInLocalStorage({"users": this.users});

        return "You are successfully register!"
    }

    logout() {
        if(!this.logged) {
            return "You are not logged in!";
        }

        this.logged = null;
        saveInLocalStorage({"logged": null});

        return "You are successfully logout!"
    }

    setReferenceUser = ({username, password}) => {
        const user = this.users.find(user => user.username === username && user.password === password);
        
        if (user) {
            return user
        }

        const admin =  this.admins.find(user => user.username === username && user.password === password);

        if (admin) {
            return admin
        }

        return null
    }

    setMonthlyIncomeForUser(monthlyIncome) {
        // console.log(this.logged);
        this.logged.monthlyIncome = monthlyIncome;
        saveInLocalStorage({
            "users": this.users,
            "logged": this.logged, 
        });
    }

    setLoanId(id) {
        this.logged.loanIDs.push(id);
        saveInLocalStorage({
            "users": this.users,
            "logged": this.logged, 
        });
    }
}