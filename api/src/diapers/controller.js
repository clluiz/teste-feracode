const service = require('./service');
const diapers = require('./db');

const save = function(req, res, next) {
  let diaper = req.body;
  diaper.amountPurchased = 0;
  diapers.insert(diaper)
    .then(response => res.send(response))
    .catch(err => next(err));
};

const update = async function(req, res, next) {
  try {
    let diaper = await diapers.get(req.params.id);
    let updated = {...diaper, ...req.body};
    await diapers.insert(updated);
    res.send(updated);
  } catch(err) {
    next(err);
  }
};

const remove = async function(req, res, next) {
  try {
    let diaper = await diapers.get(req.params.id);
    diaper.deleted = true;
    await diapers.insert(diaper);
    res.send(diaper);
  } catch(err) {
    next(err);
  }

};

const get = function(req, res, next) {
  diapers.view('diapers', 'all_diapers')
    .then((body) => { 
      res.send(body.rows.map(r => r.value).filter(d => !d.deleted)); })
    .catch(err => next(err));
};

const getOne = function(req, res) {
  diapers.get(req.params.id)
    .then((body) => {
      if(body.deleted) res.send(null);
      res.send(body);
    })
    .catch(err => next(err));
};

const sell = async function(req, res, next) {
  try {
    let diaper = await diapers.get(req.params.id);

    if(diaper.amount - req.body.amountPurchased < 0) {
      req.body.amountPurchased = diaper.amount;
    };

    let actualDate = new Date();
    diaper.amountPurchased += req.body.amountPurchased;
    diaper.exhaustionForecast = service.calculateExhaustionForecast(diaper.lastPurchase, actualDate, diaper.amount, diaper.amountPurchased);
    diaper.lastPurchase = actualDate;
    await diapers.insert(diaper);
    res.send(diaper);
  } catch(err) {
    next(err);
  }
};

exports.save = save;
exports.update = update;
exports.get = get;
exports.getOne = getOne;
exports.remove = remove;
exports.sell = sell;