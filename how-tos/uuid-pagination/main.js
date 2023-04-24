import pg from 'pg'
const { Pool } = pg

function createDbPool() {
    return new Pool({
        user: 'postgres',
        host: 'localhost',
        password: 'postgres',
        port: 5432,
      })
}

async function getRandomUser(pool) {
    const query = "SELECT * FROM users ORDER BY random() LIMIT 1;"
    const result = await pool.query(query)

    return result.rows[0]
}

async function getNext10Users(pool, user) {
    console.log(user)
    // Using a row constructor.
    const query = `
        SELECT * FROM users 
            WHERE (created_time, id) < ($1, $2)
            ORDER BY created_time DESC, id DESC LIMIT 10;
    `

    const result = await pool.query(query, [user.created_time, user.id])
    return result.rows
}

// Setting up connection to postgres instance.
const pool = createDbPool()

// Getting a random user to start with.
const randomUser = await getRandomUser(pool)
const next10Users = await getNext10Users(pool, randomUser)
console.log(next10Users)

await pool.end()