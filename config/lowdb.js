const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./config/msgs.json')// --ignore msgs.json
const db = low(adapter)

db.defaults({info:[]}).write()
//console.log(db.get('info').value() )


module.exports = db
