const moment = require('moment');

const calculateExhaustionForecast = function(lastPurschaseData, actualDate, total, amountPurschased) {
  if(!lastPurschaseData) return null;
  let a = moment(lastPurschaseData);
  let b = moment(actualDate);
  let timeDiference = Math.abs(moment(b).diff(moment(a), 'seconds'));
  let diapersSoldByHour = amountPurschased / timeDiference;
  let exhaustionForecast = (total - amountPurschased) / diapersSoldByHour;
  return exhaustionForecast;
};

exports.calculateExhaustionForecast = calculateExhaustionForecast;