const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        buildingName:         { type: String },
        buildingNameMarathi:  { type: String },
        streetName:           { type: String },
        streetNameMarathi:    { type: String },
        landmark:             { type: String },
        landmarkMarathi:      { type: String },
        pin:                  { type: String },
        district:             { type: String },   // stores district _id or name
        districtName:         { type: String },   // human-readable label
        taluka:               { type: String },
        talukaName:           { type: String },
        village:              { type: String },
        villageName:          { type: String },
    },
    { _id: false }
);

const reportSchema = new mongoose.Schema(
    {
        reportType: { type: String, required: true },

        trustDetails: {
            trustNumber:      { type: String },
            trustName:        { type: String },
            address:          { type: addressSchema },
        },

        auditorDetails: {
            auditorName:        { type: String },
            nameOfFirm:         { type: String },
            status:             { type: String },
            district:           { type: String },
            districtName:       { type: String },
            membershipNumber:   { type: String },
            registrationNumber: { type: String },
        },

        accountingYear: { type: String },

        auditorAddress: {
            address:       { type: addressSchema },
            mobileNumber:  { type: String },
            emailId:       { type: String },
        },

        trustName:      { type: String },
        registrationNo: { type: String },
        financialYear:  { type: String },
        address:        { type: String },
        date:           { type: Date },
        place:          { type: String },

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

            contribution: {
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