const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./db')
const routes = require("./routes/users")
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})
app.get("/users", routes.getUsers);
app.get("/users/:id", routes.getUserById)
app.post("/users", routes.createUser);
app.put("/users/:id", routes.updateUser)
app.delete("/users/:id", routes.deleteUser);




app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})