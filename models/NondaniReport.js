const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        buildingName:         { type: String },
        streetName:           { type: String },
        landmark:             { type: String },
        pin:                  { type: String },
        district:             { type: String },
        districtName:         { type: String },
        taluka:               { type: String },
        talukaName:           { type: String },
        village:              { type: String },
        villageName:          { type: String },
    },
    { _id: false }
);

const nondaniReportSchema = new mongoose.Schema(
    {
        reportType: { type: String, required: true, default: "nondani" },

        trustDetails: {
            trustName:        { type: String },
            address:          { type: addressSchema },
        },
        
        trustName:      { type: String },
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

        presidentName: { type: String },
        vicePresidentName: { type: String },
        secretaryName: { type: String },
        jointSecretaryName: { type: String },
        treasurerName: { type: String },
        financialYear: { type: String },
        registrationNo: { type: String },

        committeeMembers: [{
            name: { type: String },
            address: { type: String },
            designation: { type: String },
            age: { type: Number },
            occupation: { type: String },
            nationality: { type: String, default: "भारतीय" }
        }],

        objectives: [{ type: String }],
        
        landlordNOC: {
            name: { type: String },
            age: { type: Number },
            address: { type: String },
            propertyNumber: { type: String },
        },

        checklist: [
            {
                documentName: String,
                isSubmitted: Boolean,
            }
        ],

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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("NondaniReport", nondaniReportSchema);
