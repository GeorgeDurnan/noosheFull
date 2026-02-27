const pool = require("../db")

const getCarts = (request, response) => {
    pool.query('SELECT * FROM carts ORDER BY id ASC', (error, results) => {
        if (error) {
            return response.status(500).send("Database error" + error)
        } else if (results.rows.length === 0) {
            return response.status(404).json("No carts found")
        }
        response.status(200).json(results.rows)
    })
}
//system for creating a cart and returning them 
const createCart = async (sid) => {
    const cartExists = await pool.query('SELECT id FROM carts WHERE sid = $1', [sid])
    if (cartExists.rows.length == 0) {
        const results = await pool.query('INSERT INTO carts (sid) VALUES ($1) RETURNING id', [sid])
        return results.rows[0].id
    } else {
        return cartExists.rows[0].id
    }
}
const getCartItems = async (request, response) => {
    const sid = request.sessionID
    console.log("sid" + sid)
    try {
        const id = await createCart(sid)
        pool.query('SELECT product_id, quantity, options, id FROM cart_items WHERE cart_id = $1', [id], (error, results) => {
            if (error) {
                response.status(500).json({"error": error})
            } else if (results.rows.length === 0) {
                response.status(404).json({ "msg:": "No cart items found" })
            } else {
                response.status(200).json(results.rows)
            };


        })
    } catch (e) {
        response.status(500).send({ "error": e })
    }


}
//Adding an item to the cart
const addItemToCart = async (request, response) => {
    const sid = request.sessionID
    const { product_id, quantity, options, id } = request.body
    try {
        const cart_id = await getCartFromSid(sid)
        pool.query('INSERT INTO cart_items (cart_id, product_id, quantity, options, id) VALUES ($1, $2, $3, $4, $5)', [cart_id, product_id, quantity, options, id], async (error, results) => {
            if (error) {
                response.status(400).send(error)
            } else {
                response.status(201).send("success")
            }

        })
    } catch (e) {
        response.status(400).send(e)
    }

}
const getCartFromSid = async (sid) => {
    const cart_id = await pool.query('SELECT id FROM carts WHERE sid = $1', [sid])
    try {
        if (cart_id.rows.length === 0) {
            throw new Error("Cart not found")
        } else {
            return cart_id.rows[0].id

        }

    } catch (e) {
        console.log("it was here")
        response.status(400).send(e)
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
                console.log(error)
                response.status(404).send(error)
            } else if (results.rowCount === 0) {
                console.log(JSON.stringify(results))
                response.status(404).json({"msg": `Item not in cart or cart does not exist`, "results": results})
            } else {
                response.status(200).json({ "msg": `Quantity updated new quantity ${quantity}`, "quantity": quantity })

            }

        }
    )
}
//delete item from cart
const deleteItem = async (request, response) => {
    const {id} = request.body
    const sid = request.sessionID
    const cart_id = await getCartFromSid(sid)
    if(!cart_id){
        response.status(401).json({"msg": "not authorised"})
    }
    
    pool.query('DELETE FROM cart_items WHERE id = $1 AND cart_id = $2', [id, cart_id], (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        } else if (results.rowCount === 0) {
            response.status(404).send(`Cart with ID: ${id} not found`)
        } else {
            response.status(200).send(`Cart deleted with ID: ${id}`)
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

//needs to be fixed
const addCartToOrder = async (request, response) => {
    const { cart_id, address_id } = request.body
    const items = await pool.query('SELECT product_id, quantity FROM cart_items WHERE cart_id = $1', [cart_id])
    if (items.rows.length === 0) {
        return request.status(404).send("Cart items not found")
    }
    const product = await pool.query('SELECT name, price FROM products WHERE id = $1', [product_id])

    const order = await pool.query('INSERT INTO orders (shipping_address_id) VALUES ($1, $2) RETURNING id', [address_id])
    const order_id = order.rows[0].id
    for (const item of items.rows) {
        pool.query('INSERT INTO order_items (order_id, product_id, quantity, product_name, options, price) VALUES ($1, $2, $3)', [order_id, item.product_id, item.quantity])
    }
    response.status(200).send(order_id)


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
    updateCart,
    addItemToCart,
    addCartToOrder,
    deleteCart,
    deleteItem
}