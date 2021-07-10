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

function checkId(arr) {
    if (arr === undefined) {
        return '0'
    } else {
        return arr.id
    }
}

module.exports = {
    handlePost,
    getId,
    checkId
}