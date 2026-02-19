const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const pool = require('./db')
const port = 5000
const routeUser = require("./routes/users")
const routeProduct = require("./routes/products")
const routeCart = require("./routes/carts")
const routeOrder = require("./routes/orders")
const routeAuth = require("./routes/auth")
const routeContact = require("./routes/contacts")
const routeAddress = require("./routes/addresses")
const routeImages = require("./routes/images")
const routeCats = require("./routes/product_cats")
const routeOptions = require("./routes/options")
const routeOptionCats = require("./routes/optionCats")
const cors = require("cors")

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

const allowedOrigins = [
  'http://localhost:3000', //website
  'http://localhost:4000' //admin
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // This allows cookies/sessions to pass through
}));
app.post("/check", routeAuth.checkAuthenticated, routeAuth.checkPasswordOnly)
app.post("/login", routeAuth.verify)
app.post("/signup", routeAuth.register)
app.post("/logout", routeAuth.logout)
app.put("/change", routeAuth.checkAuthenticated, routeAuth.updatePassword)
app.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ id: req.user.id, username: req.user.username });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

app.get("/users", routeAuth.checkAuthenticated, routeUser.getUsers);
app.get("/users/:id", routeAuth.checkAuthenticated, routeUser.getUserById);

app.delete("/users/:id", routeAuth.checkAuthenticated, routeUser.deleteUser);

app.post("/users/address", routeAuth.checkAuthenticated, routeAddress.addAddress)

app.get("/products", routeProduct.getProducts);
app.get("/products/:id", routeProduct.getProductById)
app.post("/products", routeAuth.checkAuthenticated, routeProduct.createProduct)
app.put("/products/:id", routeAuth.checkAuthenticated, routeProduct.updateProduct);
app.delete("/products/:id", routeAuth.checkAuthenticated, routeProduct.deleteProduct);

app.get("/products/cakes/categories", routeAuth.checkAuthenticated,
  routeProduct.getCakeCategories)

app.get("/carts", routeAuth.checkAuthenticated, routeCart.getCarts)
app.get("/carts/:id", routeAuth.checkAuthenticated, routeCart.getCartById)
app.get("/carts/items/:id", routeAuth.checkAuthenticated, routeCart.getCartItems)
app.get("/carts/status/:status", routeAuth.checkAuthenticated, routeCart.getCartsByStatus)
app.post("/carts", routeAuth.checkAuthenticated, routeCart.createCart)
app.post("/carts/addItem", routeAuth.checkAuthenticated, routeCart.addItemToCart)
app.post("/carts/order", routeAuth.checkAuthenticated, routeCart.addCartToOrder)
app.put("/carts/:id", routeAuth.checkAuthenticated, routeCart.updateCart)
app.delete("/carts/:id", routeAuth.checkAuthenticated, routeCart.deleteCart)

app.get("/orders", routeAuth.checkAuthenticated, routeOrder.getOrders)
app.get("/orders/:id", routeAuth.checkAuthenticated, routeOrder.getOrderById)
app.get("/orders/items/:id", routeAuth.checkAuthenticated, routeOrder.getOrderItems)
app.get("/orders/status/:status", routeAuth.checkAuthenticated, routeOrder.getOrdersByStatus)
app.post("/orders", routeAuth.checkAuthenticated, routeOrder.createOrder)
app.post("/orders/addItem", routeAuth.checkAuthenticated, routeOrder.addItemToOrder)
app.put("/orders/:id", routeAuth.checkAuthenticated, routeOrder.updateOrder)
app.delete("/orders/:id", routeAuth.checkAuthenticated, routeOrder.deleteOrder)

app.post("/contacts", routeAuth.checkAuthenticated, routeContact.createContact)

app.get("/options/:id", routeOptions.getOptions)
app.post("/options", routeAuth.checkAuthenticated, routeOptions.addOption)
app.put("/options/:id", routeAuth.checkAuthenticated, routeOptions.updateOption);
app.delete("/options/:id", routeAuth.checkAuthenticated, routeOptions.deleteOption);

app.get("/categories/:id", routeOptionCats.getCategories);
app.post("/categories", routeAuth.checkAuthenticated, routeOptionCats.addCategory)
app.put("/categories/:id", routeAuth.checkAuthenticated, routeOptionCats.updateCategory);
app.delete("/categories/:id", routeAuth.checkAuthenticated, routeOptionCats.deleteCategory);

app.get("/allergens", routeProduct.getAllAllergens)
app.get("/allergens/:id", routeAuth.checkAuthenticated, routeProduct.getAllergens);
app.post("/allergens", routeAuth.checkAuthenticated, routeProduct.addAllergens);
app.put("/allergens/:id", routeAuth.checkAuthenticated, routeProduct.updateAllergens);
app.delete("/allergens/:id", routeAuth.checkAuthenticated, routeProduct.deleteAllergens);

app.post("/images", routeAuth.checkAuthenticated, upload.single('file'), routeImages.sendImage, routeImages.addImage)
app.get("/images/:id", routeImages.getImages)
app.get("/images", routeImages.getAllImages)

app.get("/cakeCats", routeCats.getCats)
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
})