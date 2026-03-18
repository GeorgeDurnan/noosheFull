const pool = require("../db")

//Get all carts
const getCarts = (request, response) => {
    pool.query('SELECT * FROM carts ORDER BY id ASC', (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rows.length === 0) {
            response.status(404).json("No carts found")
        } else {
            response.status(200).json(results.rows)
        }

    })
}
//Returns ID of cart associated with sid creates cart if doesn't exist
const createCart = async (sid) => {
    //If a cart already exists with the SID return it 
    const cartExists = await pool.query('SELECT id FROM carts WHERE sid = $1', [sid])
    if (cartExists.rows.length == 0) {
        const results = await pool.query('INSERT INTO carts (sid) VALUES ($1) RETURNING id', [sid])
        return results.rows[0].id
    } else {
        return cartExists.rows[0].id
    }
}
//Get all cart items no input required and gets it from the SID
const getCartItems = async (request, response) => {
    // Set a property to mark session as initialized
    request.session.cartInitialized = true
    // Save the session and only proceed after it's saved
    request.session.save(async (err) => {
        if (err) {
            return response.status(500).json({ error: 'Session save failed', details: err })
        }
        try {
            const sid = request.sessionID
            //Either creates a cart or gets the cart id
            const id = await createCart(sid)
            pool.query('SELECT product_id, quantity, options, id, extra FROM cart_items WHERE cart_id = $1', [id], (error, results) => {
                if (error) {
                    response.status(500).json({ "error": error })
                } else if (results.rows.length === 0) {
                    response.status(404).json({ "msg:": "No cart items found" })
                } else {
                    response.status(200).json({ "data": results.rows })
                }
            })
        } catch (e) {
            response.status(500).json({ "error": e })
        }
    })
}
//Adding an item to the cart
const addItemToCart = async (request, response) => {
    const sid = request.sessionID
    const { product_id, quantity, options, id, extra } = request.body
    try {
        const cart_id = await getCartFromSid(sid)
        if (!cart_id) {
            return response.status(404).json({ "msg": "Cart with SID not found" })
        }
        pool.query('INSERT INTO cart_items (cart_id, product_id, quantity, options, id, extra) VALUES ($1, $2, $3, $4, $5, $6)', [cart_id, product_id, quantity, options, id, extra], async (error, results) => {
            if (error) {
                response.status(500).json({ "msg": "Database error", "error": error })
            } else {
                response.status(201).json({ "msg": "Cart item added succesfully" })
            }

        })
    } catch (e) {
        response.status(500).json({ "msg": "Database error", "error": e })
    }

}
//Utility method for getting cart from SID
const getCartFromSid = async (sid) => {
    const cart_id = await pool.query('SELECT id FROM carts WHERE sid = $1', [sid])
    try {
        if (cart_id.rows.length === 0) {
            return false
        } else {
            return cart_id.rows[0].id

        }

    } catch (e) {
        response.status(500).json({ "error": e })
    }
}
//to update quantity 
const updateCart = async (request, response) => {
    const sid = request.sessionID
    const cart_id = await getCartFromSid(sid)
    const { product_id, quantity, options } = request.body
    console.log("product_id" + product_id)
    pool.query(`UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 AND options::jsonb = $4::jsonb`,
        [quantity, cart_id, product_id, options],
        (error, results) => {
            if (error) {
                response.status(500).json({ "error": error })
            } else if (results.rowCount === 0) {
                response.status(404).json({ "msg": `Item not in cart or cart does not exist`, "results": results })
            } else {
                response.status(200).json({ "msg": `Quantity updated new quantity ${quantity}`, "quantity": quantity })

            }

        }
    )
}
//delete item from cart
const deleteItem = async (request, response) => {
    const { id } = request.body
    const sid = request.sessionID
    const cart_id = await getCartFromSid(sid)
    if (!cart_id) {
        return response.status(401).json({ "msg": "not authorised" })
    }

    pool.query('DELETE FROM cart_items WHERE id = $1 AND cart_id = $2', [id, cart_id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `Cart with ID: ${id} not found` })
        } else {
            response.status(200).json({ "msg": `Cart deleted with ID: ${id}` })
        }

    })
}
//Returns cart by its id
const getCartById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM carts WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        } else if (results.rows.length === 0) {
            response.status(404).json({ "msg": "cart not found" })
        } else {
            response.status(200).json({ "data": results.rows })
        }

    })
}
//Returns all carts with a specific status e.g. rotten, converted, active
const getCartsByStatus = (request, response) => {
    const status = parseInt(request.params.status)
    pool.query('SELECT * FROM carts WHERE status = $1', [status], (error, results) => {
        if (error) {
            response.status(500).json({ "error": error })
        } else if (results.rows.length === 0) {
            response.status(404).json({ "msg": `no carts with status ${status} found`, "status": status })
        } else {
            response.status(200).json(results.rows)
        }

    })
}

//Changes cart entry to "converted" and creates a new order entry with the same products
const addCartToOrder = async (sid, address_id, stripe) => {
    console.log("add cart to order")
    const cart_id = await getCartFromSid(sid)
    const items = await pool.query('SELECT product_id, quantity, options, extra FROM cart_items WHERE cart_id = $1', [cart_id])

    if (items.rows.length === 0) {
        return
    }
    const exists = await pool.query('SELECT * FROM orders WHERE stripe = $1', [stripe])
    if (exists.rows.length !== 0) {
        return
    }
    const order = await pool.query('INSERT INTO orders (shipping_address_id, stripe) VALUES ($1, $2) RETURNING id', [address_id, stripe])
    const order_id = order.rows[0].id
    try {
        for (const item of items.rows) {
            const product = await pool.query('SELECT price, name FROM products WHERE id = $1', [item.product_id])
            const price = product.rows[0].price
            const name = product.rows[0].name
            await pool.query('INSERT INTO order_items (order_id, product_id, quantity, product_name, product_options, price, extra) VALUES ($1, $2, $3, $4, $5, $6, $7)', [order_id, item.product_id, item.quantity, name, item.options, price, item.extra])
        }

        const total = await pool.query('SELECT SUM(price * quantity) AS total FROM order_items WHERE order_id = $1', [order_id])
        await pool.query(`UPDATE orders SET price = $1 WHERE id = $2`, [total.rows[0].total, order_id])
        await pool.query(`UPDATE carts SET status = $1 WHERE id = $2`, ['converted', cart_id])

        console.log("succesfully added cart to order")
    } catch (e) {
        console.log("error when converting to cart" + e)
        pool.query('DELETE FROM orders WHERE id = $1', [order_id])
        throw e
    }


}
const deleteCart = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM carts WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `Cart with ID: ${id} not found` })
        } else {
            response.status(200).json({ "msg": `Cart deleted with ID: ${id}` })
        }

    })
}

module.exports = {
    getCarts,
    getCartById,
    getCartItems,
    getCartsByStatus,
    updateCart,
    addItemToCart,
    addCartToOrder,
    deleteCart,
    deleteItem,
    getCartFromSid
}