const pool = require("../db")

//Returns all users avoiding their password salts etc
const getUsers = (request, response) => {
    pool.query('SELECT id, username FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
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
            response.status(404).json({ "msg": "user not found ", "error": error })
        } else {
            response.status(200).json(results.rows)
        }

    })
}
//Creates a user
const createUser = (request, response) => {
    const { username, hashed_password, salt } = request.body
    pool.query('INSERT INTO users (username, hashed_password, salt) VALUES ($1, $2, $3) RETURNING id', [username, hashed_password, salt], (error, results) => {
        if (error) {
            response.status(500).json({ "error": error })
        } else {
            const newUserId = results.rows[0].id
            response.status(201).json({ "msg": `User added with ID: ${newUserId}`, "id": newUserId })
        }

    })
}
//Deletes a user
const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rows.length === 0) {
            response.status(404).json({ "msg": "user not found ", "error": error })
        } else {
            response.status(200).json({"msg": `User deleted with ID: ${id}`})
        }

    })
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
}