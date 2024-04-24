const prompt = require("prompt")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

let users = []

function register(name, username, password) {
    const hashedPassword = bcrypt.hashSync(password, 15)
    const id = users.length + 1
    users.push({ id, name, username, hashedPassword })
    console.log("User has been registered!")
    main()
}

function login(username, password) {
    const user = users.find(user => user.username === username)
    if (!user) {
        console.log("User does not exist")
        return main()
    }

    const pass = bcrypt.compareSync(password, user.hashedPassword)

    if (!pass) {
        console.log("Incorrect password")
        return main()
    }

    const token = jwt.sign({username: user.username}, "NotSoSecret", {algorithm: 'HS256'})

    console.log(`Welcome. Your token: ${token}`)
}

function main() {
    let name, username, password = ""

    const template = `
        Welcome to login/register simulator!

        Please, choose what do you want to do:

        1 - Register a new user
        2 - Login an existing user
    `
    console.log(template)

    prompt.get(['option'], (err, result) => {
        const option = parseInt(result.option)
        switch (option) {
            case 1:
                prompt.get(['name', 'username', 'password'], (err, result) => {
                    register(name, username, password)
                })
                break;
            case 2:
                prompt.get(['username', 'password'], (err, result) => {
                    login(username, password)
                })
                break;
            default:
                console.log("Goodbye!")
                break;
        }
    })
}

main()
