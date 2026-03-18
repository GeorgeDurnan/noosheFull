const pool = require("../db")
//Returns all orders
const getOrders = (request, response) => {
    pool.query('SELECT id, status, created_at, price FROM orders ORDER BY id ASC', (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        }
        response.status(200).json(results.rows)
    })
}
//Returns a specific order 
const getOrderById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM orders WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        } else if (results.rows.length === 0) {
            response.status(404).json({ "msg": "order not found" })
        } else {
            response.status(200).json(results.rows[0])
        }

    })
}
// Get all items for an order and calculate total price
const getOrderItems = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM order_items WHERE order_id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Server error", "error": error })
        } else if (results.rows.length === 0) {
            response.status(404).json({ "msg": "order not found" })
        } else {
            const items = results.rows
            pool.query('SELECT COALESCE(SUM(order_items.quantity * products.price),0) AS total_price FROM order_items JOIN products ON order_items.product_id = products.id WHERE order_items.order_id = $1',
                [id], (error, results) => {
                    const total = results.rows[0].total_price
                    response.status(200).json({ items: items, total: total })
                })
        }
    })
}
//Returns all orders with a specific status (rotten, active, converted)
const getOrdersByStatus = (request, response) => {
    const status = request.params.status
    pool.query('SELECT * FROM orders WHERE status = $1', [status], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rows.length === 0) {
            response.status(404).json({ "msg": `no orders with status ${status} found` })
        } else {
            response.status(200).json(results.rows)
        }

    })
}

//TODO: Look to remove as its function is replaced by convert cart 
// Create a new order 
const createOrder = (request, response) => {
    const { user_id, status = 'pending' } = request.body

    pool.query('INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING id', [user_id, status], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else {
            const newId = results.rows[0].id
            response.status(201).json({ "msg": `Order added with ID: ${newId}`, "id": newId })
        }

    })
}

// Update order item quantity (removes item if quantity is 0)
const updateOrder = (request, response) => {
    const order_id = parseInt(request.params.id)
    const { product_id, quantity } = request.body
    pool.query(`UPDATE order_items SET quantity = $1 WHERE order_id = $2 AND product_id = $3`,
        [quantity, order_id, product_id],
        (error, results) => {
            if (error) {
                response.status(500).json({ "msg": "Database error", "error": error })
            } else if (results.rowCount === 0) {
                response.status(404).json({ "msg": "Item not in order or order does not exist" })
            } else {
                if (quantity === 0) {
                    pool.query('DELETE FROM order_items WHERE order_id = $1 AND product_id = $2', [order_id, product_id], (error, results) => {
                        if (error) {
                            response.status(500).json({ "msg": "Database error", "error": error })
                        } else if (results.rowCount === 0) {
                            response.status(404).json({ "msg": "order not found" })
                        } else {
                            response.status(200).json({ "msg": "Product removed from order" })
                        }
                    })
                } else {
                    response.status(200).json({ "msg": `Order modified with ID: ${order_id} and product ID ${product_id}` })
                }

            }

        }
    )
}

//TODO: Consider whether is neccesary to keep as logic replaced by convert cart (Will we add functionality to edit order after purchased?)
// Add an item to order
const addItemToOrder = (request, response) => {
    const { order_id, product_id, quantity = 1 } = request.body

    pool.query('INSERT INTO order_items (order_Id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id', [order_id, product_id, quantity], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else {
            const newId = results.rows[0].id
            response.status(201).json({ "msg": `Item added with ID: ${newId}`, "id": newId })
        }

    })
}

//Delete order 
const deleteOrder = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM orders WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `Order with ID: ${id} not found` })
        } else {
            response.status(200).json({ "msg": `Order deleted with ID: ${id}` })
        }

    })
}

module.exports = {
    getOrders,
    getOrderById,
    getOrderItems,
    getOrdersByStatus,
    createOrder,
    updateOrder,
    addItemToOrder,
    deleteOrder
}