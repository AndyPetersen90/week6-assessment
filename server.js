const express = require('express')
const path = require('path')
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')

app.use(express.json())

var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '0e5ab84b0cf749dd92e7d3090ccc5c2a',
  captureUncaught: true,
  captureUnhandledRejections: true,
})


// rollbar.log('Hello world!')

app.use('/', express.static(path.join(__dirname, '/public')))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.js"))
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.css"))
})

/*
Rollbar methods
rollbar.info() rollbar.log() rollbar.error() rollbar.warning() rollbar.critical()
*/

app.get('/api/robots', (req, res) => {
    try {
        res.status(200).send(botsArr)
        rollbar.log('Bots have been requested')
    } catch (error) {
        console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
        rollbar.error('Error getting bots')
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        res.status(200).send({choices, compDuo})
        rollbar.log('Bots have been drawn for battle')
    } catch (error) {
        console.log('ERROR GETTING FIVE BOTS', error)
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            res.status(200).send('You lost!')
            rollbar.info('A battle has been won by the computer')
        
        } else {
            playerRecord.losses++
            res.status(200).send('You won!')
            rollbar.info('A battle has been won by the player')
        }
        rollbar.log('A battle has taken place')
    } catch (error) {
        console.log('ERROR DUELING', error)
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        res.status(200).send(playerRecord)
    } catch (error) {
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
    }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})