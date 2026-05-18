const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        reportType: {
            type: String,
            required: true,
        },

        trustName: {
            type: String,
        },

        registrationNo: String,

        financialYear: String,

        address: String,

        date: Date,

        place: String,

        currentStep: {
            type: Number,
            default: 1,
        },

        status: {
            type: String,
            enum: ["draft", "completed"],
            default: "draft",
        },

        signatures: [
            {
                label: String,
                file: String,
            },
        ],

        stamps: [
            {
                label: String,
                file: String,
            },
        ],

        permissions: [
            {
                question: String,
                answer: String,
            },
        ],

        scheduleIX: {
            incomeShown: {
                type: Number,
                default: 0,
            },

            deductions: [
                {
                    key: String,
                    label: String,
                    amount: Number,
                },
            ],

            grossAnnualIncome: {
                type: Number,
                default: 0,
            },
        },

        incomeExpenditure: {
            expenditures: [
                {
                    key: String,
                    label: String,
                    amount: Number,
                },
            ],

            incomes: [
                {
                    key: String,
                    label: String,
                    amount: Number,
                },
            ],

            totalExpenditure: Number,

            totalIncome: Number,
        },

        balanceSheet: {
            fundsLiabilities: [
                {
                    key: String,
                    label: String,
                    amount: Number,
                    total: Number,
                },
            ],

            propertyAssets: [
                {
                    key: String,
                    label: String,
                    amount: Number,
                    total: Number,
                },
            ],

            totalFundsLiabilities: Number,

            totalPropertyAssets: Number,
        },

        receiptPayment: {
            receipts: [
                {
                    key: String,
                    label: String,
                    amount: Number,
                    total: Number,
                },
            ],
            payments: [
                {
                    key: String,
                    label: String,
                    amount: Number,
                    total: Number,
                },
            ],
            totalReceipts: Number,
            totalPayments: Number,
        },

        schedule9D: {
            trustNameMarathi: String,
            registrationNoMarathi: String,
            financialYearMarathi: String,
            trustPan: String,
            incomeTaxRegistration: String,
            previousITReturns: [
                {
                    srNo: String,
                    receiptNo: String,
                    year: String,
                }
            ],
            trusteesPan: [
                {
                    srNo: String,
                    name: String,
                    pan: String,
                }
            ]
        },

        delayExemption: {
            applicantName: String,
            applicantAge: String,
            applicantAddress: String,
            designation: String,
            trustRegistrationDate: String,
            financialYearMarathi: String,
            place: String,
            date: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Report", reportSchema);