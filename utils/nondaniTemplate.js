module.exports = (report) => {
  const details = report.nondaniDetails || {};
  
  // Format Address Helper
  const formatAddress = (address) => {
    if (!address) return "_________________";
    if (typeof address === "string") return address.trim() || "_________________";
    const parts = [];
    if (address.buildingName) parts.push(address.buildingName);
    if (address.streetName) parts.push(address.streetName);
    if (address.landmark) parts.push(address.landmark);
    if (address.village || address.villageName) {
      const v = address.village || address.villageName;
      parts.push(v.startsWith("मु.") ? v : `मु. ${v}`);
    }
    if (address.taluka || address.talukaName) {
      const t = address.taluka || address.talukaName;
      parts.push(t.startsWith("ता.") ? t : `ता. ${t}`);
    }
    if (address.district || address.districtName) {
      const d = address.district || address.districtName;
      parts.push(d.startsWith("जि.") ? d : `जि. ${d}`);
    }
    if (parts.length === 0) return "_________________";
    return parts.join(", ") + (address.pin ? ` - ${address.pin}` : "");
  };

  const trustName =
    report.trustDetails?.trustName ||
    report.trustName ||
    "_________________";

  const address =
    formatAddress(report.trustDetails?.address) !== "_________________"
      ? formatAddress(report.trustDetails?.address)
      : (typeof report.address === "string" && report.address.trim())
        ? report.address
        : "_________________";

  const place = report.place || "जालना";
  const financialYear = report.financialYear || "2025-26";
  const registrationNo = report.registrationNo || "_________________";

  const formatDate = (dateVal) => {
    if (!dateVal) return "__.__.2026";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return dateVal;
    return d.toLocaleDateString("en-GB");
  };

  const date = report.date ? formatDate(report.date) : formatDate(new Date());

  // Dynamic Committee Members Setup
  const rawMembers = report.committeeMembers && report.committeeMembers.length > 0
    ? report.committeeMembers
    : [];

  const defaultMembers = [
    { name: "_________________", address: "_________________", designation: "अध्यक्ष", age: "____", occupation: "_________________", nationality: "भारतीय" },
    { name: "_________________", address: "_________________", designation: "उपाध्यक्ष", age: "____", occupation: "_________________", nationality: "भारतीय" },
    { name: "_________________", address: "_________________", designation: "सचिव", age: "____", occupation: "_________________", nationality: "भारतीय" },
    { name: "_________________", address: "_________________", designation: "सहसचिव", age: "____", occupation: "_________________", nationality: "भारतीय" },
    { name: "_________________", address: "_________________", designation: "कोषाध्यक्ष", age: "____", occupation: "_________________", nationality: "भारतीय" },
    { name: "_________________", address: "_________________", designation: "सदस्य", age: "____", occupation: "_________________", nationality: "भारतीय" },
    { name: "_________________", address: "_________________", designation: "सदस्य", age: "____", occupation: "_________________", nationality: "भारतीय" },
  ];

  const committeeMembers = rawMembers.length > 0 ? rawMembers : defaultMembers;
  const memberCount = committeeMembers.length;

  // Key Office Bearers Fallback Detection
  const presidentMember = committeeMembers.find((m) => (m.designation && String(m.designation).includes("अध्यक्ष") && !String(m.designation).includes("उपाध्यक्ष"))) || committeeMembers[0] || {};
  const vicePresidentMember = committeeMembers.find((m) => (m.designation && String(m.designation).includes("उपाध्यक्ष"))) || committeeMembers[1] || {};
  const secretaryMember = committeeMembers.find((m) => (m.designation && String(m.designation).includes("सचिव") && !String(m.designation).includes("सहसचिव"))) || committeeMembers[2] || {};
  const jointSecretaryMember = committeeMembers.find((m) => (m.designation && String(m.designation).includes("सहसचिव"))) || committeeMembers[3] || {};
  const treasurerMember = committeeMembers.find((m) => (m.designation && String(m.designation).includes("कोषाध्यक्ष"))) || committeeMembers[4] || {};

  const presidentName = report.presidentName || presidentMember.name || "_________________";
  const vicePresidentName = report.vicePresidentName || vicePresidentMember.name || "_________________";
  const secretaryName = report.secretaryName || secretaryMember.name || "_________________";
  const jointSecretaryName = report.jointSecretaryName || jointSecretaryMember.name || "_________________";
  const treasurerName = report.treasurerName || treasurerMember.name || "_________________";

  const presidentAge = presidentMember.age || report.delayExemption?.applicantAge || "४५";
  const presidentOccupation = presidentMember.occupation || "शेती";
  const presidentAddress = presidentMember.address || address;

  // Dynamic Objectives Setup
  const defaultObjectives = [
    "लोकांना वाचनाची आवड निर्माण करणे.",
    "साहित्यिक, कलावंतास पुरस्कार देऊन कौतुक करणे.",
    "व्याख्याने कविसंमेलन, वादविवाद, परिसंवाद, साहित्यसंमेलन इत्यादी साहित्यिक उपक्रम राबविणे.",
    "लेखक वाचक सुसंवाद घडवून आणणे.",
    "विविध भाषिक पुस्तके उपलब्ध करून देणे.",
    "समाजातील विविध घटकात वाचनाची आवड निर्माण करण्यासाठी वाचनालय सुरू करणे ते चालविणे.",
    "सार्वजनिक वाचनालयाद्वारे दैनिक, साप्ताहिक, मासिक इ. उपलब्ध करून देणे, शहरी व ग्रामीण भागात वाचनालये सुरू करणे.",
    "प्रौढांमध्ये साक्षरतेचा प्रचार व प्रसार करणे वाचनाची आवड निर्माण करणे.",
    "मनोरंजनातुन ज्ञानवृध्दी होईल अशा प्रकारचे साहित्य वाचनालयाला पुरविणे.",
    "चर्चासत्रे, वाद-संवाद, मेळावे भरवुन विविध प्रकारचे साहित्य निर्मितीस हातभार लावणे.",
    "सामाजिक, पौराणिक, विज्ञानविषयक माहिती संपन्न पुस्तके उपलब्ध करणे.",
    "संगणकीकृत तसेच ऑनलाईन (डीजीटल) वाचनालये सुरू करणे.",
    "लहान मुलांसाठी व प्रौढ साक्षरांसाठी आवश्यक ती पुस्तके वाचनालयात उपलब्ध करून देणे.",
    "विविध प्रकाराचे वर्तमानपत्र, साप्ताहिके, पाक्षिके, मासिके व वार्षिक अंक तसेच विशेषांक ची माहिती इ. वाचनालयात उपलब्ध करून देणे.",
    "दुर्मिळ ग्रंथांचे व पुस्तकाचे जतन करणे."
  ];

  const objectives = report.objectives && report.objectives.length > 0 ? report.objectives : defaultObjectives;

  // Landlord NOC Setup
  const noc = report.landlordNOC || {
    name: "_________________",
    age: "____",
    address: "_________________",
    propertyNumber: "_________________",
  };

  // Fix Image URL Helper for Puppeteer
  const fixImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const baseUrl = process.env.SERVER_URL || "http://localhost:5000";
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const sig1 = fixImageUrl(report.signatures?.[0]?.file);
  const sig2 = fixImageUrl(report.signatures?.[1]?.file);
  const sig3 = fixImageUrl(report.signatures?.[2]?.file);
  const stamp1 = fixImageUrl(report.stamps?.[0]?.file);
  const stamp2 = fixImageUrl(report.stamps?.[1]?.file);
  const stamp3 = fixImageUrl(report.stamps?.[2]?.file);

  // Dynamic Committee Table
  const renderCommitteeTable = (isSchedule = false) => {
    const count = committeeMembers.length;
    let fontSize = "14px";
    let cellPadding = "4px 5px";
    let lineHeight = "1.3";
    let margin = "10px";

    if (count > 10) {
      fontSize = "12px";
      cellPadding = "2.5px 3.5px";
      lineHeight = "1.16";
      margin = "6px";
    } else if (count > 7) {
      fontSize = "13px";
      cellPadding = "3px 4px";
      lineHeight = "1.22";
      margin = "8px";
    }

    return `
      <table style="width: 100%; border-collapse: collapse; margin-top: ${margin}; font-size: ${fontSize}; line-height: ${lineHeight}; border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; font-family: var(--font-primary);">
        <thead>
          <tr style="border-bottom: 1.5px solid #000; background-color: #fcfcfc;">
            <th style="padding: ${cellPadding}; text-align: left; font-weight: bold; width: 28%;">अ.क्र. सभासदाचे नांव</th>
            <th style="padding: ${cellPadding}; text-align: left; font-weight: bold; width: 30%;">पत्ता</th>
            <th style="padding: ${cellPadding}; text-align: left; font-weight: bold; width: 14%;">पद</th>
            <th style="padding: ${cellPadding}; text-align: center; font-weight: bold; width: 6%;">वय</th>
            <th style="padding: ${cellPadding}; text-align: left; font-weight: bold; width: 12%;">व्यवसाय</th>
            <th style="padding: ${cellPadding}; text-align: left; font-weight: bold; width: 10%;">राष्ट्रीयत्व</th>
          </tr>
        </thead>
        <tbody>
          ${committeeMembers.map((m, i) => `
            <tr style="border-bottom: ${i === count - 1 ? 'none' : '1px solid #e0e0e0'};">
              <td style="padding: ${cellPadding}; vertical-align: top;">
                <span style="font-weight: bold; display: inline-block; width: 18px;">${i + 1}.</span> ${m.name || "_____"}
              </td>
              <td style="padding: ${cellPadding}; vertical-align: top;">${m.address || "_____"}</td>
              <td style="padding: ${cellPadding}; vertical-align: top; font-weight: bold;">${m.designation || "_____"}</td>
              <td style="padding: ${cellPadding}; vertical-align: top; text-align: center;">${m.age || "_____"}</td>
              <td style="padding: ${cellPadding}; vertical-align: top;">${m.occupation || "_____"}</td>
              <td style="padding: ${cellPadding}; vertical-align: top;">${m.nationality || "भारतीय"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  };

  // Dynamic Committee Signatures Table
  const renderCommitteeSignatures = (hasDesignation = false) => {
    const count = committeeMembers.length;
    let fontSize = "14px";
    let cellPadding = "4px 5px";
    let sigHeight = "28px";
    let margin = "10px";

    if (count > 10) {
      fontSize = "12px";
      cellPadding = "2.5px 3.5px";
      sigHeight = "18px";
      margin = "6px";
    } else if (count > 7) {
      fontSize = "13px";
      cellPadding = "3px 4px";
      sigHeight = "22px";
      margin = "8px";
    }

    return `
      <table style="width: 100%; border-collapse: collapse; margin-top: ${margin}; font-size: ${fontSize}; font-family: var(--font-primary);">
        <thead>
          <tr style="background-color: #fbfbfb;">
            <th style="border: 1px solid #000; padding: ${cellPadding}; width: 40px; text-align: center;">अ.क्र.</th>
            <th style="border: 1px solid #000; padding: ${cellPadding}; text-align: left;">सभासदाचे संपूर्ण नांव</th>
            <th style="border: 1px solid #000; padding: ${cellPadding}; text-align: left; width: 38%;">पत्ता</th>
            ${hasDesignation ? `<th style="border: 1px solid #000; padding: ${cellPadding}; text-align: left; width: 14%;">पद</th>` : ''}
            <th style="border: 1px solid #000; padding: ${cellPadding}; width: 90px; text-align: center;">सही</th>
          </tr>
        </thead>
        <tbody>
          ${committeeMembers.map((m, i) => `
            <tr>
              <td style="border: 1px solid #000; padding: ${cellPadding}; text-align: center; font-weight: bold;">${i + 1}</td>
              <td style="border: 1px solid #000; padding: ${cellPadding}; font-weight: 500;">${m.name || "_____"}</td>
              <td style="border: 1px solid #000; padding: ${cellPadding}; line-height: 1.2;">${m.address || "_____"}</td>
              ${hasDesignation ? `<td style="border: 1px solid #000; padding: ${cellPadding}; font-weight: bold;">${m.designation || "_____"}</td>` : ''}
              <td style="border: 1px solid #000; padding: ${cellPadding}; height: ${sigHeight}; text-align: center; vertical-align: middle;"></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  };

  // Footer Signatures for Trust Bearers
  const renderFooterSignatures = () => `
    <div class="page-footer">
      <div style="
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 20px;
        font-weight: bold;
        font-size: 15px;
        font-family: var(--font-primary);
      ">
        <div style="text-align: center; flex: 1;">
          <div style="height: 20px; display: flex; align-items: center; justify-content: center;">
            ${sig1 ? `<img src="${sig1}" style="max-height: 18px; max-width: 80px; object-fit: contain;" />` : ''}
            ${stamp1 ? `<img src="${stamp1}" style="max-height: 20px; max-width: 80px; object-fit: contain;" />` : ''}
          </div>
          <div style="border-top: 1px solid #000; padding-top: 2px;">अध्यक्ष</div>
        </div>
        <div style="text-align: center; flex: 1;">
          <div style="height: 20px; display: flex; align-items: center; justify-content: center;">
            ${sig2 ? `<img src="${sig2}" style="max-height: 18px; max-width: 80px; object-fit: contain;" />` : ''}
            ${stamp2 ? `<img src="${stamp2}" style="max-height: 20px; max-width: 80px; object-fit: contain;" />` : ''}
          </div>
          <div style="border-top: 1px solid #000; padding-top: 2px;">उपाध्यक्ष</div>
        </div>
        <div style="text-align: center; flex: 1;">
          <div style="height: 20px; display: flex; align-items: center; justify-content: center;">
            ${sig3 ? `<img src="${sig3}" style="max-height: 18px; max-width: 80px; object-fit: contain;" />` : ''}
            ${stamp3 ? `<img src="${stamp3}" style="max-height: 20px; max-width: 80px; object-fit: contain;" />` : ''}
          </div>
          <div style="border-top: 1px solid #000; padding-top: 2px;">सचिव</div>
        </div>
      </div>
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html lang="mr">
    <head>
      <meta charset="UTF-8">
      <title>Nondani Report</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Marathi:ital,wght@0,400;0,700;1,400&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');

        :root {
          --font-primary: 'Sakal Marathi', 'SakalBharati', 'Tiro Devanagari Marathi', 'Noto Sans Devanagari', 'Times New Roman', serif;
          
          /* Typography Sizes */
          --size-title-lg: 19.5px;
          --size-title-md: 17.5px;
          --size-heading: 15.5px;
          --size-body: 14.5px;
          --size-table-cell: 14px;
          --size-small: 12.5px;

          /* Line Heights */
          --lh-title: 1.25;
          --lh-heading: 1.3;
          --lh-body: 1.36;
          --lh-table: 1.26;
        }

        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          color: #000;
        }

        body {
          font-family: var(--font-primary);
          font-size: var(--size-body);
          line-height: var(--lh-body);
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        p, h1, h2, h3, h4, h5, h6 {
          margin: 0;
          padding: 0;
        }

        /* 
         * Strict Page Separation:
         * .page is display: block with overflow: hidden and fixed printable height
         * so NO child element or margin can ever bleed onto previous page bottoms.
         */
        .page {
          width: 100%;
          height: 242mm;
          max-height: 242mm;
          min-height: 242mm;
          box-sizing: border-box;
          padding: 0;
          margin: 0;
          page-break-before: always;
          break-before: page;
          page-break-inside: avoid;
          break-inside: avoid;
          page-break-after: avoid;
          break-after: avoid;
          display: block;
          position: relative;
          overflow: hidden;
        }

        .page:first-of-type,
        .page:first-child {
          page-break-before: auto;
          break-before: auto;
        }

        .page-inner {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: 0 2px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .page-content {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
        }

        .page-footer {
          flex: 0 0 auto;
          margin-top: auto;
          padding-top: 6px;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        /* Typography & Utility Classes */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .text-justify { text-align: justify; }
        .font-bold { font-weight: bold; }
        .underline { text-decoration: underline; }
        .indent { text-indent: 30px; }
        .flex-between { display: flex; justify-content: space-between; align-items: flex-start; }

        .title-lg { font-size: var(--size-title-lg); font-weight: bold; text-align: center; line-height: var(--lh-title); margin-bottom: 8px; }
        .title-md { font-size: var(--size-title-md); font-weight: bold; text-align: center; line-height: var(--lh-title); margin-bottom: 5px; }
        .title-sm { font-size: var(--size-heading); font-weight: bold; margin-bottom: 4px; }

        /* Tables */
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--size-table-cell);
          line-height: var(--lh-table);
        }

        th, td {
          vertical-align: top;
        }

        tr {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .no-break {
          page-break-inside: avoid;
          break-inside: avoid;
        }
      </style>
    </head>
    <body>

      <!-- PAGE 1: Application (परिशिष्ट " अ ") -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div style="text-align: center; margin-bottom: 6px;">
              <div style="border: 1.5px solid #000; padding: 2px 18px; display: inline-block; font-weight: bold; font-size: 18px; line-height: 1.1;">
                परिशिष्ट " अ "
              </div>
              <div style="font-size: 13px; margin-top: 1px;">(Society Application)</div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; font-size: 14.5px; line-height: 1.35;">
              <div>
                प्रति,<br>
                <b>मा. सहाय्यक संस्था निबंधक,</b><br>
                जालना विभाग जालना.
              </div>
              <div style="font-weight: bold; margin-top: 6px; font-size: 14.5px;">
                दि. ${date}
              </div>
            </div>

            <table style="width: 100%; border: none; margin-bottom: 4px; border-collapse: collapse; font-size: 14.5px; line-height: 1.35;">
              <tr>
                <td style="width: 95px; font-weight: bold; padding: 1.5px 0;">विषय</td>
                <td style="width: 15px; font-weight: bold; padding: 1.5px 0; text-align: center;">:-</td>
                <td style="font-weight: bold; text-decoration: underline; padding: 1.5px 0;">संस्था नोंदणी अधिनियम 1860 अन्वये नोंदणी बाबत....</td>
              </tr>
              <tr>
                <td style="width: 95px; font-weight: bold; padding: 3px 0 1.5px 0;">संस्थेचे नांव</td>
                <td style="width: 15px; font-weight: bold; padding: 3px 0 1.5px 0; text-align: center;">:-</td>
                <td style="font-weight: bold; font-size: 15.5px; padding: 3px 0 1.5px 0; line-height: 1.25;">
                  “ ${trustName} ”<br>
                  <div style="font-size: 13.5px; font-weight: normal; margin-top: 1px;">${address}</div>
                </td>
              </tr>
            </table>

            <div style="margin-bottom: 4px; font-size: 14.5px; line-height: 1.35;">
              महोदय,<br>
              <p style="text-indent: 25px; margin: 1px 0 0 0; text-align: justify;">
                निवेदन सादर करण्यात येते की, वरील विषयात नमूद केलेल्या संस्थेची नोंदणी अधिनियम 1860 अन्वये नोंदणी करावयाची आहे. सबब आपणाकडे खालील प्रमाणे कागदपत्रे सादर करण्यात आलेली आहेत.
              </p>
            </div>

            <table style="width: 100%; border: none; margin-bottom: 4px; font-size: 13px; line-height: 1.26; border-collapse: collapse;">
              <tr><td style="width: 25px; font-weight: bold; padding: 1px 0;">1)</td><td style="padding: 1px 0; text-align: justify;">विधान पत्र (ज्ञापन) मेमोरंडम ऑफ असोसिएशन.</td></tr>
              <tr><td style="width: 25px; font-weight: bold; padding: 1px 0;">2)</td><td style="padding: 1px 0; text-align: justify;">नियम व नियमावलीची सत्यप्रत.</td></tr>
              <tr><td style="width: 25px; font-weight: bold; padding: 1px 0;">3)</td><td style="padding: 1px 0; text-align: justify;">संस्था नोंदणी बाबत कार्यकारी मंडळाच्या सर्व सभासदांच्या सह्यांचे संमतीपत्र.</td></tr>
              <tr><td style="width: 25px; font-weight: bold; padding: 1px 0;">4)</td><td style="padding: 1px 0; text-align: justify;">संस्था नोंदणी बाबत कार्यकारी मंडळाच्या सर्व सभासदांच्या सह्यांचे अधिकारपत्र.</td></tr>
              <tr><td style="width: 25px; font-weight: bold; padding: 1px 0;">5)</td><td style="padding: 1px 0; text-align: justify;">कार्यकारिणीची निवड व उद्देश व नियमावली मंजुरी बाबत ठरावाची सत्यप्रत.</td></tr>
              <tr><td style="width: 25px; font-weight: bold; padding: 1px 0;">6)</td><td style="padding: 1px 0; text-align: justify;">संस्थेच्या पत्त्या बाबत व जागेबाबत अध्यक्ष व सचिव यांचे प्रतिज्ञापत्र 100/- रूपयाच्या स्टॅम्प पेपरवर ५ रु. कोर्ट फी राहील.</td></tr>
              <tr><td style="width: 25px; font-weight: bold; padding: 1px 0;">7)</td><td style="padding: 1px 0; text-align: justify;">भाडेकरारनामा 100/- रूपयाच्या स्टॅम्प पेपरवर तसेच जागा मालकाचे नाहरकत, जागेचा पुरावा, सर्व सभासदांचे आधार कार्ड व फोटो.</td></tr>
              <tr><td style="width: 25px; font-weight: bold; padding: 1px 0;">8)</td><td style="padding: 1px 0; text-align: justify;">चुकीचे वाङ्मय, देशविघातक व गैर मार्गाने निधी जमा करणार नाही करीता अध्यक्ष व सचिव यांचे प्रतिज्ञापत्र, धर्मादाय संशयास्पद पैशाची माहिती अवगत करणे बाबत हमीपत्र.</td></tr>
              <tr><td style="width: 25px; font-weight: bold; padding: 1px 0;">9)</td><td style="padding: 1px 0; text-align: justify;">परिशिष्ट 1-2-6.</td></tr>
              <tr><td style="width: 25px; font-weight: bold; padding: 1px 0;">10)</td><td style="padding: 1px 0; text-align: justify;">सूचना, ठराव, सभासद नोंदवही इ. ची सत्यप्रत.</td></tr>
            </table>

            <div style="margin-bottom: 4px; font-size: 14.5px; line-height: 1.35;">
              <p style="text-indent: 25px; margin: 0 0 3px 0; text-align: justify;">
                पुढे असेही निवेदन करण्यात येते की, वरील संस्थेचे सर्व उद्देश सन 1860 च्या संस्था नोंदणी अधिनियमाच्या कलम 20 अन्वये असून, वरील संस्थेच्या नावांची या नामसदृष्य असलेली अन्य संस्था माझ्या माहिती प्रमाणे अस्तित्वात नाही. नोंदणी शुल्क रू. ५०/- (अक्षरी पन्नास रूपये फक्त ) भरण्यासाठी तयार आहे.
              </p>
              <p style="text-align: center; font-weight: bold; margin-top: 3px; font-size: 14.5px;">
                तरी वरील संस्था नोंदणी अधिनियम 1860 अन्वये त्वरीत नोंदवावी अशी विनंती आहे.
              </p>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 14.5px; align-items: flex-start; line-height: 1.35;">
              <div style="font-weight: bold; margin-top: 3px;">
                सहपत्रे :- वरील प्रमाणे
              </div>
              <div style="text-align: center; width: 300px;">
                आपला विश्वासु,<br><br>
                <span style="font-weight: bold; font-size: 15.5px;">${presidentName}</span><br>
                “ ${trustName} ”<br>
                <span style="font-size: 13.5px; font-weight: normal;">${address}</span>
              </div>
            </div>
          </div>
          ${renderFooterSignatures()}
        </div>
      </div>


      <!-- PAGE 2: Memorandum (परिशिष्ट " ब ") -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div style="text-align: center; margin-bottom: 6px; line-height: 1.25;">
              <span style="font-weight: bold; font-size: 18px;">परिशिष्ट " ब "</span><br>
              <span style="font-size: 15.5px; text-decoration: underline; font-weight: bold;">या संस्थेचे ज्ञापन</span><br>
              <span style="font-weight: bold; font-size: 16.5px;">मेमोरंडम ऑफ असोसिएशन</span><br>
              <span style="font-size: 13.5px; font-weight: bold;">(Memorandum of Association)</span>
            </div>

            <table style="width: 100%; border: none; margin-bottom: 5px; border-collapse: collapse; font-size: 14.5px; line-height: 1.35;">
              <tr>
                <td style="width: 25px; font-weight: bold; padding: 1.5px 0;">1)</td>
                <td style="width: 165px; font-weight: bold; padding: 1.5px 0;">संस्थेचे नांव :-</td>
                <td style="font-weight: bold; font-size: 15.5px; padding: 1.5px 0;">“ ${trustName} ”</td>
              </tr>
              <tr>
                <td style="width: 25px; font-weight: bold; padding: 2px 0;">2)</td>
                <td style="width: 165px; font-weight: bold; padding: 2px 0;">संस्थेच्या कार्यालयाचा पत्ता :</td>
                <td style="padding: 2px 0; font-size: 14px;">${address}</td>
              </tr>
              <tr>
                <td style="width: 25px; font-weight: bold; padding: 2px 0;">3)</td>
                <td style="width: 165px; font-weight: bold; padding: 2px 0;">संस्थेचे उद्देश :</td>
                <td style="font-weight: bold; text-decoration: underline; padding: 2px 0;">या संस्थेचे उद्देश खालील प्रमाणे आहेत</td>
              </tr>
            </table>

            <table style="width: 100%; border: none; font-size: ${objectives.length > 12 ? '13px' : '14px'}; line-height: ${objectives.length > 12 ? '1.24' : '1.34'}; border-collapse: collapse;">
              ${objectives.map((obj, i) => `
                <tr>
                  <td style="width: 25px; vertical-align: top; padding: 1.5px 0; font-weight: bold;">${i + 1})</td>
                  <td style="vertical-align: top; padding: 1.5px 0; text-align: justify;">${obj || "_____"}</td>
                </tr>
              `).join("")}
            </table>
          </div>
          ${renderFooterSignatures()}
        </div>
      </div>


      <!-- PAGE 3: Executive Committee (कार्यकारी मंडळ) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div style="text-align: center; margin-bottom: 8px; font-size: 14px;">
              (..2..)
            </div>

            <div style="margin-bottom: 6px; font-size: 15px; line-height: 1.4; text-align: justify;">
              <b>4) “ ${trustName} ”</b> ${address}. या संस्थेचे नियम व नियमावली प्रमाणे या कार्यकारी मंडळावर सदरहु संस्थेच्या कार्यकारी मंडळाचा संस्थेचा कार्यभार सोपविण्यात आला आहे. त्या पहिल्या कार्यकारी मंडळाचा संपुर्ण पत्ता, हुद्दा, वय, व्यवसाय, राष्ट्रीयत्व खालील प्रमाणे आहे.
            </div>

            ${renderCommitteeTable()}
          </div>        
          ${renderFooterSignatures()}
        </div>
      </div>        


      <!-- PAGE 4: Signatures (सह्या व साक्षांकन) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div style="text-align: center; margin-bottom: 8px; font-size: 14px;">
              (..3..)
            </div>

            <div style="margin-bottom: 6px; font-size: 14.5px; line-height: 1.38; text-align: justify;">
              <b>5.</b> आम्ही खालील सह्या करणार <b>" ${trustName} "</b> ${address}. चे पदाधिकारी सदस्य जाहीर करतो की, संस्था अधिनियम 1860 अन्वये अभिप्रेत केलेली संस्था अस्तित्वात आणण्याची आमची ईच्छा असून वरील उद्देशाने आम्ही एकत्र येऊन <b>" ${trustName} "</b> ${address}. ही संस्था आज दिनांक <b>${date}</b> रोजी स्थापन केली असून संस्था नोंदणी अधिनियम 1860 अन्वये नोंदणी करण्यासाठी आम्ही या विधानपत्रावर सह्या केल्या आहेत.
            </div>
            
            ${renderCommitteeSignatures()}
            
            <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 14px;">
              <div>
                स्थळ : ${place}<br>
                दिनांक : ${date}
              </div>
            </div>

            <div style="margin-top: 10px; margin-left: 45%; font-size: 13.5px; line-height: 1.3; text-align: left;">
              वरील सह्या करणाऱ्या सर्व सभासदांना मी ओळखतो.<br>
              व त्यांनी माझ्या समक्ष या विधानपत्रावर सह्या केल्या आहेत.<br><br>
              <b>विशेष कार्यकारी दंडाधिकारी / वकील / सनदी लेखापाल / नोटरी संपूर्ण नांव, पत्ता व शिक्का.</b>
            </div>
          </div>
          ${renderFooterSignatures()}
        </div>
      </div>


      <!-- PAGE 5: Rules & Regulations Part 1 (परिशिष्ट " क ") -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div style="text-align: center; margin-bottom: 6px; line-height: 1.25;">
              <span style="font-weight: bold; font-size: 18px;">परिशिष्ट " क "</span><br>
              <span style="font-weight: bold; font-size: 16px;">“ ${trustName} ”</span><br>
              <span style="font-size: 14px;">${address}</span><br>
              <span style="font-size: 14.5px; text-decoration: underline; font-weight: bold; margin-top: 2px; display: inline-block;">या संस्थेचे नियम व नियमावली (Rules & Regulation/Constitution)</span>
            </div>

            <table style="width: 100%; border: none; border-collapse: collapse; font-size: 14px; line-height: 1.32; text-align: justify;">
              <colgroup>
                <col style="width: 20px;">
                <col style="width: 22px;">
                <col style="width: 70px;">
                <col style="width: 15px;">
                <col style="width: auto;">
              </colgroup>
              
              <tr>
                <td colspan="5" style="padding: 2px 0;">
                  <b><u>1)</u> &nbsp;&nbsp;<u>नियमावलीतील संदर्भिय शब्दाची व्याख्या</u> :-</b>
                </td>
              </tr>
              <tr>
                <td></td>
                <td style="padding: 1px 0;">अ)</td>
                <td style="padding: 1px 0;">संस्था</td>
                <td style="padding: 1px 0; text-align: center;">:</td>
                <td style="padding: 1px 0;">संस्था म्हणजे " ${trustName} " ${address}. ही संस्था नोंदणी कायदा 1860 अन्वये नोंद होणारी संस्था.</td>
              </tr>
              <tr>
                <td></td>
                <td style="padding: 1px 0;">ब)</td>
                <td style="padding: 1px 0;">अध्यक्ष</td>
                <td style="padding: 1px 0; text-align: center;">:</td>
                <td style="padding: 1px 0;">अध्यक्ष म्हणजे " ${trustName} " ${address}. या संस्थेचा अध्यक्ष.</td>
              </tr>
              <tr>
                <td></td>
                <td style="padding: 1px 0;">क)</td>
                <td style="padding: 1px 0;">उपाध्यक्ष</td>
                <td style="padding: 1px 0; text-align: center;">:</td>
                <td style="padding: 1px 0;">उपाध्यक्ष म्हणजे " ${trustName} " ${address}. या संस्थेचा उपाध्यक्ष.</td>
              </tr>
              <tr>
                <td></td>
                <td style="padding: 1px 0;">ड)</td>
                <td style="padding: 1px 0;">सचिव</td>
                <td style="padding: 1px 0; text-align: center;">:</td>
                <td style="padding: 1px 0;">सचिव म्हणजे " ${trustName} " ${address}. या संस्थेचा सचिव.</td>
              </tr>
              <tr>
                <td></td>
                <td style="padding: 1px 0;">इ)</td>
                <td style="padding: 1px 0;">सहसचिव</td>
                <td style="padding: 1px 0; text-align: center;">:</td>
                <td style="padding: 1px 0;">सहसचिव म्हणजे " ${trustName} " ${address}. या संस्थेचा सहसचिव.</td>
              </tr>
              <tr>
                <td></td>
                <td style="padding: 1px 0;">प)</td>
                <td style="padding: 1px 0;">कोषाध्यक्ष</td>
                <td style="padding: 1px 0; text-align: center;">:</td>
                <td style="padding: 1px 0;">कोषाध्यक्ष - ${trustName} - ${address}. या संस्थेचा कोषाध्यक्ष.</td>
              </tr>
              <tr>
                <td></td>
                <td style="padding: 1px 0;">फ)</td>
                <td style="padding: 1px 0;">सभासद</td>
                <td style="padding: 1px 0; text-align: center;">:</td>
                <td style="padding: 1px 0;">सभासद म्हणजे ${trustName}, ${address}. या संस्थेची वर्गणी भरून झालेला आजीव सभासद, वार्षिक सभासद व कार्यकारी मंडळावर निवडून आलेले सभासद.</td>
              </tr>
              
              <tr><td colspan="5" style="height: 4px;"></td></tr>
              
              <tr>
                <td colspan="3" style="padding: 2px 0;"><b><u>2)</u> &nbsp;&nbsp;<u>कार्यक्षेत्र</u></b></td>
                <td style="padding: 2px 0; text-align: center;"><b>:</b></td>
                <td style="padding: 2px 0;">या संस्थेचे कार्यक्षेत्र संपूर्ण महाराष्ट्र राज्य राहील.</td>
              </tr>
              
              <tr>
                <td colspan="3" style="padding: 2px 0;"><b><u>3)</u> &nbsp;&nbsp;<u>हिशोबाचे वर्ष</u></b></td>
                <td style="padding: 2px 0; text-align: center;"><b>:</b></td>
                <td style="padding: 2px 0;">या संस्थेचे हिशोबाचे वर्ष 1 एप्रिल ते 31 मार्च असे राहील.</td>
              </tr>
              
              <tr><td colspan="5" style="height: 4px;"></td></tr>
              
              <tr>
                <td colspan="5" style="padding: 2px 0;">
                  <b><u>4)</u> &nbsp;&nbsp;<u>सभासदत्व व त्याची नोंदणी पध्दती</u> :-</b>
                </td>
              </tr>
              <tr>
                <td></td>
                <td style="padding: 1px 0;">अ)</td>
                <td colspan="3" style="padding: 1px 0;">कोणत्याही भारतीय सज्ञान व्यक्तीस/महिलेस संस्थेचे सभासद होता येईल.</td>
              </tr>
              <tr>
                <td></td>
                <td style="padding: 1px 0;">ब)</td>
                <td colspan="3" style="padding: 1px 0;">सभासद होण्यासाठी त्याने/तीने संस्थेला लेखी अर्ज करावा.</td>
              </tr>
              <tr>
                <td></td>
                <td style="padding: 1px 0;">क)</td>
                <td colspan="3" style="padding: 1px 0;">कार्यकारी मंडळाचा या बाबतचा निर्णय अंतिम राहिल.</td>
              </tr>
              
              <tr><td colspan="5" style="height: 4px;"></td></tr>
              
              <tr>
                <td colspan="5" style="padding: 2px 0;">
                  <b><u>5)</u> &nbsp;&nbsp;<u>सभासदांचे प्रकार</u> :-</b>
                </td>
              </tr>
              <tr>
                <td></td>
                <td style="padding: 1px 0;">अ)</td>
                <td colspan="3" style="padding: 1px 0;">
                  <b>आजीव सभासद :-</b> आजिव सभासद होण्यासाठी प्रत्येकाने सभासद वर्गणी रूपये 101/- फी संस्थेस अदा केली पाहिजे. ते संस्थेचे तहहयात सभासद असतील. त्यांना पुन्हा सभासदत्व फी भरावी लागणार नाही.
                </td>
              </tr>
              <tr>
                <td></td>
                <td style="padding: 1px 0;">ब)</td>
                <td colspan="3" style="padding: 1px 0;">
                  <b>वार्षिक सभासद :-</b> वार्षिक सभासद होण्यासाठी सभासदाने वा व्यक्तीने दरवर्षी 51/- रूपये सभासद वर्गणी अदा करावयास हवी. तसेच पहिल्यांदा 5/- रूपये म्हणून प्रवेश फी अदा करावी.
                </td>
              </tr>
            </table>
          </div>
          ${renderFooterSignatures()}
        </div>
      </div>


      <!-- PAGE 6: Rules & Regulations Part 2 -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div style="text-align: center; margin-bottom: 6px; font-size: 14px;">
              (..2..)
            </div>

            <div style="font-size: 14.5px; line-height: 1.36; text-align: justify; color: #000;">
              <div style="margin-bottom: 6px;">
                <b>6) &nbsp;&nbsp;<u>सभासदत्व रद्द होणे</u> :-</b><br>
                <p style="text-indent: 25px; margin: 1px 0 0 0;">
                  कोणताही सभासद कायदेशीर गुन्हेगार ठरला असेल, सभासद वर्गणी दिली नसेल, राजीनामा दिल्यास तो राजीनामा कार्यकारी मंडळाने मंजुर केल्यास, मयत झाल्यास, देश सोडून गेला असेल, संस्थेला हानी किंवा नुकसान पोहचवित असेल किंवा योग्य कारणावरून कार्यकारी मंडळाने बहुमताने ठराव मंजूर करून काढून टाकल्यास सभासदत्व रद्द झाले असे समजले जाईल.
                </p>
              </div>

              <div style="margin-bottom: 6px;">
                <b>7) &nbsp;&nbsp;<u>सर्वसाधारण सभा तिचे अधिकार व कर्तव्ये</u> :-</b><br>
                <p style="margin: 1px 0 0 0; padding-left: 12px;">
                  सर्वसाधारण सभा म्हणजे संस्थेच्या सभासदांची सभा संस्थेच्या आर्थिक वर्ष संपल्यानंतर दोन महीन्याच्या आत वार्षिक सर्वसाधारण सभा घेतली जाईल, सर्वसाधारण सभेचे कार्ये व अधिकार खालील प्रमाणे आहे.<br>
                  अ) मागील सर्वसाधारण सभेचा वृत्तांत निर्णय वाचून कायम करणे.<br>
                  ब) वार्षिक जमाखर्च मंजूर करणे, वार्षिक अहवाल मंजूर करणे, कार्यकारिणीच्या आर्थिक धोरणात्मक स्वरूपाच्या ठरावांना मान्यता देणे.<br>
                  ड) आयत्यावेळी येणाऱ्या विषयावर अध्यक्षांच्या संमतीने निर्णय घेणे.
                </p>
              </div>

              <div style="margin-bottom: 6px;">
                <b>8) &nbsp;&nbsp;<u>सर्वसाधारण सभेची सुचना व गणसंख्या</u> :-</b><br>
                <p style="text-indent: 25px; margin: 1px 0 0 0;">
                  सचिव हे सर्वसाधारण सभेची सूचना ही प्रत्येक सभासदास सभेच्या तारखेच्या 15 दिवस अगोदर पोस्टाने किंवा समक्ष सही घेऊन देतील. त्या सुचनेवर सभेचे ठिकाण, विषय वेळ व दिनांक लिहिलेली असेल. या सभेत 2/5 सभासदांची गणसंख्या असेल.
                </p>
              </div>

              <div style="margin-bottom: 6px;">
                <b>9) &nbsp;&nbsp;<u>विशेष सर्वसाधारण सभा तिचे कार्य</u> :-</b><br>
                <p style="text-indent: 25px; margin: 1px 0 0 0;">
                  काही महत्त्वाच्या व तातडीच्या कामासाठी सर्वसाधारण सभा घेतली जाईल, त्यास विशेष सर्वसाधारण सभा संबोधले जाईल. या सभेस 2/5 सभासदांची गणसंख्या राहिल. या सभेस 15 दिवसांच्या नोटीस पोस्टाने वा समक्ष सही घेऊन दिली जाईल.
                </p>
              </div>

              <div style="margin-bottom: 6px;">
                <b>10) &nbsp;&nbsp;<u>कार्यकारी मंडळ व पदाधिकारी यांची रचना</u> :-</b><br>
                <p style="margin: 1px 0 0 0; padding-left: 12px;">
                  अ) संस्थेचे कार्यकारी मंडळ कमीत कमी 7 सदस्यांचे व जास्तीत जास्त 13 सदस्यांचे राहील.<br>
                  ब) कार्यकारी मंडळावर संस्थेच्या सर्व सभासदास निवडून जाता येईल.<br>
                  क) संस्थेच्या कार्यकारी मंडळात खालीलप्रमाणे पदाधिकारी असतील. एक-अध्यक्ष, एक-उपाध्यक्ष, एक- सचिव, एक - सहसचिव, एक- कोषाध्यक्ष व इतर सभासद असतील.
                </p>
              </div>
            </div>
          </div>
          ${renderFooterSignatures()}
        </div>
      </div>


      <!-- PAGE 7: Rules & Regulations Part 3 -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div style="text-align: center; margin-bottom: 6px; font-size: 14px;">
              (.. 3 ..)
            </div>

            <div style="font-size: 14.2px; line-height: 1.34; text-align: justify; color: #000;">
              <div style="margin-bottom: 5px;">
                <b>11) &nbsp;&nbsp;<u>कार्यकारी मंडळाचा कार्यकाल व निवडणुकीची पद्धत</u> :-</b><br>
                <p style="text-indent: 25px; margin: 1px 0 0 0;">
                  पहिले कार्यकारी मंडळ हे पाच वर्षांचे असेल, त्यानंतर सर्वसाधारण सभेत निवडून आलेल्या कार्यकारी मंडळाचा कार्यकाल हा पाच वर्षाचा असेल. कार्यकारी मंडळाच्या सभासदांची निवड दर पाच वर्षाने सर्वसाधारण सभेत गुप्त मतदान पद्धतीने करण्यात येईल.
                </p>
              </div>

              <div style="margin-bottom: 5px;">
                <b>12) &nbsp;&nbsp;<u>कार्यकारी मंडळाचे पदाधिकारी व त्यांचे कामे</u> :-</b><br>
                <p style="margin: 1px 0 2px 0;">
                  कार्यकारी मंडळात खालील प्रमाणे पदे असतील. एक-अध्यक्ष, एक-उपाध्यक्ष, एक- सचिव, एक - सहसचिव, एक- कोषाध्यक्ष व इतर सभासद कार्यकारी मंडळातील पदाधिकारी यांची व त्या अन्वये कार्यकारी मंडळाची कार्ये खालील प्रमाणे असतील.
                </p>

                <div style="margin-left: 10px; margin-bottom: 4px;">
                  <b>अ) &nbsp;&nbsp;<u>अध्यक्षांची कार्ये व अधिकार</u> :-</b>
                  <table style="width: 100%; border: none; margin-left: 8px; font-size: 13.8px; line-height: 1.28;">
                    <tr><td style="width: 20px; padding: 1px 0;">अ)</td><td style="padding: 1px 0;">संस्थेच्या सर्व सभा व्यवस्थित चालविणे, त्यांचे संचालन करणे, सभा बोलविणे.</td></tr>
                    <tr><td style="width: 20px; padding: 1px 0;">ब)</td><td style="padding: 1px 0;">संस्थेच्या कारभारावर संपूर्ण नियंत्रण ठेवणे.</td></tr>
                    <tr><td style="width: 20px; padding: 1px 0;">क)</td><td style="padding: 1px 0;">सभेत समान मते पडल्यास निर्णायक जादा मत देणे.</td></tr>
                  </table>
                </div>

                <div style="margin-left: 10px; margin-bottom: 4px;">
                  <b>ब) &nbsp;&nbsp;<u>उपाध्यक्षांची कार्ये</u> :-</b>
                  <table style="width: 100%; border: none; margin-left: 8px; font-size: 13.8px; line-height: 1.28;">
                    <tr><td style="width: 20px; padding: 1px 0;">अ)</td><td style="padding: 1px 0;">अध्यक्षांच्या कामात मदत करणे.</td></tr>
                    <tr><td style="width: 20px; padding: 1px 0;">ब)</td><td style="padding: 1px 0;">अध्यक्षांच्या गैरहजेरीत त्यांचे कामकाज पाहणे.</td></tr>
                  </table>
                </div>

                <div style="margin-left: 10px; margin-bottom: 4px;">
                  <b>क) &nbsp;&nbsp;<u>सचिवाची कार्ये</u> :-</b>
                  <table style="width: 100%; border: none; margin-left: 8px; font-size: 13.8px; line-height: 1.28;">
                    <tr><td style="width: 20px; padding: 1px 0;">1)</td><td style="padding: 1px 0;">संस्थेचा सर्व प्रकारचा पत्रव्यवहार पाहणे व आवश्यक रजिस्टर ठेवणे.</td></tr>
                    <tr><td style="width: 20px; padding: 1px 0;">2)</td><td style="padding: 1px 0;">सभेचे सर्व ठराव अंमलात आणणे व हिशोब पडताळून पाहणे.</td></tr>
                    <tr><td style="width: 20px; padding: 1px 0;">3)</td><td style="padding: 1px 0;">अध्यक्षांच्या परवानगीने सभांच्या कार्यक्रम पत्रिका पाठविणे व दस्तऐवजावर सह्या करणे.</td></tr>
                    <tr><td style="width: 20px; padding: 1px 0;">4)</td><td style="padding: 1px 0;">आर्थिक हिशोब तयार करणे, बँकेवरील व्यवहारांवर नियंत्रण ठेवणे व अहवाल सादर करणे.</td></tr>
                  </table>
                </div>

                <div style="margin-left: 10px; margin-bottom: 4px;">
                  <b>ड) &nbsp;&nbsp;<u>सहसचिवाचे कार्ये</u> :-</b>
                  <span style="font-size: 13.8px;">सचिवाच्या गैरहजेरीत सचिवाची कामे करणे, किंवा योग्य ती मदत करणे.</span>
                </div>

                <div style="margin-left: 10px; margin-bottom: 4px;">
                  <b>इ) &nbsp;&nbsp;<u>कोषाध्यक्षांचे कार्ये</u> :-</b>
                  <span style="font-size: 13.8px;">संस्थेच्या आर्थिक परिस्थितीवर नियंत्रण ठेवणे, हिशोब पूर्ण झाल्यावर कार्यकारी मंडळापुढे ठेवणे, पत्रके तयार करणे व त्रुटींची पूर्तता करणे.</span>
                </div>

                <div style="margin-left: 10px;">
                  <b>ई) &nbsp;&nbsp;<u>इतर सभासदांची कार्ये</u> :-</b>
                  <span style="font-size: 13.8px;">सर्व साधारण सभेस हजर राहणे, संस्थेच्या कार्यास मदत करणे, मतदानास हजर राहणे.</span>
                </div>
              </div>
            </div>
          </div>
          ${renderFooterSignatures()}
        </div>
      </div>


      <!-- PAGE 8: Rules & Regulations Part 4 -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div style="text-align: center; margin-bottom: 6px; font-size: 14px;">
              (.. 4 ..)
            </div>

            <div style="font-size: 14.5px; line-height: 1.36; text-align: justify;">
              <div style="margin-bottom: 6px;">
                <b>13) &nbsp;&nbsp;<u>कार्यकारी मंडळाची सभा व मागणी</u> :-</b><br>
                <p style="text-indent: 25px; margin: 1px 0 0 0;">
                  कार्यकारी मंडळाची सभा ही जास्तीत जास्त तीन महिन्यातून एकदा घेण्यात येईल. अशा प्रकारे एका वर्षात कमीत कमी चार सभा घेण्यात येतील. तसेच महत्त्वाच्या अथवा तातडीच्या कामासाठी कार्यकारी मंडळाची सभा बोलविण्यात येईल. त्यासाठी कमीत कमी २/३ सभासदांची अध्यक्षांकडे मागणी करणे आवश्यक आहे. तिला मागणीची सभा किंवा तातडीची सभा असे संबोधण्यात येईल. ही तातडीची सभा बोलविण्याचा अधिकार अध्यक्षांचा राहील. सदर सभा अध्यक्षांनी १५ दिवसांच्या आत न बोलविल्यास मागणी करणारे सभासद अशी सभा बोलवतील.
                </p>
              </div>

              <div style="margin-bottom: 6px;">
                <b>14) &nbsp;&nbsp;<u>कार्यकारी मंडळाच्या सभेची सूचना व गणसंख्या</u> :-</b><br>
                <p style="text-indent: 25px; margin: 1px 0 0 0;">
                  प्रत्येक कार्यकारी मंडळाच्या सभेची सूचना पंधरा दिवसांपूर्वी पोस्टाने किंवा समक्ष सही घेऊन दिली जाईल. सभेला कार्यकारी मंडळातील सदस्यांची गणसंख्या ही २/३ राहील. पण गणसंख्येच्या अभावी सभा जर तहकूब झाली तर तहकूब झालेली सभा, त्याच दिवशी त्याच ठिकाणी, ठरलेल्या वेळेनंतर एका तासाने घेण्यात येईल. अशा तहकूब सभेस गणसंख्येची आवश्यकता राहणार नाही. मात्र या सभेत विषय पत्रिकेशिवाय इतर कोणत्याही विषयांवर चर्चा होणार नाही अथवा निर्णय घेतले जाणार नाहीत. महत्त्वाच्या अथवा तातडीच्या कामासाठी जी सभा बोलविण्यात येईल त्या सभेला पाच दिवसांची नोटीस अथवा सूचना देण्यात येईल.
                </p>
              </div>

              <div style="margin-bottom: 6px;">
                <b>15) &nbsp;&nbsp;<u>कार्यकारी मंडळाच्या निवडणुकीचे नियम</u> :-</b><br>
                <p style="margin: 1px 0 0 0; padding-left: 12px;">
                  अ) कार्यकारी मंडळाची निवडणूक सर्वसाधारण सभेत दर पाच वर्षांनी गुप्त मतदान पद्धतीने घेण्यात येईल.<br>
                  ब) या संस्थेच्या सर्व सभासदांना निवडणुकीत उभे राहता येईल.
                </p>
              </div>

              <div style="margin-bottom: 6px;">
                <b>16) &nbsp;&nbsp;<u>कार्यकारी मंडळातील रिक्त पद भरण्याबाबत</u> :-</b><br>
                <p style="text-indent: 25px; margin: 1px 0 0 0;">
                  कार्यकारी मंडळातील पद अथवा जागा नियम क्रमांक ६ प्रमाणे व पुढील सभासद मृत्यू झाल्यामुळे, राजीनामा दिल्यामुळे व तो कार्यकारी मंडळाने मंजूर केल्यास रिक्त झाल्यास उर्वरित सभासद संस्थेच्या सर्व सभासदांमधून उर्वरित कालावधीसाठी त्यांच्या बहुमताने असे रिक्त पद व जागा भरून काढावीत, असे रिक्त पद व जागा तीन महिन्यात भरली नाही तर मा. सहाय्यक धर्मादाय आयुक्त जालना उपविभाग, जालना यांना भरण्याचा अधिकार राहील.
                </p>
              </div>

              <div style="margin-bottom: 6px;">
                <b>17) &nbsp;&nbsp;<u>कार्यकारी मंडळाचे अधिकार व कर्तव्य</u> :-</b><br>
                <p style="margin: 1px 0 0 0; padding-left: 12px;">
                  अ) संस्थेच्या उद्देशाकरिता निधी जमा करणे, वाढविणे, त्याचा विनियोग करणे, योग्य अशी गुंतवणूक करणे, देणग्या, शासकीय व निमशासकीय अनुदान स्वीकारणे.<br>
                  ब) मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० व त्याखालील नियमांना अनुसरून संस्थेच्या उद्देशपूर्तीसाठी कर्ज घेणे.<br>
                  क) दैनंदिन खर्चाचे अंदाजपत्रक मंजूर करणे व त्या खालील रक्कम मंजूर करणे व खर्चास वेळोवेळी मंजुरी देणे.<br>
                  ड) संस्थेच्या नावाने जंगम व स्थावर मिळकत खरेदी करणे व त्यावर इमारती व वास्तू बांधणे, गहाण व भाड्याने व लीज पद्धतीने देणे.<br>
                  इ) आवश्यक त्या विषय समित्या किंवा पोटसमित्या नेमणे.
                </p>
              </div>
            </div>
          </div>
          ${renderFooterSignatures()}
        </div>
      </div>


      <!-- PAGE 9: Rules & Regulations Part 5 -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div style="text-align: center; margin-bottom: 6px; font-size: 14px;">
              (.. 5 ..)
            </div>

            <div style="font-size: 14.2px; line-height: 1.34; text-align: justify;">
              <div style="margin-bottom: 5px;">
                फ) आवश्यक तो नोकरवर्ग नेमणे, त्यांचे पगार ठरविणे व त्यांना सेवेतून मुक्त करणे.<br>
                ब) कार्यकारी मंडळावर मुदती आधी जागा रिकामी झाल्यास ती बहुमताने भरून काढणे.<br>
                इ) सनदी लेखापाल (ऑडिटर) यांची नेमणूक करणे.<br>
                प) मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० व संस्था नोंदणी कायदा १८६० अन्वये उद्देशपूर्तीसाठी कार्ये करणे.
              </div>

              <div style="margin-bottom: 5px;">
                <b>18) &nbsp;&nbsp;<u>संस्थेचा निधी, मिळकती व विनियोग</u> :-</b><br>
                <p style="text-indent: 25px; margin: 1px 0 0 0;">
                  संस्थेचा निधी देणाऱ्या शासकीय व निमशासकीय अनुदाने स्वीकारून, देणग्या गोळा करून करण्यात येईल व तो सातत्याने वाढविण्याचा प्रयत्न करण्यात येईल. निधी व मिळकतीचा विनियोग संस्थेच्या उद्देशपूर्तीसाठी करण्यात येईल.
                </p>
              </div>

              <div style="margin-bottom: 5px;">
                <b>19) &nbsp;&nbsp;<u>उद्दिष्ट निहाय खर्चाची तरतूद</u> :-</b><br>
                <p style="text-indent: 25px; margin: 1px 0 0 0;">
                  संस्थेच्या सर्व उद्दिष्टांवर समप्रमाणात खर्च करण्यात येईल. यास उद्देशांचे गरजेनुसार व काळाप्रमाणे व परिस्थितीस अनुसरून यात बदल केला जाईल. या बाबतची सूचना मा. सहाय्यक धर्मादाय आयुक्त यांचे कार्यालयात वार्षिक तपासणी अहवालाबरोबर दिली जाईल.
                </p>
              </div>

              <div style="margin-bottom: 5px;">
                <b>20) &nbsp;&nbsp;<u>कर्ज संबंधी तरतूद</u> :-</b><br>
                <p style="text-indent: 25px; margin: 1px 0 0 0;">
                  संस्थेच्या उद्दिष्टपूर्तीसाठी मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० चे कलमास अधीन राहून कार्यकारी मंडळाच्या ठरावानुसार अध्यक्ष व सचिव संस्थेला लागणारे कर्ज घेतील. संस्थेला लागणारे कर्ज मा. धर्मादाय सहआयुक्त यांच्या पूर्वपरवानगीने घेण्यात येईल.
                </p>
              </div>

              <div style="margin-bottom: 5px;">
                <b>21) &nbsp;&nbsp;<u>स्थावर मालमत्ता खरेदी-विक्री करणे बाबतची तरतूद</u> :-</b><br>
                <p style="text-indent: 25px; margin: 1px 0 0 0;">
                  संस्थेला स्थावर मालमत्ता खरेदी करणे तसेच विक्री करण्याचा अधिकार राहील, त्याकरिता कार्यकारी मंडळाची बहुमताने संमती घ्यावी लागेल. विक्री करावयाची असल्यास मा. धर्मादाय सहआयुक्त यांची परवानगी घेणे आवश्यक राहील.
                </p>
              </div>

              <div style="margin-bottom: 5px;">
                <b>22) &nbsp;&nbsp;<u>बँक खाते व संस्थेचा वार्षिक व्यवहार</u> :-</b><br>
                <p style="text-indent: 25px; margin: 1px 0 0 0;">
                  संस्थेकडे येणाऱ्या निधीपैकी रु. ५००/- इतकी रक्कम हातात ठेवून बाकीची रक्कम कोणत्याही राष्ट्रीयकृत बँकेत खाते उघडून संस्थेच्या नावाने ठेवता येईल. बँकेचे खात्यातील व्यवहार हे अध्यक्ष व सचिव किंवा कोषाध्यक्ष यापैकी दोघांच्या संयुक्त सहीने राहतील.
                </p>
              </div>

              <div style="margin-bottom: 5px;">
                <b>23) &nbsp;&nbsp;<u>सभासदांची यादी ठेवण्याची पद्धत</u> :-</b><br>
                <p style="text-indent: 25px; margin: 1px 0 0 0;">
                  सन १९७१ च्या संस्था नोंदणी (महाराष्ट्र) नियमाप्रमाणे उल्लेख केलेले अनुसूची १, २ व ६ मध्ये कार्यकारी मंडळाची व सर्व सभासदांची यादी व संस्थेमध्ये असलेल्या नोकरवर्गाची यादी ठेवण्यात येईल व वेळोवेळी मा. सहाय्यक निबंधक यांना कळविण्यात येईल.
                </p>
              </div>

              <div style="margin-bottom: 5px;">
                <b>24) &nbsp;&nbsp;<u>नियम आणि नियमावलीत बदल करण्याची तरतूद</u> :-</b><br>
                <p style="text-indent: 25px; margin: 1px 0 0 0;">
                  या नियमावलीत बदल करणे व नवीन नियमांचा अंतर्भाव करणे यांसाठी वार्षिक सर्वसाधारण सभेत अथवा विशेष सर्वसाधारण सभेत ३/५ मताधिक्याने मंजुरी मिळवावी लागेल संस्था नोंदणी कायदा १८६० चे कलम १२ व १२ अ नुसार कार्यवाही केली जाईल.
                </p>
              </div>
            </div>
          </div>
          ${renderFooterSignatures()}
        </div>
      </div>


      <!-- PAGE 10: Rules & Regulations Part 6 (Certificate) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div style="text-align: center; margin-bottom: 8px; font-size: 14px;">
              (.. 6 ..)
            </div>

            <div style="font-size: 15px; line-height: 1.42; text-align: justify;">
              <div style="margin-bottom: 10px;">
                <b>25) &nbsp;&nbsp;<u>संस्थेच्या नावात व उद्देशात बदल करण्याची तरतूद</u> :-</b><br>
                <p style="text-indent: 25px; margin: 2px 0 0 0;">
                  संस्थेच्या नावांत किंवा उद्देशात बदल करावयाचा असल्यास संस्था नोंदणी अधिनियम १८६० मधील कलम १२ व १२ अ चा अवलंब केला जाईल. ती तशी मंजुरी सर्वसाधारण सभेत ३/५ बहुमताने घेण्यात येईल.
                </p>
              </div>

              <div style="margin-bottom: 12px;">
                <b>26) &nbsp;&nbsp;<u>विसर्जन</u> :-</b><br>
                <p style="text-indent: 25px; margin: 2px 0 0 0;">
                  कोणत्याही कारणास्तव संस्था विसर्जित अथवा बंद करावयाची असल्यास सोसायटी नोंदणी अधिनियम १८६० अन्वये कलम १३ व १४ नुसार संस्था बरखास्त केली जाईल. सदर संस्थेची सर्व देणी देऊन शिल्लक राहिलेली मालमत्ता या प्रकारचा उद्देश असणाऱ्या व सोसायटी नोंदणी कायदा १८६० अन्वये नोंदणी झालेल्या संस्थेकडे वर्ग करता येईल किंवा विलीन करता येईल.
                </p>
              </div>

              <div style="border: 2px solid #000; padding: 14px; margin: 16px 0; text-align: center; background-color: #fafafa;">
                <b style="font-size: 18px;">‘‘ दाखला ’’</b><br><br>
                प्रमाणित करण्यात येते की, <b>" ${trustName} "</b> ${address}.<br>
                या संस्थेच्या नियमावलीची ही सत्यप्रत आहे.
              </div>

              <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 15px; font-size: 15px;">
                <div>
                  स्थळ : ${place}<br>
                  दिनांक : ${date}
                </div>
                <div style="text-align: center; width: 300px;">
                  <b>${presidentName}</b><br>
                  अध्यक्ष<br>
                  <b>" ${trustName} "</b><br>
                  <span style="font-size: 14px;">${address}</span>
                </div>
              </div>
            </div>
          </div>
          ${renderFooterSignatures()}
        </div>
      </div>


      <!-- PAGE 11: Consent Letter (परिशिष्ट " ड ") -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div class="title-lg">परिशिष्ट " ड "</div>
            <div class="title-sm text-center">-: संमती पत्र :- (Consent letter of members)</div>

            <div style="margin: 6px 0 5px 0; font-size: 15px; line-height: 1.35;">
              प्रति,<br>
              मे. सहाय्यक संस्था निबंधक,<br>
              विभाग जालना, जिल्हा जालना.<br><br>
              <b>विषय :- संस्था नोंदणी अधिनियम 1860 अन्वये नोंदणी बाबत....</b>
            </div>

            <div style="margin-bottom: 4px; font-size: 14.5px; line-height: 1.35;">
              महोदय,<br>
              <p class="indent" style="text-align: justify; margin-top: 1px;">
                आम्ही खालील सह्या करणार " <b>${trustName}</b> " ${address}. या संस्थेच्या पहिल्या कार्यकारी मंडळाचे सभासद असून, सदर संस्थेच्या कार्यकारी मंडळावर संस्थेच्या ध्येय, उद्देश व नियमावलीप्रमाणे काम करण्यास आमची संमती आहे. तसेच संस्था नोंदणी अधिनियम 1860 अन्वये सदर संस्थेची नोंदणी होण्यास संमती असून त्याचे प्रतिक म्हणून आम्ही आमच्या सह्या या संमतीपत्रावर केल्या आहेत.
              </p>
            </div>

            ${renderCommitteeSignatures(true)}

            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 10px; font-size: 14px;">
              <div>
                स्थळ : ${place}<br>
                दिनांक : ${date}
              </div>
              <div style="text-align: left; width: 55%; font-size: 13px; line-height: 1.3;">
                वरील सह्या करणाऱ्या सर्व सभासदांना मी ओळखतो.<br>
                व त्यांनी माझ्या समक्ष या संमतीपत्रावर सह्या केल्या आहेत.<br><br>
                <b>विशेष कार्यकारी दंडाधिकारी / वकील / सनदी लेखापाल / नोटरी संपूर्ण नांव, पत्ता व शिक्का.</b>
              </div>
            </div>
          </div>
          ${renderFooterSignatures()}
        </div>
      </div>


      <!-- PAGE 12: Authority Letter (परिशिष्ट " इ ") -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div class="title-lg">परिशिष्ट " इ "</div>
            <div class="title-sm text-center">अधिकार पत्र (Authority Letter)</div>

            <div style="margin: 6px 0 5px 0; font-size: 15px; line-height: 1.35;">
              प्रति,<br>
              मे. सहाय्यक संस्था निबंधक,<br>
              विभाग जालना, जिल्हा जालना.<br>
            </div>

            <div style="margin-bottom: 4px; font-size: 14.5px; line-height: 1.35;">
              महोदय,<br>
              <p class="indent" style="text-align: justify; margin-top: 1px;">
                आम्ही खालील सह्या करणार " <b>${trustName}</b> " ${address}. या संस्थेचे ५ वर्षे कार्यकारी मंडळाचे सभासद आहोत. आम्ही नमूद करीत आहोत की, या संस्थेच्या वतीने <b>${presidentName}</b> यांना सदरहू संस्था नोंदविण्या बाबतच्या कागदपत्रात आवश्यक ते बदल करण्याचे अधिकार या पत्रान्वये प्रदान करीत आहोत.
              </p>
            </div>

            ${renderCommitteeSignatures(true)}

            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 10px; font-size: 14.5px;">
              <div>
                स्थळ : ${place}<br>
                दिनांक : ${date}
              </div>
              <div style="text-align: center; width: 300px;">
                अध्यक्ष,<br><br>
                <b>${presidentName}</b><br>
                " ${trustName} "<br>
                <span style="font-size: 13.5px;">${address}</span>
              </div>
            </div>
          </div>
          ${renderFooterSignatures()}
        </div>
      </div>


      <!-- PAGE 13: Schedule 6 (तक्ता नियम सहा) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div class="title-md text-center" style="margin-bottom: 4px;">
              तक्ता नियम सहा (6) नियम 15<br>
              <span class="underline">(Schedule-6)</span><br>
              <span class="underline">संचालक मंडळाने निवडलेल्यांची यादी</span>
            </div>

            <table style="width: 100%; border: none; margin: 4px 0; font-size: ${memberCount > 10 ? '13px' : '14.5px'}; line-height: 1.28;">
              <tr>
                <td style="width: 25px; font-weight: bold; padding: 1px 0;">1)</td>
                <td style="width: 160px; font-weight: bold; padding: 1px 0;">संस्थेचे नांव :</td>
                <td style="font-weight: bold; font-size: ${memberCount > 10 ? '14px' : '15.5px'}; padding: 1px 0;">" ${trustName} "<br><span style="font-size: ${memberCount > 10 ? '12px' : '13.5px'}; font-weight: normal;">${address}</span></td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 2px 0;">2)</td>
                <td style="font-weight: bold; padding: 2px 0;">संस्था नोंदणी क्रमांक :-</td>
                <td style="padding: 2px 0;">${registrationNo}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 2px 0;">3)</td>
                <td style="font-weight: bold; padding: 2px 0;">संस्था नोंदणी अधिनियम :-</td>
                <td style="padding: 2px 0;">संस्था नोंदणी अधिनियम, १८६०</td>
              </tr>
            </table>

            ${renderCommitteeTable(true)}

            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: ${memberCount > 10 ? '6px' : '12px'}; font-size: 14px;">
              <div>स्थळ : ${place}<br>दिनांक : ${date}</div>
              <div style="text-align: center; width: 280px;">
                अध्यक्ष,<br><br>
                <b>${presidentName}</b><br>
                " ${trustName} "<br>
                <span style="font-size: 12.5px;">${address}</span>
              </div>
            </div>
          </div>
          ${renderFooterSignatures()}
        </div>
      </div>


      <!-- PAGE 14: Schedule 1 (तक्ता नियम सात) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div class="title-md text-center" style="margin-bottom: 4px;">
              तक्ता नियम सात (7) नियम 15<br>
              <span class="underline">(Schedule-1)</span><br>
              <span class="underline">संस्था नोंदणी अधिनियम 1860 चे कलम 4 नुसार</span>
            </div>

            <table style="width: 100%; border: none; margin: 4px 0; font-size: ${memberCount > 10 ? '13px' : '14.5px'}; line-height: 1.28;">
              <tr>
                <td style="width: 25px; font-weight: bold; padding: 1px 0;">1)</td>
                <td style="width: 170px; font-weight: bold; padding: 1px 0;">संस्थेचे नांव :</td>
                <td style="font-weight: bold; font-size: ${memberCount > 10 ? '14px' : '15.5px'}; padding: 1px 0;">" ${trustName} "<br><span style="font-size: ${memberCount > 10 ? '12px' : '13.5px'}; font-weight: normal;">${address}</span></td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 2px 0;">2)</td>
                <td style="font-weight: bold; padding: 2px 0;">संस्था नोंदणी अधिनियम :-</td>
                <td style="padding: 2px 0;">1860 नुसार नोंदणी क्र. ${registrationNo}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 2px 0;">3)</td>
                <td style="font-weight: bold; padding: 2px 0;">निवडणूक दिनांक व कालावधी :-</td>
                <td style="padding: 2px 0;">दि. ${date} ते ५ वर्षे कालावधीकरिता</td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 2px 0;">4)</td>
                <td style="font-weight: bold; padding: 2px 0;">पदाधिकार्‍यांचा कालावधी :-</td>
                <td style="padding: 2px 0;">पाच वर्षाकरिता</td>
              </tr>
            </table>

            ${renderCommitteeTable(true)}

            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: ${memberCount > 10 ? '6px' : '12px'}; font-size: 14px;">
              <div>स्थळ : ${place}<br>दिनांक : ${date}</div>
              <div style="text-align: center; width: 280px;">
                अध्यक्ष,<br><br>
                <b>${presidentName}</b><br>
                " ${trustName} "<br>
                <span style="font-size: 12.5px;">${address}</span>
              </div>
            </div>
          </div>
          ${renderFooterSignatures()}
        </div>
      </div>


      <!-- PAGE 15: Schedule 8 (तक्ता नियम आठ) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div class="title-md text-center" style="margin-bottom: 4px;">
              तक्ता नियम आठ (8)<br>
              <span class="underline">संस्था नोंदणी अधिनियम 1860 चे कलम 4 नुसार</span>
            </div>

            <table style="width: 100%; border: none; margin: 4px 0; font-size: ${memberCount > 10 ? '13px' : '14.5px'}; line-height: 1.28;">
              <tr>
                <td style="width: 25px; font-weight: bold; padding: 1px 0;">1)</td>
                <td style="width: 170px; font-weight: bold; padding: 1px 0;">संस्थेचे नांव :</td>
                <td style="font-weight: bold; font-size: ${memberCount > 10 ? '14px' : '15.5px'}; padding: 1px 0;">" ${trustName} "<br><span style="font-size: ${memberCount > 10 ? '12px' : '13.5px'}; font-weight: normal;">${address}</span></td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 2px 0;">2)</td>
                <td style="font-weight: bold; padding: 2px 0;">संस्था नोंदणी अधिनियम :-</td>
                <td style="padding: 2px 0;">1860 नुसार नोंदणी क्र. ${registrationNo}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 2px 0;">3)</td>
                <td style="font-weight: bold; padding: 2px 0;">निवडणूक दिनांक व कालावधी :-</td>
                <td style="padding: 2px 0;">दि. ${date} ते ५ वर्षे कालावधीकरिता</td>
              </tr>
              <tr>
                <td style="font-weight: bold; padding: 2px 0;">4)</td>
                <td style="font-weight: bold; padding: 2px 0;">पदाधिकार्‍यांचा कालावधी :-</td>
                <td style="padding: 2px 0;">पाच वर्षाकरिता</td>
              </tr>
            </table>

            ${renderCommitteeTable(true)}

            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: ${memberCount > 10 ? '6px' : '12px'}; font-size: 14px;">
              <div>स्थळ : ${place}<br>दिनांक : ${date}</div>
              <div style="text-align: center; width: 280px;">
                अध्यक्ष,<br><br>
                <b>${presidentName}</b><br>
                " ${trustName} "<br>
                <span style="font-size: 12.5px;">${address}</span>
              </div>
            </div>
          </div>
          ${renderFooterSignatures()}
        </div>
      </div>


      <!-- PAGE 16: Schedule 2 (Employees List) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div style="text-align: center; margin-bottom: 8px; line-height: 1.25;">
              <span style="font-weight: bold; font-size: 18px; text-decoration: underline;">परिशिष्ट - दोन</span><br>
              <span style="font-weight: bold; font-size: 16px; text-decoration: underline;">(Schedule-2)</span><br>
              <span style="font-weight: bold; font-size: 16px; text-decoration: underline;">(नियम - 8 )</span><br><br>
              <span style="font-weight: bold; font-size: 16px; text-decoration: underline;">कार्यकारी मंडळाने नेमलेल्या कर्मचा-यांचे विवरण</span>
            </div>

            <div style="border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; margin-top: 8px;">
              <table style="width: 100%; border-collapse: collapse; border-bottom: 1.5px solid #000; font-size: 13px; line-height: 1.25;">
                <thead>
                  <tr style="background-color: #fbfbfb;">
                    <th style="padding: 4px 2px; text-align: left; font-weight: bold; width: 6%;">अ.क्र.</th>
                    <th style="padding: 4px 2px; text-align: left; font-weight: bold; width: 20%;">कर्मचा-यांचे नांव व हुद्दा</th>
                    <th style="padding: 4px 2px; text-align: left; font-weight: bold; width: 10%;">वेतन</th>
                    <th style="padding: 4px 2px; text-align: left; font-weight: bold; width: 14%;">पूर्ण वेळ/<br>अर्धवेळ/<br>कायम/<br>तात्पुरते</th>
                    <th style="padding: 4px 2px; text-align: left; font-weight: bold; width: 12%;">मासिक भत्ता<br>विशेष<br>वेतन</th>
                    <th style="padding: 4px 2px; text-align: left; font-weight: bold; width: 10%;">इतर<br>सोयी<br>घरभाडे</th>
                    <th style="padding: 4px 2px; text-align: left; font-weight: bold; width: 12%;">भ.नि.नि.<br>अंशदान</th>
                    <th style="padding: 4px 2px; text-align: left; font-weight: bold; width: 16%;">केव्हाने<br>दिलेबाबत<br>इतर सोयी<br>सवलती</th>
                  </tr>
                </thead>
              </table>
              
              <div style="position: relative; width: 100%; height: 260px; background-color: #fff;">
                <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0;">
                  <line x1="0" y1="100%" x2="100%" y2="0" style="stroke: black; stroke-width: 1.5;" />
                </svg>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; border: 1.5px solid #000; padding: 4px 20px; font-weight: bold; font-size: 18px;">
                  निरंक
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 14.5px; line-height: 1.35;">
              <div>
                स्थळ : ${place}<br>
                दिनांक : ${date}
              </div>
              <div style="text-align: center; width: 280px;">
                अध्यक्ष,<br><br>
                <b>${presidentName}</b><br>
                “ ${trustName} ”<br>
                <span style="font-size: 13px;">${address}</span>
              </div>
            </div>
          </div>
          ${renderFooterSignatures()}
        </div>
      </div>


      <!-- PAGE 17: Guarantee Letter 1 (रुग्णालय) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div class="title-lg underline">हमीपत्र</div>
            
            <div style="margin: 6px 0 8px 0; font-size: 15px; line-height: 1.35;">
              प्रति,<br>
              मा. सहाय्यक धर्मादाय आयुक्त,<br>
              जालना उपविभाग जालना.<br><br>
              <b>विषय :- धर्मादाय रुग्णालय/धर्मादाय वैद्यकीय केंद्राची माहिती अवगत करणे बाबत.</b><br>
              <b>संस्थेचे नाव :- " ${trustName} "</b>
            </div>

            <div style="margin-bottom: 6px; font-size: 14.5px; line-height: 1.38;">
              <p class="indent" style="text-align: justify; margin-bottom: 3px;">
                आम्ही खाली स्वाक्षरी करणार " <b>${trustName}</b> " ${address}. या संस्थेच्या पहिल्या कार्यकारी मंडळाचे सभासद व विश्वस्त या द्वारे हमीपत्र लिहून देतो की, भविष्यात आमच्या या सार्वजनिक विश्वस्त न्यासाच्या वतीने कोणतेही धर्मादाय रुग्णालय किंवा धर्मादाय वैद्यकीय रुग्णालय केंद्र किंवा दवाखाना सुरू करण्यात आला तर त्या संबंधीची सविस्तर माहिती आम्ही त्वरित मा. सहाय्यक धर्मादाय आयुक्त जालना विभाग जालना यांच्या कार्यालयास स्वतःहून अवगत करू.
              </p>
              <p class="indent" style="text-align: justify;">
                सदर हमीपत्राचे उल्लंघन झाल्यास आम्ही कायद्यानुसार होणाऱ्या कारवाईस वैयक्तिक व सामूहिकरीत्या जबाबदार राहू.
              </p>
            </div>

            ${renderCommitteeSignatures(true)}

            <div style="display: flex; justify-content: space-between; margin-top: auto; padding-top: 10px; font-size: 14.5px;">
              <div>
                स्थळ : ${place}<br>
                दिनांक : ${date}
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- PAGE 18: Guarantee Letter 2 (गैरवापर) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div class="title-lg underline">हमीपत्र</div>

            <div style="margin: 10px 0 10px 0; font-size: 15px; line-height: 1.4;">
              प्रति,<br>
              मा. सहाय्यक धर्मादाय आयुक्त,<br>
              जालना उपविभाग जालना.<br><br>
              <b>विषय :- नोंदणी प्रमाणपत्राचा गैरवापर अथवा बेकायदेशीर कृत्यासाठी वापर न करण्याबाबत.</b><br>
              <b>संस्थेचे नाव :- " ${trustName} "</b>
            </div>

            <div style="margin-bottom: 15px; font-size: 15px; line-height: 1.5;">
              <p class="indent" style="text-align: justify; margin-bottom: 8px;">
                मी, खाली स्वाक्षरी करणार <b>${presidentName}</b>, वय <b>${presidentAge}</b> वर्षे, राहणार <b>${address}</b>, या संस्थेचा अध्यक्ष या नात्याने सत्य प्रतिज्ञेवर हमीपत्र लिहून देतो की, आमच्या संस्थेची नोंदणी झाल्यानंतर मिळणाऱ्या नोंदणी प्रमाणपत्राचा गैरवापर करणार नाही. तसेच संस्थेच्या नावावर कोणत्याही प्रकारची चिठ्ठी/लकी ड्रॉ काढणे, भिशी चालविणे, हुंडा घेणे किंवा इतर कोणतेही बेकायदेशीर कृत्ये अथवा समाजविघातक कृत्ये संस्थेच्या माध्यमातून केली जाणार नाहीत.
              </p>
              <p class="indent" style="text-align: justify;">
                संस्थेचा संपूर्ण कारभार केवळ तिच्या उद्दिष्टांच्या आणि कायद्याच्या चौकटीत राहूनच चालविला जाईल. या हमीपत्राचे उल्लंघन झाल्यास त्याची संपूर्ण कायदेशीर जबाबदारी माझी वैयक्तिक व संस्थेच्या सर्व पदाधिकाऱ्यांची राहील.
              </p>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; padding-bottom: 15px; font-size: 15px;">
              <div>
                स्थळ : ${place}<br>
                दिनांक : ${date}
              </div>
              <div style="text-align: center; width: 280px;">
                <b>हमीदार / अध्यक्ष</b><br><br><br><br>
                <b>${presidentName}</b>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- PAGE 19: Application for Public Trust Registration (अनुसूची - २, पान १) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div style="text-align: center; font-weight: bold; font-size: 17.5px; line-height: 1.25; margin-bottom: 2px; letter-spacing: 0;">
              सार्वजनिक विश्वस्त व्यवस्थेच्या नोंदणीसाठीचा अर्ज
            </div>
            <div style="text-align: center; font-weight: bold; font-size: 15.5px; text-decoration: underline; margin-bottom: 2px;">
              अनुसूची - २
            </div>
            <div style="text-align: center; font-size: 13px; margin-bottom: 8px;">
              (नियम ६ पहा)
            </div>
            
            <div style="line-height: 1.35; font-size: 14.5px; margin-bottom: 5px;">
              <b>मा. सहाय्यक धर्मादाय आयुक्त,</b><br>
              जालना विभाग जालना.
            </div>
            
            <div style="line-height: 1.35; font-size: 14.5px; margin-bottom: 5px;">
              <b>“ ${trustName} ”</b> &nbsp;&nbsp;&nbsp;&nbsp; ${address}<br>
              <b>या सार्वजनिक विश्वस्त व्यवस्थेसंबंधी.</b>
            </div>
            
            <div style="text-indent: 25px; text-align: justify; line-height: 1.38; font-size: 14px; margin-bottom: 6px;">
              मी <b>${presidentName}</b> या द्वारे उपरिनिर्दिष्ट सार्वजनिक विश्वस्तव्यवस्थेचा विश्वस्त सदरहू सार्वजनिक विश्वस्त व्यवस्थेच्या नोंदणीसाठी मुंबई सार्वजनिक विश्वस्त अधिनियम 1950 च्या कलम 18 अन्वये अर्ज सादर करीत आहे.
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.32;">
              <tr>
                <td style="width: 25px; font-weight: bold;">२)</td>
                <td colspan="2" style="font-weight: bold;">मी पुढील आवश्यक तपशील सादर करीत आहे :-</td>
              </tr>
              <tr>
                <td style="width: 25px; padding-top: 2px;">(अ.१)</td>
                <td style="width: 290px; padding-top: 2px; padding-right: 8px;">
                  सार्वजनिक विश्वस्त व्यवस्था ज्या नावाने ओळखली जावी ते नाव व पूर्ण पत्ता :-
                </td>
                <td style="padding-top: 2px; font-weight: bold; line-height: 1.25;">
                  “ ${trustName} ”<br>
                  <span style="font-weight: normal; font-size: 13px;">${address}</span>
                </td>
              </tr>
              <tr>
                <td style="width: 25px; padding-top: 4px;">१)</td>
                <td colspan="2" style="padding-top: 4px; font-weight: bold;">
                  विश्वस्त व व्यवस्थापक यांची नावे, पत्ता व पद :-
                </td>
              </tr>
            </table>
            
            <!-- Trustees List Table styled cleanly like Page 3 -->
            <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: ${memberCount > 10 ? '12px' : memberCount > 7 ? '13px' : '14px'}; line-height: 1.25; border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; font-family: var(--font-primary);">
              <thead>
                <tr style="border-bottom: 1.5px solid #000; background-color: #fcfcfc;">
                  <th style="padding: 4px 5px; text-align: center; font-weight: bold; width: 45px; white-space: nowrap;">अ.क्र.</th>
                  <th style="padding: 4px 5px; text-align: left; font-weight: bold; width: 38%; white-space: nowrap;">सभासदाचे संपूर्ण नांव</th>
                  <th style="padding: 4px 5px; text-align: left; font-weight: bold; width: 40%;">पत्ता</th>
                  <th style="padding: 4px 5px; text-align: left; font-weight: bold; width: 16%; white-space: nowrap;">पद</th>
                </tr>
              </thead>
              <tbody>
                ${committeeMembers.map((m, i) => `
                  <tr style="border-bottom: ${i === memberCount - 1 ? 'none' : '1px solid #e0e0e0'};">
                    <td style="padding: ${memberCount > 10 ? '3px 4px' : '4px 5px'}; text-align: center; vertical-align: top; font-weight: bold;">${i + 1}.</td>
                    <td style="padding: ${memberCount > 10 ? '3px 4px' : '4px 5px'}; vertical-align: top; font-weight: bold;">${m.name || "_____"}</td>
                    <td style="padding: ${memberCount > 10 ? '3px 4px' : '4px 5px'}; vertical-align: top; font-size: ${memberCount > 10 ? '11.5px' : '12.5px'}; line-height: 1.2;">${m.address || "_____"}</td>
                    <td style="padding: ${memberCount > 10 ? '3px 4px' : '4px 5px'}; vertical-align: top; font-weight: 500;">${m.designation || "_____"}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: auto; padding-top: 8px; font-size: 14px; line-height: 1.35;">
              <tr>
                <td style="width: 25px; font-weight: bold; vertical-align: top;">२)</td>
                <td style="width: 270px; vertical-align: top; padding-right: 8px;">
                  विश्वस्तांच्या किंवा व्यवस्थापकांच्या जागी दुसरा विश्वस्त किंवा व्यवस्थापक घेण्याची रीत :-
                </td>
                <td style="vertical-align: top; text-align: justify;">
                  कार्यकारी मंडळाचा कार्यकाल पाच वर्षांचा राहील निवडणूक दर पाच वर्षांनी सर्वसाधारण सभेत गुप्त मतदान पद्धतीने घेण्यात येईल
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>


      <!-- PAGE 20: Application for Public Trust Registration (अनुसूची - २, पान २) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div style="text-align: center; margin-bottom: 6px; font-size: 14px;">
              अनुसूची - २ (चालू - पान २)
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 14.5px; line-height: 1.38;">
              <!-- Row 3 -->
              <tr style="vertical-align: top;">
                <td style="width: 28px; font-weight: bold; padding: 4px 0;">(३)</td>
                <td style="width: 280px; font-weight: bold; padding: 4px 10px 4px 0;">विश्वस्त व्यवस्थेचा हेतू</td>
                <td style="width: 15px; text-align: center; padding: 4px 0;">:-</td>
                <td style="padding: 4px 0;">परिशिष्ट ( ब ) प्रमाणे</td>
              </tr>
              <!-- Row 4 -->
              <tr style="vertical-align: top;">
                <td style="width: 28px; font-weight: bold; padding: 4px 0;">(४)</td>
                <td style="font-weight: bold; padding: 4px 10px 4px 0;">
                  (अ) सार्वजनिक विश्वस्त व्यवस्था निर्माण करणाऱ्या दस्तऐवजाचा तपशील (नक्कल जोडा)<br><br>
                  (ब) सार्वजनिक विश्वस्त व्यवस्था उगम किंवा निर्मिती संबंधीचा दस्तऐवजाशिवाय इतर तपशील (नक्कल जोडा)
                </td>
                <td style="text-align: center; padding: 4px 0;">
                  :-<br><br><br>
                  :-
                </td>
                <td style="padding: 4px 0;">
                  मेमोरंडम ऑफ असो. ची प्रत.<br><br><br>
                  -||-
                </td>
              </tr>
              <!-- Row 5 -->
              <tr style="vertical-align: top;">
                <td style="width: 28px; font-weight: bold; padding: 4px 0;">(५)</td>
                <td style="font-weight: bold; padding: 4px 10px 4px 0;">
                  सार्वजनिक विश्वस्त व्यवस्थेसंबंधी योजना कोणतीही असल्यास तिचा तपशील (नक्कल जोडा)
                </td>
                <td style="text-align: center; padding: 4px 0;">:-</td>
                <td style="padding: 4px 0;">संस्थेची नियम व नियमावलीची प्रत</td>
              </tr>
              <!-- Row 6 -->
              <tr style="vertical-align: top;">
                <td style="width: 28px; font-weight: bold; padding: 4px 0;">(६)</td>
                <td style="font-weight: bold; padding: 4px 10px 4px 0; text-align: justify; line-height: 1.28; font-size: 13.5px;">
                  जंगम मालमत्ता अशा मालमत्तेच्या प्रत्येक वर्गाच्या अंदाजे किंमतीसह. (टिप:- प्रत्येक वस्तूचे वर्णन ठरविण्याऐवजी अशा मालमत्ताकतींच्या वर्गांचे स्थूल वर्णन करून नोंदी भराव्यात, जसे फर्निचर, पुस्तके वगैरे, रोकड रक्कम विश्वस्तव्यवस्थेच्या, भांडवलाचा भाग असेल तरच फक्त रोकड रकमेसंबंधी नोंद करावी, रोकडच्या बाबतीत प्रत्येक तारण पत्र, कर्जरोखे (Securities) संचय (Stock) शेअर, ऋणपत्र (Debentures) यांचा त्यावर जो क्रमांक असेल तो धरून तपशील द्या )
                </td>
                <td style="text-align: center; padding: 4px 0;">:-</td>
                <td style="padding: 4px 0; line-height: 1.45;">
                  1. &nbsp;&nbsp; अर्जदार जवळ रुपये 707/- जमा.<br>
                  2.<br>
                  3.
                </td>
              </tr>
              <!-- Row 7 -->
              <tr style="vertical-align: top;">
                <td style="width: 28px; font-weight: bold; padding: 4px 0;">(७)</td>
                <td style="font-weight: bold; padding: 4px 10px 4px 0; line-height: 1.28; font-size: 13.5px;">
                  (अ) जेथे स्थावर मालमत्ता असेल ते गाव किंवा नगर भूमापन महानगर पालिका किंवा भूमापन क्रमांक क्षेत्र आकार किंवा जुनी दर्शविणारी अथवा मालमत्तेची सविस्तर माहिती ज्या अधिका-याने ती धारण केली असेल त्या धारण अधिका-याचे वर्णन<br><br>
                  (ब) प्रत्येक स्थावर मालमत्तेची अंदाजे किंमत
                </td>
                <td style="text-align: center; padding: 4px 0;">
                  :-<br><br><br><br>
                  :-
                </td>
                <td style="padding: 4px 0; line-height: 1.45;">
                  संस्था नवीन असल्यामुळे सध्या काही नाही<br>
                  1.<br>
                  2.<br><br>
                  संस्था नवीन असल्यामुळे सध्या काही नाही<br>
                  1.<br>
                  2.
                </td>
              </tr>
              <!-- Row 8 -->
              <tr style="vertical-align: top;">
                <td style="width: 28px; font-weight: bold; padding: 4px 0;">(८)</td>
                <td style="font-weight: bold; padding: 4px 10px 4px 0;">सार्वजनिक विश्वस्त व्यवस्थेच्या उत्पन्नाची साधने</td>
                <td style="text-align: center; padding: 4px 0;">:-</td>
                <td style="padding: 4px 0;">
                  देणगी, वर्गणी, सभासद फीस, शासकीय व निमशासकीय अनुदान इत्यादी.
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>


      <!-- PAGE 21: Application for Public Trust Registration (अनुसूची - २, पान ३) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div style="text-align: center; margin-bottom: 5px; font-size: 14px;">
              अनुसूची - २ (चालू - पान ३)
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.34; margin-bottom: 6px;">
              <!-- Row 9 -->
              <tr style="vertical-align: top;">
                <td style="width: 28px; font-weight: bold; padding: 2px 0;">(९)</td>
                <td style="width: 280px; font-weight: bold; padding: 2px 10px 2px 0;">सरासरी ढोबळ वार्षिक उत्पन्न</td>
                <td style="width: 15px; text-align: center; padding: 2px 0;">:-</td>
                <td style="padding: 2px 0;">संस्था नवीन असल्यामुळे सध्या काही नाही.</td>
              </tr>
              <!-- Row 10 -->
              <tr style="vertical-align: top;">
                <td style="width: 28px; font-weight: bold; padding: 2px 0;">(१०)</td>
                <td style="font-weight: bold; padding: 2px 10px 2px 0;">सरासरी वार्षिक खर्च</td>
                <td style="text-align: center; padding: 2px 0;">:-</td>
                <td style="padding: 2px 0;">-||-</td>
              </tr>
              <!-- Row 11 -->
              <tr style="vertical-align: top;">
                <td style="width: 28px; font-weight: bold; padding: 2px 0;">(११)</td>
                <td style="font-weight: bold; padding: 2px 10px 2px 0;">
                  सरासरी वार्षिक खर्चाची रक्कम<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;अ) &nbsp;&nbsp; विश्वस्त व व्यवस्थापक यांच्या पगारावर खर्च<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;ब) &nbsp;&nbsp; आस्थापना व नोकर वर्ग यांवर खर्च<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;क) &nbsp;&nbsp; धार्मिक हेतुप्रीत्यर्थ होणारा खर्च<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;ड) &nbsp;&nbsp; किरकोळ हेतुप्रीत्यर्थ होणारा खर्च
                </td>
                <td style="text-align: center; padding: 2px 0;">
                  :-<br>:-<br>:-<br>:-<br>:-
                </td>
                <td style="padding: 2px 0;">
                  -||-<br>-||-<br>-||-<br>-||-<br>-||-
                </td>
              </tr>
              <!-- Row 12 -->
              <tr style="vertical-align: top;">
                <td style="width: 28px; font-weight: bold; padding: 2px 0;">(१२)</td>
                <td style="font-weight: bold; padding: 2px 10px 2px 0;">
                  विश्वस्त व्यवस्थेच्या मालमत्तेवरील भाराचा तपशील
                </td>
                <td style="text-align: center; padding: 2px 0;">:-</td>
                <td style="padding: 2px 0;">-||-</td>
              </tr>
              <!-- Row 13 -->
              <tr style="vertical-align: top;">
                <td style="width: 28px; font-weight: bold; padding: 2px 0;">(१३)</td>
                <td style="font-weight: bold; padding: 2px 10px 2px 0;">
                  मालमत्ते संबंधातील मालकी हक्काच्या दस्तऐवजाचा तपशील व ते ताब्यात असणाऱ्यांची नावे.
                </td>
                <td style="text-align: center; padding: 2px 0;">:-</td>
                <td style="padding: 2px 0;">संस्थेच्या अध्यक्ष/सचिवाकडे राहील.</td>
              </tr>
              <!-- Row 14 -->
              <tr style="vertical-align: top;">
                <td style="width: 28px; font-weight: bold; padding: 2px 0;">(१४)</td>
                <td style="font-weight: bold; padding: 2px 10px 2px 0;">शेरे कोणतेही असल्यास</td>
                <td style="text-align: center; padding: 2px 0;">:-</td>
                <td style="padding: 2px 0;">हिशोबाचे वर्ष 1 एप्रिल ते 31 मार्च असे राहील.</td>
              </tr>
            </table>

            <div style="line-height: 1.35; margin-bottom: 5px; font-size: 14.5px;">
              <b>३.&nbsp;&nbsp;&nbsp;&nbsp; फी दाखल रु. ३/- (अक्षरी तीन रुपये फक्त) सोबत पाठवित आहोत.</b><br>
              <b>४.&nbsp;&nbsp;&nbsp;&nbsp; सार्वजनिक विश्वस्त व्यवस्थेसंबंधी विश्वस्तांशी किंवा व्यवस्थापक यांच्याशी करावयाचा कोणताही पत्र व्यवहार पुढील पत्त्यावर करावा.</b>
            </div>

            <div style="line-height: 1.3; margin-left: 15px; margin-bottom: 8px; font-size: 14.5px;">
              संस्थेचे नाव &nbsp;&nbsp;&nbsp;:- &nbsp;&nbsp;&nbsp; <b>" ${trustName} "</b><br>
              पत्ता &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:- &nbsp;&nbsp;&nbsp; <b>${address}</b>
            </div>

            <table style="width: 100%; border: none; margin-bottom: 6px; font-size: 14.5px;">
              <tr>
                <td style="width: 50%;">
                  <b>तारीख :- ${date}</b>
                </td>
                <td style="text-align: right; font-weight: bold; padding-right: 15px;">
                  अर्जदाराची सही
                </td>
              </tr>
            </table>

            <div style="border-top: 1px dashed #000; margin: 4px 0;"></div>

            <div style="text-indent: 25px; text-align: justify; line-height: 1.3; margin-bottom: 5px; font-size: 13.5px;">
              मी वर नामनिर्देशित <b>${presidentName}</b>, <b>${address}</b> येथील रहिवासी असून, प्रतिज्ञा करतो व सांगतो की, वरील अर्जात नमूद केलेली माहिती माझ्या पूर्ण माहिती प्रमाणे व विश्वासा प्रमाणे खरी आहे.
            </div>
            
            <div style="font-weight: bold; margin-bottom: 6px; text-indent: 25px; font-size: 13.5px;">
              उपरिनिर्दिष्ट जालना येथे गांभीर्यपूर्वक प्रतिज्ञा केली.
            </div>

            <div style="margin-top: auto; padding-top: 4px;">
              <table style="width: 100%; border: none; margin-bottom: 4px; font-size: 14.5px;">
                <tr>
                  <td style="width: 50%;">
                    <b>तारीख :- ${date}</b>
                  </td>
                  <td style="text-align: right; font-weight: bold; padding-right: 15px;">
                    अर्जदाराची सही
                  </td>
                </tr>
              </table>

              <div style="text-align: center; font-weight: bold; font-size: 14.5px;">
                माझ्या समक्ष
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- PAGE 22: Consent Letter for Trust (संमतीपत्राचा नमुना) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div class="title-lg text-center underline" style="margin-bottom: 8px;">संमतीपत्राचा नमुना</div>
            
            <div style="margin-bottom: 6px; line-height: 1.3; font-size: 15px;">
              <b>प्रति,</b><br>
              <b>मा. सहाय्यक धर्मादाय आयुक्त,</b><br>
              <b>जालना विभाग जालना.</b>
            </div>

            <div style="margin-bottom: 6px; font-size: 14.5px;">
              <b>महोदय,</b><br>
              <p style="text-indent: 25px; text-align: justify; line-height: 1.4; margin: 2px 0;">
                <b>${presidentName}</b>, यांनी विश्वस्त व्यवस्था/संस्था/मंडळ <b>" ${trustName} "</b> <b>${address}</b> नोंदविण्यासाठी मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० अन्वये दि. ${date} रोजी अर्ज सादर केला आहे. त्या अर्जातील सर्व माहिती खरी आहे. आम्हास त्या संबंधी जास्त सांगावयाचे नाही सदरहू अर्जाची सुनावणीची स्वतंत्र नोटीस आम्हास पाठवण्याची आवश्यकता नाही. नोंदणी प्रमाणपत्र अर्जदाराच्या नावे देण्यास आमची कोणतीही हरकत नाही.
              </p>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 15px; font-weight: bold; margin-bottom: 4px;">
              <div>कळावे,</div>
              <div style="padding-right: 20px;">आपले,</div>
            </div>

            <!-- Committee Members Table for Sammatipatra -->
            <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: ${memberCount > 10 ? '12px' : memberCount > 7 ? '13px' : '14px'}; border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; font-family: var(--font-primary);">
              <thead>
                <tr style="border-bottom: 1.5px solid #000; background-color: #fcfcfc;">
                  <th style="padding: 4px 5px; text-align: center; font-weight: bold; width: 45px; white-space: nowrap;">अ.क्र.</th>
                  <th style="padding: 4px 5px; text-align: left; font-weight: bold; width: 38%; white-space: nowrap;">सभासदाचे संपूर्ण नांव</th>
                  <th style="padding: 4px 5px; text-align: left; font-weight: bold; width: 40%;">पत्ता</th>
                  <th style="padding: 4px 5px; text-align: center; font-weight: bold; width: 16%; white-space: nowrap;">सही</th>
                </tr>
              </thead>
              <tbody>
                ${committeeMembers.map((m, i) => `
                  <tr style="border-bottom: ${i === memberCount - 1 ? 'none' : '1px solid #e0e0e0'};">
                    <td style="padding: ${memberCount > 10 ? '3px 4px' : '4px 5px'}; text-align: center; vertical-align: top; font-weight: bold;">${i + 1}.</td>
                    <td style="padding: ${memberCount > 10 ? '3px 4px' : '4px 5px'}; vertical-align: top; font-weight: bold;">${m.name || "_____"}</td>
                    <td style="padding: ${memberCount > 10 ? '3px 4px' : '4px 5px'}; vertical-align: top; font-size: ${memberCount > 10 ? '11.5px' : '12.5px'}; line-height: 1.2;">${m.address || "_____"}</td>
                    <td style="padding: ${memberCount > 10 ? '3px 4px' : '4px 5px'}; vertical-align: middle; text-align: center;">
                      <span style="border-bottom: 1px solid #000; width: 75px; display: inline-block;">&nbsp;</span>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>

            <div style="margin-top: auto; padding-top: 10px;">
              <table style="width: 100%; border: none; font-size: 14.5px;">
                <tr>
                  <td style="width: 45%;"></td>
                  <td style="text-align: right; font-weight: bold; padding-right: 20px; line-height: 1.35;">
                    वरील सर्व सह्या मी ओळखतो<br><br>
                    (अर्जदाराची सही.)<br><br>
                    <b>${presidentName}</b>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>


      <!-- PAGE 23: Affidavit Page 1 (प्रतिज्ञापत्र - पान १) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div class="title-lg text-center underline" style="margin-bottom: 12px;">प्रतिज्ञापत्र</div>
            
            <div style="margin: 10px 0 15px 0; line-height: 1.55; font-size: 15.5px;">
              मी खाली सही करणार <b>${presidentName}</b>, वय <b>${presidentAge}</b> वर्षे, व्यवसाय - <b>${presidentOccupation}</b>, राहणार <b>${address}</b>.<br>
              सत्य प्रतिज्ञेवर खालीलप्रमाणे लिहून देतो की,<br><br>
              १) मी <b>" ${trustName} "</b> ${address}. या संस्थेचा अध्यक्ष/विश्वस्त असून संस्था नोंदणी अधिनियम १८६० व मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० अन्वये सदर संस्था नोंदणी करण्याकरिता सहाय्यक संस्था निबंधक तथा सहाय्यक धर्मादाय आयुक्त जालना विभाग जालना यांच्या कार्यालयात प्रस्ताव सादर केला आहे. प्रस्तावासोबत जोडलेले सर्व पुरावे, नियम व नियमावली तसेच विवरणातील मजकूर खरा व सत्य आहे. सदर संस्था ही धर्मादाय व शैक्षणिक स्वरूपाच्या उद्देशाकरिता स्थापन केली असून, तिचे ध्येय व उद्देश संस्था नोंदणी अधिनियम १८६० च्या कलम २० ला अनुसरून आहेत.<br><br>
              २) या संस्थेच्या विधानपत्रावर व नियमावलीवर सह्या करणाऱ्या सर्व सभासदांना मी चांगल्या प्रकारे ओळखतो व त्यांनी माझ्या समक्ष स्वाक्षऱ्या केल्या आहेत.<br><br>
              ३) आज तारखेपर्यंत नोंदणी प्रकरणातील मजकुरामध्ये कोणताही बदल झालेला नाही.<br>
            </div>

            <div style="margin-top: auto; padding-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 15px;">
                <div>स्थळ : ${place}<br>दिनांक : ${date}</div>
                <div style="text-align: center; width: 280px;">
                  <b>प्रतिज्ञाक</b><br><br><br>
                  <b>${presidentName}</b>
                </div>
              </div>

              <div style="text-align: center; margin-top: 20px; font-weight: bold; font-size: 15px;">
                (.. पान २ वर चालू ..)
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- PAGE 24: Affidavit Page 2 (प्रतिज्ञापत्र - पान २) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div class="title-lg text-center underline" style="margin-bottom: 12px;">प्रतिज्ञापत्र (पान २)</div>

            <div style="margin: 10px 0 15px 0; line-height: 1.55; font-size: 15.5px;">
              ४) वरील नावाची अथवा या नामाशी मिळतीजुळती असणारी कोणतीही संस्था/मंडळ आमच्या गावात व परिसरात सध्या अस्तित्वात नाही व नोंदणीकृत नाही.<br><br>
              ५) आज तारखेपर्यंत संस्थेच्या नावावर कोणत्याही प्रकारची स्थावर मालमत्ता नाही. जंगम मालमत्ता म्हणून संस्थेकडे फक्त रोख रक्कम रुपये ७०७/- (अक्षरी सातशे सात रुपये फक्त) जमा असून ती अध्यक्ष/सचिव यांच्या ताब्यात सुरक्षित आहे.<br><br>
              ६) संस्थेच्या कार्यालयाचा पत्ता <b>" ${trustName} "</b> ${address} हा असून सदर जागा ही भाडेतत्वावर घेण्यात आली आहे. त्यापुष्ट्यर्थ घरमालकाचे नाहरकत प्रमाणपत्र, टॅक्स पावती, पी.आर.कार्ड, ८-अ चा उतारा इत्यादी कागदपत्रे या प्रस्तावासोबत जोडली आहेत.<br><br>
              सदर प्रस्तावाबाबत किंवा पत्त्याबाबत भविष्यात काही वाद निर्माण झाल्यास अथवा तक्रार आल्यास त्याची संपूर्ण जबाबदारी वैयक्तिक व सामूहिकरीत्या माझी व कार्यकारी मंडळाची राहील. कार्यालयाच्या पत्त्यात काही बदल झाल्यास तो नियमानुसार आपल्या कार्यालयाला अवगत करण्यात येईल.<br><br>
              हे प्रतिज्ञापत्र मी स्वेच्छेने व राजीखुशीने लिहून दिले असून ते सत्य व बरोबर आहे.
            </div>

            <div style="margin-top: auto; padding-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 15px; font-size: 15px;">
                <div>स्थळ : ${place}<br>दिनांक : ${date}</div>
                <div style="text-align: center; width: 280px;">
                  <b>प्रतिज्ञाक</b><br><br><br>
                  <b>${presidentName}</b>
                </div>
              </div>

              <div style="border-top: 1px solid #000; margin: 12px 0;"></div>

              <div style="margin-left: 45%; font-size: 14px; line-height: 1.35;">
                माझ्या समक्ष प्रतिज्ञाकाची सही घेतली व ओळख पटवली.<br><br><br>
                <b>विशेष कार्यकारी दंडाधिकारी / नोटरी संपूर्ण नांव व शिक्का.</b>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- PAGE 25: Landlord NOC (नाहरकत प्रमाणपत्र) -->
      <div class="page">
        <div class="page-inner">
          <div class="page-content">
            <div style="border: 2px solid #000; padding: 6px 20px; width: 280px; margin: 15px auto; font-size: 20px; font-weight: bold; text-align: center;">
              नाहरकत प्रमाणपत्र
            </div>

            <div style="margin: 30px 0; line-height: 2.1; font-size: 17px;">
              मी, <b>${noc.name || "_________________"}</b> वय <b>${noc.age || "____"}</b> वर्षे<br>
              रा. <b>${noc.address || address}</b><br>
              घर नंबर / म्युन्शिपीपल नंबर <b>${noc.propertyNumber || "_________________"}</b> असा असून, यातील एक खोली<br>
              संस्थेचे नांव <b>" ${trustName} "</b><br>
              या संस्थेस संस्थेच्या कार्यालया करीता वापरण्यास दिली आहे.<br>
              करीता नाहरकत प्रमाणपत्र देत आहे.<br>
            </div>

            <div style="margin-top: auto; padding-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 16px;">
                <div>स्थळ : ${place}<br>दिनांक : ${date}</div>
                <div style="text-align: center; width: 280px;">
                  सही (घरमालक)<br><br><br><br>
                  <b>${noc.name || "_________________"}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </body>
    </html>
  `;
};
