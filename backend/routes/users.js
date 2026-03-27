const pool = require("../db")

//Returns all users avoiding their password salts etc
const getUsers = (request, response) => {
    pool.query('SELECT id, username FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error.message })
        } else {
            response.status(200).json(results.rows)
        }

    })
}
//Returns specific user
const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": "user not found " })
        } else {
            response.status(200).json(results.rows)
        }

    })
}
//Deletes a user
const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": "user not found " })
        } else {
            response.status(200).json({ "msg": `User deleted with ID: ${id}` })
        }

    })
}

module.exports = {
    getUsers,
    getUserById,
    deleteUser,
}