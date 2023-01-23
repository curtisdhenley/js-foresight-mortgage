function getUserInput() {
    let loanAmount = document.getElementById('loanAmount').value;
    let term = document.getElementById('term').value.toLocaleString(
        'en-US', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }
    );
    let rate = document.getElementById('rate').value.toLocaleString(
        'en-US', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }
    )

    loanAmount = parseFloat(loanAmount);
    term = parseFloat(term);
    rate = parseFloat(rate);

    calculateAmounts(loanAmount, term, rate);
}

function calculateAmounts(amount, term, rate) {

    // total monthly payment = (amount loaned) * (rate/1200)/(1-(1 + rate/1200)(-number of months))
    let monthlyPayment = (amount * (rate / 1200) / (1 - (1 + rate / 1200) ** (-term)));

    // remaining balance before the very first month equals the amount of the loan
    let remainingBalance = amount;

    // interest payment = previous remaining balance * rate/1200
    let interestPayment = remainingBalance * (rate / 1200)

    // principal payment = total monthly payment - interest payment
    let principalPayment = monthlyPayment - interestPayment;

    // at end of each month, remaining balance = previous remaining balance - principal payments
    let newRemainBalance = remainingBalance - principalPayment;

    let loanParts = {
        'Loan Amount': amount,
        'Loan Term': term,
        'Loan Interest Rate': rate,
        'Monthly Payment': monthlyPayment,
        'Remaining Balance': remainingBalance,
        'Interest Payment': interestPayment,
        'Principal Payment': principalPayment,
        'New Remaining Balance': newRemainBalance
    }
    displayBalances(loanParts);
    displayPaymentData(loanParts);

}

function displayBalances(balancesArr) {

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
}

function displayPaymentData(balancesArr) {
    let tableBody = document.getElementById('mortgageTableBody');
    const tableRowTemplate = document.getElementById('mortgageTableRowTemplate');
    let totalInterest = 0;

    tableBody.innerHTML = '';

    for (let i = 1; i <= balancesArr['Loan Term']; i++) {
        let eventRow = document.importNode(tableRowTemplate.content, true);
        let tableCells = eventRow.querySelectorAll('td');

        // month
        tableCells[0].innerHTML = i;

        // payment
        tableCells[1].innerHTML = balancesArr['Monthly Payment'].toLocaleString(
            'en-US', {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }
        );

        // principal
        balancesArr['Principal Payment'] = (balancesArr['Monthly Payment'] - (balancesArr['Remaining Balance'] * (balancesArr['Loan Interest Rate'] / 1200)));
        tableCells[2].innerHTML = balancesArr['Principal Payment'].toLocaleString(
            'en-US', {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }
        );

        // interest
        balancesArr['Interest Payment'] = balancesArr['Remaining Balance'] * (balancesArr['Loan Interest Rate'] / 1200);
        tableCells[3].innerHTML = balancesArr['Interest Payment'].toLocaleString(
            'en-US', {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }
        );
        
        // total interest
        totalInterest += parseFloat(balancesArr['Interest Payment']);
        tableCells[4].innerHTML = totalInterest.toLocaleString(
            'en-US', {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }
        );
        
        
        // balance
        balancesArr['New Remaining Balance'] = balancesArr['Remaining Balance'] - balancesArr['Principal Payment'];
        tableCells[5].innerHTML = balancesArr['New Remaining Balance'].toLocaleString(
            'en-US', {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }
        ); 
        
        tableBody.appendChild(eventRow);
        balancesArr['Remaining Balance'] = balancesArr['New Remaining Balance'];
    }
}