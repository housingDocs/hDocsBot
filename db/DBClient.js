const { createClient } = require('@libsql/client')
const { url, token } = require('../config.json').db

const TIME = Object.freeze({
    "SECOND": 1_000,
    "MINUTE": 1_000 * 60,
    "HOUR": 1_000 * 60 * 60,
    "DAY": 1_000 * 60 * 60 * 24,
    "MONTH": 1_000 * 60 * 60 * 24 * 30
})

class DBError {
    dberror = true
    message
    code

    constructor(message = 'An Error occured!', code = 0) {
        this.message = message
        this.code = code
    }
}

class DBClient {
    
    client

    constructor () {
        this.client = createClient({
            url,
            authToken: token
        })
    }

    async run(sql, args) {
        if (args !== undefined) {
            if (args.some(a => a === undefined)) {
                throw new Error('[DBClient] Got undefined argument')
            }
        }
        return this.client.execute({
            sql,
            args: (args === undefined ? [] : args)
        });
    }

    async executeSafely(call) {
        try {
            return call()
        } catch(e) {
            Debug.error(e)
            return new DBError(e, -1)
        }
    }

    async ratePage(user, page, rating) {
        return this.executeSafely(async () => {
            const now = Date.now()
            const lastUserRating = (await this.run(`
                SELECT date
                  FROM LastUserRate
                 WHERE user = ?
                   AND page = ?
            `, [
                user,
                page
            ])).rows

            if (lastUserRating.length !== 0) {
                const lastDate = lastUserRating[0].date

                if (now - lastDate < TIME.DAY * 7) {
                    return new DBError("Your rating for this page is on cooldown")
                }

                await this.run(`
                    UPDATE LastUserRate
                    SET date = ?
                    WHERE user = ?
                    AND page = ?
                `, [
                    now,
                    user,
                    page
                ])

            } else {

                await this.run(`
                    INSERT INTO LastUserRate (user, date, page)
                    VALUES                   (?, ?, ?)
                `, [
                    user,
                    now,
                    page
                ])
            }

            await this.run(`
                INSERT INTO PageRating (user, name, rating)
                VALUES                 (?, ?, ?)
            `, [
                user, page, rating
            ])

            return true
        })
    }

    async getTopRatedPages(amount) {
        return this.executeSafely(async () => {
            const pages = (await this.run(`
                SELECT AVG(rating) AS rating, name
                  FROM PageRating
                 GROUP BY name
                 ORDER BY rating DESC
                 LIMIT ?
            `, [
                amount
            ])).rows

            return pages
        })
    }
}

module.exports = DBClient