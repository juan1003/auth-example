import express from "express"
import morgan from "morgan"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan("common"))

export type User = {
    id: number,
    name: string,
    username: string,
    password: string
}

let users: User[] = []

function register(name: string, username: string, password: string) {
    const hashedPassword = bcrypt.hashSync(password, 15)
    const id = users.length + 1
    users.push({ id, name: name, username: username, password: hashedPassword })
    return id
}

function login(username: string, password: string) {
    const user = users.find(user => user.username === username)

    if (!user) {
        return new Error(`User with username ${username} not found.`)
    }

    const pass = bcrypt.compareSync(password, user.password)

    if (!pass) {
        return new Error("Incorrect password")
    }

    const token = jwt.sign({ username: user.username }, "NotSoSecret", { algorithm: 'HS256' })

    return token
}

app.post("/register", (req: express.Request, res: express.Response) => {
    const { name, username, password } = req.body
    const createdUserId = register(name, username, password)

    if (!createdUserId) {
        res.status(500).send("Something wrong happened")
    }

    res.status(301).send(createdUserId)
})

app.post("/login", (req: express.Request, res: express.Response) => {
    const { username, password } = req.body

    const token = login(username, password)

    if(!token) {
        res.status(500).send("Something wrong happened")
    }

    res.status(200).send(token)
})

app.listen(3000, () => {
    console.log("Listening on http://localhost:3000")
})
