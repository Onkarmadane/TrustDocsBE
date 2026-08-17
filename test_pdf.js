const fs = require('fs');
const puppeteer = require('puppeteer');
const { generateReportHTML } = require('./utils/pdfTemplate');

const flItems = [
    { label: 'Trust Funds or Corpus', isHeader: true },
    { label: 'Balance As Per Last Balance-Sheet', amount: 500000, total: null, isSubItem: true },
    { label: 'Adjustment during the year (give details)', amount: 50000, total: 550000, isSubItem: true },
    { label: 'Other Earmarked Funds (Created under the Provisions of the trust-deed or scheme or out of the income)', isHeader: true },
    { label: 'Depreciation Fund', amount: 25000, total: null, isSubItem: true },
    { label: 'Sinking Fund', amount: 15000, total: null, isSubItem: true },
    { label: 'Reserve Fund', amount: 60000, total: null, isSubItem: true },
    { label: 'Any Other Fund', amount: 10000, total: 110000, isSubItem: true },
    { label: 'Loans (Secured or Unsecured)', isHeader: true },
    { label: 'From Trustee', amount: 40000, total: null, isSubItem: true },
    { label: 'From Others', amount: 30000, total: 70000, isSubItem: true },
    { label: 'Liabilities', isHeader: true },
    { label: 'For Expenses', amount: 12000, total: null, isSubItem: true },
    { label: 'For Advances', amount: 8000, total: null, isSubItem: true },
    { label: 'For Rent & Other Deposits', amount: 5000, total: null, isSubItem: true },
    { label: 'For Sundry Credit Balances', amount: 15000, total: 40000, isSubItem: true },
    { label: 'Income And Expenditure Account', isHeader: true },
    { label: 'Add : Balance As Per Last Balance-Sheet', amount: 100000, total: null, isSubItem: true },
    { label: 'Add : Surplus as per Income', amount: 150000, total: null, isSubItem: true },
    { label: 'Less : Deficit Expenditure Account', amount: 0, total: null, isSubItem: true },
    { label: 'Less : Appropriation If Any', amount: 0, total: 250000, isSubItem: true }
];

const paItems = [
    { label: 'Immovable Properties', isHeader: true },
    { label: 'Balance As Per Last Balance-Sheet', amount: 400000, total: null, isSubItem: true },
    { label: 'Additions during the year', amount: 50000, total: null, isSubItem: true },
    { label: 'Less : Deductions during the Year (U/S 36 permission must be taken)', amount: 0, total: null, isSubItem: true },
    { label: 'Less : Depreciation up to date', amount: 20000, total: 430000, isSubItem: true },
    { label: 'Investments', amount: 200000, total: 200000, isHeader: true },
    { label: 'Furniture And Fixtures', isHeader: true },
    { label: 'Balance As Per Last Balance-Sheet', amount: 50000, total: null, isSubItem: true },
    { label: 'Additions during the year', amount: 10000, total: null, isSubItem: true },
    { label: 'Less : Sales during the year', amount: 0, total: null, isSubItem: true },
    { label: 'Less : Depreciation up to date', amount: 5000, total: 55000, isSubItem: true },
    { label: 'Loans (Secured or Unsecured) - Good/Doubtful', isHeader: true },
    { label: 'Loan Scholarships', amount: 20000, total: null, isSubItem: true },
    { label: 'Other Loans', amount: 15000, total: 35000, isSubItem: true },
    { label: 'Advances', isHeader: true },
    { label: 'To Trustees', amount: 5000, total: null, isSubItem: true },
    { label: 'To Employees', amount: 4000, total: null, isSubItem: true },
    { label: 'To Contractor', amount: 6000, total: null, isSubItem: true },
    { label: 'To Lawyers', amount: 2000, total: null, isSubItem: true },
    { label: 'To Others', amount: 3000, total: 20000, isSubItem: true },
    { label: 'Income Outstanding', isHeader: true },
    { label: 'Rent', amount: 10000, total: null, isSubItem: true },
    { label: 'Interest', amount: 5000, total: null, isSubItem: true },
    { label: 'Other Income', amount: 2000, total: 17000, isSubItem: true },
    { label: 'Cash And Bank Balances', isHeader: true },
    { label: 'In Savings Account', amount: 120000, total: null, isSubItem: true },
    { label: 'In Current Account', amount: 50000, total: null, isSubItem: true },
    { label: 'In Fixed Deposit Account', amount: 80000, total: null, isSubItem: true },
    { label: 'With The Trustee', amount: 3000, total: null, isSubItem: true },
    { label: 'With The Manager', amount: 10000, total: 263000, isSubItem: true }
];

