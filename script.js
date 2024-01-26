let passDisplay= document.querySelector("[data-passwordDisplay]");
let copyMsg= document.querySelector("[data-copyMsg]");
let copyBtn= document.querySelector("[data-copyBtn]");

let lenDisplay= document.querySelector("[data-length]");
let inputSlider= document.querySelector("[data-slider]");

let checkboxes= document.querySelectorAll("input[type='checkbox']");
let uppercase= document.querySelector("#uppercase");
let lowercase= document.querySelector("#lowercase");
let numbers= document.querySelector("#numbers");
let symbols= document.querySelector("#symbols");

let indicator= document.querySelector("[data-indicator]");
let generatePass= document.querySelector("[data-generatePass]");

let symb= `~@!#$%^&*()_-+=}]{[:;"'\\|,./?\`]`;
let passLength= 10; 
let pass="";
let checked= 1;

setIndicator("#ccc");

function handleSlider(){
    lenDisplay.innerText= passLength;
    inputSlider.value= passLength;
    let min= inputSlider.min;
    let max= inputSlider.max;
    inputSlider.style.backgroundSize= (passLength-min)*100/(max-min)+'% 100%';
}

handleSlider();

function getRndInteger(lowerBound, upperBound){
    return ( Math.floor(Math.random()*(upperBound-lowerBound)) +lowerBound);
}

function getRndDigit(){
    return getRndInteger(0,10);
}
function getRndLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function getRndUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function getRndSymbol(){
    return symb[getRndInteger(0,symb.length-1)];
}


function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow= `0 0 12px 1px ${color}`;
}

async function copy(){
    try{
        await navigator.clipboard.writeText(passDisplay.value);
        copyMsg.innerText= "Copied!";
    }
    catch{
        copyMsg.innerText= "Failed!";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    }, 2000);
}

function calcStrength(){
    let hasLower= false;
    let hasUpper= false;
    let hasSymbol= false;
    let hasNumber= false;
    if(uppercase.checked) hasUpper=true;
    if(lowercase.checked) hasLower=true;
    if(symbols.checked) hasSymbol=true;
    if(numbers.checked) hasNumber=true;

    if(hasLower && hasUpper && (hasSymbol || hasNumber) && passLength>=8){
        setIndicator('#90EE90');
    }
    else if( (hasLower||hasUpper) && (hasSymbol || hasNumber) && passLength>=6){
        setIndicator('yellow');
    }
    else{
        setIndicator('red');
    }
}

function trackCheckbox(checkbox){
    if(checkbox.checked){
        checked++;
    }
    else{
        checked--;
    }
}

function shufflePass(pass){
    for (let i = passLength -1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        let k = pass[i];
        pass[i] = pass[j];
        pass[j] = k;
      }
    let str= "";
    pass.forEach(e=>str+=e);
    return str;
}

inputSlider.addEventListener("input", (e)=>{
    passLength= e.target.value;
    handleSlider();
});

copyBtn.addEventListener("click", ()=>{
    if(passDisplay.value){
        copy();
    }
});

checkboxes.forEach((checkbox)=>{
    checkbox.addEventListener('change', ()=>{
        trackCheckbox(checkbox);
    });
});


generatePass.addEventListener("click", ()=>{
    if(checked==0) return;

    if(passLength<checked){
        passLength= checked;
        handleSlider();
    }

    let listChecked=[];
    let funct={
        numbers: getRndDigit,
        symbols: getRndSymbol,
        uppercase: getRndUppercase,
        lowercase: getRndLowercase
    };
    checkboxes.forEach((checkbox)=>{
        if(checkbox.checked){
            listChecked.push(funct[checkbox.id]);
        }
    });

    pass="";
    for(let i=0; i<listChecked.length; i++){
        pass+= listChecked[i]();
    }

    for(let i=0; i< (passLength-listChecked.length); i++){
        let randomInd= getRndInteger(0, listChecked.length);
        pass+= listChecked[randomInd]();
    }

    pass= shufflePass(Array.from(pass));
    
    passDisplay.value= pass;
    calcStrength();

});