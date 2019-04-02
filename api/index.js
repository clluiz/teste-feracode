const express = require('express')
const app = express()
const couchdb = require('./src/couchdb');
const bodyParser = require('body-parser');
const diapersController = require('./src/diapers/controller');
const port = 4000;

const initDB = function() {
  couchdb.db.create('diapers', (err) => {
    if(err && err.statusCode != 412) {
      console.error(err);
    } else {
      console.log('Diapers database already created');
    }
  });  
};

app.use(bodyParser.json());
initDB()

app.get('/diapers', diapersController.get);
app.get('/diapers/:id', diapersController.getOne)
app.post('/diapers', diapersController.save);
app.put('/diapers/:id', diapersController.update);
app.put('/diapers/:id/sell', diapersController.sell);
app.delete('/diapers/:id', diapersController.remove);

app.use(express.static('../frontend'));

app.listen(port, () => console.log(`Let'sell some diapers! ${port}!`))