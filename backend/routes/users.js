const pool = require("../db")

const getUsers = (request, response) => {
    pool.query('SELECT id, username FROM users ORDER BY id ASC', (error, results) => {
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
    const { username, hashed_password, salt } = request.body
    pool.query('INSERT INTO users (username, hashed_password, salt) VALUES ($1, $2, $3) RETURNING id', [username, hashed_password, salt], (error, results) => {
        if (error) {
            response.status(404).send(error)
        } else {
            const newUserId = results.rows[0].id;
            response.status(201).send(`User added with ID: ${newUserId}`)
        }

    })
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
    deleteUser,
}