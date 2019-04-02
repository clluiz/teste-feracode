var diapers = [];
var diaperToSell = null;

function listAllDiapers() {
  fetch('http://localhost:4000/diapers')
    .then(function (response) {
      return response.json()
    })
    .then(function (result) {
      var tableBody = document.getElementById("table-body");
      tableBody.innerHTML = '';
      diapers = result;
      diapers.forEach(renderDiaper);
    });
};

function addDiaperToStock() {
  var diaper = {
    model: document.getElementById('select-model').value,
    size: document.getElementById('select-size').value,
    description: document.getElementById('input-description').value,
    amount: document.getElementById('input-amount').value
  };

  if (!diaper.model || !diaper.size || !diaper.amount) {
    alert('Check if model, size or amount are filled');
    return;
  }

  fetch('http://localhost:4000/diapers', {
    method: 'POST',
    body: JSON.stringify(diaper),
    headers: new Headers({ 'content-type': 'application/json' }),
  }).then(function (response) {
    diapers.push(diaper);
    renderDiaper(diaper, diapers.length - 1);
  });
};

function sellDiaper(event) {
  event.preventDefault();
};

function renderDiaper(diaper, index) {
  var template = document.querySelector('#diaper-template');
  var tbody = document.querySelector("tbody");
  var clone = document.importNode(template.content, true);
  var td = clone.querySelectorAll("td");
  td[0].textContent = diaper.model;
  td[1].textContent = diaper.size;
  td[2].textContent = parseInt(diaper.amount || 0) - parseInt(diaper.amountPurchased || 0);
  td[3].textContent = diaper.lastPurchase ? new Date(diaper.lastPurchase).toLocaleString('pt-BR') : '-';
  let exhaustionForecast = parseFloat(diaper.exhaustionForecast / 60).toPrecision(3);
  td[4].textContent = isNaN(exhaustionForecast) ? '-' : exhaustionForecast;
  td[5].children[0].addEventListener('click', function () {
    sellDiaper(index);
  });
  tbody.appendChild(clone);
};

function sellDiaper(index) {
  showSellForm();
  diaperToSell = diapers[index];
};

function confirmSell() {
  var value = document.getElementById('input-amount-sell').value;
  if (!value) {
    alert('Fill the amount of diapers purschased');
    return;
  }
  var amount = parseInt(value);
  fetch('http://localhost:4000/diapers/' + diaperToSell._id + '/sell', {
    method: 'PUT',
    body: JSON.stringify({ amountPurchased: amount }),
    headers: new Headers({ 'content-type': 'application/json' }),
  }).then(function () {
    diapers = [];
    diaperToSell = null;
    listAllDiapers();
  })
    .catch(function (error) { alert('Error updating diaper') });
}

function showSellForm() {
  document.getElementById("section-sell").style.display = "block";
  document.getElementById("section-new").style.display = "none";
};

listAllDiapers();