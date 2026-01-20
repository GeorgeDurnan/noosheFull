const pool = require("../db")

const getOrders = (request, response) => {
    pool.query('SELECT * FROM orders ORDER BY id ASC', (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        }
        response.status(200).json(results.rows)
    })
}

const getOrderById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM orders WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        } else if (results.rows.length === 0) {
            response.status(404).send("order not found")
        } else {
            response.status(200).json(results.rows)
        }

    })
}
const getOrderItems = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT product_id, quantity FROM order_items WHERE order_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        } else if (results.rows.length === 0) {
            response.status(404).send("order not found")
        } else {
            const items = results.rows
            pool.query('SELECT COALESCE(SUM(order_items.quantity * products.price),0) AS total_price FROM order_items JOIN products ON order_items.product_id = products.id WHERE order_items.order_id = $1',
                [id], (error, results) => {
                    const total = results.rows[0].totalPrice
                    response.status(200).json({ items: items, total: total })
                })

        }
    })
}
const getOrdersByStatus = (request, response) => {
    const status = parseInt(request.params.status)
    pool.query('SELECT * FROM orders WHERE status = $1', [status], (error, results) => {
        if (error) {
            throw error
        } else if (results.rows.length === 0) {
            response.status(404).send(`no orders with status ${status} found`)
        } else {
            response.status(200).json(results.rows)
        }

    })
}



const createOrder = (request, response) => {
    const { user_id, status = 'pending' } = request.body

    pool.query('INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING id', [user_id, status], (error, results) => {
        if (error) {
            response.status(400).send(error)
        } else {
            const newId = results.rows[0].id;
            response.status(201).send(`Order added with ID: ${newId}`)
        }

    })
}

const updateOrder = (request, response) => {
    const order_id = parseInt(request.params.id)
    const { product_id, quantity } = request.body
    pool.query(`UPDATE order_items SET quantity = $1 WHERE order_id = $2 AND product_id = $3`,
        [quantity, order_id, product_id],
        (error, results) => {
            if (error) {
                response.status(404).send(error)
            } else if (results.rowCount === 0) {
                response.status(404).send(`Item not in order or order does not exist`)
            } else {
                if (quantity === 0) {
                    pool.query('DELETE FROM order_items WHERE order_item = $1 AND product_id = $2', [order_id, product_id], (error, results) => {
                        if (error) {
                            response.status(500).send("Database error" + error)
                        } else if (results.rowCount === 0) {
                            response.status(404).send(`Not found`)
                        } else {
                            response.status(200).send(`Product removed from order`)
                        }
                    })
                } else {
                    response.status(200).send(`Order modified with ID: ${order_id} and product ID ${product_id}`)
                }

            }

        }
    )
}
const addItemToOrder = (request, response) => {
    const { order_id, product_id, quantity = 1 } = request.body

    pool.query('INSERT INTO order_items (order_Id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id', [order_id, product_id, quantity], (error, results) => {
        if (error) {
            response.status(400).send(error)
        } else {
            const newId = results.rows[0].id;
            response.status(201).send(`Item added with ID: ${product_id}`)
        }

    })
}

const deleteOrder = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM orders WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        } else if (results.rowCount === 0) {
            response.status(404).send(`Order with ID: ${id} not found`)
        } else {
            response.status(200).send(`Order deleted with ID: ${id}`)
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