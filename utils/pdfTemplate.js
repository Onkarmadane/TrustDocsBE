const generateNondaniReportHTML = require("./nondaniTemplate");

exports.generateReportHTML = (report) => {
    if (report.reportType === "nondani") {
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
            address.district,
        ].filter(Boolean);
        if (parts.length === 0) return null;
        return parts.join(", ") + (address.pin ? ` - ${address.pin}` : "");
    };

    // Default values if data is missing
    const trustName =
        report.trustDetails?.trustName ||
        report.trustName ||
        "Trust Name Not Provided";
    const registrationNo =
        report.trustDetails?.trustNumber ||
        report.registrationNo ||
        "Registration No. Not Provided";
    const yearEnding =
        report.accountingYear || report.financialYear || "31.03.2025";
    const address =
        formatAddress(report.trustDetails?.address) ||
        report.address ||
        "Address Not Provided";
    const date = report.date
        ? new Date(report.date).toLocaleDateString("en-GB")
        : "__.__.____";
    const place = report.place || "Jalna";

    const auditorFirm = report.auditorDetails?.nameOfFirm || "";
    const auditorStatus = report.auditorDetails?.status || "";
    const auditorName = report.auditorDetails?.auditorName || "";
    const auditorMembershipNo = report.auditorDetails?.membershipNumber || "";
    const auditorRegistrationNo = report.auditorDetails?.registrationNumber || "";
    const auditorAddressLine =
        formatAddress(report.auditorAddress?.address) || "";
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

    const schIX_incomeShown = Number(report.scheduleIX?.incomeShown) || 0;
    const schIX_deductions = report.scheduleIX?.deductions || [];
    const totalDeductionsCalc = schIX_deductions.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const schIX_totalDeductions = totalDeductionsCalc > 0
        ? totalDeductionsCalc
        : ((report.scheduleIX?.totalDeductions !== undefined && report.scheduleIX?.totalDeductions !== null)
            ? Number(report.scheduleIX.totalDeductions)
            : ((schIX_incomeShown && report.scheduleIX?.grossAnnualIncome && (schIX_incomeShown - Number(report.scheduleIX.grossAnnualIncome) > 0)) 
                ? (schIX_incomeShown - Number(report.scheduleIX.grossAnnualIncome)) 
                : ""));
    const schIX_grossAnnualIncome = (report.scheduleIX?.grossAnnualIncome !== undefined && report.scheduleIX?.grossAnnualIncome !== null && report.scheduleIX?.grossAnnualIncome !== "")
        ? Number(report.scheduleIX.grossAnnualIncome)
        : (schIX_incomeShown ? Math.max(0, schIX_incomeShown - (Number(schIX_totalDeductions) || 0)) : 0);
    const schIX_contribution = report.scheduleIX?.contribution || 0;

    const sch9d_trustPan = report.schedule9D?.trustPan || "";
    const sch9d_incomeTaxRegistration =
        report.schedule9D?.incomeTaxRegistration || "";
    const rawPreviousITReturns = report.schedule9D?.previousITReturns || [];
    const sch9d_previousITReturns = Array.from({ length: Math.max(3, rawPreviousITReturns.length) })
        .map((_, i) => rawPreviousITReturns[i] || { receiptNo: "", year: "" });
    const rawTrusteesPan = report.schedule9D?.trusteesPan || [];
    const sch9d_trusteesPan = Array.from({ length: Math.max(9, rawTrusteesPan.length) })
        .map((_, i) => rawTrusteesPan[i] || { name: "", pan: "" });

    const formatExemptionDate = (dateVal) => {
        if (!dateVal) return "";
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return dateVal;
        return d.toLocaleDateString("en-GB");
    };

    const delay_applicantName =
        report.delayExemption?.applicantName ||
        sch9d_trusteesPan?.[0]?.name ||
        "__________________";
    const delay_applicantAge = report.delayExemption?.applicantAge || "४०";
    const delay_applicantAddress =
        report.delayExemption?.applicantAddress || address;
    const delay_designation =
        report.delayExemption?.designation || "विश्वस्त / सचिव / अध्यक्ष";
    const delay_trustRegistrationDate =
        report.delayExemption?.trustRegistrationDate || "-  /  /20  ";
    const delay_financialYearMarathi =
        report.delayExemption?.financialYearMarathi || "2023-24";
    const delay_place = report.delayExemption?.place || "जालना";
    const delay_date = report.delayExemption?.date
        ? formatExemptionDate(report.delayExemption.date)
        : report.date
            ? formatExemptionDate(report.date)
            : "__.__.____";

    const generateTrusteePage9Rows = (trustees) => {
        const minRows = 9;
        const rows = [];
        const totalRows = Math.max(minRows, trustees.length);

        for (let i = 0; i < totalRows; i++) {
            const trustee = trustees[i] || { name: "", pan: "" };
            rows.push(`
                <tr>
                    <td style="text-align: center; font-weight: bold;">${i + 1}</td>
                    <td style="text-align: left;">${trustee.name || ""}</td>
                    <td style="text-align: center;">${trustee.pan || ""}</td>
                </tr>
            `);
        }
        return rows.join("");
    };

    // Helper to fix image URLs for Puppeteer
    const fixImageUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        const baseUrl = process.env.SERVER_URL || "http://localhost:5000";
        return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
    };

    const sig1 = fixImageUrl(report.signatures?.[0]?.file);
    const sig2 = fixImageUrl(report.signatures?.[1]?.file);
    const sig3 = fixImageUrl(report.signatures?.[2]?.file);
    const sig4 = fixImageUrl(report.signatures?.[3]?.file);
    const stamp1 = fixImageUrl(report.stamps?.[0]?.file);
    const stamp2 = fixImageUrl(report.stamps?.[1]?.file);
    const stamp3 = fixImageUrl(report.stamps?.[2]?.file);
    const stamp4 = fixImageUrl(report.stamps?.[3]?.file);
    // Helper functions to detect headings and subitems for Excel-styled tables
    const isHeading = (item) => {
        if (!item || !item.label) return false;
        if (item.isHeader === true) return true;
        if (item.isSubItem === true) return false;

        const l = String(item.label).trim().toLowerCase();
        const k = String(item.key || "").toLowerCase();

        if (k.endsWith('_header') || k.endsWith('_head') || k === 'rec_open' || k === 'pay_close' || k === 'fl_corpus' || k === 'fl_earmarked' || k === 'fl_loans' || k === 'fl_liabilities' || k === 'pa_immovable' || k === 'pa_investments' || k === 'pa_furniture' || k === 'pa_loans' || k === 'pa_advances' || k === 'pa_income_outstanding' || k === 'pa_cash' || k.includes('income_expenditure') || k.includes('inc_exp')) {
            return true;
        }

        const headingLabels = [
            "to expenditure in respect of properties",
            "to establishment expenses",
            "to remuneration to trustees",
            "to remuneration to head",
            "to legal fees",
            "to audit fees",
            "to contribution and fees",
            "to amount written off",
            "to miscellaneous expenses",
            "to depreciation",
            "to amount transferred to reserve or specific funds",
            "to amount transferred to reserve",
            "to expenditure on objects of the trust",
            "to surplus carried over",
            "by rent",
            "by interest",
            "by dividend",
            "by donations in cash or kind",
            "by grants",
            "by income from other sources",
            "by transfer from reserve",
            "by deficit carried over",
            "trust funds or corpus",
            "other earmarked funds",
            "loans (secured or unsecured)",
            "loans (secured / unsecured)",
            "loans (secured or unsecured) advances",
            "loans scholarship",
            "loans",
            "liabilities",
            "immovable properties",
            "investments",
            "furniture and fixtures",
            "advances",
            "income outstanding",
            "cash and bank balances",
            "income & expenditure a/c",
            "income and expenditure a/c",
            "income & expenditure account",
            "income and expenditure account",
            "to opening balance",
            "to opening balances",
            "to receipts",
            "to receipt",
            "to other receipts",
            "to income",
            "by expenses",
            "by expense",
            "by expenditure",
            "by payments",
            "by payment",
            "by objects of the trust",
            "by closing balances",
            "by closing balance",
            "opening balance",
            "closing balance"
        ];

        return headingLabels.some(h => l.startsWith(h) || l === h);
    };

    const isSubItem = (item) => {
        if (!item || !item.label) return false;
        if (isHeading(item)) return false;
        if (item.isSubItem === true) return true;
        if (item.isHeader === true) return false;

        const l = String(item.label).trim().toLowerCase();
        const k = String(item.key || "").toLowerCase();

        if (k.includes('_inner') || k.startsWith('exp_rates') || k.startsWith('exp_repairs') || k.startsWith('exp_salaries') || k.startsWith('exp_insurance') || k.startsWith('exp_depreciation_prop') || k.startsWith('exp_other_exp') || k.startsWith('exp_bad_debts') || k.startsWith('exp_loan_scholarships') || k.startsWith('exp_irrecoverable') || k.startsWith('exp_other_items') || k.startsWith('exp_obj_') || k.startsWith('inc_rent_') || k.startsWith('inc_interest_') || k.startsWith('fl_co_') || k.startsWith('fl_ef_') || k.startsWith('fl_lo_') || k.startsWith('fl_li_') || k.startsWith('pa_ip_') || k.startsWith('pa_in_') || k.startsWith('pa_ff_') || k.startsWith('pa_lo_') || k.startsWith('pa_ad_') || k.startsWith('pa_io_') || k.startsWith('pa_cb_') || k.startsWith('rec_op_') || k.startsWith('pay_cl_')) {
            return true;
        }

        const subLabels = [
            "rates, taxes", "repairs and maintenance", "salaries", "insurance",
            "other expenses", "bad debts", "loan scholarships", "loan scholarship", "other loans", "irrecoverable rents", "other items",
            "religious", "educational", "medical relief", "relief of poverty", "other charitable objects",
            "accrued", "realised", "on securities", "on loan", "on bank account",
            "balance as per", "adjustment during", "sinking fund", "depreciation fund", "specific funds", "reserve fund", "other funds",
            "from trustees", "from others", "for expenses", "for advances", "for rent and other deposits", "sundry credit balance", "sundry credit balances",
            "additions during", "less: sales", "depreciation up to date", "in securities", "in shares", "in fixed deposit", "other investments",
            "to trustees", "to employees", "to contractor", "to contractors", "to lawyers", "to others",
            "in savings account", "in current account", "in fixed deposit account", "with the trustee", "with the manager",
            "cash in hand"
        ];

        return subLabels.some(s => l.startsWith(s));
    };

    const getItemStyle = (item) => {
        if (isHeading(item)) {
            return "font-weight: bold; padding-left: 3px; word-break: break-word;";
        }
        if (isSubItem(item)) {
            return "padding-left: 10px; font-weight: normal; word-break: break-word;";
        }
        return "padding-left: 3px; word-break: break-word;";
    };

    const formatCellAmount = (val) => {
        if (val === null || val === undefined || val === "") return "";
        const n = typeof val === "number" ? val : parseFloat(String(val).replace(/,/g, ""));
        if (isNaN(n) || n === 0) return "";
        return n.toLocaleString("en-IN");
    };

    // Helper functions to generate Excel-styled rows
    const generateIncomeExpenditureFlatRows = (rawExpenditures, rawIncomes) => {
        const cleanExpenditures = [];
        let seenSurplus = false;
        (rawExpenditures || []).forEach(item => {
            const isSurplus = (item.key && String(item.key).includes('surplus')) || (item.label && String(item.label).toLowerCase().includes('surplus'));
            if (isSurplus) {
                if (!seenSurplus) {
                    seenSurplus = true;
                    cleanExpenditures.push(item);
                }
            } else {
                cleanExpenditures.push(item);
            }
        });

        const cleanIncomes = [];
        let seenDeficit = false;
        (rawIncomes || []).forEach(item => {
            const isDeficit = (item.key && String(item.key).includes('deficit')) || (item.label && String(item.label).toLowerCase().includes('deficit'));
            if (isDeficit) {
                if (!seenDeficit) {
                    seenDeficit = true;
                    cleanIncomes.push(item);
                }
            } else {
                cleanIncomes.push(item);
            }
        });

        const maxRows = Math.max(cleanExpenditures.length, cleanIncomes.length);
        if (maxRows === 0)
            return '<tr class="excel-row"><td colspan="4" class="text-center">No data available</td></tr>';

        let html = "";
        for (let i = 0; i < maxRows; i++) {
            const exp = cleanExpenditures[i] || {
                label: "",
                amount: null,
                isHeader: false,
            };
            const inc = cleanIncomes[i] || { label: "", amount: null, isHeader: false };

            const expStyle = getItemStyle(exp);
            const incStyle = getItemStyle(inc);

            html += `
                <tr class="excel-row">
                    <td style="${expStyle}">
                        ${exp.label || ""}
                    </td>
                    <td class="col-amount ${isHeading(exp) ? "font-bold" : ""}">
                        ${formatCellAmount(exp.amount)}
                    </td>
                    <td style="${incStyle}">
                        ${inc.label || ""}
                    </td>
                    <td class="col-amount ${isHeading(inc) ? "font-bold" : ""}">
                        ${formatCellAmount(inc.amount)}
                    </td>
                </tr>
            `;
        }
        return html;
    };

    const cleanLabel = (label) => {
        if (!label) return "";
        return String(label)
            .replace(/\s*\(Total\)/gi, "")
            .replace(/\s*\(Detail\)/gi, "")
            .trim();
    };

    const cleanBalanceSheetList = (items) => {
        if (!Array.isArray(items)) return [];
        const result = [];
        for (const item of items) {
            if (!item) continue;
            const rawLabel = String(item.label || "");
            const isTotalRow = rawLabel.toLowerCase().includes("(total)");
            const isDetailRow = rawLabel.toLowerCase().includes("(detail)");
            const baseLabel = cleanLabel(rawLabel);

            if (isTotalRow && result.length > 0) {
                const prev = result[result.length - 1];
                if (cleanLabel(prev.label) === baseLabel) {
                    prev.total = (item.amount !== null && item.amount !== undefined && item.amount !== "" && Number(item.amount) !== 0) ? item.amount : (item.total || prev.total);
                    continue;
                }
            }

            if (isDetailRow && result.length > 0) {
                const prev = result[result.length - 1];
                if (cleanLabel(prev.label) === baseLabel) {
                    prev.amount = (item.amount !== null && item.amount !== undefined && item.amount !== "" && Number(item.amount) !== 0) ? item.amount : prev.amount;
                    continue;
                }
            }

            result.push({
                ...item,
                label: baseLabel
            });
        }
        return result;
    };

    const generateBalanceSheetFlatRows = (rawLeftItems, rawRightItems) => {
        const leftItems = cleanBalanceSheetList(rawLeftItems);
        const rightItems = cleanBalanceSheetList(rawRightItems);
        const maxRows = Math.max(leftItems.length, rightItems.length);
        if (maxRows === 0)
            return '<tr class="excel-row"><td colspan="6" class="text-center">No data available</td></tr>';

        let html = "";
        for (let i = 0; i < maxRows; i++) {
            const left = leftItems[i] || {
                label: "",
                amount: null,
                total: null,
                isHeader: false,
            };
            const right = rightItems[i] || {
                label: "",
                amount: null,
                total: null,
                isHeader: false,
            };

            const leftStyle = getItemStyle(left);
            const rightStyle = getItemStyle(right);

            html += `
                <tr class="excel-row">
                    <td style="${leftStyle}">
                        ${left.label || ""}
                    </td>
                    <td class="col-amount ${isHeading(left) ? "font-bold" : ""}">
                        ${formatCellAmount(left.amount)}
                    </td>
                    <td class="col-amount font-bold">
                        ${formatCellAmount(left.total)}
                    </td>
                    <td style="${rightStyle}">
                        ${right.label || ""}
                    </td>
                    <td class="col-amount ${isHeading(right) ? "font-bold" : ""}">
                        ${formatCellAmount(right.amount)}
                    </td>
                    <td class="col-amount font-bold">
                        ${formatCellAmount(right.total)}
                    </td>
                </tr>
            `;
        }
        return html;
    };

    const renderDeductionRow = (label, key, indent = 0) => {
        let amount = "";
        let rawVal = null;

        if (Array.isArray(schIX_deductions)) {
            const found = schIX_deductions.find(d => {
                if (!d) return false;
                if (d.key && d.key === key) return true;
                if (d.label) {
                    const dl = d.label.toLowerCase();
                    if (key === 'sch_donations' && dl.includes('donations')) return true;
                    if (key === 'sch_grants' && dl.includes('grants')) return true;
                    if (key === 'sch_sinking' && dl.includes('sinking')) return true;
                    if (key === 'sch_education' && dl.includes('education')) return true;
                    if (key === 'sch_medical' && dl.includes('medical')) return true;
                    if (key === 'sch_veterinary' && dl.includes('veterinary')) return true;
                    if (key === 'sch_calamity' && (dl.includes('calamity') || dl.includes('distress'))) return true;
                    if (key === 'sch_agri_a' && (dl.includes('land revenue') || dl.includes('local fund'))) return true;
                    if (key === 'sch_agri_b' && dl.includes('superior landlord')) return true;
                    if (key === 'sch_agri_c' && dl.includes('cost of production')) return true;
                    if (key === 'sch_non_agri_a' && (dl.includes('assessment') || dl.includes('municipal'))) return true;
                    if (key === 'sch_non_agri_b' && dl.includes('ground rent')) return true;
                    if (key === 'sch_non_agri_c' && dl.includes('insurance')) return true;
                    if (key === 'sch_non_agri_d' && dl.includes('repairs at 10')) return true;
                    if (key === 'sch_non_agri_e' && dl.includes('cost of collection at 4')) return true;
                    if (key === 'sch_securities_1' && dl.includes('securities')) return true;
                    if (key === 'sch_repairs' && dl.includes('building not rented')) return true;
                }
                return false;
            });
            if (found && found.amount !== null && found.amount !== undefined && found.amount !== "") {
                rawVal = found.amount;
            }
        }

        if ((rawVal === null || rawVal === undefined || rawVal === "") && report.scheduleIX && report.scheduleIX[key] !== undefined) {
            rawVal = report.scheduleIX[key];
        }
        if ((rawVal === null || rawVal === undefined || rawVal === "") && report[key] !== undefined) {
            rawVal = report[key];
        }

        if (rawVal !== null && rawVal !== undefined && rawVal !== "" && !isNaN(Number(rawVal)) && Number(rawVal) > 0) {
            amount = Number(rawVal).toLocaleString("en-IN");
        } else if (rawVal !== null && rawVal !== undefined && rawVal !== "" && typeof rawVal === 'string' && rawVal.trim() !== '') {
            amount = rawVal;
        }

        return `
            <div style="display: flex; justify-content: space-between; align-items: baseline; line-height: 1.45; margin-bottom: 3px; ${indent ? `padding-left: ${indent}px;` : ''}">
                <span style="flex: 1; padding-right: 15px; font-size: 12px;">${label}</span>
                <span style="font-weight: bold; width: 100px; min-width: 100px; text-align: right; padding-right: 15px; flex-shrink: 0; white-space: nowrap; font-size: 12px;">${amount}</span>
            </div>
        `;
    };

    const renderScheduleIXDeductionsList = () => {
        return `
            <div style="font-weight: bold; margin-bottom: 2px;">Items not chargeable to contribution under Section 58 and Rules 32</div>
            ${renderDeductionRow("i) Donations received from other Public Trust and Dharmadas:", "sch_donations")}
            ${renderDeductionRow("ii) Grants received from Government and local authorities:", "sch_grants")}
            ${renderDeductionRow("iii) Interest or Sinking or Depreciation Fund:", "sch_sinking")}
            ${renderDeductionRow("iv) Amount spent for the purpose of secular education:", "sch_education")}
            ${renderDeductionRow("v) Amount spent for the purpose of medical relief:", "sch_medical")}
            ${renderDeductionRow("vi) Amount spent for the purpose of veterinary treatment of animals:", "sch_veterinary")}
            ${renderDeductionRow("vii) Expenditure incurred from donations for relief of distress caused by scarcity, drought, flood, fire or other natural calamity:", "sch_calamity")}
            <div>viii) Deductions out of income from lands used for agricultural purpose:</div>
            ${renderDeductionRow("a] Land Revenue and local Fund cess:", "sch_agri_a", 10)}
            ${renderDeductionRow("b] Rent payable to superior landlord:", "sch_agri_b", 10)}
            ${renderDeductionRow("c] Cost of production, if lands are cultivated by trust:", "sch_agri_c", 10)}
            <div>ix) Deductions out of income from lands used for non agricultural purpose:</div>
            ${renderDeductionRow("a] Assessment, cesses and other Government or Municipal taxes:", "sch_non_agri_a", 10)}
            ${renderDeductionRow("b] Ground rent payable to the superior landlord:", "sch_non_agri_b", 10)}
            ${renderDeductionRow("c] Insurance premia:", "sch_non_agri_c", 10)}
            ${renderDeductionRow("d] Repairs at 10% of gross rent of Building let out:", "sch_non_agri_d", 10)}
            ${renderDeductionRow("e] Cost of Collection at 4 percent of gross rent of buildings let out:", "sch_non_agri_e", 10)}
            ${renderDeductionRow("x) Cost of collection of income or receipts from securities, stocks etc at 1% of such income:", "sch_securities_1")}
            ${renderDeductionRow("xi) Deduction on account of repairs in respect of building not rented and yielding no income at 10% of the estimated gross annual rent:", "sch_repairs")}
        `;
    };

    const getAlphabetIndex = (index) => {
        let code = "";
        let temp = index;
        while (temp >= 0) {
            code = String.fromCharCode((temp % 26) + 97) + code;
            temp = Math.floor(temp / 26) - 1;
        }
        return code;
    };

    const generatePermissionRows = (perms) => {
        if (!perms || perms.length === 0)
            return '<tr><td colspan="3" class="text-center" style="padding: 4px;">No checklist data</td></tr>';
        return perms
            .map((p, index) => {
                const letterIndex = getAlphabetIndex(index);
                return `
                <tr>
                    <td class="col-checklist-num">${letterIndex}]</td>
                    <td class="col-checklist-question">${p.question}</td>
                    <td class="col-checklist-answer">${p.answer === "yes" ? "Yes" : p.answer === "no" ? "No" : p.answer === "NA" ? "N/A" : p.answer || "N/A"}</td>
                </tr>
            `;
            })
            .join("");
    };
    const generateSignatureBlock = (isCompact = false) => {
        const boxHeight = isCompact ? "18px" : "24px";
        const stampMaxH = isCompact ? "20px" : "26px";
        const stampMaxW = isCompact ? "70px" : "85px";
        const sigMaxH = isCompact ? "16px" : "22px";
        const sigMaxW = isCompact ? "60px" : "75px";
        const metaFont = isCompact ? "10.5px" : "11.5px";
        const titleFont = isCompact ? "11px" : "12px";

        return `
    <div class="signatures" style="width:100%; margin:0; padding-top:${isCompact ? '2px' : '4px'}; text-align:left;">
      
      <!-- Bottom Left: Line 1 Date, Line 2 Place, Line 3 Signatures spanning half page horizontally -->
      <div style="text-align:left; font-size:${metaFont}; line-height:1.3; width:52%;">
        <div>Date: ${date}</div>
        <div>Place: ${place}</div>
        <div style="margin-top:${isCompact ? '12px' : '16px'}; width:100%;">
          <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:${titleFont}; text-align:center; width:100%;">
            <div style="flex:1; text-align:left;">President</div>
            <div style="flex:1; text-align:center;">Vice President</div>
            <div style="flex:1; text-align:right;">Trustee</div>
          </div>
          <div class="sig-box" style="height:${boxHeight}; display:flex; align-items:center; justify-content:space-between; width:100%; margin-top:1px;">
            <div style="flex:1; display:flex; justify-content:flex-start;">
              ${stamp1 ? `<img src="${stamp1}" style="max-height:${stampMaxH}; max-width:${stampMaxW}; object-fit:contain;" />` : ''}
              ${sig1 ? `<img src="${sig1}" style="max-height:${sigMaxH}; max-width:${sigMaxW}; object-fit:contain;" />` : ''}
            </div>
            <div style="flex:1; display:flex; justify-content:center;">
              ${stamp2 ? `<img src="${stamp2}" style="max-height:${stampMaxH}; max-width:${stampMaxW}; object-fit:contain;" />` : ''}
              ${sig2 ? `<img src="${sig2}" style="max-height:${sigMaxH}; max-width:${sigMaxW}; object-fit:contain;" />` : ''}
            </div>
            <div style="flex:1; display:flex; justify-content:flex-end;">
              ${stamp3 ? `<img src="${stamp3}" style="max-height:${stampMaxH}; max-width:${stampMaxW}; object-fit:contain;" />` : ''}
              ${sig3 ? `<img src="${sig3}" style="max-height:${sigMaxH}; max-width:${sigMaxW}; object-fit:contain;" />` : ''}
            </div>
          </div>
          <div style="border-top:1px dashed #000; width:100%;"></div>
        </div>
      </div>

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
            @import url('https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Marathi:wght@400;700&display=swap');
            :root {
                /* Centralized Font Styles */
                --font-primary: 'Sakal Marathi', 'SakalBharati', 'Tiro Devanagari Marathi', 'Times New Roman', Times, serif;

                /* Centralized Typography Sizes */
                --size-title: 22px;
                --size-heading: 16px;
                --size-subheading: 14px;
                --size-body: 15px;
                --size-table-cell: 12px;
                --size-meta: 12px;
                --size-small: 11px;

                /* Line Heights */
                --lh-title: 1.15;
                --lh-heading: 1.15;
                --lh-body: 1.2;
                --lh-table: 1.15;

                /* Spacing Values */
                --space-xs: 4px;
                --space-sm: 8px;
                --space-md: 16px;
                --space-lg: 24px;
                --space-xl: 30px;

                /* Table Cell Paddings */
                --table-cell-padding-y: 4px;
                --table-cell-padding-x: 4px;
                --table-compact-padding-y: 3px;
                --table-compact-padding-x: 3px;
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
            .page {
                width: 100%;
                box-sizing: border-box;
                padding: 10px 8px;
                position: relative;
                page-break-after: always;
                page-break-inside: avoid;

                display: flex;
                flex-direction: column;
            }

@page {
    size: A4;
    margin: 8mm;
}

            /* Tables inside pages should not flex-grow to avoid pushing signatures off-page */
            .page .excel-table {
                flex: 0 0 auto;
            }
            .page .excel-table tbody {
                vertical-align: top;
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

            /* Auditor Checklist Table (Page 2) - Optimized cell padding and vertical alignment */
            .checklist-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 8px;
                font-size: 11.5px;
                line-height: 1.35;
                flex: 1 1 auto;
            }
            .checklist-table td {
                border: 1px solid #000;
                padding: 4px 5px;
                vertical-align: middle;
            }
            .checklist-table .col-checklist-num {
                width: 28px;
                text-align: center;
                font-weight: bold;
                white-space: nowrap;
                padding: 4px 3px;
                vertical-align: middle;
            }
            .checklist-table .col-checklist-question {
                text-align: left;
                padding: 4px 6px;
                vertical-align: middle;
            }
            .checklist-table .col-checklist-answer {
                width: 55px;
                text-align: center;
                font-weight: bold;
                white-space: nowrap;
                padding: 2px 3px;
                vertical-align: middle;
            }

            /* Meta Info Table (Page 2 header info) */
            .meta-table {
                width: 100%;
                border-collapse: collapse;
                border: none;
                margin-bottom: 8px;
                font-size: 12px;
                line-height: 1.4;
            }
            .meta-table td {
                border: none;
                padding: 3px 4px;
                vertical-align: top;
            }

            /* Excel-Style Table Styling (Complete Excel Spreadsheet Grid Lines & Headers) */
            .excel-table {
                width: 100%;
                border-collapse: collapse;
                border: 1px solid #000;
                margin-bottom: var(--space-md);
                font-size: var(--size-table-cell);
                line-height: var(--lh-table);
            }
            .excel-table th {
                border: 1px solid #000;
                background-color: #f2f2f2;
                font-weight: bold;
                text-align: center;
                padding: 6px 5px;
                vertical-align: middle;
            }
            .excel-table td {
                border: 1px solid #000;
                padding: var(--table-cell-padding-y) var(--table-cell-padding-x);
                vertical-align: top;
            }
            .excel-table .excel-row td,
            .excel-table .flat-data-row td {
                border: 1px solid #000;
                padding: var(--table-cell-padding-y) var(--table-cell-padding-x);
            }
            .excel-table .excel-total-row td {
                border-top: 1px solid #000;
                border-bottom: 1px solid #000;
                border-left: 1px solid #000;
                border-right: 1px solid #000;
                font-weight: bold;
                background-color: #f8f9fa;
                padding: 6px var(--table-cell-padding-x);
            }
            .flat-data-row td {
                border: 1px solid #000;
                padding: var(--table-cell-padding-y) var(--table-cell-padding-x);
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
                
                justify-content: space-between;
                margin-top: var(--space-xl);
            }
            .page-signature-footer page2-signatures .signatures {
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
                .page-signature-footer {
    margin-top: auto;
    width: 100%;
    padding-top: 8px;
    flex-shrink: 0;
}

            /* Compact page layout for dense tables (Balance Sheet, Receipt & Payment, Income & Expenditure) */
            .page-compact {
                padding: 6px 8px !important;
                height: 258mm !important;
                max-height: 258mm !important;
                box-sizing: border-box !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                page-break-inside: avoid !important;
                page-break-after: always !important;
            }
            .account-header {
                text-align: center;
                margin-bottom: 6px !important;
                padding-top: 0px;
                flex-shrink: 0;
                line-height: 1.25;
            }
            .account-header .act-title {
                font-size: 13px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 1.5px;
            }
            .account-header .sch-title {
                font-size: 12px;
                font-weight: bold;
                letter-spacing: 0.3px;
                margin-bottom: 2px;
            }
            .account-header .trust-meta {
                font-size: 11.5px;
                font-weight: normal;
                line-height: 1.35;
                margin-top: 1px;
            }
            .account-header .account-title {
                font-size: 13.5px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 5px;
                margin-bottom: 5px;
                padding: 2px 0;
            }
            .page-compact .table-container {
                flex: 1 1 auto;
                display: flex;
                flex-direction: column;
                margin-bottom: 4px;
                min-height: 0;
            }
            .page-compact .excel-table {
                width: 100%;
                height: 100%;
                margin-bottom: 0px !important;
                font-size: 11px !important;
                line-height: 1.2 !important;
                border-collapse: collapse;
            }
            .page-compact .excel-table th {
                padding: 4px 4px !important;
                font-size: 11.5px !important;
                line-height: 1.2 !important;
                background-color: #f2f2f2;
                font-weight: bold;
                text-align: center;
                vertical-align: middle;
            }
            .page-compact .excel-table td {
                padding: 2.5px 4px !important;
                font-size: 11px !important;
                line-height: 1.18 !important;
                vertical-align: middle;
            }
            .page-compact .excel-table .excel-total-row td {
                padding: 4px 4px !important;
                font-size: 11.5px !important;
                font-weight: bold;
                background-color: #f8f9fa;
            }
            .page-compact .page-signature-footer {
                margin-top: auto !important;
                padding-top: 4px !important;
                flex-shrink: 0 !important;
            }
            .page-compact .signatures {
                padding-top: 0px !important;
                margin-top: 0px !important;
            }
            .page-compact .signature-meta {
                margin-bottom: 2px !important;
                line-height: 1.3 !important;
                font-size: 11px !important;
            }
            .page-compact .signature-right > div:first-child {
                font-size: 11px !important;
            }
        </style>
    </head>
    <body>
        <!-- PAGE 1: TITLE PAGE -->
        <div class="page" style="padding: 10px 8px; height: 278mm; max-height: 278mm; box-sizing: border-box; display: flex; flex-direction: column; justify-content: stretch; page-break-inside: avoid; page-break-after: always;">
            <div style="border: 2px solid #000; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; padding: 45px 25px 30px 25px; text-align: center; font-family: 'Times New Roman', Times, serif;">
                
                <!-- TOP: Title -->
                <div style="font-size: 34px; font-weight: bold; letter-spacing: 4px; word-spacing: 5px; text-transform: uppercase; color: #000; margin-top: 20px;">
                    AUDIT REPORT
                </div>
                
                <!-- MIDDLE: Trust & Year Details -->
                <div style="margin: auto 0; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
                    <div style="font-size: 20px; font-weight: bold; text-transform: uppercase; color: #000; margin-bottom: 20px; letter-spacing: 1.2px;">
                        FOR THE YEAR ENDED ${yearEnding}
                    </div>
                    <div style="font-size: 25px; font-weight: bold; text-transform: uppercase; color: #ff0000; margin-bottom: 14px; line-height: 1.35; letter-spacing: 0.8px; max-width: 95%;">
                        ${trustName}
                    </div>
                    <div style="font-size: 18px; font-weight: bold; color: #ff0000; margin-bottom: 45px; line-height: 1.4; max-width: 90%;">
                        ${address ? (address.toLowerCase().startsWith("at") ? address : `At. ${address}`) : ""}
                    </div>
                    
                    <div style="display: inline-block; text-align: left;">
                        <div style="font-size: 21px; font-weight: bold; margin-bottom: 12px; white-space: nowrap;">
                            <span style="color: #000;">Registration No :- </span>
                            <span style="color: #ff0000;">${registrationNo}</span>
                        </div>
                        <div style="font-size: 21px; font-weight: bold; color: #000; white-space: nowrap;">
                            <span>Date : &nbsp; &nbsp; ${date}</span>
                        </div>
                    </div>
                </div>

                <!-- BOTTOM: Auditor Details -->
                <div style="margin-bottom: 15px; text-align: center; line-height: 1.5; width: 100%;">
                    <div style="font-size: 23px; font-weight: bold; text-transform: uppercase; color: #000; margin-bottom: 6px; letter-spacing: 1.5px;">
                        ${auditorFirm.toUpperCase()}
                    </div>
                    <div style="font-size: 18px; font-weight: bold; text-transform: uppercase; color: #000; margin-bottom: 10px; letter-spacing: 1px;">
                        ${auditorStatus.toUpperCase() || "CERTIFIED AUDITORS"}
                    </div>
                    <div style="font-size: 16.5px; font-weight: bold; color: #000; line-height: 1.5;">
                        ${auditorName ? `<div style="margin-bottom: 2px;">${auditorName}</div>` : ""}
                        ${auditorMembershipNo || auditorRegistrationNo ? `<div style="margin-bottom: 2px;">${auditorMembershipNo ? `M.No: ${auditorMembershipNo}` : ""}${auditorRegistrationNo ? ` | F.R.No: ${auditorRegistrationNo}` : ""}</div>` : ""}
                        ${auditorAddressLine ? `<div style="margin-bottom: 2px; max-width: 95%; margin-left: auto; margin-right: auto;">Address : - ${auditorAddressLine}</div>` : ""}
                        ${auditorEmail ? `<div style="margin-bottom: 2px;">Email. Id- ${auditorEmail}</div>` : ""}
                        ${auditorMobile ? `<div style="margin-bottom: 2px;">Mob.No- ${auditorMobile}</div>` : ""}
                    </div>
                </div>

            </div>
        </div>

        <!-- PAGE 2: AUDITOR REPORT (Checklist) -->
        <div class="page">
            <div class="text-center font-bold mb-2 size-subheading" style="line-height: 1.35;">
                Report of an auditor relating to accounts audited under sub section (2) of Section 33 & 34 and the rule 19<br>
                of the Bombay Trust Act 1950.
            </div>

            <table class="meta-table">
                <tr>
                    <td style="width: 150px; font-weight: bold;">Name of the trust</td>
                    <td>${trustName}<br>AT ${address}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Registration No</td>
                    <td>${registrationNo}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">For The Year Ending</td>
                    <td>${yearEnding}</td>
                </tr>
            </table>

            <table class="checklist-table">
                <tbody>
                    ${generatePermissionRows(permissions)}
                </tbody>
            </table>

            <div class="page-signature-footer page2-signatures">
                ${generateSignatureBlock()}
            </div>
        </div>

        <!-- PAGE 3: SCHEDULE IX C -->
        <div class="page" style="font-family: 'Times New Roman', Times, serif; padding: 14px 12px;">
            <div class="text-center font-bold" style="line-height: 1.5; margin-bottom: 14px;">
                <p style="font-size: 18px; margin: 4px 0;">The Bombay Public Trusts Act 1950</p>
                <p style="font-size: 17px; margin: 4px 0; letter-spacing: 1.5px;">SCHEDULE - IX C</p>
                <p style="font-size: 14px; margin: 4px 0;">( VIDE RULE 32 )</p>
                <p style="font-size: 13px; margin-top: 8px; margin-bottom: 4px; text-transform: uppercase;">
                    STATEMENT IN INCOME TO CONTRIBUTION FOR THE YEAR ENDING : ${yearEnding}
                </p>
                <p style="font-size: 15px; margin: 5px 0; text-transform: uppercase;">
                    Name of the Trust :- ${trustName}
                </p>
                <p style="font-size: 14px; margin: 3px 0;">
                    ${address ? (address.toLowerCase().startsWith("at") ? address : `At. ${address}`) : ""}
                </p>
                <p style="font-size: 14px; margin: 3px 0;">
                    Registration No-${registrationNo}
                </p>
            </div>

            <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #000; margin-bottom: 12px; font-size: 13px; line-height: 1.4;">
                <thead>
                    <tr>
                        <th colspan="2" style="border: 1px solid #000; height: 24px;"></th>
                        <th style="border: 1px solid #000; width: 120px; text-align: center; font-weight: bold; font-size: 14px; padding: 4px 6px;">Rs.</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Row I -->
                    <tr>
                        <td style="width: 36px; text-align: center; font-weight: bold; border: 1px solid #000; vertical-align: top; padding: 6px 4px; font-size: 13px;">I.</td>
                        <td style="font-weight: bold; border: 1px solid #000; vertical-align: top; padding: 6px 8px; font-size: 13px;">
                            Income as showan in the income and Expenditure Account (Schedule IX)
                        </td>
                        <td style="width: 120px; text-align: center; font-weight: bold; border: 1px solid #000; vertical-align: middle; padding: 6px; font-size: 13px;">
                            ${schIX_incomeShown !== null && schIX_incomeShown !== undefined ? schIX_incomeShown : ""}
                        </td>
                    </tr>

                    <!-- Row II -->
                    <tr>
                        <td style="width: 36px; text-align: center; font-weight: bold; border: 1px solid #000; vertical-align: top; padding: 6px 4px; font-size: 13px;">II.</td>
                        <td style="border: 1px solid #000; vertical-align: top; padding: 6px 8px; font-size: 12px; line-height: 1.4;">
                            ${renderScheduleIXDeductionsList()}
                        </td>
                        <td style="width: 120px; text-align: center; font-weight: bold; border: 1px solid #000; vertical-align: middle; padding: 6px; font-size: 13px;">
                            ${schIX_totalDeductions !== null && schIX_totalDeductions !== undefined && schIX_totalDeductions !== "" ? (typeof schIX_totalDeductions === 'number' ? schIX_totalDeductions.toLocaleString('en-IN') : schIX_totalDeductions) : ""}
                        </td>
                    </tr>

                    <!-- Row 3 -->
                    <tr>
                        <td colspan="2" style="font-weight: bold; border: 1px solid #000; padding: 6px 8px; font-size: 13px;">
                            Gross Annual Income chargeable to contribution Rs.
                        </td>
                        <td style="width: 120px; text-align: center; font-weight: bold; border: 1px solid #000; padding: 6px; font-size: 13px;">
                            ${schIX_grossAnnualIncome !== null && schIX_grossAnnualIncome !== undefined ? schIX_grossAnnualIncome : ""}
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Certificate Text -->
            <div style="text-align: justify; font-size: 13px; line-height: 1.55; margin-top: 14px; padding: 0 6px;">
                Certified that while claiming deductions admissible under the above Sehedule,the Trust has not claimedany amount twice either wholly or partly, against any of the items mentioned in the Sehedule while have the effect of double-deductions.
            </div>


            <div class="page-signature-footer page2-signatures" style="margin-top: auto;">
                ${generateSignatureBlock()}
            </div>
        </div>

        <!-- PAGE 4: INCOME & EXPENDITURE -->
        <div class="page page-compact">
            <div class="account-header">
                <div class="act-title">The Bombay Public Trusts Act 1950</div>
                <div class="sch-title">SCHEDULE IX (VIDE RULE 17(1))</div>
                <div class="trust-meta">
                    <span style="font-weight: bold;">Name of the Trust :-</span> ${trustName}
                </div>
                <div class="trust-meta">
                    ${address ? (address.toLowerCase().startsWith("at") ? address : `At. ${address}`) : ""} &nbsp;|&nbsp; <span style="font-weight: bold;">Registration No :-</span> ${registrationNo}
                </div>
                <div class="account-title">
                    INCOME AND EXPENDITURE A/C FOR THE YEAR ENDED ${yearEnding}
                </div>
            </div>

            <div class="table-container">
                <table class="excel-table">
                    <thead>
                        <tr>
                            <th style="width: 38%;">EXPENDITURE</th>
                            <th style="width: 12%;" class="col-amount">AMOUNT</th>
                            <th style="width: 38%;">INCOME</th>
                            <th style="width: 12%;" class="col-amount">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateIncomeExpenditureFlatRows(expenditures, incomes)}
                        <tr class="excel-total-row">
                            <td class="font-bold text-center">TOTAL</td>
                            <td class="font-bold col-amount">${formatCellAmount(totalExpenditure) || (totalExpenditure === 0 ? "0" : "")}</td>
                            <td class="font-bold text-center">TOTAL</td>
                            <td class="font-bold col-amount">${formatCellAmount(totalIncome) || (totalIncome === 0 ? "0" : "")}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="page-signature-footer">
                ${generateSignatureBlock(true)}
            </div>
        </div>

        <!-- PAGE 5: BALANCE SHEET -->
        <div class="page page-compact">
            <div class="account-header">
                <div class="act-title">The Bombay Public Trusts Act 1950</div>
                <div class="sch-title">SCHEDULE VII (VIDE RULE 17(1))</div>
                <div class="trust-meta">
                    <span style="font-weight: bold;">Name of the Trust :-</span> ${trustName}
                </div>
                <div class="trust-meta">
                    ${address ? (address.toLowerCase().startsWith("at") ? address : `At. ${address}`) : ""} &nbsp;|&nbsp; <span style="font-weight: bold;">Registration No :-</span> ${registrationNo}
                </div>
                <div class="account-title">
                    BALANCE SHEET AS ON ${yearEnding}
                </div>
            </div>

            <div class="table-container">
                <table class="excel-table">
                    <thead>
                        <tr>
                            <th style="width: 29%;">Funds & Liabilities</th>
                            <th style="width: 10.5%;">Amount</th>
                            <th style="width: 10.5%;">Amount</th>
                            <th style="width: 29%;">Property & Assets</th>
                            <th style="width: 10.5%;">Amount</th>
                            <th style="width: 10.5%;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateBalanceSheetFlatRows(fundsLiabilities, propertyAssets)}
                        <tr class="excel-total-row">
                            <td class="font-bold text-center">TOTAL</td>
                            <td></td>
                            <td class="font-bold col-amount">${formatCellAmount(totalFunds) || (totalFunds === 0 ? "0" : "")}</td>
                            <td class="font-bold text-center">TOTAL</td>
                            <td></td>
                            <td class="font-bold col-amount">${formatCellAmount(totalAssets) || (totalAssets === 0 ? "0" : "")}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="page-signature-footer">
                ${generateSignatureBlock(true)}
            </div>
        </div>

        <!-- PAGE 6: RECEIPT & PAYMENT -->
        <div class="page page-compact">
            <div class="account-header">
                <div class="act-title">The Bombay Public Trusts Act 1950</div>
                <div class="sch-title">(VIDE RULE 17(1))</div>
                <div class="trust-meta">
                    <span style="font-weight: bold;">Name of the Trust :-</span> ${trustName}
                </div>
                <div class="trust-meta">
                    ${address ? (address.toLowerCase().startsWith("at") ? address : `At. ${address}`) : ""} &nbsp;|&nbsp; <span style="font-weight: bold;">Registration No :-</span> ${registrationNo}
                </div>
                <div class="account-title">
                    RECEIPT & PAYMENT ACCOUNT FOR THE YEAR ENDED ${yearEnding}
                </div>
            </div>

            <div class="table-container">
                <table class="excel-table">
                    <thead>
                        <tr>
                            <th style="width: 29%;">Receipts</th>
                            <th style="width: 10.5%;">Amount</th>
                            <th style="width: 10.5%;">Amount</th>
                            <th style="width: 29%;">Payments</th>
                            <th style="width: 10.5%;">Amount</th>
                            <th style="width: 10.5%;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateBalanceSheetFlatRows(receipts, payments)}
                        <tr class="excel-total-row">
                            <td class="font-bold text-center">TOTAL</td>
                            <td></td>
                            <td class="font-bold col-amount">${formatCellAmount(totalReceipts) || (totalReceipts === 0 ? "0" : "")}</td>
                            <td class="font-bold text-center">TOTAL</td>
                            <td></td>
                            <td class="font-bold col-amount">${formatCellAmount(totalPayments) || (totalPayments === 0 ? "0" : "")}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="page-signature-footer">
                ${generateSignatureBlock(true)}
            </div>
        </div>

        <!-- PAGE 7: SCHEDULE 9-D -->
        <div class="page" style="padding: 20px 12px; line-height: 1.5; page-break-inside: avoid; page-break-after: always;">
            <div class="text-center font-bold mb-4" style="line-height: 1.45; padding-top: 6px;">
                <p style="font-size: 22px; font-weight: bold; letter-spacing: 2px; margin-bottom: 4px;">"SCHEDULE IX-D"</p>
                <p style="font-size: 15px; font-weight: bold; margin-bottom: 10px;">[See rule 19 (2A)]</p>
                <p style="font-size: 15px; font-weight: 500; margin: 3px 0;">Information to be submitted by the Auditor along with Audit Report under</p>
                <p style="font-size: 15px; font-weight: 500; margin: 3px 0;">sub-section (1) of section 34 of the Maharashtra Public Trusts Act.</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; border: 2px solid #000; font-size: 14.5px; line-height: 1.45; margin-top: 12px;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="width: 8%; text-align: center; font-weight: bold; border: 1px solid #000; padding: 12px 6px; font-size: 15px;">Sr.<br>No.</th>
                        <th style="width: 44%; text-align: center; font-weight: bold; border: 1px solid #000; padding: 12px 10px; font-size: 15px;">Particulars</th>
                        <th style="text-align: center; font-weight: bold; border: 1px solid #000; padding: 12px 10px; font-size: 15px;">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="text-align: center; font-weight: bold; vertical-align: middle; border: 1px solid #000; padding: 14px 8px;">1.</td>
                        <td style="vertical-align: middle; border: 1px solid #000; padding: 14px 12px; font-weight: 500;">PAN No. of Trust.</td>
                        <td style="vertical-align: middle; border: 1px solid #000; padding: 14px 12px; font-weight: bold; font-family: monospace; font-size: 15px;">${sch9d_trustPan}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center; font-weight: bold; vertical-align: middle; border: 1px solid #000; padding: 14px 8px;">2.</td>
                        <td style="vertical-align: middle; border: 1px solid #000; padding: 14px 12px; font-weight: 500;">Registration No. with date of registration under section 12AA of Income Tax Act, 1961 (43 of 1961).</td>
                        <td style="vertical-align: middle; border: 1px solid #000; padding: 14px 12px; font-size: 14.5px;">${sch9d_incomeTaxRegistration}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center; font-weight: bold; vertical-align: middle; border: 1px solid #000; padding: 14px 8px;">3.</td>
                        <td style="vertical-align: middle; border: 1px solid #000; padding: 14px 12px; font-weight: 500;">Acknowledgement No. with date of filing of the Return of Income for earlier three years.</td>
                        <td style="padding: 0; vertical-align: top; border: 1px solid #000;">
                            <table style="width: 100%; height: 100%; border-collapse: collapse; margin: 0; border: none; font-size: 14px;">
                                <thead>
                                    <tr style="background-color: #fafafa;">
                                        <th style="border-bottom: 1px solid #000; border-right: 1px solid #000; font-weight: bold; width: 16%; text-align: center; padding: 9px 4px;">Sr.<br>No.</th>
                                        <th style="border-bottom: 1px solid #000; border-right: 1px solid #000; font-weight: bold; text-align: center; padding: 9px 8px;">Acknowledgement No.</th>
                                        <th style="border-bottom: 1px solid #000; font-weight: bold; width: 28%; text-align: center; padding: 9px 8px;">Year</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${(sch9d_previousITReturns && sch9d_previousITReturns.length > 0 ? sch9d_previousITReturns : [{ receiptNo: "", year: "" }, { receiptNo: "", year: "" }, { receiptNo: "", year: "" }])
                                        .map((item, index, arr) => `
                                        <tr>
                                            <td style="border-right: 1px solid #000; text-align: center; padding: 10px 4px; ${index !== arr.length - 1 ? "border-bottom: 1px solid #000;" : ""}">${["(i)", "(ii)", "(iii)", "(iv)", "(v)"][index] || `(${index + 1})`}</td>
                                            <td style="border-right: 1px solid #000; text-align: center; padding: 10px 8px; font-family: monospace; ${index !== arr.length - 1 ? "border-bottom: 1px solid #000;" : ""}">${item.receiptNo || ""}</td>
                                            <td style="text-align: center; padding: 10px 8px; ${index !== arr.length - 1 ? "border-bottom: 1px solid #000;" : ""}">${item.year || ""}</td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; font-weight: bold; vertical-align: middle; border: 1px solid #000; padding: 14px 8px;">4.</td>
                        <td style="vertical-align: middle; border: 1px solid #000; padding: 14px 12px; font-weight: 500;">PAN No. of all Trustees.</td>
                        <td style="padding: 0; vertical-align: top; border: 1px solid #000;">
                            <table style="width: 100%; height: 100%; border-collapse: collapse; margin: 0; border: none; font-size: 14px;">
                                <thead>
                                    <tr style="background-color: #fafafa;">
                                        <th style="border-bottom: 1px solid #000; border-right: 1px solid #000; font-weight: bold; width: 16%; text-align: center; padding: 9px 4px;">Sr.<br>No.</th>
                                        <th style="border-bottom: 1px solid #000; border-right: 1px solid #000; font-weight: bold; text-align: center; padding: 9px 8px;">Name of Trustee</th>
                                        <th style="border-bottom: 1px solid #000; font-weight: bold; width: 32%; text-align: center; padding: 9px 8px;">PAN No.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${(sch9d_trusteesPan && sch9d_trusteesPan.length > 0 ? sch9d_trusteesPan : [{ name: "", pan: "" }, { name: "", pan: "" }, { name: "", pan: "" }])
                                        .map((item, index, arr) => `
                                        <tr>
                                            <td style="border-right: 1px solid #000; text-align: center; padding: 9px 4px; ${index !== arr.length - 1 ? "border-bottom: 1px solid #000;" : ""}">(${index + 1})</td>
                                            <td style="border-right: 1px solid #000; text-align: left; padding: 9px 10px; ${index !== arr.length - 1 ? "border-bottom: 1px solid #000;" : ""}">${item.name || ""}</td>
                                            <td style="text-align: center; padding: 9px 8px; font-family: monospace; ${index !== arr.length - 1 ? "border-bottom: 1px solid #000;" : ""}">${item.pan || ""}</td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- PAGE 8: DELAY EXEMPTION -->
        <div class="page size-body" style="line-height: 1.5;">
            <div style="float: left; width: 95px; height: 105px; border: 1px dashed #000; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 11px; padding: 4px; line-height: 1.25; margin-bottom: 10px; margin-right: 15px; font-weight: bold;">
                तिकीट चिकटविण्याची जागा
            </div>
            <h2 class="size-title font-bold text-center mb-4" style="border-bottom: 1px solid #000; padding-bottom: 5px; margin-top: 15px;">विलंब माफीचा अर्ज</h2>
            <div style="clear: both;"></div>

            <p class="mb-2">
            1) मी ${delay_applicantName} वय ${delay_applicantAge} वर्ष, पत्ता- ${delay_applicantAddress} सत्य प्रतिज्ञेवर खालील प्रमाणे कथन करतो की,या न्यासाचा ${delay_designation} आहे. सदर न्यास हा दिनांक ${delay_trustRegistrationDate} रोजी नोंदविण्यात आलेला आहे. 
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
