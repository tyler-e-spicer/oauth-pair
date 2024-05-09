const controller = {};

controller.login = (req, res, next) => {
    // fake credentials for checking 
    const userObj = {
        username: 'Username',
        password: 'Password'
    };

    const { username, password } = req.body;
    console.log(`We hit the controller with user: ${username} and password: ${password}.`)

    if (username === userObj.username && password === userObj.password) {
        next()
    } else {
        next('Please provide a valid username and password.')
    }
}

export default controller;