const http = require('http');
const { getUsers, getSingleUser, saveUser, deleteUser, preflightOptions, getId, connect } = require('./func');
const mongoose = require('mongoose');

const dbconn = `mongodb+srv://admin:${connect}@nodeapi.ofka6.mongodb.net/nodeapi?retryWrites=true&w=majority`
mongoose.connect(dbconn, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to DB'))

const PORT = process.send.PORT || 5000

const server = http.createServer((req, res) => {
    if(req.url === '/users' && req.method === 'GET') {
        getUsers(req, res);
    } else if(req.url.match(/\user\/[0-9]+/) && req.method === 'GET') {
        const id = getId(req)
        getSingleUser(res, req, id)
    } else if(req.url === '/post' && req.method === 'POST') {
        saveUser(res, req)
/*OPTIONS zbog cors preflight errora*/
    } else if(req.url.match(/\user\/[0-9]+/) && req.method === 'DELETE') {
        id = getId(req)
        deleteUser(req, res, id) 
    }else if(req.url && req.method === 'OPTIONS') {
        preflightOptions(res)
    } else {
        res.writeHead(404, {                
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
    })
        res.end(JSON.stringify({message: 'Route not found'}))
    }
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})