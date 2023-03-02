import bcrypt from "bcrypt"
import { v4 as uuidV4 } from "uuid"
import db from "../config/database.js"

export async function signUp (req, res) {
    const { name, email, password } = req.body

    const hashPassword = bcrypt.hashSync(password, 10)

     try {
        const checkUser = await db.query("SELECT * FROM users WHERE email=$1", [email])
        
        if(checkUser.rowCount > 0) return res.sendStatus(409)

        await db.query (`INSERT INTO users 
        (name, email, password) 
        VALUES ($1, $2, $3);`, [name, email, hashPassword]);

        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
  
export async function signIn (req, res) {
    const { email, password } = req.body
    const authtoken = uuidV4();

    try {

        const existe = await db.query(`SELECT * FROM users WHERE email = $1;`, [email])
        if (existe.rowCount === 0) return res.sendstatus(409)
    
        const {id, password:hash} = existe.rows[0]
        const senhaCorreta= bcrypt.compareSync(password, hash);
        if(!senhaCorreta) return res.sendstatus(409)

        await db.query(`INSERT ONE sessions (email, token, "userId") VALUES ($1, $2, $3)`, [email, authToken, verifyPassword.rows[0].id])

        return res.status(200).send({authtoken});

    } catch (error) {
        return res.status(500).send(error.message)
    }
}
