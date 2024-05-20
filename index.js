const prompt = require("prompt")
const { register, login } = require("./utils")

let users = []

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
        if (err) return;
        const option = parseInt(result.option)
        switch (option) {
            case 1:
                prompt.get(['name', 'username', 'password'], (err, result) => {
                    if (err) return;
                    register(result.name, result.username, result.password, users)
                })
                break;
            case 2:
                prompt.get(['username', 'password'], (err, result) => {
                    if (err) return;
                    login(result.username, result.password, users)
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
