function calculateAmounts() {
    let loanAmount = document.getElementById('loanAmount').value;
    let term = document.getElementById('term').value;
    let rate = document.getElementById('rate').value;

    loanAmount = parseInt(loanAmount)
    term = parseInt(term);
    rate = parseFloat(rate);

    // total monthly payment = (amount loaned) * (rate/1200)/(1-(1 + rate/1200)(-number of months))
    let monthlyPayment = (loanAmount * (rate / 1200) / (1 - (1 + rate / 1200) ** (-term)))

    // remaining balance before the very first month equals the amount of the loan
    let remainingBalance = loanAmount;

    // interest payment = previous remaining balance * rate/1200
    let interestPayment = remainingBalance * (rate / 1200)

    // principal payment = total monthly payment - interest payment
    let principalPayment = monthlyPayment - interestPayment;

    // at end of each month, remaining balance = previous remaining balance - principal payments
    let newRemainBalance = remainingBalance - principalPayment;

    let loanParts = {
        'Loan Amount': loanAmount,
        'Loan Term': term,
        'Interest Rate': rate,
        'Monthly Payment': monthlyPayment,
        'Remaining Balance': remainingBalance,
        'Interest Payment': interestPayment,
        'Principal Payment': principalPayment,
        'New Remaining Balance': newRemainBalance
    }

    return loanParts;
}

function displayBalances() {
    let balancesArr = calculateAmounts();

    document.getElementById('monthly-payment').innerHTML = balancesArr['Monthly Payment'].toLocaleString(
        'en-US', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }
    );
    document.getElementById('total-principal').innerHTML = (balancesArr['Principal Payment'] * balancesArr['Loan Term']).toLocaleString(
        'en-US', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }
    );
    document.getElementById('total-interest').innerHTML = (balancesArr['Interest Payment'] * balancesArr['Loan Term']).toLocaleString(
        'en-US', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }
    );
    document.getElementById('total-cost').innerHTML = ((balancesArr['Principal Payment'] * balancesArr['Loan Term']) + (balancesArr['Interest Payment'] * balancesArr['Loan Term'])).toLocaleString(
        'en-US', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }
    );

    displayPaymentData();
}

function displayPaymentData() {
    
    let balancesArr = calculateAmounts();
    let tableBody = document.getElementById('mortgageTableBody');
    const tableRowTemplate = document.getElementById('mortgageTableRowTemplate');

    tableBody.innerHTML = '';

    for (let i = 1; i <= balancesArr['Loan Term']; i++) {
        let eventRow = document.importNode(tableRowTemplate.content, true);
        let tableCells = eventRow.querySelectorAll('td');

        // month
        tableCells[0].innerHTML = i;

        // payment
        tableCells[1].innerHTML = balancesArr['Monthly Payment'];

        // principal
        tableCells[2].innerHTML = balancesArr['Monthly Payment'] - balancesArr['Interest Payment'];

        // interest
        tableCells[3].innerHTML = balancesArr['Remaining Balance'] * (rate / 1200);

        // total interest
        tableCells[4].innerHTML = tableCells[3].innerHTML + (balancesArr['Remaining Balance'] * (rate / 1200));

        // balance
        tableCells[5].innerHTML = (balancesArr['Remaining Balance'] - tableCells[2].innerHTML);

        tableBody.appendChild(eventRow);
    }
}