const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

function register(name, username, password, users) {
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
}

function login(username, password, users) {
    const user = users.find(user => user.username === username)
    if (!user) {
        console.log("User does not exist")
        return 
    }

    const pass = bcrypt.compareSync(password, user.password)

    if (!pass) {
        console.log("Incorrect password")
        return
    }

    const token = jwt.sign({username: user.username}, "NotSoSecret", {algorithm: 'HS256'})

    console.log(`Welcome ${user.name}! Your token: ${token}`)
}

module.exports = { register, login }
