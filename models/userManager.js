class UserManager {
    constructor({users, admins, logged}) {
        this.users = users;
        this.admins = admins;
        this.logged = logged;
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
        
        localStorage.setItem("logged", JSON.stringify(this.logged));

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
        localStorage.setItem("users", JSON.stringify(this.users));

        return "You are successfully register!"
    }

    logout() {
        if(!this.logged) {
            return "You are not logged in!";
        }

        this.logged = null;
        localStorage.setItem("logged", null);

        return "You are successfully logout!"
    }
}