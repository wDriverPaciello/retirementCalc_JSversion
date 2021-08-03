/**Utility Functions */
function inputKeyUp(e) {
    e.which = e.which || e.keyCode;
    if (e.which == 13) {
        submitBtn();
    }
}

function toPercent(num) {
    var num = num / 100;
    return num;
}

function round(num1, num2) {
    var num3 = Number.parseFloat(num1).toFixed(num2);
    return num3;
}

function toDollars(num) {
    var num = "$" + round(num, 2);
    return num;
}

function showHide(divID, btnID) {
    var divStuff = document.getElementById(divID);
    var buttonStuff = document.getElementById(btnID);

    if (buttonStuff.getAttribute('aria-expanded') === 'true') {
        buttonStuff.setAttribute('aria-expanded', false);
        divStuff.style.display = "none";
    } else {
        buttonStuff.setAttribute('aria-expanded', true);
        divStuff.style.display = "block";
    }

}

/**Other */
function setDefault() {
    showHide('retIncomeInfo', 'retIncomeBtn');
    showHide('safeRetBalInfo', 'safeRetBalBtn');
    showHide('advOptions', 'advOptionsBtn');
    submitBtn();
}

function submitBtn() {
    deletePerviousSubmit();

    /**Inputs*/
    let ageInput = parseInt(document.getElementById("currentAge").value);
    let retirementAgeInput = parseInt(document.getElementById("retirementAge").value);
    let incomeInput = parseInt(document.getElementById("currentIncome").value);
    let savedInput = parseInt(document.getElementById("currentSaved").value);
    let saveRateInput = toPercent(parseInt(document.getElementById("savingsRate").value));
    let payIncreaseInput = toPercent(parseInt(document.getElementById("payIncrease").value));
    let aveInterestInput = toPercent(parseInt(document.getElementById("aveInterest").value));

    let cust_retIncomInput = document.getElementById("cust_retIncom").value;
    let cust_retBalanceInput = parseInt(document.getElementById("cust_retBalance").value);
    let inflationInput = toPercent(parseInt(document.getElementById("inflation").value));
    let retInterestRateInput = toPercent(parseInt(document.getElementById("retInterestRate").value));

    /**Logic*/
    let year = 0;
    let income = incomeInput;
    let savingsBal = savedInput;
    let adjInterestRate = aveInterestInput - inflationInput //interest - inflation

    buildTable("dataTable");

    if (cust_retBalanceInput === "") {
        mostBasicCalculation();
    } else {
        cust_retBalCalc();
    }

    /*
    Name: deletePerviousSubmit
    Description:  Get rid of the previous table
    */
    function deletePerviousSubmit() {
        var table = document.getElementById("dataTable");
        while (table.rows.length > 0) {
            table.deleteRow(0);
        }
    }

    /*
    Name: updateIncome
    Description:  Update income to include a pay raise
        New Income = Current Income + (Current income * Annual Raise)
    */
    function updateIncome() {
        var temp_pay_increase = (income * payIncreaseInput); //get this year's pay increase
        income = income + temp_pay_increase; // add pay increase to pay
        return income;
    }

    /*
    Name: updateSavings
    Description: Update savings balance to include current year's savings and interest
        1. Annual Savings = Income * Savings Rate
        2. New Savings Balance = Savings Balance + Annual Savings
        3. New Savings Balance = New Savings Balance + (New Savings Balance * Interest Rate)
    */
    function updateSavings() {
        var newSaved = income * saveRateInput //get this year's amount saved
        var temp_bal_increase = savingsBal + newSaved; //get last year's bal + new money saved
        savingsBal = temp_bal_increase + (temp_bal_increase * adjInterestRate); //add this year's interest to balance
        
        return savingsBal;
    }

    /*
    Name: updateDraw
    Description: Update amount drawn from retirement accounts
        1. New Annual Draw = Savings Balance / 25
    */
    function updateDraw(){
        //ToDo
    }

    /** Nothing was changed under Adavnced Options */
    function mostBasicCalculation() {
        console.log("mostBasicCalculation()")
        for (ageInput = ageInput + 1; ageInput <= retirementAgeInput; ageInput++) {

            income = updateIncome();
            savingsBal = updateSavings();
            year = year + 1
            buildTable("dataTable");
        }
    }

    function cust_retBalCalc() {
        console.log("cust_retBalCalc()")
        for (ageInput = ageInput + 1; ageInput <= retirementAgeInput; ageInput++) {

            if (savingsBal >= cust_retBalanceInput) {
                break;
            } else {
                /**Incroment*/
                income = updateIncome();

                savingsBal = updateSavings();

                year = year + 1

                buildTable("dataTable");
            }
        }
    }

    /*
    Name: buildTable
    Description: Build the table rows for the amitorization table
    */
    function buildTable(dataTable) {
        let table = document.getElementById(dataTable);
        let row = table.insertRow(-1);
        let cell1 = row.insertCell(-1);
        let cell2 = row.insertCell(-1);
        let cell3 = row.insertCell(-1);
        let cell4 = row.insertCell(-1);

        /**Output*/
        cell1.innerHTML = year;
        cell2.innerHTML = ageInput;
        cell3.innerHTML = toDollars(income);
        cell4.innerHTML = toDollars(savingsBal);
    }

    /**Display results */
    document.getElementById("retIncome").innerHTML = toDollars(income - (income * saveRateInput));
    document.getElementById("safeRetBal").innerHTML = toDollars(savingsBal);
}
