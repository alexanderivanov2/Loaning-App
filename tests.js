console.log("       ***TEST FOR SETUP LOCAL STORAGE***\n");
console.log(`TEST FOR SET UP USERS -> ${localStorage.getItem("users")}`);
console.log(`TEST FOR SET UP ADMINS -> ${localStorage.getItem("admins")}`);
console.log(`TEST FOR SET UP LOGGED -> ${localStorage.getItem("logged")}`);
console.log("\n           ***TEST FOR LOGIN***\n");
console.log(`Logged in in localstorage -> ${localStorage.getItem("logged")}`);
viewController.userManager.logout();
console.log("Test Login Valid User -> " + viewController.userManager.login({
    username: "test", password: 123456}));
console.log("Test Login when user is logged -> " + viewController.userManager.login({
        username: "test", password: 123456}));
        
viewController.userManager.logout();
console.log("Test Login with invalid password -> " + viewController.userManager.login({
    username: "test", password: 12345}));
console.log("Test Login with invalid username -> " + viewController.userManager.login({
    username: "test22", password: 123456}));
console.log("\n           ***TEST LOGOUT***\n");
viewController.userManager.login({username: "test", password: 123456})
console.log("Test LOGOUT user -> " + viewController.userManager.logout());
console.log("Test LOGOUT when no logged in user -> " + viewController.userManager.logout());
console.log("\n           *** TEST REGISTER***\n");
console.log("Test Login valid register -> " + viewController.userManager.register({
    username: "test4", password: 123456}));
console.log("Test register with already exist username -> " + viewController.userManager.register({
    username: "test", password: 123456}));
viewController.userManager.login({username: "test", password: 123456});
console.log("Test Login when there is logged in user -> " + viewController.userManager.register({
    username: "test5", password: 123456}));
console.log("\n           ******\n");
console.log("\n           ******\n");