const mockReport = {
    reportType: 'audit',
    trustName: 'SHRI SWAMI SAMARTH MAHARAJ CHARITABLE TRUST',
    registrationNo: 'F-12345/JALNA',
    accountingYear: '31.03.2025',
    financialYear: '2024-2025',
    address: 'Plot No 12, Samarth Nagar, Jalna - 431203',
    date: new Date(),
    place: 'Jalna',
    incomeExpenditure: {
        expenditures: [
            { label: 'To Expenditure In Respect Of Properties', isHeader: true },
            { label: 'Rates, Taxes, Cesses', amount: 5000, isSubItem: true },
            { label: 'Repairs And Maintenance', amount: 12000, isSubItem: true },
            { label: 'Salaries/Honorarium', amount: 45000, isSubItem: true },
            { label: 'Insurance', amount: 3000, isSubItem: true },
            { label: 'Depreciation', amount: 8000, isSubItem: true },
            { label: 'Other Expenses', amount: 2000, isSubItem: true },
            { label: 'To Establishment Expenses', amount: 15000 },
            { label: 'To Audit Fees', amount: 10000 },
            { label: 'To Expenditure On Objects Of The Trust', isHeader: true },
            { label: 'Religious', amount: 25000, isSubItem: true },
            { label: 'Educational', amount: 60000, isSubItem: true },
            { label: 'Medical Relief', amount: 40000, isSubItem: true },
            { label: 'Relief of Poverty', amount: 20000, isSubItem: true },
            { label: 'To Surplus Carried Over To Balance Sheet', amount: 150000 }
        ],
        incomes: [
            { label: 'By Rent', isHeader: true },
            { label: 'Accrued', amount: 10000, isSubItem: true },
            { label: 'Realised', amount: 90000, isSubItem: true },
            { label: 'By Interest', isHeader: true },
            { label: 'On Bank Account', amount: 35000, isSubItem: true },
            { label: 'By Dividend', amount: 15000 },
            { label: 'By Donations In Cash or Kind', amount: 200000 },
            { label: 'By Grants', amount: 100000 }
        ],
        totalExpenditure: 450000,
        totalIncome: 450000
    },
    balanceSheet: {
        fundsLiabilities: flItems,
        propertyAssets: paItems,
        totalFundsLiabilities: 1020000,
        totalPropertyAssets: 1020000
    },
    receiptPayment: {
        receipts: [
            { label: 'To Opening Balance', isHeader: true },
            { label: 'Cash', amount: 15000, isSubItem: true },
            { label: 'Bank', amount: 185000, isSubItem: true },
            { label: 'To Receipts', amount: 50000, total: 50000 },
            { label: 'To Members Contribution', amount: 120000, total: 120000 },
            { label: 'To Donation Received', amount: 250000, total: 250000 }
        ],
        payments: [
            { label: 'By Expenses', amount: 35000, total: 35000 },
            { label: 'By Meeting Exp.', amount: 5000, total: 5000 },
            { label: 'By Traveling Exp.', amount: 12000, total: 12000 },
            { label: 'By Printing & Stationery Exp.', amount: 8000, total: 8000 },
            { label: 'By Miscellaneous Expenses', amount: 4000, total: 4000 },
            { label: 'By Education Exp.', amount: 60000, total: 60000 },
            { label: 'By Bank Charges Exp.', amount: 1200, total: 1200 },
            { label: 'By Swachata Abhiyan Exp.', amount: 15000, total: 15000 },
            { label: 'By Cultural Program Exp.', amount: 25000, total: 25000 },
            { label: 'By Tree Plantation Fees', amount: 5000, total: 5000 },
            { label: 'By Audit Fees', amount: 10000, total: 10000 },
            { label: 'By Closing Balances', isHeader: true },
            { label: 'Cash In Hand', amount: 13000, isSubItem: true },
            { label: 'Bank', amount: 426800, isSubItem: true }
        ],
        totalReceipts: 620000,
        totalPayments: 620000
    }
};

(async () => {
    const html = generateReportHTML(mockReport);
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.emulateMediaType('print');
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const info = await page.evaluate(() => {
        const pages = document.querySelectorAll('.page');
        return Array.from(pages).map((p, idx) => ({
            page: idx + 1,
            scrollHeight: p.scrollHeight,
            offsetHeight: p.offsetHeight,
            rectHeight: p.getBoundingClientRect().height
        }));
    });
    console.log('Evaluated page heights in print mode:', info);

    await browser.close();
})();
