const generateNondaniReportHTML = require('./nondaniTemplate');

exports.generateReportHTML = (report) => {
    if (report.reportType === 'nondani') {
        return generateNondaniReportHTML(report);
    }
    const formatAddress = (address) => {
        if (!address) return null;
        const parts = [
            address.buildingName,
            address.streetName,
            address.landmark,
            address.village,
            address.taluka,
            address.district
        ].filter(Boolean);
        if (parts.length === 0) return null;
        return parts.join(', ') + (address.pin ? ` - ${address.pin}` : '');
    };

    // Default values if data is missing
    const trustName = report.trustDetails?.trustName || report.trustName || "Trust Name Not Provided";
    const registrationNo = report.trustDetails?.trustNumber || report.registrationNo || "Registration No. Not Provided";
    const yearEnding = report.accountingYear || report.financialYear || "31.03.2025";
    const address = formatAddress(report.trustDetails?.address) || report.address || "Address Not Provided";
    const date = report.date ? new Date(report.date).toLocaleDateString('en-GB') : "__.__.____";
    const place = report.place || "Jalna";

    const auditorFirm = report.auditorDetails?.nameOfFirm || "";
    const auditorStatus = report.auditorDetails?.status || "";
    const auditorName = report.auditorDetails?.auditorName || "";
    const auditorMembershipNo = report.auditorDetails?.membershipNumber || "";
    const auditorRegistrationNo = report.auditorDetails?.registrationNumber || "";
    const auditorAddressLine = formatAddress(report.auditorAddress?.address) || "";
    const auditorEmail = report.auditorAddress?.emailId || "";
    const auditorMobile = report.auditorAddress?.mobileNumber || "";

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

    const receipts = report.receiptPayment?.receipts || [];
    const payments = report.receiptPayment?.payments || [];
    const totalReceipts = report.receiptPayment?.totalReceipts || 0;
    const totalPayments = report.receiptPayment?.totalPayments || 0;

    const schIX_incomeShown = report.scheduleIX?.incomeShown || 0;
    const schIX_deductions = report.scheduleIX?.deductions || [];
    const schIX_grossAnnualIncome = report.scheduleIX?.grossAnnualIncome || 0;
    const schIX_contribution = report.scheduleIX?.contribution || 0;


    const sch9d_trustPan = report.schedule9D?.trustPan || '';
    const sch9d_incomeTaxRegistration = report.schedule9D?.incomeTaxRegistration || '';
    const sch9d_previousITReturns = report.schedule9D?.previousITReturns || [];
    const sch9d_trusteesPan = report.schedule9D?.trusteesPan || [];

    const delay_applicantName = report.delayExemption?.applicantName || '__________________';
    const delay_applicantAge = report.delayExemption?.applicantAge || '४०';
    const delay_applicantAddress = report.delayExemption?.applicantAddress || '__________________';
    const delay_designation = report.delayExemption?.designation || 'विश्वस्त / सचिव / अध्यक्ष';
    const delay_trustRegistrationDate = report.delayExemption?.trustRegistrationDate || '-  /  /20  ';
    const delay_financialYearMarathi = report.delayExemption?.financialYearMarathi || '2023-24';
    const delay_place = report.delayExemption?.place || 'जालना';
    const delay_date = report.delayExemption?.date || '07/01/2026';

    // Helper to fix image URLs for Puppeteer
    const fixImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const baseUrl = process.env.SERVER_URL || 'http://localhost:5000';
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const sig1 = fixImageUrl(report.signatures?.[0]?.file);
    const sig2 = fixImageUrl(report.signatures?.[1]?.file);
    const stamp1 = fixImageUrl(report.stamps?.[0]?.file);
    const stamp2 = fixImageUrl(report.stamps?.[1]?.file);

    // Helper functions to generate rows
    const generateIncomeExpenditureFlatRows = (expenditures, incomes) => {
        const maxRows = Math.max(expenditures.length, incomes.length);
        if (maxRows === 0) return '<tr class="flat-data-row"><td colspan="4" class="text-center">No data available</td></tr>';

        let html = '';
        for (let i = 0; i < maxRows; i++) {
            const exp = expenditures[i] || { label: '', amount: null, isHeader: false };
            const inc = incomes[i] || { label: '', amount: null, isHeader: false };

            html += `
                <tr class="flat-data-row">
                    <td class="${exp.isHeader ? 'font-bold' : ''}">
                        ${exp.label || ''}
                    </td>
                    <td class="col-amount">
                        ${exp.amount !== null && exp.amount !== undefined ? exp.amount : ''}
                    </td>
                    <td class="${inc.isHeader ? 'font-bold' : ''}">
                        ${inc.label || ''}
                    </td>
                    <td class="col-amount">
                        ${inc.amount !== null && inc.amount !== undefined ? inc.amount : ''}
                    </td>
                </tr>
            `;
        }
        return html;
    };

    const generateBalanceSheetFlatRows = (leftItems, rightItems) => {
        const maxRows = Math.max(leftItems.length, rightItems.length);
        if (maxRows === 0) return '<tr class="flat-data-row"><td colspan="6" class="text-center">No data available</td></tr>';

        let html = '';
        for (let i = 0; i < maxRows; i++) {
            const left = leftItems[i] || { label: '', amount: null, total: null, isHeader: false };
            const right = rightItems[i] || { label: '', amount: null, total: null, isHeader: false };

            html += `
                <tr class="flat-data-row">
                    <td class="${left.isHeader ? 'font-bold' : ''}">
                        ${left.label || ''}
                    </td>
                    <td class="col-amount">
                        ${left.amount !== null && left.amount !== undefined ? left.amount : ''}
                    </td>
                    <td class="col-amount">
                        ${left.total !== null && left.total !== undefined ? left.total : ''}
                    </td>
                    <td class="${right.isHeader ? 'font-bold' : ''}">
                        ${right.label || ''}
                    </td>
                    <td class="col-amount">
                        ${right.amount !== null && right.amount !== undefined ? right.amount : ''}
                    </td>
                    <td class="col-amount">
                        ${right.total !== null && right.total !== undefined ? right.total : ''}
                    </td>
                </tr>
            `;
        }
        return html;
    };

    const getAlphabetIndex = (index) => {
        let code = '';
        let temp = index;
        while (temp >= 0) {
            code = String.fromCharCode((temp % 26) + 97) + code;
            temp = Math.floor(temp / 26) - 1;
        }
        return code;
    };

    const generatePermissionRows = (perms) => {
        if (!perms || perms.length === 0) return '<tr><td colspan="3" class="text-center">No checklist data</td></tr>';
        return perms.map((p, index) => {
            const letterIndex = getAlphabetIndex(index);
            return `
                <tr>
                    <td style="width: 20px;" class="size-meta text-center">${letterIndex}]</td>
                    <td class="size-meta">${p.question}</td>
                    <td class="col-yesno size-meta">${p.answer || 'N/A'}</td>
                </tr>
            `;
        }).join('');
    };

    const generateSignatureBlock = () => {
        return `
            <div class="signatures size-subheading">
                <div class="signature-block signature-meta">
                    Date :- ${date}<br>
                    Place :- ${place}
                </div>
                <div class="signature-block signature-box">
                    <div class="font-bold">PRESIDENT</div>
                    <div>${trustName}</div>
                    <div class="signature-media-container">
                        ${stamp1 ? `<img src="${stamp1}" class="sig-img-stamp" />` : ''}
                        ${sig1 ? `<img src="${sig1}" class="sig-img-signature" />` : ''}
                    </div>
                </div>
                ${(sig2 || stamp2) ? `
                <div class="signature-block signature-box">
                    <div class="font-bold">SECRETARY / TRUSTEE</div>
                    <div>${trustName}</div>
                    <div class="signature-media-container">
                        ${stamp2 ? `<img src="${stamp2}" class="sig-img-stamp" />` : ''}
                        ${sig2 ? `<img src="${sig2}" class="sig-img-signature" />` : ''}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
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
            :root {
                /* Centralized Font Styles */
                --font-primary: 'Times New Roman', Times, serif;

                /* Centralized Typography Sizes (Configurable at one place to manage scaling and prevent page breaks) */
                --size-title: 22px;
                --size-heading: 16px;
                --size-subheading: 14px;
                --size-body: 15px;
                --size-table-cell: 15px;
                --size-meta: 12px;
                --size-small: 11px;

                /* Line Heights */
                --lh-title: 1.3;
                --lh-heading: 1.4;
                --lh-body: 1.5;
                --lh-table: 1.3;

                /* Spacing Values */
                --space-xs: 4px;
                --space-sm: 8px;
                --space-md: 16px;
                --space-lg: 24px;
                --space-xl: 30px;

                /* Table Cell Paddings */
                --table-cell-padding-y: 6px;
                --table-cell-padding-x: 8px;
                --table-compact-padding-y: 3px;
                --table-compact-padding-x: 6px;
            }

            /* Reset & Core Setup */
            * { box-sizing: border-box; }
            body {
                font-family: var(--font-primary);
                font-size: var(--size-body);
                line-height: var(--lh-body);
                margin: 0;
                padding: 0;
                color: #000;
            }

            p, h1, h2, h3, h4, h5, h6 {
                margin: 0;
                padding: 0;
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
                padding: 15px;
                position: relative;
                page-break-after: always;
            }
            
            /* Typography Classes referencing centralized variables */
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .uppercase { text-transform: uppercase; }
            
            /* Unified Typography scale classes */
            .size-title { font-size: var(--size-title); line-height: var(--lh-title); }
            .size-heading { font-size: var(--size-heading); line-height: var(--lh-heading); }
            .size-subheading { font-size: var(--size-subheading); }
            .size-body { font-size: var(--size-body); }
            .size-table-cell { font-size: var(--size-table-cell); }
            .size-meta { font-size: var(--size-meta); }
            .size-small { font-size: var(--size-small); }

            /* Spacing rules using central scales */
            .mb-1 { margin-bottom: var(--space-xs); }
            .mb-2 { margin-bottom: var(--space-sm); }
            .mb-3 { margin-bottom: calc(var(--space-sm) + var(--space-xs)); }
            .mb-4 { margin-bottom: var(--space-md); }
            .mb-8 { margin-bottom: var(--space-lg); }
            .mt-2 { margin-top: var(--space-sm); }
            .mt-4 { margin-top: var(--space-md); }
            .mt-8 { margin-top: var(--space-lg); }
            .pt-8 { padding-top: var(--space-lg); }

            /* Headers */
            .main-title { 
                font-size: var(--size-title); 
                font-weight: bold; 
                text-align: center; 
                margin: var(--space-xl) 0; 
                line-height: var(--lh-title);
            }
            
            /* Tables */
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: var(--space-md);
                font-size: var(--size-table-cell);
                line-height: var(--lh-table);
            }
            th, td {
                border: 1px solid #000;
                padding: var(--table-cell-padding-y) var(--table-cell-padding-x);
                vertical-align: top;
            }
            tr {
                page-break-inside: avoid;
            }
            th { text-align: center; font-weight: bold; }
            .col-amount { text-align: right; }
            .col-yesno { width: 60px; text-align: center; }
            
            .table-compact th,
            .table-compact td {
                padding: var(--table-compact-padding-y) var(--table-compact-padding-x);
            }

            /* Flat Data Table Row Styling (Perfect alignment & continuous vertical lines, closed outer frame) */
            .flat-data-row td {
                border-top: none;
                border-bottom: none;
                border-left: none;
                border-right: 1px solid #000;
                padding: var(--table-cell-padding-y) var(--table-cell-padding-x);
            }
            /* Outer frame: left border on first cell, right border on last cell */
            .flat-data-row td:first-child {
                border-left: 1px solid #000;
            }
            .flat-data-row td:last-child {
                border-right: 1px solid #000;
            }
            /* Close the bottom of the flat-data section before the TOTAL row */
            .flat-data-row:last-of-type td {
                border-bottom: 1px solid #000;
            }

            /* Schedule IX C row styles */
            .sch9c-container {
                border: 1px solid #000;
            }
            .sch9c-row {
                display: flex;
                justify-content: space-between;
                padding: var(--table-cell-padding-y) var(--table-cell-padding-x);
            }
            .sch9c-row-main {
                border-bottom: 1px solid #000;
                background-color: #f9f9f9;
            }
            .sch9c-row-header {
                border-bottom: 1px solid #000;
                background-color: #fff;
            }
            .sch9c-row-item {
                border-bottom: 1px solid #ccc;
                padding: calc(var(--table-cell-padding-y) - 2px) var(--table-cell-padding-x);
            }
            .sch9c-row-item:last-child {
                border-bottom: none;
            }
            .sch9c-row-total {
                background-color: #f0f0f0;
                border-top: 1px solid #000;
            }

            /* Schedule 9-D Nested Sub-tables */
            .nested-table {
                width: 100%;
                border-collapse: collapse;
                margin: 0;
                border: none;
            }
            .nested-table th,
            .nested-table td {
                padding: var(--table-compact-padding-y) var(--table-compact-padding-x);
                text-align: center;
                border: none;
                border-right: 1px solid #000;
            }
            .nested-table th:last-child,
            .nested-table td:last-child {
                border-right: none;
            }
            .nested-border-bottom {
                border-bottom: 1px solid #000 !important;
            }

            /* Grid for signatures */
            .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: var(--space-xl);
            }
            .page2-signatures .signatures {
                margin-top: var(--space-md) !important;
            }
            .signature-block {
                text-align: center;
                width: 30%;
            }
            .signature-meta {
                text-align: left;
                margin-bottom: var(--space-md);
            }
            .signature-box {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .signature-media-container {
                position: relative;
                margin-top: var(--space-sm);
                height: 60px;
                width: 100px;
            }
            .sig-img-stamp {
                position: absolute;
                top: 0;
                left: 0;
                max-height: 60px;
                max-width: 100px;
                z-index: 1;
            }
            .sig-img-signature {
                position: absolute;
                top: 15px;
                left: 10px;
                max-height: 30px;
                max-width: 80px;
                z-index: 2;
            }
        </style>
    </head>
    <body>
        <div class="page-border"></div>

        <!-- PAGE 1: TITLE PAGE -->
        <div class="page">
            <div class="main-title uppercase">AUDIT REPORT</div>
            
            <div class="text-center mb-8 mt-8">
                <div class="font-bold mb-2 size-heading">FOR THE YEAR ENDED ${yearEnding}</div>
                <div class="font-bold mb-2 size-heading">${trustName}</div>
                <div class="mb-4 size-body">AT ${address}</div>
                <div class="font-bold mb-2 size-heading">Registration No :- ${registrationNo}</div>
                <div class="font-bold mb-8 size-heading">Date :- ${date}</div>
            </div>

            <div class="text-center mt-8 pt-8">
                <div class="font-bold mb-1 size-heading">${auditorFirm.toUpperCase()}</div>
                <div class="font-bold mb-1 size-heading">${auditorStatus.toUpperCase()}</div>
                <div class="size-subheading" style="line-height: 1.5;">
                    ${auditorName ? `<span class="font-bold">${auditorName}</span><br>` : ''}
                    ${auditorMembershipNo ? `M.No: ${auditorMembershipNo}` : ''}
                    ${auditorRegistrationNo ? ` | F.R.No: ${auditorRegistrationNo}` : ''}
                    ${(auditorMembershipNo || auditorRegistrationNo) ? '<br>' : ''}
                    Address :- ${auditorAddressLine}<br>
                    Email. Id- ${auditorEmail}<br>
                    Mob.No- ${auditorMobile}
                </div>
            </div>
        </div>

        <!-- PAGE 2: AUDITOR REPORT (Checklist) -->
        <div class="page">
            <div class="text-center font-bold mb-2 size-subheading">
                Report of an auditor relating to accounts audited under sub section (2) of Section 33 & 34 and the rule 19<br>
                of the Bombay Trust Act 1950.
            </div>

            <table style="border: none; margin-bottom: 5px;" class="size-meta table-compact">
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

            <table class="table-compact">
                <tbody>
                    ${generatePermissionRows(permissions)}
                </tbody>
            </table>

            <div class="page2-signatures">
                ${generateSignatureBlock()}
            </div>
        </div>

        <!-- PAGE 3: SCHEDULE IX C -->
        <div class="page">
            <div class="text-center font-bold mb-3" style="line-height: 1.4;">
                <p class="size-subheading" style="margin: 2px 0;">The Bombay Public Trusts Act 1950</p>
                <p class="size-subheading" style="margin: 2px 0;">SCHEDULE - IX C</p>
                <p class="size-small" style="color: #555; margin: 2px 0;">( VIDE RULE 32 )</p>
                <p class="size-subheading" style="margin-top: 5px; margin-bottom: 2px;">
                    STATEMENT OF INCOME TO CONTRIBUTION FOR THE YEAR ENDING :- ${yearEnding}
                </p>
                <p class="size-meta" style="color: #333; margin: 2px 0;">
                    Name of the Trust — ${trustName} | Reg. No:- ${registrationNo}
                </p>
            </div>

            <div style="border: 1px solid #000;" class="size-meta">
                <!-- Row: Income shown -->
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding: 6px; ">
                    <p style="font-weight: bold; flex: 1;">I. Income as shown in the Income and Expenditure Account (Schedule IX)</p>
                    <span style="font-weight: bold; width: 80px; text-align: right;">${schIX_incomeShown}</span>
                </div>

                <!-- Row: Section header -->
                <div style="padding: 6px; border-bottom: 1px solid #000; background-color: #fff;">
                    <p style="font-weight: bold;">II. Items not chargeable to contribution under Section 58 and Rules 32</p>
                </div>

                <!-- Sub-items -->
                ${schIX_deductions.map((item) => `
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #ccc; padding: 4px 6px;">
                        <p style="flex: 1; color: #333;">${item.label}</p>
                        <span style="width: 80px; text-align: right; color: #000;">${item.amount !== null && item.amount !== undefined ? item.amount : ''}</span>
                    </div>
                `).join('')}

                <!-- Gross Annual Income -->
                <div style="display: flex; justify-content: space-between; padding: 6px; background-color: #f0f0f0; border-top: 1px solid #000;">
                    <p style="font-weight: bold; flex: 1;">Gross Annual Income Chargeable to Contribution</p>
                    <span style="font-weight: bold; width: 80px; text-align: right;">${schIX_grossAnnualIncome}</span>
                </div>

                <!-- Amount of Contribution -->
                <div style="display: flex; justify-content: space-between; padding: 6px; border-top: 1px solid #000;">
                    <p style="flex: 1;">Amount Of Contribution Computed At The Rate Fixed Under Sub-Section (1) Of Section 58 And Payable</p>
                    <span style="font-weight: bold; width: 80px; text-align: right;">${schIX_contribution}</span>
                </div>
            </div>

            ${generateSignatureBlock()}
        </div>

        <!-- PAGE 4: INCOME & EXPENDITURE -->
        <div class="page">
            <div class="text-center font-bold mb-4 size-subheading" style="line-height: 1.4;">
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
                    ${generateIncomeExpenditureFlatRows(expenditures, incomes)}
                    <tr>
                        <td class="font-bold text-center">TOTAL</td>
                        <td class="font-bold col-amount">${totalExpenditure}</td>
                        <td class="font-bold text-center">TOTAL</td>
                        <td class="font-bold col-amount">${totalIncome}</td>
                    </tr>
                </tbody>
            </table>
            
            ${generateSignatureBlock()}
        </div>

        <!-- PAGE 5: BALANCE SHEET -->
        <div class="page">
            <div class="text-center font-bold mb-4 size-subheading" style="line-height: 1.4;">
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
                    ${generateBalanceSheetFlatRows(fundsLiabilities, propertyAssets)}
                    <tr>
                        <td class="font-bold text-center">TOTAL</td>
                        <td style="border-right: none;"></td>
                        <td class="font-bold col-amount">${totalFunds}</td>
                        <td class="font-bold text-center">TOTAL</td>
                        <td style="border-right: none;"></td>
                        <td class="font-bold col-amount">${totalAssets}</td>
                    </tr>
                </tbody>
            </table>

            ${generateSignatureBlock()}
        </div>

        <!-- PAGE 6: RECEIPT & PAYMENT -->
        <div class="page size-body" style="line-height: var(--lh-body);">
            <div class="text-center font-bold mb-4 size-subheading" style="line-height: 1.4;">
                Name of the Trust :- ${trustName}<br>
                AT ${address}<br>
                Registration No-${registrationNo}<br>
                <br>
                RECEIPT & PAYMENT ACCOUNT
            </div>

            <table class="size-body">
                <thead>
                    <tr>
                        <th style="width: 30%;">Receipts</th>
                        <th style="width: 10%;">Amount</th>
                        <th style="width: 10%;">Amount</th>
                        <th style="width: 30%;">Payments</th>
                        <th style="width: 10%;">Amount</th>
                        <th style="width: 10%;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateBalanceSheetFlatRows(receipts, payments)}
                    <tr>
                        <td class="font-bold text-center">TOTAL</td>
                        <td style="border-right: none;"></td>
                        <td class="font-bold col-amount">${totalReceipts}</td>
                        <td class="font-bold text-center">TOTAL</td>
                        <td style="border-right: none;"></td>
                        <td class="font-bold col-amount">${totalPayments}</td>
                    </tr>
                </tbody>
            </table>

            ${generateSignatureBlock()}
        </div>

        <!-- PAGE 7: SCHEDULE 9-D -->
        <div class="page size-body" style="line-height: var(--lh-body);">
            <div class="text-center font-bold mb-6 pb-2" style="line-height: 1.5;">
                <p class="size-heading uppercase" style="margin: 4px 0; font-weight: bold;">"SCHEDULE IX-D"</p>
                <p class="size-body font-normal" style="margin: 2px 0;">[See rule 19 (2A)]</p>
                <p class="size-body font-normal" style="margin: 8px 0 2px 0;">Information to be submitted by the Auditor along with Audit Report under</p>
                <p class="size-body font-normal" style="margin: 2px 0;">sub-section (1) of section 34 of</p>
                <p class="size-body font-normal" style="margin: 2px 0;">the Maharashtra Public Trusts Act.</p>
            </div>

            <table class="size-body" style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #000; padding: 6px; width: 8%; text-align: center; font-weight: normal;">Sr.<br>No.</th>
                        <th style="border: 1px solid #000; padding: 6px; width: 45%; text-align: center; font-weight: normal;">Particulars</th>
                        <th style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: normal;">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold; vertical-align: top;">1.</td>
                        <td style="border: 1px solid #000; padding: 6px; vertical-align: top;">PAN No. of Trust.</td>
                        <td style="border: 1px solid #000; padding: 6px; vertical-align: top;">${sch9d_trustPan}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold; vertical-align: top;">2.</td>
                        <td style="border: 1px solid #000; padding: 6px; vertical-align: top;">Registration No. with date of registration under section 12AA of Income Tax Act, 1961 (43 of 1961).</td>
                        <td style="border: 1px solid #000; padding: 6px; vertical-align: top;">${sch9d_incomeTaxRegistration}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold; vertical-align: top;">3.</td>
                        <td style="border: 1px solid #000; padding: 6px; vertical-align: top;">Acknowledgement No. with date of filing of the Return of Income for earlier three years.</td>
                        <td style="border: 1px solid #000; padding: 0; vertical-align: top;">
                            <table style="width: 100%; height: 100%; border-collapse: collapse; margin: 0; border: none;">
                                <thead>
                                    <tr>
                                        <th style="border-bottom: 1px solid #000; border-right: 1px solid #000; padding: 6px; font-weight: normal; width: 15%; text-align: center;">Sr.<br>No.</th>
                                        <th style="border-bottom: 1px solid #000; border-right: 1px solid #000; padding: 6px; font-weight: normal; text-align: center;">Acknowledgement No.</th>
                                        <th style="border-bottom: 1px solid #000; padding: 6px; font-weight: normal; width: 25%; text-align: center;">Year</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${(sch9d_previousITReturns && sch9d_previousITReturns.length > 0 ? sch9d_previousITReturns : [{ receiptNo: '', year: '' }, { receiptNo: '', year: '' }, { receiptNo: '', year: '' }]).map((item, index, arr) => `
                                        <tr>
                                            <td style="border-right: 1px solid #000; padding: 6px; text-align: center; ${index !== arr.length - 1 ? 'border-bottom: 1px solid #000;' : ''}">${['(i)', '(ii)', '(iii)', '(iv)', '(v)'][index] || `(${index + 1})`}</td>
                                            <td style="border-right: 1px solid #000; padding: 6px; text-align: center; ${index !== arr.length - 1 ? 'border-bottom: 1px solid #000;' : ''}">${item.receiptNo || ''}</td>
                                            <td style="padding: 6px; text-align: center; ${index !== arr.length - 1 ? 'border-bottom: 1px solid #000;' : ''}">${item.year || ''}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold; vertical-align: top;">4.</td>
                        <td style="border: 1px solid #000; padding: 6px; vertical-align: top;">PAN No. of all Trustees.</td>
                        <td style="border: 1px solid #000; padding: 0; vertical-align: top;">
                            <table style="width: 100%; height: 100%; border-collapse: collapse; margin: 0; border: none;">
                                <thead>
                                    <tr>
                                        <th style="border-bottom: 1px solid #000; border-right: 1px solid #000; padding: 6px; font-weight: normal; width: 15%; text-align: center;">Sr.<br>No.</th>
                                        <th style="border-bottom: 1px solid #000; border-right: 1px solid #000; padding: 6px; font-weight: normal; text-align: center;">Name of Trustee</th>
                                        <th style="border-bottom: 1px solid #000; padding: 6px; font-weight: normal; width: 30%; text-align: center;">PAN No.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${(sch9d_trusteesPan && sch9d_trusteesPan.length > 0 ? sch9d_trusteesPan : [{ name: '', pan: '' }, { name: '', pan: '' }, { name: '', pan: '' }]).map((item, index, arr) => `
                                        <tr>
                                            <td style="border-right: 1px solid #000; padding: 6px; text-align: center; ${index !== arr.length - 1 ? 'border-bottom: 1px solid #000;' : ''}">(${index + 1})</td>
                                            <td style="border-right: 1px solid #000; padding: 6px; text-align: center; ${index !== arr.length - 1 ? 'border-bottom: 1px solid #000;' : ''}">${item.name || ''}</td>
                                            <td style="padding: 6px; text-align: center; ${index !== arr.length - 1 ? 'border-bottom: 1px solid #000;' : ''}">${item.pan || ''}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- PAGE 8: DELAY EXEMPTION -->
        <div class="page size-body" style="line-height: var(--lh-body);">
            <h2 class="size-title font-bold text-center mb-4" style="border-bottom: 1px solid #000; padding-bottom: 5px;">विलंब माफीचा अर्ज</h2>

            <p style="padding-left: 20px;" class="mb-2">
                वय ${delay_applicantAge} वर्ष पत्ता- ${delay_applicantAddress} सत्य प्रतिज्ञेवर खालील प्रमाणे कथन करतो की,
            </p>

            <p class="mb-2">
                1) मी ${delay_applicantName} ${trustName} ${delay_applicantAddress} या सार्वजनिक न्यास नोंदणी क्रमांक ${registrationNo} या न्यासाचा ${delay_designation} आहे.
            </p>
            <p style="padding-left: 20px;" class="mb-2">
                सदर न्यास हा दिनांक ${delay_trustRegistrationDate} रोजी नोंदविण्यात आलेला आहे.
            </p>

            <p class="mb-2" style="text-align: justify;">
                2) सदर न्यासाचे आर्थिक वर्ष ${delay_financialYearMarathi} चे लेखापरिक्षण अहवाल या कार्यालयात एक एप्रिल पासुन सहा महिन्याच्या आत दाखल करणे आवश्यक होते. परंतु सदर <span style="font-weight: bold;">अनावधाने</span> आज रोजी सदर न्यासाचा लेखापरिक्षण अहवाल या कार्यालयात दाखल करीत आहे. सदरचा लेखापरिक्षण अहवाल वेळेत दाखल करण्यात झालेला विलंब हा हेतुपुरस्कर झालेला नाही. या पुढे लेखापरिक्षण अहवाल वेळेत दाखल करण्यात येईल याची दक्षता घेण्यात येईल.
            </p>

            <p class="mb-4">
                3) सदर लेखापरिक्षण अहवाल दाखल करण्यास झालेला उशीर न्यासाचे हितार्थ दृष्टीकोनातुन माफ करण्यात येवून लेखापरिक्षण अहवाल स्विकृत करावा हि विनंती.
            </p>

            <div style="margin-top: 40px; display: flex; justify-content: space-between;" class="mb-4">
                <div>
                    <p style="margin: 2px 0;">स्थळ - ${delay_place}</p>
                    <p style="margin: 2px 0;">दिनांक - ${delay_date}</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 2px 0;">अर्जदाराची</p>
                    <p style="margin-top: 30px; margin-bottom: 0;">स्वाक्षरी</p>
                </div>
            </div>

            <h3 class="font-bold text-center size-subheading mb-2">-: सत्यापन :-</h3>

            <p class="mb-4" style="text-align: justify;">
                मी ${delay_applicantName} वय ${delay_applicantAge} वर्ष पत्ता- ${delay_applicantAddress} सत्य प्रतिज्ञेवर प्रमाणे कथन करतो की, सदर अर्जातील परिच्छेद क्रमांक 1 ते 3 मजकुर हा माझ्या माहितीप्रमाणे खरा व बरोबर असुन त्याचे सत्यतेसाठी मी सदर प्रतिज्ञापत्र सादर करीत आहे.
            </p>

            <div style="margin-top: 40px; display: flex; justify-content: space-between;">
                <div>
                    <p style="margin: 2px 0;">स्थळ - ${place}</p>
                    <p style="margin: 2px 0;">दिनांक - ${date}</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 2px 0;">अर्जदाराची</p>
                    <p style="margin-top: 30px; margin-bottom: 0;">स्वाक्षरी</p>
                </div>
            </div>
            <div style="text-align: center; margin-top: 40px; font-weight: bold;">
                माझे समक्ष
            </div>
        </div>

    </body>
    </html>
    `;
};
