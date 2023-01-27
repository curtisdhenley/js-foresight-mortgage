// entry point
function getUserInput() {
    let principal = parseFloat(document.getElementById('loanAmount').value);
    let term = parseInt(document.getElementById('term').value);
    let rate = parseFloat(document.getElementById('rate').value);

    if (Number.isInteger(principal) && Number.isInteger(term) && Number.isInteger(rate)) {
        calculateAmounts(principal, term, rate);
    } else {
        alert('Please enter valid numbers');
    }

}

// calculates amounts and stores them in an object
function calculateAmounts(principal, term, rate) {
   

    // total monthly payment = (amount loaned) * (rate/1200)/(1-(1 + rate/1200)(-number of months))
    let monthlyPayment = (principal * (rate / 1200)) / (1 - Math.pow(1 + rate / 1200, -term));

    let remainingBalance = principal;
    let interestPayment = 0;
    let totalInterest = 0;
    let principalPayment = 0;

    let loanPayments = [];

    for (let month = 1; month <= term; month++) {
        // interest payment = previous remaining balance * rate/1200
        interestPayment = remainingBalance * (rate / 1200);

        // total interest amount
        totalInterest += interestPayment;

        // principal payment = total monthly payment - interest payment
        principalPayment = monthlyPayment - interestPayment;

        // at end of each month, remaining balance = previous remaining balance - principal payments
        remainingBalance -= principalPayment

        let payment = {
            month: month,
            monthlyPayment: monthlyPayment,
            interestPayment: interestPayment,
            totalInterest: totalInterest,
            principalPayment: principalPayment,
            remainingBalance: remainingBalance
        }

        loanPayments.push(payment);
    }
    
    displayMortgageData(loanPayments, principal);

}

// iterates through the array that's passed in and displays the values on the screen
function displayMortgageData(loanPayments, principal) {
    let tableBody = document.getElementById('mortgageTableBody');
    const tableRowTemplate = document.getElementById('mortgageTableRowTemplate');
    
    tableBody.innerHTML = '';

    for (let i = 0; i <= loanPayments.length - 1; i++) {
        let eventRow = document.importNode(tableRowTemplate.content, true);
        let tableCells = eventRow.querySelectorAll('td');
        
        // month
        tableCells[0].innerHTML = i + 1;
        
        // payment
        tableCells[1].innerHTML = formatCurrency(loanPayments[i].monthlyPayment);
        
        // principal
        tableCells[2].innerHTML = formatCurrency(loanPayments[i].principalPayment);
        
        // interest
        tableCells[3].innerHTML = formatCurrency(loanPayments[i].interestPayment);
        
        // total interest
        tableCells[4].innerHTML = formatCurrency(loanPayments[i].totalInterest);
        
        // balance
        // use math.abs to show absolute value of amount instead of negative number
        tableCells[5].innerHTML = formatCurrency(Math.abs(loanPayments[i].remainingBalance));
        
        tableBody.appendChild(eventRow);
    }
    
    let totalInterest = loanPayments[loanPayments.length - 1].totalInterest;
    let totalCost = totalInterest + principal;
    let monthlyPayment = loanPayments[0].monthlyPayment

    document.getElementById('monthly-payment').innerHTML = formatCurrency(monthlyPayment);
    document.getElementById('total-principal').innerHTML = formatCurrency(totalCost - totalInterest);
    document.getElementById('total-interest').innerHTML = formatCurrency(totalInterest);
    document.getElementById('total-cost').innerHTML = formatCurrency(totalCost);
}

// formats strings into US currency
function formatCurrency(value) {
    return Number(value).toLocaleString('en-us', {
        style: 'currency',
        currency: 'USD'
    });
} 