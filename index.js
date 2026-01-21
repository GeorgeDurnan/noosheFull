const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const pool = require('./db')
const port = 3000
const routeUser = require("./routes/users")
const routeProduct = require("./routes/products")
const routeCart = require("./routes/carts")
const routeOrder = require("./routes/orders")
const routeAuth = require("./routes/auth")
app.use(bodyParser.json())
app.use(express.static('public'));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');

app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    pool.query(
        'SELECT id, username FROM users WHERE id = $1',
        [id],
        (err, result) => cb(err, result.rows[0])
    );
});




app.get("/login", routeAuth.login)
app.post("/login/password", routeAuth.verify)
app.post("/signup", routeAuth.register)
app.post("/logout", routeAuth.logout)
app.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ id: req.user.id, username: req.user.username });
    } else {
        res.status(401).json({ error: 'Not logged in' });
    }
});

app.get("/users", routeUser.getUsers);
app.get("/users/:id", routeUser.getUserById);
app.post("/users", routeUser.createUser);
app.post("/users/address", routeUser.addAddress)
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
app.get("/carts/:status", routeCart.getCartsByStatus)
app.post("/carts", routeCart.createCart)
app.post("/carts/addItem", routeCart.addItemToCart)
app.post("/carts/order", routeCart.addCartToOrder)
app.put("/carts/:id", routeCart.updateCart)
app.delete("/carts/:id", routeCart.deleteCart)

app.get("/orders", routeOrder.getOrders)
app.get("/orders/:id", routeOrder.getOrderById)
app.get("/orders/items/:id", routeOrder.getOrderItems)
app.get("/orders/:status", routeOrder.getOrdersByStatus)
app.post("/orders", routeOrder.createOrder)
app.post("/orders/addItem", routeOrder.addItemToOrder)
app.put("/orders/:id", routeOrder.updateOrder)
app.delete("/orders/:id", routeOrder.deleteOrder)


app.listen(port, () => {
    console.log(`App running on port ${port}.`);
})