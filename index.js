const rangeSelector = document.querySelector('input[rangeSelector]');
let upperCase = document.querySelector('#upperCase');
let lowerCase = document.querySelector('#lowerCase');
let symbol = document.querySelector('#symbol');
let number = document.querySelector('#number');
let passwordBtn = document.querySelector('[password]');
let passwordLength = document.querySelector('[passwordLength]');
let indicator = document.querySelector('.strength');
let allCheckBox = document.querySelectorAll('input[type=checkbox]');
let copyMsg = document.querySelector('.copyMsg');
let copyBtn = document.querySelector('.copyBtn');
let generateBtn = document.querySelector('.generateBtn');
let password = "";
let checkCount = 0;

const defaultRange = 15;
let passwordLengthValue = 0;
let rangeSelectorValue;
let intPasswordLength = parseInt(passwordLength.innerText);


// default value of slider
function handleSlider() {
  
  passwordLength.innerText = rangeSelector.value;
  passwordLengthValue += parseInt(passwordLength.innerText);
 
}

// shuffle password
function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

// changing value according to input range
rangeSelector.addEventListener('input', function () {
  passwordLength.innerText = rangeSelector.value;
});

function setIndicator(color) {
  indicator.classList.add(color)
}

function removeWhiteIndicator(){
  indicator.classList.remove('bg-white');
}

// generating random number between
function genRndNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// generating random uppercase
function gntRndUpper() {
  return String.fromCharCode(genRndNum(65, 91)); // ASCII code for uppercase to string
}

// generating random lowercase
function gntRndLower() {
  return String.fromCharCode(genRndNum(97, 123));
}

// generating random number
function gntRndNumber() {
  return genRndNum(0, 10).toString();
}

// generating random symbol
const symbols = '~!@#$%^&*()|\\?/.<>\'"\][=-_`';
function generateSymbol() {
  return symbols[genRndNum(0, symbols.length)];
}

// check count
function handleCheckbox() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
  if (parseInt(passwordLength.innerText) < checkCount) {
    // passwordLengthValue = checkCount;
    rangeSelector.value = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener('change', handleCheckbox);
});

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasSymbol = false;
    let hasNumber = false;
    if (upperCase.checked) hasUpper = true;
    if (lowerCase.checked) hasLower = true;
    if (symbol.checked) hasSymbol = true;
    if (number.checked) hasNumber = true;
  
    if (hasLower && hasUpper && (hasSymbol || hasNumber) && parseInt(passwordLength.innerText) >= 8) {
      removeWhiteIndicator();
      setIndicator('bg-[#00ff00]');
      
    } else if ((hasLower || hasUpper) && (hasSymbol || hasNumber) && parseInt(passwordLength.innerText) >= 8) {
      removeWhiteIndicator();
      setIndicator('bg-[#feff47]');
    } else {
      removeWhiteIndicator()
      setIndicator('bg-[#a30000]');
    }
  }

async function copyText() {
  try {
    await navigator.clipboard.writeText(passwordBtn.value);
    copyMsg.classList.remove('hidden');
    setTimeout(() => {
    copyMsg.classList.add('hidden')
  }, 2000);
  } catch (e) {
    copyMsg.innerText = 'Failed';
  }
  
}

copyBtn.addEventListener('click', () => {
  if (passwordBtn.value.length >= 1) {
    copyText();
  }
});

generateBtn.addEventListener('click', () => {
    // if the password length is zero
    if (checkCount <= 0) return;
  
    // Update the range selector if checkCount is greater than the selected range
    if (parseInt(passwordLength.innerText) < checkCount) {
      passwordLengthValue = checkCount;
      rangeSelector.value = checkCount;
      handleSlider();
    }
  
    // remove old password
    password = "";
  
    // add characters based on selections
    const functionArray = [];
    if (upperCase.checked) {
      functionArray.push(gntRndUpper);
    }
    if (lowerCase.checked) {
      functionArray.push(gntRndLower);
    }
    if (symbol.checked) {
      functionArray.push(generateSymbol);
    }
    if (number.checked) {
      functionArray.push(gntRndNumber);
    }
  
    // compulsory characters
    for (let i = 0; i < functionArray.length; i++) {
      password += functionArray[i]();
    }
  
    // remaining characters
    while (password.length < parseInt(passwordLength.innerText)) {
      let randomIndex = genRndNum(0, functionArray.length);
      password += functionArray[randomIndex]();
    }
  
    passwordBtn.value = shufflePassword(password.split(''));
    passwordBtn.classList.add('text-yellow-400');
    calcStrength();
    return passwordBtn;
  });