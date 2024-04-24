const prompt = require("prompt")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

let users = []

function register(name, username, password) {
    const hashedPassword = bcrypt.hashSync(password, 15)
    const id = users.length + 1
    
    const newUser = {
        id: id,
        name: name,
        username: username,
        password: hashedPassword
    }

    users.push(newUser)
    console.log("User has been registered!")
    return main()
}

function login(username, password) {
    const user = users.find(user => user.username === username)
    if (!user) {
        console.log("User does not exist")
        return main()
    }

    const pass = bcrypt.compareSync(password, user.password)

    if (!pass) {
        console.log("Incorrect password")
        return main()
    }

    const token = jwt.sign({username: user.username}, "NotSoSecret", {algorithm: 'HS256'})

    console.log(`Welcome ${user.name}! Your token: ${token}`)
    return main()
}

function displayUsers() {
    const title = `You have these ${users.length}:`
    console.log(title)
    console.table(users)
    return main()
}

function main() {

    const template = `
        Welcome to login/register simulator!

        Please, choose what do you want to do:

        1 - Register a new user
        2 - Login an existing user
        3 - Get all users
        4 - Exit
    `
    console.log(template)

    prompt.get(['option'], (err, result) => {
        if(err) return;
        const option = parseInt(result.option)
        switch (option) {
            case 1:
                prompt.get(['name', 'username', 'password'], (err, result) => {
                    if(err) return;
                    register(result.name, result.username, result.password)
                })
                break;
            case 2:
                prompt.get(['username', 'password'], (err, result) => {
                    if(err) return;
                    login(result.username, result.password)
                })
                break;
            case 3:
                displayUsers()
                break;
            case 4:
                console.log("Goodbye!")
                break;
            default:
                console.error(`${option} is not an option.`)
                break;
        }
    })
}

main()
