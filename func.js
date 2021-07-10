const User = require('./user.model')
const { handlePost, getId, checkId, headers } = require('./utils')

function getUsers(req, res){
    User.find({}).exec((err, result) => {
        if (err) {
            res.writeHead(201, headers)
            res.end(JSON.stringify({message: "Something went very wrong"}))
        } else {   
            res.writeHead(201, headers)
            res.end(JSON.stringify(result))
        }
    })
}

async function saveUser(res, req){
    const usersArr = await User.find({}).exec()
    const lastUserID = checkId(usersArr[usersArr.length-1])
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
            res.writeHead(400, headers)
            res.end(JSON.stringify({ message: 'Please pass valid JSON data' }))
        } else {
            res.writeHead(201, headers)
            res.end(JSON.stringify(newData))
        }
    })
}

function deleteUser(req, res, id){
    User.deleteOne({ id: id }).then((result) => {
        if(result.deletedCount === 1){
            res.writeHead(202, headers)
            res.end(JSON.stringify({ message: `User with id ${id} deleted` }))
        } else {
            res.writeHead(202, headers)
            res.end(JSON.stringify({ message: `User with id ${id} not found or something went very wrong` }))           
        }

    })    
    
}

function preflightOptions (res) {
    res.writeHead(204, headers);
    res.end()
    return;
}

module.exports = {
    getUsers,
    saveUser,
    deleteUser,
    preflightOptions,
    getId
}