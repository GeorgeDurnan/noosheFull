const app = require('./index')  // or './app' if you rename it
const port = process.env.PORT || 5000 

app.listen(port, () => {
  console.log(`App running on port ${port}.`) 
}) 