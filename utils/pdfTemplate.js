exports.generateReportHTML = (report) => {
    // Default values if data is missing
    const trustName = report.trustName || "Trust Name Not Provided";
    const registrationNo = report.registrationNo || "Registration No. Not Provided";
    const yearEnding = report.financialYear || "31.03.2025";
    const address = report.address || "Address Not Provided";
    const date = report.date ? new Date(report.date).toLocaleDateString('en-GB') : "__.__.____";
    const place = report.place || "Jalna";

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

    const sch9d_trustNameMarathi = report.schedule9D?.trustNameMarathi || trustName;
    const sch9d_registrationNoMarathi = report.schedule9D?.registrationNoMarathi || registrationNo;
    const sch9d_financialYearMarathi = report.schedule9D?.financialYearMarathi || yearEnding;
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

    const generateSignatureBlock = () => {
        return `
            <div class="signatures">
                <div class="signature-block">
                    <div style="text-align: left; margin-bottom: 20px;">
                        Date :- ${date}<br>
                        Place :- ${place}
                    </div>
                </div>
                <div class="signature-block" style="display: flex; flex-direction: column; align-items: center;">
                    <div class="font-bold">PRESIDENT</div>
                    <div>${trustName}</div>
                    <div style="position: relative; margin-top: 10px; height: 60px; width: 100px;">
                        ${stamp1 ? `<img src="${stamp1}" style="position: absolute; top: 0; left: 0; max-height: 60px; max-width: 100px; z-index: 1;" />` : ''}
                        ${sig1 ? `<img src="${sig1}" style="position: absolute; top: 15px; left: 10px; max-height: 30px; max-width: 80px; z-index: 2;" />` : ''}
                    </div>
                </div>
                ${(sig2 || stamp2) ? `
                <div class="signature-block" style="display: flex; flex-direction: column; align-items: center;">
                    <div class="font-bold">SECRETARY / TRUSTEE</div>
                    <div>${trustName}</div>
                    <div style="position: relative; margin-top: 10px; height: 60px; width: 100px;">
                        ${stamp2 ? `<img src="${stamp2}" style="position: absolute; top: 0; left: 0; max-height: 60px; max-width: 100px; z-index: 1;" />` : ''}
                        ${sig2 ? `<img src="${sig2}" style="position: absolute; top: 15px; left: 10px; max-height: 30px; max-width: 80px; z-index: 2;" />` : ''}
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
                padding: 15px;
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
                margin-top: 40px;
            }
            .signature-block {
                text-align: center;
                width: 30%;
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
                <div class="font-bold mb-2">Registration No :- ${registrationNo}</div>
                <div class="font-bold mb-8">Date :- ${date}</div>
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

            ${generateSignatureBlock()}
        </div>

        <!-- PAGE 3: SCHEDULE IX C -->
        <div class="page">
            <div class="text-center font-bold mb-3 space-y-0.5" style="font-size: 11px;">
                <p>The Bombay Public Trusts Act 1950</p>
                <p>SCHEDULE - IX C</p>
                <p style="font-size: 9px; color: #555;">( VIDE RULE 32 )</p>
                <p style="margin-top: 5px;">
                    STATEMENT OF INCOME TO CONTRIBUTION FOR THE YEAR ENDING :- ${yearEnding}
                </p>
                <p style="font-size: 10px; color: #333;">
                    Name of the Trust — ${trustName} | Reg. No:- ${registrationNo}
                </p>
            </div>

            <div style="border: 1px solid #000; font-size: 10px;">
                <!-- Row: Income shown -->
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding: 6px; background-color: #f9f9f9;">
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
            </div>

            ${generateSignatureBlock()}
        </div>

        <!-- PAGE 4: INCOME & EXPENDITURE -->
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
            
            ${generateSignatureBlock()}
        </div>

        <!-- PAGE 5: BALANCE SHEET -->
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

            ${generateSignatureBlock()}
        </div>

        <!-- PAGE 6: RECEIPT & PAYMENT -->
        <div class="page">
            <div class="text-center font-bold mb-4" style="font-size: 12px;">
                Name of the Trust :- ${trustName}<br>
                AT ${address}<br>
                Registration No-${registrationNo}<br>
                <br>
                RECEIPT & PAYMENT ACCOUNT
            </div>

            <table>
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
                    <tr>
                        <td colspan="3" style="padding: 0; vertical-align: top;">
                            <table class="inner-table" style="margin: 0;">
                                ${generateBalanceSheetRows(receipts)}
                            </table>
                        </td>
                        <td colspan="3" style="padding: 0; vertical-align: top; border-left: 1px solid #000;">
                            <table class="inner-table" style="margin: 0;">
                                ${generateBalanceSheetRows(payments)}
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-bold text-center">TOTAL</td>
                        <td style="border: none;"></td>
                        <td class="font-bold col-amount" style="border-left: 1px solid #000;">${totalReceipts}</td>
                        <td class="font-bold text-center">TOTAL</td>
                        <td style="border: none;"></td>
                        <td class="font-bold col-amount" style="border-left: 1px solid #000;">${totalPayments}</td>
                    </tr>
                </tbody>
            </table>

            ${generateSignatureBlock()}
        </div>

        <!-- PAGE 7: SCHEDULE 9-D -->
        <div class="page" style="font-size: 10px;">
            <div class="text-center font-bold mb-4 pb-2" style="border-bottom: 1px solid #000;">
                <p>महाराष्ट्र शासन राजपत्र असाधारण भाग चार - ब, मे 15 , 2019/वैशाख 25, शके 1941</p>
                <p style="font-size: 11px;">मुख्य नियमांना जोडण्यात आलेल्या अनुसूची 9-क नंतर पुढील अनुसूची समाविष्ट करण्यात येईल.</p>
                <p style="font-size: 12px;">अनुसूची नऊ - ड</p>
                <p>(नियम 19 ( 2 अ) पहा )</p>
                <p>महाराष्ट्र सार्वजनिक विश्वस्तव्यवस्था अधिनियम, 1950 या अधिनियमाच्या कलम 34 च्या पोट- कलम</p>
                <p>(1) खाली लेखापरीक्षा अहवालासोबत लेखापरीक्षकाने सादर करावयाचे माहिती.</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                <tbody>
                    <tr>
                        <td style="border: 1px solid #000; padding: 4px; font-weight: bold; width: 20px; text-align: center;">1)</td>
                        <td style="border: 1px solid #000; padding: 4px; font-weight: bold; width: 30%;">संस्थेचे नाव</td>
                        <td style="border: 1px solid #000; padding: 4px;">${sch9d_trustNameMarathi}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 4px; font-weight: bold; text-align: center;">2)</td>
                        <td style="border: 1px solid #000; padding: 4px; font-weight: bold;">नोंदणी क्रमांक</td>
                        <td style="border: 1px solid #000; padding: 4px;">${sch9d_registrationNoMarathi}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 4px; font-weight: bold; text-align: center;">3)</td>
                        <td style="border: 1px solid #000; padding: 4px; font-weight: bold;">आर्थिक वर्ष</td>
                        <td style="border: 1px solid #000; padding: 4px; font-weight: bold; text-align: center;">सन ${sch9d_financialYearMarathi}</td>
                    </tr>
                </tbody>
            </table>

            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; margin-top: 10px;">
                <thead>
                    <tr style="font-weight: bold; background-color: #f0f0f0;">
                        <td style="border: 1px solid #000; padding: 4px; width: 30px; text-align: center;">अ क्रं</td>
                        <td style="border: 1px solid #000; padding: 4px; width: 35%; text-align: center;">तपशील</td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: center;">वर्णन</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #000; padding: 4px; text-align: center;">1</td>
                        <td style="border: 1px solid #000; padding: 4px;">विश्वस्त व्यवस्थेच्या स्थायी खाते क्रमांक</td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: center;">${sch9d_trustPan}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 4px; text-align: center;">2</td>
                        <td style="border: 1px solid #000; padding: 4px;">आयकर अधिनियम, 196(1961 चा 43) याच्या कलम 12 A A खाली नोंदणीच्या दिनांका सह नोंदणी क्रमांक</td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: center;">${sch9d_incomeTaxRegistration}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 4px; text-align: center;">3</td>
                        <td style="border: 1px solid #000; padding: 4px;">आधीच्या तीन वर्षाचे आयकर विवरण दाखल करण्याच्या दिनांक सह पोच पावती क्रमांक.</td>
                        <td style="border: 1px solid #000; padding: 0; vertical-align: top;">
                            <table style="width: 100%; border-collapse: collapse; margin: 0; border: none;">
                                <thead>
                                    <tr>
                                        <th style="border-bottom: 1px solid #000; border-right: 1px solid #000; padding: 4px; width: 30px;">अ क्र</th>
                                        <th style="border-bottom: 1px solid #000; border-right: 1px solid #000; padding: 4px;">पोच पावती क्रमांक</th>
                                        <th style="border-bottom: 1px solid #000; padding: 4px; width: 60px;">वर्ष</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${sch9d_previousITReturns.map((item, index) => `
                                        <tr>
                                            <td style="border-right: 1px solid #000; padding: 4px; text-align: center; ${index !== sch9d_previousITReturns.length - 1 ? 'border-bottom: 1px solid #000;' : ''}">${index + 1}</td>
                                            <td style="border-right: 1px solid #000; padding: 4px; text-align: center; ${index !== sch9d_previousITReturns.length - 1 ? 'border-bottom: 1px solid #000;' : ''}">${item.receiptNo || '-'}</td>
                                            <td style="padding: 4px; text-align: center; ${index !== sch9d_previousITReturns.length - 1 ? 'border-bottom: 1px solid #000;' : ''}">${item.year || '-'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 4px; text-align: center;">4</td>
                        <td style="border: 1px solid #000; padding: 4px;">सर्व विश्वस्तांचे स्थायी खाते क्रमांक</td>
                        <td style="border: 1px solid #000; padding: 0; vertical-align: top;">
                            <table style="width: 100%; border-collapse: collapse; margin: 0; border: none;">
                                <thead>
                                    <tr>
                                        <th style="border-bottom: 1px solid #000; border-right: 1px solid #000; padding: 4px; width: 30px;">अ क्र</th>
                                        <th style="border-bottom: 1px solid #000; border-right: 1px solid #000; padding: 4px;">विश्वस्तांचे नांव</th>
                                        <th style="border-bottom: 1px solid #000; padding: 4px; width: 100px;">स्थायी खाते क्रमांक</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${sch9d_trusteesPan.map((item, index) => `
                                        <tr>
                                            <td style="border-right: 1px solid #000; padding: 4px; text-align: center; ${index !== sch9d_trusteesPan.length - 1 ? 'border-bottom: 1px solid #000;' : ''}">${index + 1}</td>
                                            <td style="border-right: 1px solid #000; padding: 4px; text-align: center; ${index !== sch9d_trusteesPan.length - 1 ? 'border-bottom: 1px solid #000;' : ''}">${item.name || '-'}</td>
                                            <td style="padding: 4px; text-align: center; ${index !== sch9d_trusteesPan.length - 1 ? 'border-bottom: 1px solid #000;' : ''}">${item.pan || '-'}</td>
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
        <div class="page" style="font-size: 11px; line-height: 1.6;">
            <h2 style="font-size: 14px; font-weight: bold; text-align: center; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 15px;">विलंब माफीचा अर्ज</h2>

            <p style="padding-left: 20px;">
                वय ${delay_applicantAge} वर्ष पत्ता- ${delay_applicantAddress} सत्य प्रतिज्ञेवर खालील प्रमाणे कथन करतो की,
            </p>

            <p>
                1) मी ${delay_applicantName} ${sch9d_trustNameMarathi} ${delay_applicantAddress} या सार्वजनिक न्यास नोंदणी क्रमांक ${sch9d_registrationNoMarathi} या न्यासाचा ${delay_designation} आहे.
            </p>
            <p style="padding-left: 20px;">
                सदर न्यास हा दिनांक ${delay_trustRegistrationDate} रोजी नोंदविण्यात आलेला आहे.
            </p>

            <p>
                2) सदर न्यासाचे आर्थिक वर्ष ${delay_financialYearMarathi} चे लेखापरिक्षण अहवाल या कार्यालयात एक एप्रिल पासुन सहा महिन्याच्या आत दाखल करणे आवश्यक होते. परंतु सदर <span style="font-weight: bold;">अनावधाने</span> आज रोजी सदर न्यासाचा लेखापरिक्षण अहवाल या कार्यालयात दाखल करीत आहे. सदरचा लेखापरिक्षण अहवाल वेळेत दाखल करण्यात झालेला विलंब हा हेतुपुरस्कर झालेला नाही. या पुढे लेखापरिक्षण अहवाल वेळेत दाखल करण्यात येईल याची दक्षता घेण्यात येईल.
            </p>

            <p>
                3) सदर लेखापरिक्षण अहवाल दाखल करण्यास झालेला उशीर न्यासाचे हितार्थ दृष्टीकोनातुन माफ करण्यात येवून लेखापरिक्षण अहवाल स्विकृत करावा हि विनंती.
            </p>

            <div style="margin-top: 40px; display: flex; justify-content: space-between;">
                <div>
                    <p>स्थळ - ${place}</p>
                    <p>दिनांक - ${date}</p>
                </div>
                <div style="text-align: right;">
                    <p>अर्जदाराची</p>
                    <p style="margin-top: 30px;">स्वाक्षरी</p>
                </div>
            </div>

            <h3 style="font-weight: bold; text-align: center; margin-top: 30px;">-: सत्यापन :-</h3>

            <p>
                मी ${delay_applicantName} वय ${delay_applicantAge} वर्ष पत्ता- ${delay_applicantAddress} सत्य प्रतिज्ञेवर प्रमाणे कथन करतो की, सदर अर्जातील परिच्छेद क्रमांक 1 ते 3 मजकुर हा माझ्या माहितीप्रमाणे खरा व बरोबर असुन त्याचे सत्यतेसाठी मी सदर प्रतिज्ञापत्र सादर करीत आहे.
            </p>

            <div style="margin-top: 40px; display: flex; justify-content: space-between;">
                <div>
                    <p>स्थळ - ${place}</p>
                    <p>दिनांक - ${date}</p>
                </div>
                <div style="text-align: right;">
                    <p>अर्जदाराची</p>
                    <p style="margin-top: 30px;">स्वाक्षरी</p>
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
