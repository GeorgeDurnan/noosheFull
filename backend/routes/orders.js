const pool = require("../db")
//Returns all orders
const getOrders = (request, response) => {
    pool.query('SELECT id, status, created_at, price FROM orders ORDER BY id ASC', (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": "No orders found" })
        } else {
            response.status(200).json(results.rows)
        }

    })
}
//Returns a specific order 
const getOrderById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM orders WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": "Order not found" })
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
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
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
//Returns all orders with a specific status (rotten, pending, converted)
const getOrdersByStatus = (request, response) => {
    const status = request.params.status
    pool.query('SELECT * FROM orders WHERE status = $1', [status], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `no orders with status ${status} found` })
        } else {
            response.status(200).json(results.rows)
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
    deleteOrder
}