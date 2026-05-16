exports.generateReportHTML = (report) => {
    // Default values if data is missing
    const trustName = report.trustName || "Trust Name Not Provided";
    const registrationNo = report.registrationNo || "Registration No. Not Provided";
    const yearEnding = report.financialYear || "31.03.2025";
    const address = report.address || "Address Not Provided";

    // Extract dynamic arrays from the model (with fallbacks to empty arrays)
    const permissions = report.permissions || [];
    const expenditures = report.incomeExpenditure?.expenditures || [];
    const incomes = report.incomeExpenditure?.incomes || [];
    const totalExpenditure = report.incomeExpenditure?.totalExpenditure || 0;
    const totalIncome = report.incomeExpenditure?.totalIncome || 0;
    
    const fundsLiabilities = report.balanceSheet?.fundsLiabilities || [];
    const propertyAssets = report.balanceSheet?.propertyAssets || [];
    const totalFunds = report.balanceSheet?.totalFundsLiabilities || 0;
    const totalAssets = report.balanceSheet?.totalPropertyAssets || 0;

    // Helper functions to generate rows
    const generateRows = (items) => {
        if (!items || items.length === 0) return '<tr><td colspan="2" class="text-center">No data available</td></tr>';
        return items.map(item => `
            <tr>
                <td style="border: none; border-right: 1px solid #000; padding: 4px 8px;">
                    <div class="${item.isHeader ? 'font-bold mt-2' : ''}">${item.label}</div>
                </td>
                <td style="border: none; padding: 4px 8px;" class="col-amount">${item.amount !== null && item.amount !== undefined ? item.amount : ''}</td>
            </tr>
        `).join('');
    };

    const generateBalanceSheetRows = (items) => {
        if (!items || items.length === 0) return '<tr><td colspan="3" class="text-center">No data available</td></tr>';
        return items.map(item => `
            <tr>
                <td style="border: none; border-right: 1px solid #000; padding: 4px 8px;">
                    <div class="${item.isHeader ? 'font-bold mt-2' : ''}">${item.label}</div>
                </td>
                <td style="border: none; border-right: 1px solid #000; padding: 4px 8px;" class="col-amount">${item.amount !== null && item.amount !== undefined ? item.amount : ''}</td>
                <td style="border: none; padding: 4px 8px;" class="col-amount">${item.total !== null && item.total !== undefined ? item.total : ''}</td>
            </tr>
        `).join('');
    };

    const generatePermissionRows = (perms) => {
        if (!perms || perms.length === 0) return '<tr><td colspan="3" class="text-center">No checklist data</td></tr>';
        return perms.map((p, index) => `
            <tr>
                <td style="width: 20px; text-align: center; padding: 2px 4px; font-size: 10px;">${index + 1}]</td>
                <td style="padding: 2px 4px; font-size: 10px; line-height: 1.1;">${p.question}</td>
                <td class="col-yesno" style="padding: 2px 4px; font-size: 10px;">${p.answer || 'N/A'}</td>
            </tr>
        `).join('');
    };

    // Build the HTML structure
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Audit Report</title>
        <style>
            /* Reset & Core Setup */
            * { box-sizing: border-box; }
            body {
                font-family: 'Times New Roman', Times, serif;
                font-size: 14px;
                margin: 0;
                padding: 0;
                color: #000;
            }
            /* A4 Print Setup */
            .page-border {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border: 1px solid #000;
                pointer-events: none;
                z-index: -1;
            }
            .page {
                width: 100%;
                padding: 10px;
                position: relative;
                page-break-after: always;
            }
            
            /* Typography & Alignment */
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .uppercase { text-transform: uppercase; }
            .mb-2 { margin-bottom: 10px; }
            .mb-4 { margin-bottom: 20px; }
            .mb-8 { margin-bottom: 40px; }
            .mt-4 { margin-top: 20px; }
            .mt-8 { margin-top: 40px; }

            /* Headers */
            .main-title { font-size: 20px; font-weight: bold; text-align: center; margin: 40px 0; }
            
            /* Tables */
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                font-size: 12px;
            }
            th, td {
                border: 1px solid #000;
                padding: 6px 8px;
                vertical-align: top;
            }
            th { text-align: center; font-weight: bold; }
            .col-amount { text-align: right; }
            .col-yesno { width: 60px; text-align: center; }
            
            .inner-table { width: 100%; border-collapse: collapse; }
            .inner-table td { border: none; padding: 2px; }

            /* Grid for signatures */
            .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 60px;
            }
            .signature-block {
                text-align: center;
                width: 45%;
            }
        </style>
    </head>
    <body>
        <div class="page-border"></div>

        <!-- PAGE 1: TITLE PAGE -->
        <div class="page">
            <div class="main-title uppercase">AUDIT REPORT</div>
            
            <div class="text-center mb-8 mt-8">
                <div class="font-bold mb-2">FOR THE YEAR ENDED ${yearEnding}</div>
                <div class="font-bold mb-2">${trustName}</div>
                <div class="mb-4">AT ${address}</div>
                <div class="font-bold mb-8">Registration No :- ${registrationNo}</div>
            </div>

            <div class="text-center mt-8 pt-8">
                <div class="font-bold mb-2">THE RVD & ASSOCIATES</div>
                <div class="font-bold mb-2">CERTIFIED AUDITOR</div>
                <div style="font-size: 12px; line-height: 1.5;">
                    Address :- Shop No-07, Ambika Complex Near<br>
                    Shani Mandir Old Jalna.Jalna(M.S) 431203<br>
                    Email. Id- thervdassociates@gmail.com.<br>
                    Mob.No- 9325554777, 9763588222
                </div>
            </div>
        </div>

        <!-- PAGE 2: AUDITOR REPORT (Checklist) -->
        <div class="page">
            <div class="text-center font-bold mb-2" style="font-size: 11px;">
                Report of an auditor relating to accounts audited under sub section (2) of Section 33 & 34 and the rule 19<br>
                of the Bombay Trust Act 1950.
            </div>

            <table style="border: none; margin-bottom: 5px; font-size: 10px;">
                <tr>
                    <td style="border: none; width: 150px; font-weight: bold;">Name of the trust</td>
                    <td style="border: none;">${trustName}<br>AT ${address}</td>
                </tr>
                <tr>
                    <td style="border: none; font-weight: bold;">Registration No</td>
                    <td style="border: none;">${registrationNo}</td>
                </tr>
                <tr>
                    <td style="border: none; font-weight: bold;">For The Year Ending</td>
                    <td style="border: none;">${yearEnding}</td>
                </tr>
            </table>

            <table style="margin-bottom: 10px;">
                <tbody>
                    ${generatePermissionRows(permissions)}
                </tbody>
            </table>

            <div class="signatures" style="margin-top: 15px; font-size: 10px;">
                <div class="signature-block">
                    <div style="text-align: left; margin-bottom: 10px;">
                        Date :- <br>
                        Place :- 
                    </div>
                </div>
                <div class="signature-block">
                    <div style="height: 30px;"></div>
                    <div class="font-bold">PRESIDENT</div>
                    <div>${trustName}</div>
                </div>
            </div>
        </div>

        <!-- PAGE 3: INCOME & EXPENDITURE -->
        <div class="page">
            <div class="text-center font-bold mb-4" style="font-size: 12px;">
                The Bombay Public Trusts Act 1950<br>
                SCHEDULE IX (VIDE RULE 17(I)<br>
                Name of the Trust :- ${trustName}<br>
                AT ${address}<br>
                Registration No-${registrationNo}<br>
                INCOME AND EXPENDITURE A/C FOR THE YEAR ${yearEnding}
            </div>

            <table>
                <thead>
                    <tr>
                        <th style="width: 40%;">EXPENDITURE</th>
                        <th style="width: 10%;" class="col-amount">AMOUNT</th>
                        <th style="width: 40%;">INCOME</th>
                        <th style="width: 10%;" class="col-amount">AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="2" style="padding: 0; vertical-align: top;">
                            <table class="inner-table" style="margin: 0;">
                                ${generateRows(expenditures)}
                            </table>
                        </td>
                        <td colspan="2" style="padding: 0; vertical-align: top; border-left: 1px solid #000;">
                            <table class="inner-table" style="margin: 0;">
                                ${generateRows(incomes)}
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-bold text-center">TOTAL</td>
                        <td class="font-bold col-amount">${totalExpenditure}</td>
                        <td class="font-bold text-center">TOTAL</td>
                        <td class="font-bold col-amount">${totalIncome}</td>
                    </tr>
                </tbody>
            </table>
            
            <div class="signatures">
                <div class="signature-block">
                    <div style="text-align: left; margin-bottom: 30px;">
                        Date :- <br>
                        Place :- 
                    </div>
                </div>
                <div class="signature-block">
                    <div class="font-bold">PRESIDENT</div>
                    <div>${trustName}</div>
                </div>
            </div>
        </div>

        <!-- PAGE 4: BALANCE SHEET -->
        <div class="page">
            <div class="text-center font-bold mb-4" style="font-size: 12px;">
                The Bombay Public Trust Act 1950.<br>
                SCHEDULE VII (VIDE RULE 17(1))<br>
                Registration No-${registrationNo}<br>
                Name of the Trust :- ${trustName}<br>
                AT ${address}<br>
                <br>
                BALANCE SHEET AS ON ${yearEnding}
            </div>

            <table>
                <thead>
                    <tr>
                        <th style="width: 30%;">Funds & Liabilities</th>
                        <th style="width: 10%;">Amount</th>
                        <th style="width: 10%;">Amount</th>
                        <th style="width: 30%;">Property & Assets</th>
                        <th style="width: 10%;">Amount</th>
                        <th style="width: 10%;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="3" style="padding: 0; vertical-align: top;">
                            <table class="inner-table" style="margin: 0;">
                                ${generateBalanceSheetRows(fundsLiabilities)}
                            </table>
                        </td>
                        <td colspan="3" style="padding: 0; vertical-align: top; border-left: 1px solid #000;">
                            <table class="inner-table" style="margin: 0;">
                                ${generateBalanceSheetRows(propertyAssets)}
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-bold text-center">TOTAL</td>
                        <td style="border: none;"></td>
                        <td class="font-bold col-amount" style="border-left: 1px solid #000;">${totalFunds}</td>
                        <td class="font-bold text-center">TOTAL</td>
                        <td style="border: none;"></td>
                        <td class="font-bold col-amount" style="border-left: 1px solid #000;">${totalAssets}</td>
                    </tr>
                </tbody>
            </table>

            <div class="signatures">
                <div class="signature-block">
                    <div style="text-align: left; margin-bottom: 30px;">
                        Date :- <br>
                        Place :- 
                    </div>
                </div>
                <div class="signature-block">
                    <div class="font-bold">PRESIDENT</div>
                    <div>${trustName}</div>
                </div>
            </div>
        </div>

    </body>
    </html>
    `;
};
