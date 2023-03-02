import bcrypt from "bcrypt"
import { v4 as uuidV4 } from "uuid"
import { db } from "../config/database.js"

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
    const authToken = uuidV4();

    try {

        const existe = await db.query(`SELECT * FROM users WHERE email = $1;`, [email])
        console.log(existe)
        if (existe.rowCount === 0) return res.sendStatus(401)
        
        const {id, password:hash} = existe.rows[0]
        const senhaCorreta= bcrypt.compareSync(password, hash);
        console.log(senhaCorreta)
        if(!senhaCorreta) return res.sendStatus(401)


        await db.query(`INSERT INTO sessions ("userToken", "userId") VALUES ($1, $2)`, [authToken, existe.rows[0].id])

        return res.status(200).send( { token:authToken });

    } catch (error) {
        return res.status(500).send(error.message)
    }
}
