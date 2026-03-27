const pool = require("../db")

//Get all carts
const getCarts = (request, response) => {
    pool.query('SELECT * FROM carts ORDER BY id ASC', (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": "No carts found" })
        } else {
            response.status(200).json(results.rows)
        }

    })
}
//Returns ID of cart associated with sid creates cart if doesn't exist
const createCart = async (sid) => {
    //If a cart already exists with the SID return it 
    const cartExists = await pool.query('SELECT id FROM carts WHERE sid = $1', [sid])
    if (cartExists.rowCount == 0) {
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
            const result = await pool.query('SELECT product_id, quantity, options, id, extra FROM cart_items WHERE cart_id = $1', [id])
            if (result.rowCount === 0) {
                response.status(404).json({ "msg": "No cart items found" })
            } else {
                response.status(200).json({ "data": result.rows, "cart_id": id })
            }

        } catch (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        }
    })
}
//Adding an item to the cart
const addItemToCart = async (request, response) => {
    const sid = request.sessionID
    const { product_id, quantity, options, id, extra = null } = request.body
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

}
//Utility method for getting cart from SID
const getCartFromSid = async (sid) => {
    const result = await pool.query(
        'SELECT id FROM carts WHERE sid = $1',
        [sid]
    ) 

    if (result.rowCount === 0 || !result) {
        return false 
    }

    return result.rows[0].id 

} 
//to update quantity 
const updateCart = async (request, response) => {
    const sid = request.sessionID
    const cart_id = await getCartFromSid(sid)
    const { product_id, quantity, options, extra = null } = request.body
    pool.query(`UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 AND options::jsonb = $4::jsonb AND extra IS NOT DISTINCT FROM $5`,
        [quantity, cart_id, product_id, options, extra],
        (error, results) => {
            if (error) {
                response.status(500).json({ "msg": "Database error", "error": error })
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
        return response.status(401).json({ error: 'Not authorized' })
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
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": "cart not found" })
        } else {
            response.status(200).json({ "data": results.rows })
        }

    })
}
//Returns all carts with a specific status e.g. rotten, converted, active
const getCartsByStatus = (request, response) => {
    const status = request.params.status
    pool.query('SELECT * FROM carts WHERE status = $1', [status], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `no carts with status ${status} found`, "status": status })
        } else {
            response.status(200).json(results.rows)
        }

    })
}

//Changes cart entry to "converted" and creates a new order entry with the same products
const addCartToOrder = async (sid, address_id, stripe) => {
    const cart_id = await getCartFromSid(sid)
    const items = await pool.query('SELECT product_id, quantity, options, extra FROM cart_items WHERE cart_id = $1', [cart_id])

    if (items.rowCount === 0) {
        return "No items"
    }
    const exists = await pool.query('SELECT * FROM orders WHERE stripe = $1', [stripe])
    if (exists.rowCount !== 0) {
        return "Stripe already exists"
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
        return { "msg": "succeeded", "order_id": order_id }
    } catch (error) {
        pool.query('DELETE FROM orders WHERE id = $1', [order_id])
        return{"msg": "Failed", "error": error}
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