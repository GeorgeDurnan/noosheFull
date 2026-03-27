const pool = require("../db")
const deleteSession = (request, response) => {
    const sid = request.sessionID
    pool.query('DELETE FROM session WHERE sid = $1', [sid], (error, results) => {
        if (error) {
            response.status(500).json({ "msg": "Database error", "error": error })
        } else if (results.rowCount === 0) {
            response.status(404).json({ "msg": `Session with sid: ${sid} not found` })
        } else {
            response.status(200).json({ "msg": `Session deleted with sid: ${sid}` })
        }

    })
}
module.exports = {deleteSession}