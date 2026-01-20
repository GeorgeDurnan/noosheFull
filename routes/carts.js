const pool = require("../db")

const getCarts = (request, response) => {
    pool.query('SELECT * FROM carts ORDER BY id ASC', (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        }
        response.status(200).json(results.rows)
    })
}
const getCartItems = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT product_id, quantity FROM cart_items WHERE cart_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        } else if (results.rows.length === 0) {
            response.status(404).send("cart not found")
        } else {
            const items = results.rows
            pool.query('SELECT COALESCE(SUM(cart_items.quantity * products.price),0) AS total_price FROM cart_items JOIN products ON cart_items.product_id = products.id WHERE cart_items.cart_id = $1',
                [id], (error, results) => {
                    const total = results.rows[0].totalPrice
                    response.status(200).json({ items: items, total: total })
                })

        }
    })
}

const getCartById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM carts WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        } else if (results.rows.length === 0) {
            response.status(404).send("cart not found")
        } else {
            response.status(200).json(results.rows)
        }

    })
}
const getCartsByStatus = (request, response) => {
    const status = parseInt(request.params.status)
    pool.query('SELECT * FROM carts WHERE status = $1', [status], (error, results) => {
        if (error) {
            throw error
        } else if (results.rows.length === 0) {
            response.status(404).send(`no carts with status ${status} found`)
        } else {
            response.status(200).json(results.rows)
        }

    })
}

const createCart = (request, response) => {
    const { user_id, status = 'active' } = request.body

    pool.query('INSERT INTO carts (user_id, status) VALUES ($1, $2) RETURNING id', [user_id, status], (error, results) => {
        if (error) {
            response.status(400).send(error)
        } else {
            const newId = results.rows[0].id;
            response.status(201).send(`Cart added with ID: ${newId}`)
        }

    })
}

const updateCart = (request, response) => {
    const cart_id = parseInt(request.params.id)
    const { product_id, quantity } = request.body
    pool.query(`UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3`,
        [quantity, cart_id, product_id],
        (error, results) => {
            if (error) {
                response.status(404).send(error)
            } else if (results.rowCount === 0) {
                response.status(404).send(`Item not in cart or cart does not exist`)
            } else {
                if (quantity === 0) {
                    pool.query('DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cart_id, product_id], (error, results) => {
                        if (error) {
                            response.status(500).send("Database error" + error)
                        } else if (results.rowCount === 0) {
                            response.status(404).send(`Not found`)
                        } else {
                            response.status(200).send(`Product removed from cart`)
                        }
                    })
                } else {
                    response.status(200).send(`Cart modified with ID: ${cart_id} and product ID ${product_id}`)
                }

            }

        }
    )
}
const addItemToCart = (request, response) => {
    const { cart_id, product_id, quantity = 1 } = request.body

    pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id', [cart_id, product_id, quantity], (error, results) => {
        if (error) {
            response.status(400).send(error)
        } else {
            const newId = results.rows[0].id;
            response.status(201).send(`Item added with ID: ${product_id}`)
        }

    })
}

const deleteCart = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM carts WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        } else if (results.rowCount === 0) {
            response.status(404).send(`Cart with ID: ${id} not found`)
        } else {
            response.status(200).send(`Cart deleted with ID: ${id}`)
        }

    })
}

module.exports = {
    getCarts,
    getCartById,
    getCartItems,
    getCartsByStatus,
    createCart,
    updateCart,
    addItemToCart,
    deleteCart
}