//--Imports--
const express = require('express') 
const cors = require("cors") 
const session = require('express-session') 
const pgSession = require('connect-pg-simple')(session) 
const passport = require('passport') 
const bodyParser = require('body-parser') 
const multer = require('multer') 
const path = require("path") 
require('dotenv').config() 
const pool = require('./db') 

//--Route imports--
const routeUser = require("./routes/users") 
const routeProduct = require("./routes/products") 
const routeCart = require("./routes/carts") 
const routeOrder = require("./routes/orders") 
const routeAuth = require("./routes/auth") 
const routeContact = require("./routes/contacts") 
const routeAddress = require("./routes/addresses") 
const routeImages = require("./routes/images") 
const routeCats = require("./routes/productCats") 
const routeOptions = require("./routes/options") 
const routeOptionCats = require("./routes/optionCats") 
const routeAllergen = require("./routes/allergens") 
const routeStripe = require("./routes/stripe") 
const routeBiz = require("./routes/businessContact") 
const routeBasic = require("./routes/basic") 

// Logic Setup 
const app = express() 
const port = 5000 

// Allowed origins (Web & Admin)
const allowedOrigins = [
  process.env.NOOSHE, 
  process.env.ADMIN 
] 

//--Middleware--
app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session'
  }),
  secret: process.env.SESSIONSECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    sameSite: 'lax'
  }
})) 

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true) 
    if (allowedOrigins.includes(origin)) {
      callback(null, true) 
    } else {
      callback(new Error('Not allowed by CORS')) 
    }
  },
  credentials: true
})) 

const storage = multer.memoryStorage() 
const upload = multer({ storage: storage }) 

// Stripe webhook (Must be before body-parser to avoid processing bug)
app.post('/webhook', express.raw({ type: 'application/json' }), routeStripe.webhook) 

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) 

app.use(express.static('public'))  // Serves public images

// Passport Setup
app.use(passport.initialize()) 
app.use(passport.session()) 

passport.serializeUser((user, cb) => {
  cb(null, user.id) 
}) 

passport.deserializeUser((id, cb) => {
  pool.query(
    'SELECT id, username FROM users WHERE id = $1',
    [id],
    (err, result) => cb(err, result.rows[0])
  ) 
}) 

//--Routes--

// Authentication
app.post("/check", routeAuth.checkAuthenticated, routeAuth.checkPasswordOnly) 
app.post("/login", routeAuth.verify) 
app.post("/signup", routeAuth.checkAuthenticated, routeAuth.register) 
app.post("/logout", routeAuth.checkAuthenticated, routeAuth.logout) 
app.put("/change", routeAuth.checkAuthenticated, routeAuth.updatePassword) 
app.get('/me', routeAuth.checkAuthenticated, routeAuth.getCurrentUser) 

// Users
app.get("/users", routeAuth.checkAuthenticated, routeUser.getUsers) 
app.get("/users/:id", routeAuth.checkAuthenticated, routeUser.getUserById) 
app.delete("/users/:id", routeAuth.checkAuthenticated, routeUser.deleteUser) 

// Addresses
app.post("/basic", routeBasic.createAddress) 
app.get("/basic", routeBasic.getAddress) 
app.post("/address", routeAddress.addAddress) 

// Products
app.get("/products", routeProduct.getProducts) 
app.get("/products/:id", routeProduct.getProductById) 
app.post("/products", routeAuth.checkAuthenticated, routeProduct.createProduct) 
app.put("/products/:id", routeAuth.checkAuthenticated, routeProduct.updateProduct) 
app.delete("/products/:id", routeAuth.checkAuthenticated, routeProduct.deleteProduct) 

// Categories
app.get("/cakeCats", routeCats.getCats) 
app.post("/cakeCats", routeAuth.checkAuthenticated, routeCats.createCat) 
app.delete("/cakeCats/:id", routeAuth.checkAuthenticated, routeCats.deleteCat) 
app.put("/cakeCats/:id", routeAuth.checkAuthenticated, routeCats.updateCat) 

// Options & Option Categories
app.get("/options/:id", routeOptions.getOptions) 
app.post("/options", routeAuth.checkAuthenticated, routeOptions.addOption) 
app.put("/options/:id", routeAuth.checkAuthenticated, routeOptions.updateOption) 
app.delete("/options/:id", routeAuth.checkAuthenticated, routeOptions.deleteOption) 

app.get("/categories/:id", routeOptionCats.getCategories) 
app.post("/categories", routeAuth.checkAuthenticated, routeOptionCats.addCategory) 
app.put("/categories/:id", routeAuth.checkAuthenticated, routeOptionCats.updateCategory) 
app.delete("/categories/:id", routeAuth.checkAuthenticated, routeOptionCats.deleteCategory) 

// Carts
app.get("/carts", routeAuth.checkAuthenticated, routeCart.getCarts) 
app.get("/carts/items", routeCart.getCartItems) 
app.get("/carts/items/:id", routeAuth.checkAuthenticated, routeCart.getCartById) 
app.get("/carts/status/:status", routeAuth.checkAuthenticated, routeCart.getCartsByStatus) 
app.post("/carts/addItem", routeCart.addItemToCart) 
app.put("/carts", routeCart.updateCart) 
app.delete("/carts/items", routeCart.deleteItem) 
app.delete("/carts/:id", routeAuth.checkAuthenticated, routeCart.deleteCart) 

// Orders
app.get("/orders", routeAuth.checkAuthenticated, routeOrder.getOrders) 
app.get("/orders/:id", routeAuth.checkAuthenticated, routeOrder.getOrderById) 
app.get("/orders/items/:id", routeAuth.checkAuthenticated, routeOrder.getOrderItems) 
app.get("/orders/status/:status", routeAuth.checkAuthenticated, routeOrder.getOrdersByStatus) 
app.post("/orders", routeAuth.checkAuthenticated, routeOrder.createOrder) 
app.post("/orders/addItem", routeAuth.checkAuthenticated, routeOrder.addItemToOrder) 
app.put("/orders/:id", routeAuth.checkAuthenticated, routeOrder.updateOrder) 
app.delete("/orders/:id", routeAuth.checkAuthenticated, routeOrder.deleteOrder) 

// Stripe / Checkout
app.post("/create-checkout-session", routeStripe.createSession) 
app.post("/verify-pay", routeStripe.verifyPayment) 

// Images
app.post("/images", routeAuth.checkAuthenticated, upload.single('file'), routeImages.sendImage, routeImages.addImage) 
app.get("/images/:id", routeImages.getImages) 
app.get("/images", routeImages.getAllImages) 
app.delete("/images", routeAuth.checkAuthenticated, routeImages.deleteImage)

// Contacts & Business
app.post("/contacts", routeContact.createContact) 
app.post("/wholesale", routeBiz.createContact) 

// Allergens
app.get("/allergens", routeAllergen.getAllAllergens) 
app.get("/allergens/:id", routeAllergen.getAllergens) 
app.post("/allergens", routeAuth.checkAuthenticated, routeAllergen.addAllergens) 
app.put("/allergens/:id", routeAuth.checkAuthenticated, routeAllergen.updateAllergens) 
app.delete("/allergens/:id", routeAuth.checkAuthenticated, routeAllergen.deleteAllergens) 


app.listen(port, () => {
  console.log(`App running on port ${port}.`) 
})