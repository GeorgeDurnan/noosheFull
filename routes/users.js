const pool = require("../db")

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            response.status(500).send("Database error" + error)
        } else {
            response.status(200).json(results.rows)
        }

    })
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(404).send("user not found " + error)
        } else {
            response.status(200).json(results.rows)
        }

    })
}

const createUser = (request, response) => {
    const { username, password } = request.body

    pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [username, password], (error, results) => {
        if (error) {
            response.status(404).send(error)
        } else {
            const newUserId = results.rows[0].id;
            response.status(201).send(`User added with ID: ${newUserId}`)
        }

    })
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { username, password } = request.body

    pool.query(
        'UPDATE users SET username = $1, password = $2 WHERE id = $3',
        [username, password, id],
        (error, results) => {
            if (error) {
                response.status(404).send("user not found " + error)
            } else {
                response.status(200).send(`User modified with ID: ${id}`)
            }

        }
    )
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(404).send("user not found " + error)
        } else {
            response.status(200).send(`User deleted with ID: ${id}`)
        }

    })
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}