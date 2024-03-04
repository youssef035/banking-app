'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const loginArea = document.querySelector('.login');
const movements__row = document.querySelector('.movements__row');
/////////////////////////////////////////////////
// Functions

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//function that returns the balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//function to display the lists into the nav bar
const displayMovement = function (movements) {
  // empty that bitch
  containerMovements.innerHTML = '';

  calcDisplayBalance(currentAccount);

  //for every array we ll do this
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //the html that we ll be adding
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov.toFixed(2)}€</div>
  
  </div> `;
    // we need to add the html into the index
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//initialize the function
//displayMovement(account3.movements);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// function that displays dates
// i need to add this

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//function to calculate the summary (in, out, interest )
const calcSummary = function (account) {
  //we need to calculate whats comming in   first we need to get all the positive ones , then we add them up
  const deposited = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = deposited.toFixed(2) + '€';
  //now we need to know all the withrawals , and we will do that by filtering them all by the negatives then adding them up
  const withdrawals = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = Math.abs(withdrawals).toFixed(2) + '€';
  //lets calculate the interest , and the interest is paid on each deposit
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent = interest.toFixed(2) + '€';
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//function to create the username
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
    return acc.username;
  });
};

createUsername(accounts);

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// function to update the balances

const updateUI = function (account) {
  calcDisplayBalance(account);
  displayMovement(account.movements);
  calcSummary(account);
};
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// function that sets the timer :
let seconds = 10;
let minutes = 5;
const startLogoutTimer = function () {
  const intervalId = setInterval(function () {
    if (seconds > 0) {
      seconds--;
    } else if (minutes > 0) {
      minutes--;
      seconds = 59;
    } else {
      // Clear the interval when both minutes and seconds reach 0
      containerApp.setAttribute('style', 'opacity : 0');
      labelWelcome.textContent = 'session is over please login again';
      loginArea.setAttribute('style', 'opacity : 100');
      inputLoginPin.value = inputLoginUsername.value = '';
      inputLoginPin.blur();
      clearInterval(intervalId);
    }

    labelTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }, 1000);
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
let currentAccount;
//adding event handlers
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  //let's find the user
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  //checking for the login
  if (currentAccount?.pin === Number(inputLoginPin?.value)) {
    //display account infos
    updateUI(currentAccount);

    // display UI
    containerApp.setAttribute('style', 'opacity : 100');

    // display welcome message
    labelWelcome.textContent =
      'welcome back ' + currentAccount.owner.split(' ')[0];

    // removing the login area
    loginArea.setAttribute('style', 'opacity : 0');
  } else {
    alert('the pin and the user name do not match');
  }
  // we ll add the timer here
  startLogoutTimer();
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// button to transfer the money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  seconds = 10;
  minutes = 5;

  // first we need the value to be transfered
  const amount = Number(inputTransferAmount.value);
  // then we need the receiver's data and look for the object
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);

  // check the data in the console
  console.log(amount, receiver);

  // check if the user got enough money on his account
  if (
    amount > 0 &&
    receiver &&
    currentAccount.balance >= amount &&
    receiver.username !== currentAccount.username
  ) {
    // remove the balance from the current move
    currentAccount.movements.push(-amount);
    // adding the balance to the other account
    receiver.movements.push(amount);
    // update the UI of the acounts
    updateUI(currentAccount);
  } else {
    alert('not enough balance ');
  }
  // empty the text fields
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// button to delete the account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  seconds = 10;
  minutes = 5;
  // we need to check if the pin and the user name matchs
  if (
    currentAccount.pin === Number(inputClosePin.value) &&
    currentAccount.username === inputCloseUsername.value
  ) {
    // let's do the deletion
    // first we need to find the account based on th data we have
    const indexOfit = accounts.findIndex(
      acc => acc.username === currentAccount?.username
    );
    accounts.splice(indexOfit, 1);
    console.log(accounts);

    // remove the UI
    containerApp.setAttribute('style', 'opacity : 0');
    labelWelcome.textContent = 'ACCOUNT IS CLOSED';

    console.log('account is closed');
  } else {
    alert('credentials do not match , try again ');
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// button to request a loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  seconds = 10;
  minutes = 5;
  // let's get the amount to be loaned
  const requested = Math.floor(inputLoanAmount.value);
  // check for the conditions
  if (
    requested > 0 &&
    currentAccount.movements.some(mov => mov >= requested * 0.1)
  ) {
    console.log('loan granted ');
    currentAccount.movements.push(requested);
    setTimeout(() => updateUI(currentAccount), 5000);
    inputLoanAmount.value = '';
  } else {
    alert('you do not fullfil all the requierments');
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// button to sort them out

let isSortedAsc = true; // Variable to track the sorting order

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(currentAccount.movements);
  seconds = 10;
  minutes = 5;
  // Sort the movements array based on the sorting order
  const sorted = currentAccount.movements
    .slice()
    .sort((a, b) => (isSortedAsc ? a - b : currentAccount.movements));

  console.log(sorted);
  displayMovement(sorted);

  // Toggle the sorting order for the next click
  isSortedAsc = !isSortedAsc;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// adding the date
// first of all let's have our current date
const currentDate = new Date();
// now let's check where we ll add it
labelDate.textContent =
  currentDate.getDate() +
  '/' +
  (currentDate.getMonth() + 1) +
  '/' +
  currentDate.getFullYear() +
  ' , ' +
  currentDate.getHours() +
  ':' +
  currentDate.getMinutes();

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// LECTURES
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movementss = [200, 450, -400, 3000, -650, -130, 70, 1300];
