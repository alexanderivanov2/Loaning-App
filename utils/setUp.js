function setUpUserManagerData() {
    const keys = ["users", "admins", "logged"];
    const data = {};

    keys.forEach(key => {
        let value = localStorage.getItem(key);
        value = JSON.parse(value);

        data[key] = value;
    });

    return data;
}

function setUpLocalStorage() {
    const keys = ["users", "admins", "logged"];

    keys.forEach(key => {
        let value = localStorage.getItem(key);
        value = value || JSON.parse(value);

        if (key !== "logged" && !value) {
            let value = []
            switch(key) {
                case "admins":
                    value.push(new Admin("admin", "admin123"))
                    break;
                case "users":
                    value.push(new User("test", 123456), new User("test2", 123456));
                }

                localStorage.setItem(key, JSON.stringify(value));
        }

        if (key === "logged" && !value) {
            localStorage.setItem(key, null);
        }
    })
}