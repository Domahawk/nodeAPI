const mongoose = require('mongoose');
const { exists } = require('./user.model');
const User = require('./user.model')

function getUsers(req, res){
    User.find({}).exec((err, result) => {
        if (err) {
            console.log(err)
            res.writeHead(201, {                
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
        })
            res.end(JSON.stringify({message: "Something went very wrong"}))
        } else {   
            res.writeHead(201, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
            })
            res.end(JSON.stringify(result))
        }
    })
}

function getSingleUser(res, req, id){
    User.find({ id: id }).exec((err, result) => {
        if(err || !result[0] ) {
            res.writeHead(404, {                
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
        })
            res.end(JSON.stringify({message: "User not found"}))
        } else {
            res.writeHead(200, {              
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
        })
            res.end(JSON.stringify(result))
        }
    })
}

async function saveUser(res, req){

    const usersArr = await User.find({}).exec()    
    const lastUserID = usersArr[usersArr.length-1].id
    const newUserID = parseInt(lastUserID) + 1
    const body = await handlePost(req)
    const { firstName, lastName, email } = JSON.parse(body)
    const dataObj = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }
    const newData = new User ({id: newUserID.toString(), ...dataObj})
    newData.save(function(err, result) {
        if(err) {
            console.log(err)
            res.writeHead(400, {                
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
        })
            res.end(JSON.stringify({ message: 'Please pass valid JSON data' }))
        } else {
            res.writeHead(201, {                
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
        })
            res.end(JSON.stringify(newData))
        }
    })
}

function deleteUser(req, res, id){
    User.deleteOne({ id: id }).then((result) => {
        if(result.deletedCount === 1){
            res.writeHead(202, {                
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
        })
            res.end(JSON.stringify({ message: `User with id ${id} deleted` }))
        } else {
            res.writeHead(202, {                
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
        })
            res.end(JSON.stringify({ message: `User with id ${id} not found or something went very wrong` }))           
        }

    })    
    
}

function preflightOptions (res) {
    res.writeHead(204, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    });
    res.end()
    return;
}

function handlePost(req) {
    return new Promise ((resolve, reject) => {
        let body = ''

        req.on('data', (chunk) => {
            body += chunk.toString()
        })

        req.on('end', () => {
            resolve(body)
        })
    })
}

function getId(req) {
    const urlArr = req.url.split('/')
    const id = urlArr[urlArr.length-1]
    return id
}

module.exports = {
    getUsers,
    getSingleUser,
    saveUser,
    deleteUser,
    preflightOptions,
    getId
}