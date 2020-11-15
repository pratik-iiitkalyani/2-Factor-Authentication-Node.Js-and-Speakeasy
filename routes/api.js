const Router = require("express").Router();
const Uuid = require('uuid')
const Speakeasy = require('speakeasy')
const { JsonDB } = require("node-json-db")
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')
// const Db = require("../app").Db

const Db = new JsonDB(new Config('myDatabase', true, false, '/'))

// Register user and create temp secret
Router.route('/api/register')
    .post(async function (req, res) {
        const id = Uuid.v4()
        console.log("app", Db)
        try {
            const path = `../user/${id}`
            const temp_secret = Speakeasy.generateSecret()
            Db.push(path, { id, temp_secret})
            res.json({ id, secret: temp_secret.base32})
        } catch (err) {
            console.log("Error", err)
            res.status(500).json({ "message": "Error in generating the secret" })
            
        }
    })

// Verify token and make secret perm
Router.route('/api/verify')
    .post(async function (req, res) {
        const { token, userId} = req.body
        try {
            const path = `../user/${userId}`
            const user = Db.getData(path)

            const { base32:secret } = user.temp_secret
            const verified = Speakeasy.totp.verify({ secret,
                encoding: 'base32',
                token })

            if (verified) {
                Db.push(path, { id: userId, secret: user.temp_secret})
                res.json({ verified: true})
            } else {
                res.json({ verified: false })
            }
        } catch (err) {
            console.log("Error", err)
            res.status(500).json({ "message": "Error in Finding the user" })
            
        }
    })

// Validate token
Router.route('/api/validate')
    .post(async function (req, res) {
        const { token, userId} = req.body
        try {
            const path = `../user/${userId}`
            const user = Db.getData(path)

            const { base32:secret } = user.secret
            const tokenValidates = Speakeasy.totp.verify({ secret,
                encoding: 'base32',
                token,
                window: 1 })

            if (tokenValidates) {
                res.json({ validated: true})
            } else {
                res.json({ validated: false })
            }
        } catch (err) {
            console.log("Error", err)
            res.status(500).json({ "message": "Error in Finding the user" })
            
        }
    })


module.exports = Router