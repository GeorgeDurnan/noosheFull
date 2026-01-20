const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./db')
const routeUser = require("./routes/users")
const routeProduct = require("./routes/products")
const routeCart = require("./routes/carts")
const routeOrder = require("./routes/orders")
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})
app.get("/users", routeUser.getUsers);
app.get("/users/:id", routeUser.getUserById);
app.post("/users", routeUser.createUser);
app.put("/users/:id", routeUser.updateUser)
app.delete("/users/:id", routeUser.deleteUser);

app.get("/products", routeProduct.getProducts);
app.get("/products/:id", routeProduct.getProductById)
app.post("/products", routeProduct.createProduct)
app.put("/products/:id", routeProduct.updateProduct);
app.delete("/products/:id", routeProduct.deleteProduct);

app.get("/carts", routeCart.getCarts)
app.get("/carts/:id", routeCart.getCartById)
app.get("/carts/items/:id", routeCart.getCartItems)
app.post("/carts", routeCart.createCart)
app.put("/carts/:id", routeCart.updateCart)
app.post("/carts/addItem", routeCart.addItemToCart)
app.delete("/carts/:id", routeCart.deleteCart)

app.get("/orders", routeOrder.getOrders)
app.get("/orders/:id", routeOrder.getOrderById)
app.get("/orders/items/:id", routeOrder.getOrderItems)
app.post("/orders", routeOrder.createOrder)
app.put("/orders/:id", routeOrder.updateOrder)
app.post("/orders/addItem", routeOrder.addItemToOrder)
app.delete("/orders/:id", routeOrder.deleteOrder)




app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})