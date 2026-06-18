module.exports = (report) => {
    const details = report.nondaniDetails || {};
    const trustName = report.trustName || "_________________";
    const addressObj = report.trustDetails?.address || {};
    const addressParts = [];
    if (addressObj.buildingName) addressParts.push(addressObj.buildingName);
    if (addressObj.streetName) addressParts.push(addressObj.streetName);
    if (addressObj.village) addressParts.push(`मु. ${addressObj.village}`);
    if (addressObj.taluka) addressParts.push(`ता. ${addressObj.taluka}`);
    if (addressObj.district) addressParts.push(`जि. ${addressObj.district}`);
    const address = addressParts.length > 0 ? addressParts.join(', ') : "_________________";
    
    const presidentName = report.presidentName || "_________________";
    const vicePresidentName = report.vicePresidentName || "_________________";
    const secretaryName = report.secretaryName || "_________________";
    const jointSecretaryName = report.jointSecretaryName || "_________________";
    const treasurerName = report.treasurerName || "_________________";
    const date = report.date ? new Date(report.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
    const place = report.place || "_________________";
    const financialYear = report.financialYear || "2025-26";
    const registrationNo = report.registrationNo || "_________________";
    
    const committeeMembers = report.committeeMembers && report.committeeMembers.length > 0 
        ? report.committeeMembers 
        : Array(7).fill({ name: '_________________', address: '_________________', designation: '_________________', age: '____', occupation: '_________________', nationality: 'भारतीय' });

    const presidentDetails = committeeMembers.find(m => m.designation?.includes('अध्यक्ष') || m.name === presidentName) || {};
    const presidentAge = presidentDetails.age || "____";
    const presidentOccupation = presidentDetails.occupation || "________";

    const objectives = report.objectives && report.objectives.length > 0 
        ? report.objectives 
        : [
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

    const noc = report.landlordNOC || { name: '_________________', age: '____', address: '_________________', propertyNumber: '_________________' };

    const checklistHtml = (report.checklist || []).map((item, i) => `
        <tr>
            <td style="text-align: center; border: 1px solid #000; padding: 8px;">${i + 1})</td>
            <td style="border: 1px solid #000; padding: 8px;">${item.documentName}</td>
            <td style="text-align: center; border: 1px solid #000; padding: 8px;">${item.isSubmitted ? 'Yes' : 'No'}</td>
        </tr>
    `).join('');

    const renderCommitteeTable = () => `
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; line-height: 1.4; border-top: 1px solid #000; border-bottom: 1px solid #000; font-family: 'Tiro Devanagari Marathi', serif;">
            <thead>
                <tr style="border-bottom: 1px solid #000;">
                    <th style="padding: 6px 4px; text-align: left; font-weight: bold;">अ.क्र. सभासदाचे संपूर्ण नांव</th>
                    <th style="padding: 6px 4px; text-align: left; font-weight: bold; width: 30%;">पत्ता</th>
                    <th style="padding: 6px 4px; text-align: left; font-weight: bold;">पद</th>
                    <th style="padding: 6px 4px; text-align: center; font-weight: bold;">वय</th>
                    <th style="padding: 6px 4px; text-align: left; font-weight: bold;">व्यवसाय</th>
                    <th style="padding: 6px 4px; text-align: left; font-weight: bold;">राष्ट्रीयत्व</th>
                </tr>
            </thead>
            <tbody>
                ${committeeMembers.map((m, i) => `
                <tr>
                    <td style="padding: 8px 4px; vertical-align: top;">
                        <span style="font-weight: bold; display: inline-block; width: 15px;">${i + 1}.</span> ${m.name || '_____'}
                    </td>
                    <td style="padding: 8px 4px; vertical-align: top;">${m.address || '_____'}</td>
                    <td style="padding: 8px 4px; vertical-align: top;">${m.designation || '_____'}</td>
                    <td style="padding: 8px 4px; vertical-align: top; text-align: center;">${m.age || '_____'}</td>
                    <td style="padding: 8px 4px; vertical-align: top;">${m.occupation || '_____'}</td>
                    <td style="padding: 8px 4px; vertical-align: top;">${m.nationality || 'भारतीय'}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    const renderCommitteeSignatures = () => `
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px;">
            <thead>
                <tr>
                    <th style="border: 1px solid #000; padding: 8px; width: 60px;">अ.क्र.</th>
                    <th style="border: 1px solid #000; padding: 8px;">सभासदाचे संपूर्ण नांव</th>
                    <th style="border: 1px solid #000; padding: 8px;">पत्ता</th>
                    <th style="border: 1px solid #000; padding: 8px; width: 120px;">सही</th>
                </tr>
            </thead>
            <tbody>
                ${committeeMembers.map((m, i) => `
                <tr>
                    <td style="border: 1px solid #000; padding: 8px; text-align: center;">${i + 1}</td>
                    <td style="border: 1px solid #000; padding: 8px;">${m.name || '_____'}</td>
                    <td style="border: 1px solid #000; padding: 8px;">${m.address || '_____'}</td>
                    <td style="border: 1px solid #000; padding: 8px; height: 35px;"></td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    return `
    <!DOCTYPE html>
    <html lang="mr">
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Marathi:wght@400;700&display=swap');
            body {
                font-family: 'Tiro Devanagari Marathi', serif;
                font-size: 14px;
                line-height: 1.5;
                margin: 0;
                padding: 30px;
                color: #000;
            }
            .page-break { page-break-after: always; }
            .header-box {
                border: 2px solid #000;
                padding: 10px;
                text-align: center;
                font-weight: bold;
                width: 300px;
                margin: 0 auto 30px auto;
                font-size: 16px;
            }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .mb-20 { margin-bottom: 20px; }
            .mt-20 { margin-top: 20px; }
            .flex-between { display: flex; justify-content: space-between; }
            .indent { text-indent: 40px; }
            .title-lg { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 20px; }
            .title-md { font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 15px; }
            .title-sm { font-size: 14px; font-weight: bold; text-decoration: underline; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <!-- PAGE 1: Application -->
        <div style="text-align: center; margin-bottom: 10px;">
            <div style="border: 1px solid #000; padding: 3px 15px; display: inline-block; font-weight: bold; font-size: 16px; line-height: 1;">
                परिशिष्ट " अ "
            </div>
            <div style="font-size: 11px; margin-top: 2px;">(Society Application)</div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; font-size: 13px; line-height: 1.4;">
            <div>
                प्रति,<br>
                <b>मा. सहाय्यक संस्था निबंधक,</b><br>
                जालना विभाग जालना.
            </div>
            <div style="font-weight: bold; margin-top: 15px;">
                दि. &nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;&nbsp; /2026
            </div>
        </div>

        <table style="width: 100%; border: none; margin-bottom: 10px; border-collapse: collapse; font-size: 13.5px; line-height: 1.4;">
            <tr>
                <td style="width: 90px; font-weight: bold; vertical-align: top; padding: 2px 0;">विषय</td>
                <td style="width: 20px; font-weight: bold; vertical-align: top; padding: 2px 0; text-align: center;">:-</td>
                <td style="font-weight: bold; text-decoration: underline; vertical-align: top; padding: 2px 0;">संस्था नोंदणी अधिनियम 1860 अन्वये नोंदणी बाबत....</td>
            </tr>
            <tr>
                <td style="width: 90px; font-weight: bold; vertical-align: top; padding: 8px 0 2px 0;">संस्थेचे नांव</td>
                <td style="width: 20px; font-weight: bold; vertical-align: top; padding: 8px 0 2px 0; text-align: center;">:-</td>
                <td style="font-weight: bold; font-size: 15px; vertical-align: top; padding: 8px 0 2px 0; line-height: 1.3;">
                    “ ${trustName} ”<br>
                    <div style="font-size: 13px; font-weight: normal; margin-top: 3px; padding-left: 5px;">${address}</div>
                </td>
            </tr>
        </table>

        <div style="margin-bottom: 10px; font-size: 13.5px; line-height: 1.4;">
            महोदय,<br>
            <p style="text-indent: 30px; margin: 3px 0 0 0; text-align: justify;">
                निवेदन सादर करण्यात येते की, वरील विषयात नमूद केलेल्या संस्थेची नोंदणी अधिनियम 1860 अन्वये नोंदणी करावयाची आहे. सबब आपणाकडे खालील प्रमाणे कागदपत्रे सादर करण्यात आलेली आहेत.
            </p>
        </div>

        <table style="width: 100%; border: none; margin-bottom: 12px; font-size: 12.5px; line-height: 1.35; border-collapse: collapse; font-family: 'Tiro Devanagari Marathi', serif;">
            <tr>
                <td style="width: 25px; vertical-align: top; padding: 2px 0; font-weight: bold;">1)</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: justify;">विधान पत्र (ज्ञापन) मेमोरंडम ऑफ असोसिएशन.</td>
            </tr>
            <tr>
                <td style="width: 25px; vertical-align: top; padding: 2px 0; font-weight: bold;">2)</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: justify;">नियम व नियमावलीची सत्यप्रत.</td>
            </tr>
            <tr>
                <td style="width: 25px; vertical-align: top; padding: 2px 0; font-weight: bold;">3)</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: justify;">संस्था नोंदणी बाबत कार्यकारी मंडळाच्या सर्व सभासदांच्या सह्यांचे संमतीपत्र.</td>
            </tr>
            <tr>
                <td style="width: 25px; vertical-align: top; padding: 2px 0; font-weight: bold;">4)</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: justify;">संस्था नोंदणी बाबत कार्यकारी मंडळाच्या सर्व सभासदांच्या सह्यांचे अधिकारपत्र.</td>
            </tr>
            <tr>
                <td style="width: 25px; vertical-align: top; padding: 2px 0; font-weight: bold;">5)</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: justify;">कार्यकारिणीची निवड व उद्देश व नियमावली मंजुरी बाबत ठरावाची सत्यप्रत.</td>
            </tr>
            <tr>
                <td style="width: 25px; vertical-align: top; padding: 2px 0; font-weight: bold;">6)</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: justify;">संस्थेच्या पत्त्या बाबत व जागेबाबत अध्यक्ष व सचिव यांचे प्रतिज्ञापत्र 100/- रूपयाच्या स्टॅम्प पेपरवर ५ रु. कोर्ट फी राहील.</td>
            </tr>
            <tr>
                <td style="width: 25px; vertical-align: top; padding: 2px 0; font-weight: bold;">8)</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: justify;">भाडेकरारनामा 100/- रूपयाच्या स्टॅम्प पेपरवर तसेच जागा मालकाचे नाहरकत, जागेचा पुरावा, सर्व सभासदांचे आधार कार्ड व फोटो.</td>
            </tr>
            <tr>
                <td style="width: 25px; vertical-align: top; padding: 2px 0; font-weight: bold;">9)</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: justify;">चुकीचे वाङ्मय, देशविघातक व गैर मार्गाने निधी जमा करणार नाही करीता अध्यक्ष व सचिव यांचे प्रतिज्ञापत्र, धर्मादाय संशयास्पद पैशाची माहिती अवगत करणे बाबत हमीपत्र.</td>
            </tr>
            <tr>
                <td style="width: 25px; vertical-align: top; padding: 2px 0; font-weight: bold;">10)</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: justify;">परिशिष्ट 1-2-6.</td>
            </tr>
            <tr>
                <td style="width: 25px; vertical-align: top; padding: 2px 0; font-weight: bold;">11)</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: justify;">सूचना, ठराव, सभासद नोंदवही इ. ची सत्यप्रत.</td>
            </tr>
        </table>

        <div style="margin-bottom: 10px; font-size: 13.5px; line-height: 1.4;">
            <p style="text-indent: 30px; margin: 0 0 5px 0; text-align: justify;">
                पुढे असेही निवेदन करण्यात येते की, वरील संस्थेचे सर्व उद्देश सन 1860 च्या संस्था नोंदणी अधिनियमाच्या कलम 20 अन्वये असून, वरील संस्थेच्या नावांची या नामसदृष्य असलेली अन्य संस्था माझ्या माहिती प्रमाणे अस्तित्वात नाही. नोंदणी शुल्क रू. ५०/- (अक्षरी पन्नास रूपये फक्त ) भरण्यासाठी तयार आहे.
            </p>
            <p style="text-align: center; font-weight: bold; margin-top: 8px; font-size: 13.5px;">
                तरी वरील संस्था नोंदणी अधिनियम 1860 अन्वये त्वरीत नोंदवावी अशी विनंती आहे.
            </p>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 13.5px; align-items: flex-start; line-height: 1.4;">
            <div style="font-weight: bold; margin-top: 5px;">
                सहपत्रे :- वरील प्रमाणे
            </div>
            <div style="text-align: center; width: 300px;">
                आपला विश्वासु,<br><br><br>
                <span style="font-weight: bold; font-size: 14.5px;">${presidentName}</span><br>
                “ ${trustName} ”<br>
                <span style="font-size: 12.5px; font-weight: normal;">${address}</span>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 25px; padding: 0 30px; font-weight: bold; font-size: 13.5px;">
            <div style="text-align: center; width: 100px; border-top: 1px solid #000; padding-top: 3px;">अध्यक्ष</div>
            <div style="text-align: center; width: 100px; border-top: 1px solid #000; padding-top: 3px;">सचिव</div>
            <div style="text-align: center; width: 100px; border-top: 1px solid #000; padding-top: 3px;">सदस्य</div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 2: Memorandum -->
        <div style="text-align: center; margin-bottom: 12px; line-height: 1.3; font-family: 'Tiro Devanagari Marathi', serif;">
            <span style="font-weight: bold; font-size: 16px;">परिशिष्ट " ब "</span><br>
            <span style="font-size: 14px; text-decoration: underline; font-weight: bold;">या संस्थेचे ज्ञापन</span><br><br>
            <span style="font-weight: bold; font-size: 15px;">मेमोरंडम ऑफ असोसिएशन</span><br>
            <span style="font-size: 13px; font-weight: bold;">(Memorandum of Association)</span>
        </div>

        <table style="width: 100%; border: none; margin-bottom: 8px; border-collapse: collapse; font-size: 13.5px; line-height: 1.4;">
            <tr>
                <td style="width: 25px; font-weight: bold; vertical-align: top; padding: 2px 0;">1)</td>
                <td style="width: 170px; font-weight: bold; vertical-align: top; padding: 2px 0;">संस्थेचे नांव :-</td>
                <td style="font-weight: bold; font-size: 15px; vertical-align: top; padding: 2px 0;">“ ${trustName} ”</td>
            </tr>
            <tr>
                <td style="width: 25px; font-weight: bold; vertical-align: top; padding: 4px 0;">2)</td>
                <td style="width: 170px; font-weight: bold; vertical-align: top; padding: 4px 0;">संस्थेच्या कार्यालयाचा पत्ता :</td>
                <td style="vertical-align: top; padding: 4px 0;">${address}</td>
            </tr>
            <tr>
                <td style="width: 25px; font-weight: bold; vertical-align: top; padding: 4px 0;">3)</td>
                <td style="width: 170px; font-weight: bold; vertical-align: top; padding: 4px 0;">संस्थेचे उद्देश :</td>
                <td style="font-weight: bold; text-decoration: underline; vertical-align: top; padding: 4px 0;">या संस्थेचे उद्देश खालील प्रमाणे आहेत</td>
            </tr>
        </table>

        <table style="width: 100%; border: none; margin-bottom: 12px; font-size: 12.5px; line-height: 1.35; border-collapse: collapse; font-family: 'Tiro Devanagari Marathi', serif; padding-left: 20px;">
            ${objectives.map((obj, i) => `
            <tr>
                <td style="width: 25px; vertical-align: top; padding: 2px 0; font-weight: bold;">${i + 1})</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: justify;">${obj || '_____'}</td>
            </tr>
            `).join('')}
        </table>

        <div style="display: flex; justify-content: space-between; margin-top: 25px; padding: 0 40px; font-weight: bold; font-size: 13.5px; font-family: 'Tiro Devanagari Marathi', serif;">
            <div style="text-align: center; width: 100px; border-top: 1px solid #000; padding-top: 3px;">अध्यक्ष</div>
            <div style="text-align: center; width: 100px; border-top: 1px solid #000; padding-top: 3px;">उपाध्यक्ष</div>
            <div style="text-align: center; width: 100px; border-top: 1px solid #000; padding-top: 3px;">सचिव</div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 3: Executive Committee -->
        <div style="text-align: center; margin-bottom: 15px; font-size: 13px; font-family: 'Tiro Devanagari Marathi', serif;">
            (..2..)
        </div>

        <div style="margin-bottom: 15px; font-size: 13.5px; line-height: 1.45; text-align: justify; font-family: 'Tiro Devanagari Marathi', serif;">
            <b>4) “ ${trustName} ”</b> ${address}. या संस्थेचे नियम व नियमावली प्रमाणे या कार्यकारी मंडळावर सदरहु संस्थेच्या कार्यकारी मंडळाचा संस्थेचा कार्यभार सोपविण्यात आला आहे. त्या पहिल्या कार्यकारी मंडळाचा संपुर्ण पत्ता, हुद्दा, वय, व्यवसाय, राष्ट्रीयत्व खालील प्रमाणे आहे.
        </div>
        ${renderCommitteeTable()}
        
        <div style="display: flex; justify-content: space-between; margin-top: 30px; padding: 0 40px; font-weight: bold; font-size: 13.5px; font-family: 'Tiro Devanagari Marathi', serif;">
            <div style="text-align: center; width: 100px; border-top: 1px solid #000; padding-top: 3px;">अध्यक्ष</div>
            <div style="text-align: center; width: 100px; border-top: 1px solid #000; padding-top: 3px;">उपाध्यक्ष</div>
            <div style="text-align: center; width: 100px; border-top: 1px solid #000; padding-top: 3px;">सचिव</div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 4: Signatures -->
        <div style="margin-bottom: 12px; font-size: 13.5px; line-height: 1.4; font-family: 'Tiro Devanagari Marathi', serif; text-align: justify;">
            <b>5.</b> आम्ही खालील सह्या करणार <b>" ${trustName} "</b> ${address}. चे पदाधिकारी सदस्य जाहीर करतो की, संस्था अधिनियम 1860 अन्वये अभिप्रेत केलेली संस्था अस्तित्वात आणण्याची आमची ईच्छा असून वरील उद्देशाने आम्ही एकत्र येऊन <b>" ${trustName} "</b> ${address}. ही संस्था आज दिनांक <b>${date}</b> रोजी स्थापन केली असून संस्था नोंदणी अधिनियम 1860 अन्वये नोंदणी करण्यासाठी आम्ही या विधानपत्रावर सह्या केल्या आहेत.
        </div>
        ${renderCommitteeSignatures()}
        
        <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 13px; font-family: 'Tiro Devanagari Marathi', serif;">
            <div>
                स्थळ : ${place}<br>
                दिनांक : ${date}
            </div>
        </div>

        <div style="margin-top: 25px; margin-left: 50%; font-size: 12.5px; font-family: 'Tiro Devanagari Marathi', serif; line-height: 1.3;">
            वरील सह्या करणाऱ्या सर्व सभासदांना मी ओळखतो.<br>
            व त्यांनी माझ्या समक्ष या विधानपत्रावर सह्या केल्या आहेत.<br><br><br>
            <b>विशेष कार्यकारी दंडाधिकारी / वकील / सनदी लेखापाल / नोटरी संपूर्ण नांव, पत्ता व शिक्का.</b>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 5: Rules & Regulations -->
        <div style="text-align: center; margin-bottom: 12px; line-height: 1.3; font-family: 'Tiro Devanagari Marathi', serif;">
            <span style="font-weight: bold; font-size: 16px;">परिशिष्ट " क "</span><br>
            <span style="font-weight: bold; font-size: 14px;">“ ${trustName} ”</span><br>
            <span style="font-size: 12.5px;">${address}</span><br><br>
            <span style="font-size: 13.5px; text-decoration: underline; font-weight: bold;">या संस्थेचे नियम व नियमावली (Rules & Regulation/Constitution)</span>
        </div>

        <table style="width: 100%; border: none; border-collapse: collapse; font-size: 11.5px; line-height: 1.35; font-family: 'Tiro Devanagari Marathi', serif; color: #000; text-align: justify;">
            <colgroup>
                <col style="width: 20px;">
                <col style="width: 25px;">
                <col style="width: 75px;">
                <col style="width: 15px;">
                <col style="width: auto;">
            </colgroup>
            
            <!-- Rule 1 Heading -->
            <tr>
                <td colspan="5" style="padding: 4px 0;">
                    <b style="font-size: 12.5px;"><u>1)</u> &nbsp;&nbsp;<u>नियमावलीतील संदर्भिय शब्दाची व्याख्या</u> :-</b>
                </td>
            </tr>
            <!-- 1a -->
            <tr>
                <td></td>
                <td style="vertical-align: top; padding: 2px 0;">अ)</td>
                <td style="vertical-align: top; padding: 2px 0;">संस्था</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: center;">:</td>
                <td style="vertical-align: top; padding: 2px 0;">
                    संस्था म्हणजे " ${trustName} " ${address}. ही संस्था नोंदणी कायदा 1860 अन्वये नोंद होणारी संस्था.
                </td>
            </tr>
            <!-- 1b -->
            <tr>
                <td></td>
                <td style="vertical-align: top; padding: 2px 0;">ब)</td>
                <td style="vertical-align: top; padding: 2px 0;">अध्यक्ष</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: center;">:</td>
                <td style="vertical-align: top; padding: 2px 0;">
                    अध्यक्ष म्हणजे " ${trustName} " ${address}. या संस्थेचा अध्यक्ष.
                </td>
            </tr>
            <!-- 1c -->
            <tr>
                <td></td>
                <td style="vertical-align: top; padding: 2px 0;">क)</td>
                <td style="vertical-align: top; padding: 2px 0;">उपाध्यक्ष</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: center;">:</td>
                <td style="vertical-align: top; padding: 2px 0;">
                    उपाध्यक्ष म्हणजे " ${trustName} " ${address}. या संस्थेचा उपाध्यक्ष.
                </td>
            </tr>
            <!-- 1d -->
            <tr>
                <td></td>
                <td style="vertical-align: top; padding: 2px 0;">ड)</td>
                <td style="vertical-align: top; padding: 2px 0;">सचिव</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: center;">:</td>
                <td style="vertical-align: top; padding: 2px 0;">
                    सचिव म्हणजे " ${trustName} " ${address}. या संस्थेचा सचिव.
                </td>
            </tr>
            <!-- 1e -->
            <tr>
                <td></td>
                <td style="vertical-align: top; padding: 2px 0;">इ)</td>
                <td style="vertical-align: top; padding: 2px 0;">सहसचिव</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: center;">:</td>
                <td style="vertical-align: top; padding: 2px 0;">
                    सहसचिव म्हणजे " ${trustName} " ${address}. या संस्थेचा सहसचिव.
                </td>
            </tr>
            <!-- 1f -->
            <tr>
                <td></td>
                <td style="vertical-align: top; padding: 2px 0;">प)</td>
                <td style="vertical-align: top; padding: 2px 0;">कोषाध्यक्ष</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: center;">:</td>
                <td style="vertical-align: top; padding: 2px 0;">
                    कोषाध्यक्ष - ${trustName} - ${address}. या संस्थेचा कोषाध्यक्ष.
                </td>
            </tr>
            <!-- 1g -->
            <tr>
                <td></td>
                <td style="vertical-align: top; padding: 2px 0;">फ)</td>
                <td style="vertical-align: top; padding: 2px 0;">सभासद</td>
                <td style="vertical-align: top; padding: 2px 0; text-align: center;">:</td>
                <td style="vertical-align: top; padding: 2px 0;">
                    सभासद म्हणजे ${trustName}, ${address}. या संस्थेची वर्गणी भरून झालेला आजीव सभासद, वार्षिक सभासद व कार्यकारी मंडळावर निवडून आलेले सभासद.
                </td>
            </tr>
            
            <!-- Spacer -->
            <tr><td colspan="5" style="height: 6px;"></td></tr>
            
            <!-- Rule 2 -->
            <tr>
                <td colspan="3" style="vertical-align: top; padding: 4px 0;"><b><u>2)</u> &nbsp;&nbsp;<u>कार्यक्षेत्र</u></b></td>
                <td style="vertical-align: top; padding: 4px 0; text-align: center;"><b>:</b></td>
                <td style="vertical-align: top; padding: 4px 0;">या संस्थेचे कार्यक्षेत्र संपूर्ण महाराष्ट्र राज्य राहील.</td>
            </tr>
            
            <!-- Rule 3 -->
            <tr>
                <td colspan="3" style="vertical-align: top; padding: 4px 0;"><b><u>3)</u> &nbsp;&nbsp;<u>हिशोबाचे वर्ष</u></b></td>
                <td style="vertical-align: top; padding: 4px 0; text-align: center;"><b>:</b></td>
                <td style="vertical-align: top; padding: 4px 0;">या संस्थेचे हिशोबाचे वर्ष 1 एप्रिल ते 31 मार्च असे राहील.</td>
            </tr>
            
            <!-- Spacer -->
            <tr><td colspan="5" style="height: 6px;"></td></tr>
            
            <!-- Rule 4 Heading -->
            <tr>
                <td colspan="5" style="padding: 4px 0;">
                    <b style="font-size: 12.5px;"><u>4)</u> &nbsp;&nbsp;<u>सभासदत्व व त्याची नोंदणी पध्दती</u> :-</b>
                </td>
            </tr>
            <!-- 4a -->
            <tr>
                <td></td>
                <td style="vertical-align: top; padding: 2px 0;">अ)</td>
                <td colspan="3" style="vertical-align: top; padding: 2px 0;">
                    कोणत्याही भारतीय सज्ञान व्यक्तीस/महिलेस संस्थेचे सभासद होता येईल.
                </td>
            </tr>
            <!-- 4b -->
            <tr>
                <td></td>
                <td style="vertical-align: top; padding: 2px 0;">ब)</td>
                <td colspan="3" style="vertical-align: top; padding: 2px 0;">
                    सभासद होण्यासाठी त्याने/तीने संस्थेला लेखी अर्ज करावा.
                </td>
            </tr>
            <!-- 4c -->
            <tr>
                <td></td>
                <td style="vertical-align: top; padding: 2px 0;">क)</td>
                <td colspan="3" style="vertical-align: top; padding: 2px 0;">
                    कार्यकारी मंडळाचा या बाबतचा निर्णय अंतिम राहिल.
                </td>
            </tr>
            
            <!-- Spacer -->
            <tr><td colspan="5" style="height: 6px;"></td></tr>
            
            <!-- Rule 5 Heading -->
            <tr>
                <td colspan="5" style="padding: 4px 0;">
                    <b style="font-size: 12.5px;"><u>5)</u> &nbsp;&nbsp;<u>सभासदांचे प्रकार</u> :-</b>
                </td>
            </tr>
            <!-- 5a -->
            <tr>
                <td></td>
                <td style="vertical-align: top; padding: 2px 0;">अ)</td>
                <td colspan="3" style="vertical-align: top; padding: 2px 0;">
                    <b>आजीव सभासद :-</b> आजिव सभासद होण्यासाठी प्रत्येकाने सभासद वर्गणी रूपये 101/- फी संस्थेस अदा केली पाहिजे. ते संस्थेचे तहहयात सभासद असतील. त्यांना पुन्हा सभासदत्व फी भरावी लागणार नाही.
                </td>
            </tr>
            <!-- 5b -->
            <tr>
                <td></td>
                <td style="vertical-align: top; padding: 2px 0;">ब)</td>
                <td colspan="3" style="vertical-align: top; padding: 2px 0;">
                    <b>वार्षिक सभासद :-</b> वार्षिक सभासद होण्यासाठी सभासदाने वा व्यक्तीने दरवर्षी 51/- रूपये सभासद वर्गणी अदा करावयास हवी. तसेच पहिल्यांदा 5/- रूपये म्हणून प्रवेश फी अदा करावी.
                </td>
            </tr>
        </table>

        <div style="display: flex; justify-content: space-between; margin-top: 30px; padding: 0 40px; font-weight: bold; font-size: 13px; font-family: 'Tiro Devanagari Marathi', serif;">
            <div style="text-align: center; width: 100px;">अध्यक्ष</div>
            <div style="text-align: center; width: 100px;">उपाध्यक्ष</div>
            <div style="text-align: center; width: 100px;">सचिव</div>
        </div>

       

        <div class="page-break"></div>

        <!-- PAGE 6: Rules Contd -->
        <div style="text-align: center; margin-bottom: 8px; font-size: 13px; font-family: 'Tiro Devanagari Marathi', serif;">
            (..2..)
        </div>

        <div style="font-size: 11.5px; line-height: 1.25; font-family: 'Tiro Devanagari Marathi', serif; text-align: justify; color: #000;">
            <div style="margin-bottom: 8px;">
                <b style="font-size: 12.5px;">6) &nbsp;&nbsp;<u>सभासदत्व रद्द होणे</u> :-</b><br>
                <p style="text-indent: 30px; margin: 3px 0 0 0; text-align: justify; line-height: 1.3;">
                    कोणताही सभासद कायदेशीर गुन्हेगार ठरला असेल, सभासद वर्गणी दिली नसेल, राजीनामा दिल्यास तो राजीनामा कार्यकारी मंडळाने मंजुर केल्यास, मयत झाल्यास, देश सोडून गेला असेल, संस्थेला हानी किंवा नुकसान पोहचवित असेल किंवा योग्य कारणावरून कार्यकारी मंडळाने बहुमताने ठराव मंजूर करून काढून टाकल्यास सभासदत्व रद्द झाले असे समजले जाईल.
                </p>
            </div>

            <div style="margin-bottom: 8px;">
                <b style="font-size: 12.5px;">7) &nbsp;&nbsp;<u>सर्वसाधारण सभा तिचे अधिकार व कर्तव्ये</u> :-</b><br>
                <p style="margin: 3px 0 0 0; text-align: justify; padding-left: 15px; line-height: 1.3;">
                    सर्वसाधारण सभा म्हणजे संस्थेच्या सभासदांची सभा संस्थेच्या आर्थिक वर्ष संपल्यानंतर दोन महीन्याच्या आत वार्षिक सर्वसाधारण सभा घेतली जाईल, सर्वसाधारण सभेचे कार्ये व अधिकार खालील प्रमाणे आहे.<br>
                    अ) मागील सर्वसाधारण सभेचा वृत्तांत निर्णय वाचून कायम करणे.<br>
                    ब) वार्षिक जमाखर्च मंजूर करणे, वार्षिक अहवाल मंजूर करणे, कार्यकारिणीच्या आर्थिक धोरणात्मक स्वरूपाच्या ठरावांना मान्यता देणे.<br>
                    ड) आयत्यावेळी येणाऱ्या विषयावर अध्यक्षांच्या संमतीने निर्णय घेणे.
                </p>
            </div>

            <div style="margin-bottom: 8px;">
                <b style="font-size: 12.5px;">8) &nbsp;&nbsp;<u>सर्वसाधारण सभेची सुचना व गणसंख्या</u> :-</b><br>
                <p style="text-indent: 30px; margin: 3px 0 0 0; text-align: justify; line-height: 1.3;">
                    सचिव हे सर्वसाधारण सभेची सूचना ही प्रत्येक सभासदास सभेच्या तारखेच्या 15 दिवस अगोदर पोस्टाने किंवा समक्ष सही घेऊन देतील. त्या सुचनेवर सभेचे ठिकाण, विषय वेळ व दिनांक लिहिलेली असेल. या सभेत 3/5 सभासदांची गणसंख्या असेल.
                </p>
            </div>

            <div style="margin-bottom: 8px;">
                <b style="font-size: 12.5px;">9) &nbsp;&nbsp;<u>विशेष सर्वसाधारण सभा तिचे कार्य</u> :-</b><br>
                <p style="text-indent: 30px; margin: 3px 0 0 0; text-align: justify; line-height: 1.3;">
                    काही महत्त्वाच्या व तातडीच्या कामासाठी सर्वसाधारण सभा घेतली जाईल, त्यास विशेष सर्वसाधारण सभा संबोधले जाईल. या सभेस 3/5 सभासदांची गणसंख्या राहिल. या सभेस 15 दिवसांच्या नोटीस पोस्टाने वा समक्ष सही घेऊन दिली जाईल.
                </p>
            </div>

            <div style="margin-bottom: 8px;">
                <b style="font-size: 12.5px;">10) &nbsp;&nbsp;<u>कार्यकारी मंडळ व पदाधिकारी यांची रचना</u> :-</b><br>
                <p style="margin: 3px 0 0 0; text-align: justify; padding-left: 15px; line-height: 1.3;">
                    अ) संस्थेचे कार्यकारी मंडळ कमीत कमी 7 सदस्यांचे व जास्तीत जास्त 13 सदस्यांचे राहील.<br>
                    ब) कार्यकारी मंडळावर संस्थेच्या सर्व सभासदास निवडून जाता येईल.<br>
                    क) संस्थेच्या कार्यकारी मंडळात खालीलप्रमाणे पदाधिकारी असतील. एक-अध्यक्ष, एक-उपाध्यक्ष, एक- सचिव, एक - सहसचिव, एक- कोषाध्यक्ष व इतर सभासद असतील.
                </p>
            </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 15px; padding: 0 40px; font-weight: bold; font-size: 13px; font-family: 'Tiro Devanagari Marathi', serif;">
            <div style="text-align: center; width: 100px; border-top: 1px solid #000; padding-top: 3px;">अध्यक्ष</div>
            <div style="text-align: center; width: 100px; border-top: 1px solid #000; padding-top: 3px;">उपाध्यक्ष</div>
            <div style="text-align: center; width: 100px; border-top: 1px solid #000; padding-top: 3px;">सचिव</div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 7: Rules 11-12 -->
        <div style="text-align: center; margin-bottom: 8px; font-size: 13px; font-family: 'Tiro Devanagari Marathi', serif;">
            (.. 3 ..)
        </div>

        <div style="font-size: 11.5px; line-height: 1.25; font-family: 'Tiro Devanagari Marathi', serif; text-align: justify; color: #000;">
            <div style="margin-bottom: 8px;">
                <b style="font-size: 12.5px;">11) &nbsp;&nbsp;<u>कार्यकारी मंडळाचा कार्यकाल व निवडणुकीची पद्धत</u> :-</b><br>
                <p style="text-indent: 35px; margin: 3px 0 0 0; text-align: justify;">
                    पहिले कार्यकारी मंडळ हे पाच वर्षांचे असेल, त्यानंतर सर्वसाधारण सभेत निवडून आलेल्या कार्यकारी मंडळाचा कार्यकाल हा पाच वर्षाचा असेल. कार्यकारी मंडळाच्या सभासदांची निवड दर पाच वर्षाने सर्वसाधारण सभेत गुप्त मतदान पद्धतीने करण्यात येईल.
                </p>
            </div>

            <div style="margin-bottom: 8px;">
                <b style="font-size: 12.5px;">12) &nbsp;&nbsp;<u>कार्यकारी मंडळाचे पदाधिकारी व त्यांचे कामे</u> :-</b><br>
                <p style="margin: 3px 0 3px 0; text-align: justify;">
                    कार्यकारी मंडळात खालील प्रमाणे पदे असतील. एक-अध्यक्ष, एक-उपाध्यक्ष, एक- सचिव, एक - सहसचिव, एक- कोषाध्यक्ष व इतर सभासद कार्यकारी मंडळातील पदाधिकारी यांची व त्या अन्वये कार्यकारी मंडळाची कार्ये खालील प्रमाणे असतील.
                </p>

                <div style="margin-left: 15px; margin-bottom: 5px;">
                    <b>अ) &nbsp;&nbsp;<u>अध्यक्षांची कार्ये व अधिकार</u> :-</b>
                    <table style="width: 100%; border: none; border-collapse: collapse; margin-left: 15px; margin-top: 2px; margin-bottom: 2px; font-size: 11.5px; line-height: 1.25;">
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">अ)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">संस्थेच्या सर्व सभा व्यवस्थित चालविणे, त्यांचे संचालन करणे, सभा बोलविणे.</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">ब)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">संस्थेच्या कारभारावर संपूर्ण नियंत्रण ठेवणे.</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">क)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">सभेत समान मते पडल्यास निर्णायक जादा मत देणे.</td>
                        </tr>
                    </table>
                </div>

                <div style="margin-left: 15px; margin-bottom: 5px;">
                    <b>ब) &nbsp;&nbsp;<u>उपाध्यक्षांची कार्ये</u> :-</b>
                    <table style="width: 100%; border: none; border-collapse: collapse; margin-left: 15px; margin-top: 2px; margin-bottom: 2px; font-size: 11.5px; line-height: 1.25;">
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">अ)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">अध्यक्षांच्या कामात मदत करणे.</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">ब)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">अध्यक्षांच्या गैरहजेरीत त्यांचे कामकाज पाहणे.</td>
                        </tr>
                    </table>
                </div>

                <div style="margin-left: 15px; margin-bottom: 5px;">
                    <b>क) &nbsp;&nbsp;<u>सचिवाची कार्ये</u> :-</b>
                    <table style="width: 100%; border: none; border-collapse: collapse; margin-left: 15px; margin-top: 2px; margin-bottom: 2px; font-size: 11.5px; line-height: 1.25;">
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">1)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">संस्थेचा सर्व प्रकारचा पत्रव्यवहार पाहणे.</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">2)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">नियमाप्रमाणे लागणारे आवश्यकतेनुसार सर्व प्रकारचे रजिस्टर ठेवणे.</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">3)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">सभेचे सर्व ठराव अंमलात आणणे.</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">4)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">संस्थेचे हिशोब पडताळून पाहणे व तशा स्वाक्षऱ्या करणे.</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">5)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">संस्थेच्या सेवक वर्गाच्या अडीअडचणी समजावून घेऊन त्यासंबंधी कार्यकारी मंडळात ठराव मांडणे व त्याविषयी योग्य तो निर्णय घेणे.</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">6)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">अध्यक्षांच्या परवानगीने व त्यांच्या सहीने सर्व सभांच्या कार्यक्रम पत्रिका पाठविणे.</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">7)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">कार्यकारी मंडळाने ठरविल्यास त्यांचे वतीने संस्थेच्या दस्तऐवजावर सह्या करणे.</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">8)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">अध्यक्ष व उपाध्यक्ष यांना त्यांचे कार्यात मदत करणे.</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">9)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">संस्थेचा आर्थिक हिशोब तयार करणे वा करून घेणे.</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">10)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">त्यासंबंधी सर्व माहिती कार्यकारी मंडळास देणे.</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">11)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">बँकेवरील व आर्थिक व्यवहारांवर नियंत्रण ठेवणे.</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">12)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">संस्थेच्या व्यवहाराचे लेखा परिक्षण करून त्याचा अहवाल सादर करणे.</td>
                        </tr>
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">13)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">सर्व आर्थिक बाबींवर नियंत्रण ठेवणे व त्याच्या नोंदी ठेवणे.</td>
                        </tr>
                    </table>
                </div>

                <div style="margin-left: 15px; margin-bottom: 5px;">
                    <b>ड) &nbsp;&nbsp;<u>सहसचिवाचे कार्ये</u> :-</b>
                    <p style="margin: 2px 0 0 20px; text-align: justify;">
                        सचिवाच्या गैरहजेरीत सचिवाची कामे करणे, किंवा संस्थेच्या कार्यात सचिवाला योग्य ती मदत करणे.
                    </p>
                </div>

                <div style="margin-left: 15px; margin-bottom: 5px;">
                    <b>इ) &nbsp;&nbsp;<u>कोषाध्यक्षांचे कार्ये</u> :-</b>
                    <table style="width: 100%; border: none; border-collapse: collapse; margin-left: 15px; margin-top: 2px; margin-bottom: 2px; font-size: 11.5px; line-height: 1.25;">
                        <tr>
                            <td style="width: 20px; vertical-align: top; padding: 1px 0;">1)</td>
                            <td style="vertical-align: top; padding: 1px 0; text-align: justify;">संस्थेच्या आर्थिक परिस्थितीवर नियंत्रण ठेवणे, हिशोब ठेवणे, अगर लिहून घेणे, हिशोब पूर्ण झाल्यावर कार्यकारी मंडळापुढे ठेवणे, हिशोबाचे पुस्तकावरून आर्थिक पत्रके तयार करणे, रक्कमेची घेवाण करणे, ऑडीटर यांनी हिशोबातून काढलेल्या त्रुटींची पूर्तता करणे.</td>
                        </tr>
                    </table>
                </div>

                <div style="margin-left: 15px; margin-bottom: 8px;">
                    <b>ई) &nbsp;&nbsp;<u>इतर सभासदांची कार्ये</u> :-</b>
                    <p style="margin: 2px 0 0 20px; text-align: justify;">
                        सर्व साधारण सभेस हजर राहणे, संस्थेच्या कार्यास मदत करणे, मतदानास हजर राहणे.
                    </p>
                </div>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 15px; padding: 0 40px; font-weight: bold; font-size: 13px; font-family: 'Tiro Devanagari Marathi', serif;">
            <div style="text-align: center; width: 100px; border-top: 1px solid #000; padding-top: 3px;">अध्यक्ष</div>
            <div style="text-align: center; width: 100px; border-top: 1px solid #000; padding-top: 3px;">उपाध्यक्ष</div>
            <div style="text-align: center; width: 100px; border-top: 1px solid #000; padding-top: 3px;">सचिव</div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 8: Rule 13, 14, 15, 16, 17 (Part 1) -->
        <div class="mb-20">
            <b>13) कार्यकारी मंडळाची सभा व मागणी :-</b><br>
            कार्यकारी मंडळाची सभा ही जास्तीत जास्त तीन महिन्यातून एकदा घेण्यात येईल. अशा प्रकारे एका वर्षात कमीत कमी चार सभा घेण्यात येतील. तसेच महत्त्वाच्या अथवा तातडीच्या कामासाठी कार्यकारी मंडळाची सभा बोलविण्यात येईल. त्यासाठी कमीत कमी २/३ सभासदांची अध्यक्षांकडे मागणी करणे आवश्यक आहे. तिला मागणीची सभा किंवा तातडीची सभा असे संबोधण्यात येईल. ही तातडीची सभा बोलविण्याचा अधिकार अध्यक्षांचा राहील. सदर सभा अध्यक्षांनी १५ दिवसांच्या आत न बोलविल्यास मागणी करणारे सभासद अशी सभा बोलवतील.
        </div>
        <div class="mb-20">
            <b>14) कार्यकारी मंडळाच्या सभेची सूचना व गणसंख्या :-</b><br>
            प्रत्येक कार्यकारी मंडळाच्या सभेची सूचना पंधरा दिवसांपूर्वी पोस्टाने किंवा समक्ष सही घेऊन दिली जाईल. सभेला कार्यकारी मंडळातील सदस्यांची गणसंख्या ही २/३ राहील. पण गणसंख्येच्या अभावी सभा जर तहकूब झाली तर तहकूब झालेली सभा, त्याच दिवशी त्याच ठिकाणी, ठरलेल्या वेळेनंतर एका तासाने घेण्यात येईल. अशा तहकूब सभेस गणसंख्येची आवश्यकता राहणार नाही. मात्र या सभेत विषय पत्रिकेशिवाय इतर कोणत्याही विषयांवर चर्चा होणार नाही अथवा निर्णय घेतले जाणार नाहीत. महत्त्वाच्या अथवा तातडीच्या कामासाठी जी सभा बोलविण्यात येईल त्या सभेला पाच दिवसांची नोटीस अथवा सूचना पोस्टाने अथवा समक्ष सही घेऊन देण्यात येईल. या सभेला गणसंख्येचे नियम हे वरील प्रमाणेच असतील.
        </div>
        <div class="mb-20">
            <b>15) कार्यकारी मंडळाच्या निवडणुकीचे नियम :-</b><br>
            अ) कार्यकारी मंडळाची निवडणूक सर्वसाधारण सभेत दर पाच वर्षांनी गुप्त मतदान पद्धतीने घेण्यात येईल.<br>
            ब) या संस्थेच्या सर्व सभासदांना निवडणुकीत उभे राहता येईल.
        </div>
        <div class="mb-20">
            <b>16) कार्यकारी मंडळातील रिक्त पद भरण्याबाबत :-</b><br>
            कार्यकारी मंडळातील पद अथवा जागा नियम क्रमांक ६ प्रमाणे व पुढील सभासद मृत्यू झाल्यामुळे, राजीनामा दिल्यामुळे व तो कार्यकारी मंडळाने मंजूर केल्यास कारण उदा. कार्यकारी मंडळातील एखादे पद रिक्त झाल्यास उर्वरित सभासद संस्थेच्या सर्व सभासदांमधून उर्वरित कालावधीसाठी त्यांच्या बहुमताने असे रिक्त पद व जागा भरून काढावीत, असे रिक्त पद व जागा तीन महिन्यात भरली नाही तर मा. सहाय्यक धर्मादाय आयुक्त जालना उपविभाग, जालना यांना भरण्याचा अधिकार राहील.
        </div>
        <div class="mb-20">
            <b>17) कार्यकारी मंडळाचे अधिकार व कर्तव्य :-</b><br>
            अ) संस्थेच्या उद्देशाकरिता निधी जमा करणे, वाढविणे, त्याचा विनियोग करणे, योग्य अशी गुंतवणूक करणे, देणग्या, शासकीय व निमशासकीय अनुदान स्वीकारणे.<br>
            ब) मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० व त्याखालील नियमांना अनुसरून संस्थेच्या उद्देशपूर्तीसाठी कर्ज घेणे.<br>
            क) दैनंदिन खर्चाचे अंदाजपत्रक मंजूर करणे व त्या खालील रक्कम मंजूर करणे व खर्चास वेळोवेळी मंजुरी देणे.<br>
            ड) मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० च्या नियमांना अधीन राहून संस्थेच्या नावाने जंगम व स्थावर मिळकत खरेदी करणे व त्यावर इमारती व वास्तू बांधणे, गहाण व भाड्याने व लीज पद्धतीने देणे व त्यांचा उपयोग करून संस्थेच्या उद्दिष्टांची पूर्ती करणे.<br>
            इ) संस्थेच्या उपक्रमाच्या व योजनांच्या अंमलबजावणीसाठी आवश्यक त्या विषय समित्या किंवा पोटसमित्या नेमणे. त्यांची सदस्य संख्या कार्यकाळ, कार्यक्षेत्र, कार्यपद्धती, अर्थव्यवस्था, वगैरे सर्व ठरविणे, तसेच त्या समित्यांमध्ये सर्व सदस्यांमधून योग्य व अनुभवी व तज्ज्ञ व्यक्तीस नेमणे.
        </div>

        <div class="page-break"></div>

        <!-- PAGE 9: Rule 17 (Part 2) + Rules 18 to 24 -->
        <div class="mb-20">
            फ) आवश्यक तो नोकरवर्ग नेमणे, त्यांचे पगार ठरविणे व त्यांना सेवेतून मुक्त करणे.<br>
            ब) कार्यकारी मंडळावर मुदती आधी जागा रिकामी झाल्यास ती बहुमताने भरून काढणे.<br>
            इ) सनदी लेखापाल (ऑडिटर) यांची नेमणूक करणे.<br>
            प) मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० व संस्था नोंदणी कायदा १८६० अन्वये उद्देशपूर्तीसाठी कार्ये करणे.
        </div>
        <div class="mb-20">
            <b>18) संस्थेचा निधी, मिळकती व विनियोग :-</b><br>
            संस्थेचा निधी देणाऱ्या शासकीय व निमशासकीय अनुदाने स्वीकारून, देणग्या गोळा करून, करण्यात येईल व तो सातत्याने वाढविण्याचा प्रयत्न करण्यात येईल. निधी व मिळकतीचा विनियोग संस्थेच्या उद्देशपूर्तीसाठी करण्यात येईल.
        </div>
        <div class="mb-20">
            <b>19) उद्दिष्ट निहाय खर्चाची तरतूद :-</b><br>
            संस्थेच्या सर्व उद्दिष्टांवर समप्रमाणात खर्च करण्यात येईल. यास उद्देशांचे गरजेनुसार व काळाप्रमाणे व परिस्थितीस अनुसरून यात बदल केला जाईल. या बाबतची सूचना मा. सहाय्यक धर्मादाय आयुक्त यांचे कार्यालयात वार्षिक तपासणी अहवालाबरोबर दिली जाईल.
        </div>
        <div class="mb-20">
            <b>20) कर्ज संबंधी तरतूद :-</b><br>
            संस्थेच्या उद्दिष्टपूर्तीसाठी मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० चे कलमास अधीन राहून कार्यकारी मंडळाच्या ठरावानुसार अध्यक्ष व सचिव संस्थेला लागणारे कर्ज घेतील या कर्जाचा योग्य तो वापर झाला किंवा नाही याची जबाबदारी कार्यकारी मंडळावर राहील. संस्थेला लागणारे कर्ज मा. धर्मादाय सहआयुक्त, यांच्या पूर्वपरवानगीने घेण्यात येईल.
        </div>
        <div class="mb-20">
            <b>21) स्थावर मालमत्ता खरेदी-विक्री करणे बाबतची तरतूद :-</b><br>
            संस्थेला स्थावर मालमत्ता खरेदी करणे तसेच विक्री करण्याचा अधिकार राहील, संस्थेला त्याकरिता कार्यकारी मंडळाची बहुमताने संमती घ्यावी लागेल. संस्थेची स्थावर मालमत्ता विक्री करावयाची असल्यास ती विकण्यापूर्वी मा. धर्मादाय सहआयुक्त यांची परवानगी घेणे आवश्यक राहील.
        </div>
        <div class="mb-20">
            <b>22) बँक खाते व संस्थेचा वार्षिक व्यवहार :-</b><br>
            संस्थेकडे येणाऱ्या निधीपैकी रु. ५००/- इतकी रक्कम हातात ठेवून बाकीची रक्कम कोणत्याही राष्ट्रीयकृत बँकेत खाते उघडून संस्थेच्या नावाने ठेवता येईल. बँकेचे खात्यातील व्यवहार हे अध्यक्ष व सचिव किंवा कोषाध्यक्ष यापैकी दोघांच्या संयुक्त सहीने राहतील.
        </div>
        <div class="mb-20">
            <b>23) सभासदांची यादी ठेवण्याची पद्धत :-</b><br>
            सन १९७१ च्या संस्था नोंदणी (महाराष्ट्र) नियमाप्रमाणे उल्लेख केलेले अनुसूची १, २ व ६ मध्ये कार्यकारी मंडळाची व सर्व सभासदांची यादी व संस्थेमध्ये असलेल्या नोकरवर्गाची यादी ठेवण्यात येईल व वेळोवेळी मा. सहाय्यक निबंधक यांना कळविण्यात येईल सोबत अनुसूची १,२,६ जोडलेले आहेत.
        </div>
        <div class="mb-20">
            <b>24) नियम आणि नियमावलीत बदल करण्याची तरतूद :-</b><br>
            या नियमावलीत बदल करणे व नवीन नियमांचा अंतर्भाव करणे यांसाठी वार्षिक सर्वसाधारण सभेत अथवा विशेष सर्वसाधारण सभेत ३/५ मताधिक्याने मंजुरी मिळवावी लागेल संस्था नोंदणी कायदा १८६० चे कलम १२ व १२ अ नुसार कार्यवाही केली जाईल.
        </div>

        <div class="page-break"></div>

        <!-- PAGE 10: Rule 25, 26 + Certificate (दाखला) -->
        <div class="mb-20">
            <b>25) संस्थेच्या नावात व उद्देशात बदल करण्याची तरतूद :-</b><br>
            संस्थेच्या नावांत किंवा उद्देशात बदल करावयाचा असल्यास संस्था नोंदणी अधिनियम १८६० मधील कलम १२ व १२ अ चा अवलंब केला जाईल. ती तशी मंजुरी सर्वसाधारण सभेत ३/५ बहुमताने घेण्यात येईल.
        </div>
        <div class="mb-20">
            <b>26) विसर्जन :-</b><br>
            कोणत्याही कारणास्तव संस्था विसर्जित अथवा बंद करावयाची असल्यास सोसायटी नोंदणी अधिनियम १८६० अन्वये कलम १३ व १४ नुसार संस्था बरखास्त केली जाईल. सदर संस्थेची सर्व देणी देऊन शिल्लक राहिलेली मालमत्ता या प्रकारचा उद्देश असणाऱ्या व सोसायटी नोंदणी कायदा १८६० अन्वये नोंदणी झालेल्या संस्थेकडे वर्ग करता येईल किंवा विलीन करता येईल.
        </div>

        <div style="border: 1px solid #000; padding: 15px; margin-top: 30px; text-align: center;">
            <b style="font-size: 16px;">‘‘ दाखला ’’</b><br><br>
            प्रमाणित करण्यात येते की, <b>" ${trustName} "</b> ${address}.<br>
            या संस्थेच्या नियमावलीची ही सत्यप्रत आहे.
        </div>

        <div class="flex-between" style="margin-top: 40px; padding: 0 40px;">
            <div style="text-align: center;">
                <b>${presidentName}</b><br>अध्यक्ष
            </div>
            <div style="text-align: center;">
                <b>${vicePresidentName}</b><br>उपाध्यक्ष
            </div>
            <div style="text-align: center;">
                <b>${secretaryName}</b><br>सचिव
            </div>
        </div>

        <div class="mt-20">
            स्थळ : ${place}<br>
            दिनांक : ${date}
        </div>

        <div class="page-break"></div>

        <!-- PAGE 11: Consent Letter (परिशिष्ट ड) -->
        <div class="title-lg">परिशिष्ट " ड "</div>
        <div class="title-sm text-center">-: संमती पत्र :- (Consent letter of members)</div>
        <div class="mt-20 mb-20">
            प्रति,<br>
            मे. सहाय्यक संस्था निबंधक,<br>
            विभाग जालना, जिल्हा जालना.<br><br>
            <b>विषय :- संस्था नोंदणी अधिनियम 1860 अन्वये नोंदणी बाबत....</b>
        </div>
        <div class="mb-20">
            महोदय,<br>
            <p class="indent">
                आम्ही खालील सह्या करणार " <b>${trustName}</b> " ${address}. या संस्थेच्या पहिल्या कार्यकारी मंडळाचे सभासद असून, सदर संस्थेच्या कार्यकारी मंडळावर संस्थेच्या ध्येय, उद्देश व नियमावलीप्रमाणे काम करण्यास आमची संमती आहे. तसेच संस्था नोंदणी अधिनियम 1860 अन्वये सदर संस्थेची नोंदणी होण्यास संमती असून त्याचे प्रतिक म्हणून आम्ही आमच्या सह्या या संमतीपत्रावर केल्या आहेत.
            </p>
        </div>
        ${renderCommitteeSignatures()}
        <div class="mt-20">
            स्थळ : ${place}<br>
            दिनांक : ${date}
        </div>
        <div style="margin-top: 30px; margin-left: 50%;">
            वरील सह्या करणाऱ्या सर्व सभासदांना मी ओळखतो.<br>
            व त्यांनी माझ्या समक्ष या विधानपत्रावर सह्या केल्या आहेत.<br><br><br>
            <b>विशेष कार्यकारी दंडाधिकारी / वकील / सनदी लेखापाल / नोटरी संपूर्ण नांव, पत्ता व शिक्का.</b>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 12: Authority Letter (परिशिष्ट इ) -->
        <div class="title-lg">परिशिष्ट " इ "</div>
        <div class="title-sm text-center">अधिकार पत्र (Authority Letter)</div>
        <div class="mt-20 mb-20">
            प्रति,<br>
            मे. सहाय्यक संस्था निबंधक,<br>
            विभाग जालना, जिल्हा जालना.<br>
        </div>
        <div class="mb-20">
            महोदय,<br>
            <p class="indent">
                आम्ही खालील सह्या करणार " <b>${trustName}</b> " ${address}. या संस्थेचे ५ वर्षे कार्यकारी मंडळाचे सभासद आहोत. आम्ही नमूद करीत आहोत की, या संस्थेच्या वतीने <b>${presidentName}</b> यांना सदरहू संस्था नोंदवीण्या बाबतच्या कागदपत्रात आवश्यक ते बदल करण्याचे अधिकार या पत्रान्वये प्रदान करीत आहोत.
            </p>
        </div>
        ${renderCommitteeSignatures()}
        <div class="mt-20">
            स्थळ : ${place}<br>
            दिनांक : ${date}
        </div>
        <div style="margin-top: 30px; margin-left: 50%; text-align: center;">
            अध्यक्ष,<br><br><br>
            <b>${presidentName}</b><br>
            " ${trustName} "<br>
            ${address}
        </div>

        <div class="page-break"></div>

        <!-- PAGE 13: Schedule 6 (तक्ता नियम सहा) -->
        <div class="title-md text-center">तक्ता नियम सहा (6) नियम 15<br><span style="text-decoration: underline;">(Schedule-6)</span><br><span style="text-decoration: underline;">संचालक मंडळाने निवडलेल्यांची यादी</span></div>
        <table style="width: 100%; border: none; margin-bottom: 20px; margin-top: 20px;">
            <tr>
                <td style="width: 30px; font-weight: bold;">1)</td>
                <td style="width: 180px; font-weight: bold;">संस्थेचे नांव :</td>
                <td style="font-weight: bold; font-size: 16px;">" ${trustName} "<br><span style="font-size: 14px; font-weight: normal;">${address}</span></td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding-top: 15px;">2)</td>
                <td style="font-weight: bold; padding-top: 15px;">संस्था नोंदणी क्रमांक :-</td>
                <td style="padding-top: 15px;">${registrationNo}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding-top: 15px;">3)</td>
                <td style="font-weight: bold; padding-top: 15px;">संस्था नोंदणी अधिनियम :-</td>
                <td style="padding-top: 15px;">संस्था नोंदणी अधिनियम, १८६०</td>
            </tr>
        </table>
        ${renderCommitteeTable()}
        <div class="mt-20 flex-between">
            <div>स्थळ : ${place}<br>दिनांक : ${date}</div>
            <div style="text-align: center;">
                अध्यक्ष,<br><br><br>
                <b>${presidentName}</b><br>
                " ${trustName} "<br>
                ${address}
            </div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 14: Schedule 1 (तक्ता नियम सात) -->
        <div class="title-md text-center">तक्ता नियम सात (7) नियम 15<br><span style="text-decoration: underline;">(Schedule-1)</span><br><span style="text-decoration: underline;">संस्था नोंदणी अधिनियम 1860 चे कलम 4 नुसार</span></div>
        <table style="width: 100%; border: none; margin-bottom: 20px; margin-top: 20px;">
            <tr>
                <td style="width: 30px; font-weight: bold;">1)</td>
                <td style="width: 180px; font-weight: bold;">संस्थेचे नांव :</td>
                <td style="font-weight: bold; font-size: 16px;">" ${trustName} "<br><span style="font-size: 14px; font-weight: normal;">${address}</span></td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding-top: 15px;">2)</td>
                <td style="font-weight: bold; padding-top: 15px;">संस्था नोंदणी अधिनियम :-</td>
                <td style="padding-top: 15px;">1860 नुसार नोंदणी क्र. ${registrationNo}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding-top: 15px;">3)</td>
                <td style="font-weight: bold; padding-top: 15px;">निवडणूक दिनांक व कालावधी :-</td>
                <td style="padding-top: 15px;">दि. ${date} ते ५ वर्षे कालावधीकरिता</td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding-top: 15px;">4)</td>
                <td style="font-weight: bold; padding-top: 15px;">पदाधिकार्‍यांचा कालावधी :-</td>
                <td style="padding-top: 15px;">पाच वर्षाकरिता</td>
            </tr>
        </table>
        ${renderCommitteeTable()}
        <div class="mt-20 flex-between">
            <div>स्थळ : ${place}<br>दिनांक : ${date}</div>
            <div style="text-align: center;">
                अध्यक्ष,<br><br><br>
                <b>${presidentName}</b><br>
                " ${trustName} "<br>
                ${address}
            </div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 15: Schedule 8 (तक्ता नियम आठ) -->
        <div class="title-md text-center">तक्ता नियम आठ (8)<br><span style="text-decoration: underline;">संस्था नोंदणी अधिनियम 1860 चे कलम 4 नुसार</span></div>
        <table style="width: 100%; border: none; margin-bottom: 20px; margin-top: 20px;">
            <tr>
                <td style="width: 30px; font-weight: bold;">1)</td>
                <td style="width: 180px; font-weight: bold;">संस्थेचे नांव :</td>
                <td style="font-weight: bold; font-size: 16px;">" ${trustName} "<br><span style="font-size: 14px; font-weight: normal;">${address}</span></td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding-top: 15px;">2)</td>
                <td style="font-weight: bold; padding-top: 15px;">संस्था नोंदणी अधिनियम :-</td>
                <td style="padding-top: 15px;">1860 नुसार नोंदणी क्र. ${registrationNo}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding-top: 15px;">3)</td>
                <td style="font-weight: bold; padding-top: 15px;">निवडणूक दिनांक व कालावधी :-</td>
                <td style="padding-top: 15px;">दि. ${date} ते ५ वर्षे कालावधीकरिता</td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding-top: 15px;">4)</td>
                <td style="font-weight: bold; padding-top: 15px;">पदाधिकार्‍यांचा कालावधी :-</td>
                <td style="padding-top: 15px;">पाच वर्षाकरिता</td>
            </tr>
        </table>
        ${renderCommitteeTable()}
        <div class="mt-20 flex-between">
            <div>स्थळ : ${place}<br>दिनांक : ${date}</div>
            <div style="text-align: center;">
                अध्यक्ष,<br><br><br>
                <b>${presidentName}</b><br>
                " ${trustName} "<br>
                ${address}
            </div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 16: Schedule 2 (Employees List) -->
        <div style="text-align: center; margin-bottom: 12px; line-height: 1.3; font-family: 'Tiro Devanagari Marathi', serif;">
            <span style="font-weight: bold; font-size: 16px; text-decoration: underline;">परिशिष्ट - दोन</span><br>
            <span style="font-weight: bold; font-size: 14px; text-decoration: underline;">(Schedule-2)</span><br>
            <span style="font-weight: bold; font-size: 14px; text-decoration: underline;">(नियम - 8 )</span><br><br>
            <span style="font-weight: bold; font-size: 13.5px; text-decoration: underline;">कार्यकारी मंडळाने नेमलेल्या कर्मचा-यांचे विवरण</span>
        </div>

        <div style="border-top: 1.5px solid #000; border-bottom: 1.5px solid #000; margin-top: 15px; font-family: 'Tiro Devanagari Marathi', serif; color: #000;">
            <!-- Header Row -->
            <table style="width: 100%; border-collapse: collapse; border-bottom: 1.5px solid #000; font-size: 11px; line-height: 1.3;">
                <thead>
                    <tr>
                        <th style="padding: 6px 2px; text-align: left; font-weight: bold; width: 6%;">अ.क्र.</th>
                        <th style="padding: 6px 2px; text-align: left; font-weight: bold; width: 20%;">कर्मचा-यांचे नांव व हुद्दा</th>
                        <th style="padding: 6px 2px; text-align: left; font-weight: bold; width: 10%;">वेतन</th>
                        <th style="padding: 6px 2px; text-align: left; font-weight: bold; width: 14%;">पूर्ण वेळ/<br>अर्धवेळ/<br>कायम/<br>तात्पुरते</th>
                        <th style="padding: 6px 2px; text-align: left; font-weight: bold; width: 12%;">मासिक भत्ता<br>विशेष<br>वेतन</th>
                        <th style="padding: 6px 2px; text-align: left; font-weight: bold; width: 10%;">इतर<br>सोयी<br>घरभाडे</th>
                        <th style="padding: 6px 2px; text-align: left; font-weight: bold; width: 12%;">भ.नि.नि.<br>अंशदान</th>
                        <th style="padding: 6px 2px; text-align: left; font-weight: bold; width: 16%;">केव्हाने<br>दिलेबाबत<br>इतर सोयी<br>सवलती</th>
                    </tr>
                </thead>
            </table>
            
            <!-- Empty Body Area with Diagonal Line and Centered Box -->
            <div style="position: relative; width: 100%; height: 350px;">
                <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0;">
                    <line x1="0" y1="100%" x2="100%" y2="0" style="stroke: black; stroke-width: 1.5;" />
                </svg>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; border: 1.5px solid #000; padding: 4px 15px; font-weight: bold; font-size: 14px;">
                    निरंक
                </div>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 13px; font-family: 'Tiro Devanagari Marathi', serif; line-height: 1.45; color: #000;">
            <div>
                स्थळ : ${place}<br>
                दिनांक : &nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;&nbsp; /2026
            </div>
            <div style="text-align: center; width: 280px;">
                अध्यक्ष,<br><br><br>
                <b>${presidentName}</b><br>
                “ ${trustName} ”<br>
                <span style="font-size: 12px; font-weight: normal;">${address}</span>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 35px; padding: 0 40px; font-weight: bold; font-size: 13px; font-family: 'Tiro Devanagari Marathi', serif; color: #000;">
            <div style="text-align: center; width: 100px;">अध्यक्ष</div>
            <div style="text-align: center; width: 100px;">उपाध्यक्ष</div>
            <div style="text-align: center; width: 100px;">सचिव</div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 17: Guarantee Letter 1 (रुग्णालय) -->
        <div class="title-lg text-center" style="text-decoration: underline;">हमीपत्र</div>
        <div class="mt-20 mb-20">
            प्रति,<br>
            मा. सहाय्यक धर्मादाय आयुक्त,<br>
            जालना उपविभाग जालना.<br><br>
            <b>विषय :- धर्मादाय रुग्णालय/धर्मादाय वैद्यकीय केंद्राची माहिती अवगत करणे बाबत.</b><br>
            <b>संस्थेचे नाव :- " ${trustName} "</b>
        </div>
        <div class="mb-20" style="line-height: 2;">
            <p class="indent">
                आम्ही खाली स्वाक्षरी करणार " <b>${trustName}</b> " ${address}. या संस्थेच्या पहिल्या कार्यकारी मंडळाचे सभासद व विश्वस्त या द्वारे हमीपत्र लिहून देतो की, भविष्यात आमच्या या सार्वजनिक विश्वस्त न्यासाच्या वतीने कोणतेही धर्मादाय रुग्णालय किंवा धर्मादाय वैद्यकीय रुग्णालय केंद्र किंवा दवाखाना सुरू करण्यात आला तर त्या संबंधीची सविस्तर माहिती आम्ही त्वरित मा. सहाय्यक धर्मादाय आयुक्त जालना विभाग जालना यांच्या कार्यालयास स्वतःहून अवगत करू.
            </p>
            <p class="indent">
                सदर हमीपत्राचे उल्लंघन झाल्यास आम्ही कायद्यानुसार होणाऱ्या कारवाईस वैयक्तिक व सामूहिकरीत्या जबाबदार राहू.
            </p>
        </div>
        ${renderCommitteeSignatures()}
        <div class="mt-20">
            स्थळ : ${place}<br>
            दिनांक : ${date}
        </div>

        <div class="page-break"></div>

        <!-- PAGE 18: Guarantee Letter 2 (गैरवापर) -->
        <div class="title-lg text-center" style="text-decoration: underline;">हमीपत्र</div>
        <div class="mt-20 mb-20">
            प्रति,<br>
            मा. सहाय्यक धर्मादाय आयुक्त,<br>
            जालना उपविभाग जालना.<br><br>
            <b>विषय :- नोंदणी प्रमाणपत्राचा गैरवापर अथवा बेकायदेशीर कृत्यासाठी वापर न करण्याबाबत.</b><br>
            <b>संस्थेचे नाव :- " ${trustName} "</b>
        </div>
        <div class="mb-20" style="line-height: 2;">
            <p class="indent">
                मी, खाली स्वाक्षरी करणार <b>${presidentName}</b>, वय <b>${presidentAge}</b> वर्षे, राहणार <b>${address}</b>, या संस्थेचा अध्यक्ष या नात्याने सत्य प्रतिज्ञेवर हमीपत्र लिहून देतो की, आमच्या संस्थेची नोंदणी झाल्यानंतर मिळणाऱ्या नोंदणी प्रमाणपत्राचा गैरवापर करणार नाही. तसेच संस्थेच्या नावावर कोणत्याही प्रकारची चिठ्ठी/लकी ड्रॉ काढणे, भिशी चालविणे, हुंडा घेणे किंवा इतर कोणतेही बेकायदेशीर कृत्ये अथवा समाजविघातक कृत्ये संस्थेच्या माध्यमातून केली जाणार नाहीत.
            </p>
            <p class="indent">
                संस्थेचा संपूर्ण कारभार केवळ तिच्या उद्दिष्टांच्या आणि कायद्याच्या चौकटीत राहूनच चालविला जाईल. या हमीपत्राचे उल्लंघन झाल्यास त्याची संपूर्ण कायदेशीर जबाबदारी माझी वैयक्तिक व संस्थेच्या सर्व पदाधिकाऱ्यांची राहील.
            </p>
        </div>
        <div class="flex-between" style="margin-top: 50px;">
            <div>स्थळ : ${place}<br>दिनांक : ${date}</div>
            <div style="text-align: center;">
                <b>हमीदार / अध्यक्ष</b><br><br><br>
                <b>${presidentName}</b>
            </div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 19: Application for Public Trust Registration (अनुसूची - २) -->
        <!-- PAGE 19: Application for Public Trust Registration (अनुसूची - २) -->
        <div style="font-family: 'Tiro Devanagari Marathi', serif; font-size: 14px; line-height: 1.4;">
            <div class="title-lg text-center" style="margin-bottom: 2px;">सार्वजनिक विश्वस्त व्यवस्थेच्या नोंदणीसाठीचा अर्ज</div>
            <div class="title-md text-center" style="font-weight: bold; text-decoration: underline; margin-bottom: 2px;">अनुसूची - २</div>
            <div class="text-center" style="margin-bottom: 15px;">(नियम ६ पहा)</div>
            
            <div class="mb-15" style="line-height: 1.3;">
                <b>मा. सहाय्यक धर्मादाय आयुक्त,</b><br>
                जालना विभाग जालना.
            </div>
            
            <div class="mb-15" style="line-height: 1.3;">
                <b>" ${trustName} "</b> &nbsp;&nbsp;&nbsp;&nbsp; ${address}<br>
                <b>या सार्वजनिक विश्वस्त व्यवस्थेसंबंधी.</b>
            </div>
            
            <div class="mb-15" style="text-indent: 40px; text-align: justify; line-height: 1.4;">
                मी <b>${presidentName}</b> या द्वारे उपरिनिर्दिष्ट सार्वजनिक विश्वस्तव्यवस्थेचा विश्वस्त सदरहू सार्वजनिक विश्वस्त व्यवस्थेच्या नोंदणीसाठी मुंबई सार्वजनिक विश्वस्त अधिनियम 1950 च्या कलम 18 अन्वये अर्ज सादर करीत आहे.
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 13.5px;">
                <tr>
                    <td style="width: 25px; font-weight: bold; vertical-align: top;">२</td>
                    <td colspan="2" style="font-weight: bold; vertical-align: top;">मी पुढील आवश्यक तपशील सादर करीत आहे :-</td>
                </tr>
                <tr>
                    <td style="width: 25px; vertical-align: top; padding-top: 5px;">(अ.१)</td>
                    <td style="width: 320px; vertical-align: top; padding-top: 5px; padding-right: 10px;">
                        सार्वजनिक विश्वस्त व्यवस्था ज्या नावाने ओळखली जावी ते नाव व पूर्ण पत्ता :-
                    </td>
                    <td style="vertical-align: top; padding-top: 5px; font-weight: bold; line-height: 1.3;">
                        " ${trustName} "<br>
                        <span style="font-weight: normal; font-size: 12.5px;">${address}</span>
                    </td>
                </tr>
                <tr>
                    <td style="width: 25px; vertical-align: top; padding-top: 10px;">१.</td>
                    <td colspan="2" style="vertical-align: top; padding-top: 10px;">
                        विश्वस्त व व्यवस्थापक यांची नावे पत्ता व पद :-
                    </td>
                </tr>
            </table>
            
            <!-- Committee Table with Dashed Lines -->
            <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 13px; font-family: 'Tiro Devanagari Marathi', serif;">
                <thead>
                    <tr style="border-top: 1px dashed #000; border-bottom: 1px dashed #000;">
                        <th style="padding: 4px 0; text-align: left; font-weight: bold; width: 6%;">अ.क्र.</th>
                        <th style="padding: 4px 0; text-align: left; font-weight: bold; width: 44%;">सभासदाचे संपूर्ण नांव</th>
                        <th style="padding: 4px 0; text-align: left; font-weight: bold; width: 35%;">पत्ता</th>
                        <th style="padding: 4px 0; text-align: left; font-weight: bold; width: 15%;">पद</th>
                    </tr>
                </thead>
                <tbody>
                    ${committeeMembers.map((m, i) => `
                    <tr style="border-bottom: ${i === committeeMembers.length - 1 ? '1px dashed #000' : 'none'};">
                        <td style="padding: 6px 0; vertical-align: top;">${i + 1}.</td>
                        <td style="padding: 6px 0; vertical-align: top; font-weight: bold;">${m.name || '_____'}</td>
                        <td style="padding: 6px 0; vertical-align: top; font-size: 12px; line-height: 1.3;">${m.address || '_____'}</td>
                        <td style="padding: 6px 0; vertical-align: top;">${m.designation || '_____'}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <!-- Item 2 describing election method at the bottom of the page -->
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; line-height: 1.4;">
                <tr>
                    <td style="width: 30px; font-weight: bold; vertical-align: top;">२)</td>
                    <td style="width: 250px; vertical-align: top; padding-right: 15px;">
                        विश्वस्तांच्या किंवा व्यवस्थापकांच्या जागी दुसरा विश्वस्त किंवा व्यवस्थापक घेण्याची रीत :-
                    </td>
                    <td style="vertical-align: top; text-align: justify;">
                        कार्यकारी मंडळाचा कार्यकाल पाच वर्षांचा राहील निवडणूक दर पाच वर्षांनी सर्वसाधारण सभेत गुप्त मतदान पद्धतीने घेण्यात येईल
                    </td>
                </tr>
            </table>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 20: Application for Public Trust Registration (सार्वजनिक विश्वस्त व्यवस्थेच्या नोंदणीसाठीचा अर्ज - पान २) -->
        <div style="font-family: 'Tiro Devanagari Marathi', serif; font-size: 13px; line-height: 1.4;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; line-height: 1.4;">
                <!-- Row 3 -->
                <tr style="vertical-align: top;">
                    <td style="width: 30px; font-weight: bold; padding: 6px 0;">(३)</td>
                    <td style="width: 280px; font-weight: bold; padding: 6px 10px 6px 0;">विश्वस्त व्यवस्थेचा हेतू</td>
                    <td style="width: 20px; text-align: center; padding: 6px 0;">:-</td>
                    <td style="padding: 6px 0;">परिशिष्ट ( ब ) प्रमाणे</td>
                </tr>
                <!-- Row 4 -->
                <tr style="vertical-align: top;">
                    <td style="width: 30px; font-weight: bold; padding: 6px 0;">(४)</td>
                    <td style="font-weight: bold; padding: 6px 10px 6px 0;">
                        (अ) सार्वजनिक विश्वस्त व्यवस्था निर्माण करणाऱ्या दस्तऐवजाचा तपशील (नक्कल जोडा)<br><br>
                        (ब) सार्वजनिक विश्वस्त व्यवस्था उगम किंवा निर्मिती संबंधीचा दस्तऐवजाशिवाय इतर तपशील (नक्कल जोडा)
                    </td>
                    <td style="text-align: center; padding: 6px 0;">
                        :-<br><br><br>
                        :-
                    </td>
                    <td style="padding: 6px 0;">
                        मेमोरंडम ऑफ असो. ची प्रत.<br><br><br>
                        -||-
                    </td>
                </tr>
                <!-- Row 5 -->
                <tr style="vertical-align: top;">
                    <td style="width: 30px; font-weight: bold; padding: 6px 0;">(५)</td>
                    <td style="font-weight: bold; padding: 6px 10px 6px 0;">
                        सार्वजनिक विश्वस्त व्यवस्थेसंबंधी योजना कोणतीही असल्यास तिचा तपशील (नक्कल जोडा)
                    </td>
                    <td style="text-align: center; padding: 6px 0;">:-</td>
                    <td style="padding: 6px 0;">संस्थेची नियम व नियमावलीची प्रत</td>
                </tr>
                <!-- Row 6 -->
                <tr style="vertical-align: top;">
                    <td style="width: 30px; font-weight: bold; padding: 6px 0;">(६)</td>
                    <td style="font-weight: bold; padding: 6px 10px 6px 0; text-align: justify; line-height: 1.35; font-size: 12px;">
                        जंगम मालमत्ता अशा मालमत्तेच्या प्रत्येक वर्गाच्या अंदाजे किंमतीसह. (टिप:- प्रत्येक वस्तूचे वर्णन ठरविण्याऐवजी अशा मालमत्ताकतींच्या वर्गांचे स्थूल वर्णन करून नोंदी भराव्यात, जसे फर्निचर, पुस्तके वगैरे, रोकड रक्कम विश्वस्तव्यवस्थेच्या, भांडवलाचा भाग असेल तरच फक्त रोकड रकमेसंबंधी नोंद करावी, रोकडच्या बाबतीत प्रत्येक तारण पत्र, कर्जरोखे (Securities) संचय (Stock) शेअर, ऋणपत्र (Debentures) यांचा त्यावर जो क्रमांक असेल तो धरून तपशील द्या )
                    </td>
                    <td style="text-align: center; padding: 6px 0;">:-</td>
                    <td style="padding: 6px 0; line-height: 1.6;">
                        1. &nbsp;&nbsp; अर्जदार जवळ रुपये 707/- जमा.<br><br>
                        2.<br><br>
                        3.
                    </td>
                </tr>
                <!-- Row 7 -->
                <tr style="vertical-align: top;">
                    <td style="width: 30px; font-weight: bold; padding: 6px 0;">(७)</td>
                    <td style="font-weight: bold; padding: 6px 10px 6px 0; line-height: 1.35; font-size: 12px;">
                        (अ) जेथे स्थावर मालमत्ता असेल ते गाव किंवा नगर भूमापन महानगर पालिका किंवा भूमापन क्रमांक क्षेत्र आकार किंवा जुनी दर्शविणारी अथवा मालमत्तेची सविस्तर माहिती ज्या अधिका-याने ती धारण केली असेल त्या धारण अधिका-याचे वर्णन<br><br><br>
                        (ब) प्रत्येक स्थावर मालमत्तेची अंदाजे किंमत
                    </td>
                    <td style="text-align: center; padding: 6px 0;">
                        :-<br><br><br><br><br><br>
                        :-
                    </td>
                    <td style="padding: 6px 0; line-height: 1.6;">
                        संस्था नवीन असल्यामुळे सध्या काही नाही<br>
                        1.<br>
                        2.<br>
                        3.<br><br>
                        संस्था नवीन असल्यामुळे सध्या काही नाही<br>
                        1.<br>
                        2.<br>
                        3.
                    </td>
                </tr>
                <!-- Row 8 -->
                <tr style="vertical-align: top;">
                    <td style="width: 30px; font-weight: bold; padding: 6px 0;">(८)</td>
                    <td style="font-weight: bold; padding: 6px 10px 6px 0;">सार्वजनिक विश्वस्त व्यवस्थेच्या उत्पन्नाची साधने</td>
                    <td style="text-align: center; padding: 6px 0;">:-</td>
                    <td style="padding: 6px 0; line-height: 1.35;">
                        देणगी, वर्गणी, सभासद फीस, शासकीय व निमशासकीय अनुदान इत्यादी.
                    </td>
                </tr>
            </table>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 21: Application for Public Trust Registration (सार्वजनिक विश्वस्त व्यवस्थेच्या नोंदणीसाठीचा अर्ज - पान ३) -->
        <div style="font-family: 'Tiro Devanagari Marathi', serif; font-size: 13.5px; line-height: 1.5;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; line-height: 1.5; margin-bottom: 15px;">
                <!-- Row 9 -->
                <tr style="vertical-align: top;">
                    <td style="width: 35px; font-weight: bold; padding: 4px 0;">(९)</td>
                    <td style="width: 280px; font-weight: bold; padding: 4px 10px 4px 0;">सरासरी ढोबळ वार्षिक उत्पन्न</td>
                    <td style="width: 30px; text-align: center; padding: 4px 0;">:-</td>
                    <td style="padding: 4px 0;">संस्था नवीन असल्यामुळे सध्या काही नाही.</td>
                </tr>
                <!-- Row 10 -->
                <tr style="vertical-align: top;">
                    <td style="width: 35px; font-weight: bold; padding: 4px 0;">(१०)</td>
                    <td style="font-weight: bold; padding: 4px 10px 4px 0;">सरासरी वार्षिक खर्च</td>
                    <td style="text-align: center; padding: 4px 0;">:-</td>
                    <td style="padding: 4px 0;">-||-</td>
                </tr>
                <!-- Row 11 -->
                <tr style="vertical-align: top;">
                    <td style="width: 35px; font-weight: bold; padding: 4px 0;">(११)</td>
                    <td style="font-weight: bold; padding: 4px 10px 4px 0;">
                        सरासरी वार्षिक खर्चाची रक्कम<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;अ) &nbsp;&nbsp;&nbsp;&nbsp; विश्वस्त व व्यवस्थापक यांच्या<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;पगारावर होणारा खर्च<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ब) &nbsp;&nbsp;&nbsp;&nbsp; आस्थापना व नोकर वर्ग यांवर<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;होणारा खर्च<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;क) &nbsp;&nbsp;&nbsp;&nbsp; धार्मिक हेतुप्रीत्यर्थ होणारा खर्च<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ड) &nbsp;&nbsp;&nbsp;&nbsp; किरकोळ हेतुप्रीत्यर्थ होणारा खर्च
                    </td>
                    <td style="text-align: center; padding: 4px 0;">
                        :-<br>
                        :-<br><br>
                        :-<br><br>
                        :-<br>
                        :-
                    </td>
                    <td style="padding: 4px 0;">
                        -||-<br>
                        -||-<br><br>
                        -||-<br><br>
                        -||-<br>
                        -||-
                    </td>
                </tr>
                <!-- Row 12 -->
                <tr style="vertical-align: top;">
                    <td style="width: 35px; font-weight: bold; padding: 4px 0;">(१२)</td>
                    <td style="font-weight: bold; padding: 4px 10px 4px 0;">
                        विश्वस्त व्यवस्थेच्या मालमत्तेवरील भाराचा<br>
                        कोणतेही असल्यास त्यांचा तपशील
                    </td>
                    <td style="text-align: center; padding: 4px 0;">:-</td>
                    <td style="padding: 4px 0;"><br>-||-</td>
                </tr>
                <!-- Row 13 -->
                <tr style="vertical-align: top;">
                    <td style="width: 35px; font-weight: bold; padding: 4px 0;">(१३)</td>
                    <td style="font-weight: bold; padding: 4px 10px 4px 0;">
                        विश्वस्त व्यवस्थेच्या मालमत्ते संबंधातील<br>
                        मालकी हक्काच्या दस्तऐवजाचा तपशील<br>
                        व ते ताब्यात असणाऱ्या विश्वस्तांची नावे.
                    </td>
                    <td style="text-align: center; padding: 4px 0;">:-</td>
                    <td style="padding: 4px 0;"><br>संस्थेच्या अध्यक्ष/सचिवाकडे राहील.</td>
                </tr>
                <!-- Row 14 -->
                <tr style="vertical-align: top;">
                    <td style="width: 35px; font-weight: bold; padding: 4px 0;">(१४)</td>
                    <td style="font-weight: bold; padding: 4px 10px 4px 0;">
                        शेरे कोणतेही असल्यास
                    </td>
                    <td style="text-align: center; padding: 4px 0;">:-</td>
                    <td style="padding: 4px 0;">
                        हिशोबाचे वर्ष 1 एप्रिल ते 31 मार्च<br>
                        असे राहील.
                    </td>
                </tr>
            </table>

            <div style="line-height: 1.5; margin-bottom: 15px;">
                <b>३.&nbsp;&nbsp;&nbsp;&nbsp; फी दाखल रु. ३/- (अक्षरी तीन रुपये फक्त) सोबत पाठवित आहोत.</b><br>
                <b>४.&nbsp;&nbsp;&nbsp;&nbsp; सार्वजनिक विश्वस्त व्यवस्थेसंबंधी विश्वस्तांशी किंवा व्यवस्थापक यांच्याशी करावयाचा कोणताही पत्र व्यवहार पुढील पत्त्यावर करावा.</b>
            </div>

            <div style="line-height: 1.4; margin-left: 25px; margin-bottom: 25px;">
                संस्थेचे नाव &nbsp;&nbsp;&nbsp;:- &nbsp;&nbsp;&nbsp; <b>" ${trustName} "</b><br>
                पत्ता &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:- &nbsp;&nbsp;&nbsp; <b>${address}</b>
            </div>

            <table style="width: 100%; border: none; margin-bottom: 30px;">
                <tr>
                    <td style="width: 50%;">
                        <b>तारीख :- &nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp; /2026</b>
                    </td>
                    <td style="text-align: right; font-weight: bold; padding-right: 30px;">
                        <br>
                        अर्जदाराची सही
                    </td>
                </tr>
            </table>

            <div style="border-top: 1px dashed #000; margin: 15px 0;"></div>

            <div style="text-indent: 40px; text-align: justify; line-height: 1.5; margin-bottom: 15px;">
                मी वर नामनिर्देशित <b>${presidentName}</b>, <b>${address}</b> येथील रहिवासी असून, प्रतिज्ञा करतो व सांगतो की, वरील अर्जात नमूद केलेली माहिती माझ्या पूर्ण माहिती प्रमाणे व विश्वासा प्रमाणे खरी आहे.
            </div>
            
            <div style="font-weight: bold; margin-bottom: 30px; text-indent: 40px;">
                उपरिनिर्दिष्ट जालना येथे गांभीर्यपूर्वक प्रतिज्ञा केली.
            </div>

            <table style="width: 100%; border: none; margin-bottom: 10px;">
                <tr>
                    <td style="width: 50%;">
                        <b>तारीख :- &nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp; /2026</b>
                    </td>
                    <td style="text-align: right; font-weight: bold; padding-right: 30px;">
                        <br>
                        अर्जदाराची सही
                    </td>
                </tr>
            </table>

            <div style="text-align: center; font-weight: bold; margin-top: 15px;">
                माझ्या समक्ष
            </div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 22: Consent Letter for Trust (संमतीपत्राचा नमुना) -->
        <div style="font-family: 'Tiro Devanagari Marathi', serif; font-size: 14px; line-height: 1.5;">
            <div class="title-lg text-center" style="text-decoration: underline; margin-bottom: 15px;">संमतीपत्राचा नमुना</div>
            
            <div class="mb-15" style="line-height: 1.3;">
                <b>प्रति,</b><br>
                <b>मा. सहाय्यक धर्मादाय आयुक्त,</b><br>
                <b>जालना विभाग जालना.</b>
            </div>

            <div class="mb-15">
                <b>महोदय,</b><br>
                <p style="text-indent: 40px; text-align: justify; line-height: 1.5; margin: 5px 0;">
                    <b>${presidentName}</b>, यांनी विश्वस्त व्यवस्था/संस्था/मंडळ <b>" ${trustName} "</b> <b>${address}</b> नोंदविण्यासाठी मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० अन्वये दि. &nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp; /2026 रोजी अर्ज सादर केला आहे. त्या अर्जातील सर्व माहिती खरी आहे. आम्हास त्या संबंधी जास्त सांगावयाचे नाही सदरहू अर्जाची सुनावणीची स्वतंत्र नोटीस आम्हास पाठवण्याची आवश्यकता नाही. नोंदणी प्रमाणपत्र अर्जदाराच्या नावे देण्यास आमची कोणतीही हरकत नाही.
                </p>
            </div>

            <div class="mb-10" style="line-height: 1.3;">
                <b>कळावे,</b>
            </div>
            
            <div style="text-align: right; font-weight: bold; padding-right: 40px; margin-bottom: 5px;">
                आपले,
            </div>

            <!-- Committee Members Table with Dashed Lines -->
            <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 13px; font-family: 'Tiro Devanagari Marathi', serif;">
                <thead>
                    <tr style="border-top: 1px dashed #000; border-bottom: 1px dashed #000;">
                        <th style="padding: 4px 0; text-align: left; font-weight: bold; width: 6%;">अ.क्र.</th>
                        <th style="padding: 4px 0; text-align: left; font-weight: bold; width: 44%;">सभासदाचे संपूर्ण नांव</th>
                        <th style="padding: 4px 0; text-align: left; font-weight: bold; width: 35%;">पत्ता</th>
                        <th style="padding: 4px 0; text-align: center; font-weight: bold; width: 15%;">सही</th>
                    </tr>
                </thead>
                <tbody>
                    ${committeeMembers.map((m, i) => `
                    <tr style="border-bottom: ${i === committeeMembers.length - 1 ? '1px dashed #000' : 'none'};">
                        <td style="padding: 8px 0; vertical-align: top;">${i + 1}.</td>
                        <td style="padding: 8px 0; vertical-align: top; font-weight: bold;">${m.name || '_____'}</td>
                        <td style="padding: 8px 0; vertical-align: top; font-size: 12px; line-height: 1.3;">${m.address || '_____'}</td>
                        <td style="padding: 8px 0; vertical-align: middle; text-align: center;">
                            <span style="border-bottom: 1px solid #000; width: 90px; display: inline-block;">&nbsp;</span>
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>

            <table style="width: 100%; border: none; margin-top: 15px; font-size: 13.5px;">
                <tr>
                    <td style="width: 40%;"></td>
                    <td style="text-align: right; font-weight: bold; padding-right: 30px; line-height: 1.4;">
                        वरील सर्व सह्या मी ओळखतो<br><br>
                        (अर्जदाराची सही.)<br><br>
                        <b>${presidentName}</b>
                    </td>
                </tr>
            </table>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 23: Affidavit Page 1 (प्रतिज्ञापत्र - पान १) -->
        <div class="title-lg text-center" style="text-decoration: underline;">प्रतिज्ञापत्र</div>
        <div class="mb-20 mt-20" style="line-height: 2;">
            मी खाली सही करणार <b>${presidentName}</b>, वय <b>${presidentAge}</b> वर्षे, व्यवसाय - <b>${presidentOccupation}</b>, राहणार <b>${address}</b>.<br>
            सत्य प्रतिज्ञेवर खालीलप्रमाणे लिहून देतो की,<br><br>
            १) मी <b>" ${trustName} "</b> ${address}. या संस्थेचा अध्यक्ष/विश्वस्त असून संस्था नोंदणी अधिनियम १८६० व मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० अन्वये सदर संस्था नोंदणी करण्याकरिता सहाय्यक संस्था निबंधक तथा सहाय्यक धर्मादाय आयुक्त जालना विभाग जालना यांच्या कार्यालयात प्रस्ताव सादर केला आहे. प्रस्तावासोबत जोडलेले सर्व पुरावे, नियम व नियमावली तसेच विवरणातील मजकूर खरा व सत्य आहे. सदर संस्था ही धर्मादाय व शैक्षणिक स्वरूपाच्या उद्देशाकरिता स्थापन केली असून, तिचे ध्येय व उद्देश संस्था नोंदणी अधिनियम १८६० च्या कलम २० ला अनुसरून आहेत.<br><br>
            २) या संस्थेच्या विधानपत्रावर व नियमावलीवर सह्या करणाऱ्या सर्व सभासदांना मी चांगल्या प्रकारे ओळखतो व त्यांनी माझ्या समक्ष स्वाक्षऱ्या केल्या आहेत.<br><br>
            ३) आज तारखेपर्यंत नोंदणी प्रकरणातील मजकुरामध्ये कोणताही बदल झालेला नाही.<br>
        </div>
        <div class="flex-between" style="margin-top: 50px;">
            <div>स्थळ : ${place}<br>दिनांक : ${date}</div>
            <div style="text-align: center;">
                <b>प्रतिज्ञाक</b><br><br><br>
                <b>${presidentName}</b>
            </div>
        </div>
        <div style="text-align: center; margin-top: 40px; font-weight: bold; font-size: 14px;">
            (.. पान २ वर चालू ..)
        </div>

        <div class="page-break"></div>

        <!-- PAGE 24: Affidavit Page 2 (प्रतिज्ञापत्र - पान २) -->
        <div class="title-lg text-center" style="text-decoration: underline;">प्रतिज्ञापत्र (पान २)</div>
        <div class="mb-20 mt-20" style="line-height: 2;">
            ४) वरील नावाची अथवा या नामाशी मिळतीजुळती असणारी कोणतीही संस्था/मंडळ आमच्या गावात व परिसरात सध्या अस्तित्वात नाही व नोंदणीकृत नाही.<br><br>
            ५) आज तारखेपर्यंत संस्थेच्या नावावर कोणत्याही प्रकारची स्थावर मालमत्ता नाही. जंगम मालमत्ता म्हणून संस्थेकडे फक्त रोख रक्कम रुपये ७०७/- (अक्षरी सातशे सात रुपये फक्त) जमा असून ती अध्यक्ष/सचिव यांच्या ताब्यात सुरक्षित आहे.<br><br>
            ६) संस्थेच्या कार्यालयाचा पत्ता <b>" ${trustName} "</b> ${address} हा असून सदर जागा ही भाडेतत्वावर घेण्यात आली आहे. त्यापुष्ट्यर्थ घरमालकाचे नाहरकत प्रमाणपत्र, टॅक्स पावती, पी.आर.कार्ड, ८-अ चा उतारा इत्यादी कागदपत्रे या प्रस्तावासोबत जोडली आहेत.<br><br>
            सदर प्रस्तावाबाबत किंवा पत्त्याबाबत भविष्यात काही वाद निर्माण झाल्यास अथवा तक्रार आल्यास त्याची संपूर्ण जबाबदारी वैयक्तिक व सामूहिकरीत्या माझी व कार्यकारी मंडळाची राहील. कार्यालयाच्या पत्त्यात काही बदल झाल्यास तो नियमानुसार आपल्या कार्यालयाला अवगत करण्यात येईल.<br><br>
            हे प्रतिज्ञापत्र मी स्वेच्छेने व राजीखुशीने लिहून दिले असून ते सत्य व बरोबर आहे.
        </div>
        <div class="flex-between" style="margin-top: 50px;">
            <div>स्थळ : ${place}<br>दिनांक : ${date}</div>
            <div style="text-align: center;">
                <b>प्रतिज्ञाक</b><br><br><br>
                <b>${presidentName}</b>
            </div>
        </div>
        <hr style="margin: 30px 0;">
        <div style="margin-left: 50%; font-size: 13px;">
            माझ्या समक्ष प्रतिज्ञाकाची सही घेतली व ओळख पटवली.<br><br><br>
            <b>विशेष कार्यकारी दंडाधिकारी / नोटरी संपूर्ण नांव व शिक्का.</b>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 25: NOC (नाहरकत प्रमाणपत्र) -->
        <div class="title-lg text-center" style="border: 2px solid #000; padding: 10px; width: 300px; margin: 0 auto;">नाहरकत प्रमाणपत्र</div>
        <div class="mb-20 mt-20" style="line-height: 2.5;">
            मी, <b>${noc.name}</b> वय <b>${noc.age}</b> वर्षे<br>
            रा. <b>${noc.address}</b><br>
            घर नंबर / म्युन्शिपीपल नंबर <b>${noc.propertyNumber}</b> असा असून, यातील एक खोली<br>
            संस्थेचे नांव <b>" ${trustName} "</b><br>
            या संस्थेस संस्थेच्या कार्यालया करीता वापरण्यास दिली आहे.<br>
            करीता नाहरकत प्रमाणपत्र देत आहे.<br>
        </div>
        <div class="mt-20 flex-between">
            <div>स्थळ : ${place}<br>दिनांक : ${date}</div>
            <div style="text-align: center;">
                सही (घरमालक)<br><br><br>
                <b>${noc.name}</b>
            </div>
        </div>

    </body>
    </html>
    `;
};
