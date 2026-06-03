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
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px;">
            <thead>
                <tr>
                    <th style="border: 1px solid #000; padding: 6px;">अ.क्र.</th>
                    <th style="border: 1px solid #000; padding: 6px;">सभासदाचे संपूर्ण नांव</th>
                    <th style="border: 1px solid #000; padding: 6px;">पत्ता</th>
                    <th style="border: 1px solid #000; padding: 6px;">पद</th>
                    <th style="border: 1px solid #000; padding: 6px;">वय</th>
                    <th style="border: 1px solid #000; padding: 6px;">व्यवसाय</th>
                    <th style="border: 1px solid #000; padding: 6px;">राष्ट्रीयत्व</th>
                </tr>
            </thead>
            <tbody>
                ${committeeMembers.map((m, i) => `
                <tr>
                    <td style="border: 1px solid #000; padding: 6px; text-align: center;">${i + 1}</td>
                    <td style="border: 1px solid #000; padding: 6px;">${m.name || '_____'}</td>
                    <td style="border: 1px solid #000; padding: 6px;">${m.address || '_____'}</td>
                    <td style="border: 1px solid #000; padding: 6px;">${m.designation || '_____'}</td>
                    <td style="border: 1px solid #000; padding: 6px; text-align: center;">${m.age || '_____'}</td>
                    <td style="border: 1px solid #000; padding: 6px;">${m.occupation || '_____'}</td>
                    <td style="border: 1px solid #000; padding: 6px;">${m.nationality || 'भारतीय'}</td>
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
        <div class="header-box">
            परिशिष्ट " अ "<br>
            <span style="font-size: 13px; font-weight: normal;">(Society Application)</span>
        </div>

        <div class="flex-between mb-20">
            <div>
                प्रति,<br>
                मा. सहाय्यक संस्था निबंधक,<br>
                जालना विभाग जालना.
            </div>
            <div>
                दि. ${date}
            </div>
        </div>

        <table style="width: 100%; border: none; margin-bottom: 30px;">
            <tr>
                <td style="width: 120px; font-weight: bold; vertical-align: top;">विषय :-</td>
                <td style="font-weight: bold; text-decoration: underline;">संस्था नोंदणी अधिनियम 1860 अन्वये नोंदणी बाबत....</td>
            </tr>
            <tr>
                <td style="width: 120px; font-weight: bold; vertical-align: top; padding-top: 10px;">संस्थेचे नांव :-</td>
                <td style="padding-top: 10px; font-weight: bold; font-size: 16px;">
                    " ${trustName} "<br>
                    <span style="font-size: 14px; font-weight: normal;">${address}</span>
                </td>
            </tr>
        </table>

        <div class="mb-20">
            महोदय,<br>
            <p class="indent">
                निवेदन सादर करण्यात येते की, वरिल विषयात नमुद केलेल्या संस्थेची नोंदणी अधिनियम 1860 अन्वये
                नोंदणी करावयाची आहे. सबब आपणाकडे खालील प्रमाणे कागदपत्रे सादर करण्यात आलेली आहेत.
            </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
                <tr>
                    <th style="border: 1px solid #000; padding: 8px; width: 50px;">अ.क्र.</th>
                    <th style="border: 1px solid #000; padding: 8px;">कागदपत्राचे नाव</th>
                    <th style="border: 1px solid #000; padding: 8px; width: 100px;">सादर केले</th>
                </tr>
            </thead>
            <tbody>
                ${checklistHtml || `
                    <tr><td style="border: 1px solid #000; padding: 8px; text-align: center;">1</td><td style="border: 1px solid #000; padding: 8px;">विधान पत्र (ज्ञापन) मेमोरंडम ऑफ असोसिएशन</td><td style="border: 1px solid #000; padding: 8px; text-align: center;">होय</td></tr>
                    <tr><td style="border: 1px solid #000; padding: 8px; text-align: center;">2</td><td style="border: 1px solid #000; padding: 8px;">नियम व नियमावलीची सत्यप्रत</td><td style="border: 1px solid #000; padding: 8px; text-align: center;">होय</td></tr>
                    <tr><td style="border: 1px solid #000; padding: 8px; text-align: center;">3</td><td style="border: 1px solid #000; padding: 8px;">संमतीपत्र व अधिकारपत्र</td><td style="border: 1px solid #000; padding: 8px; text-align: center;">होय</td></tr>
                `}
            </tbody>
        </table>

        <div class="mb-20">
            <p class="indent">
                पुढे असेही निवेदन करण्यात येते की, वरील संस्थेचे सर्व उद्देश सन 1860 च्या संस्था नोंदणी या अधिनियमाच्या
                कलम 20 अन्वये असून, वरील संस्थेच्या नावांची या नामसदृष्य असलेली अन्य संस्था माझ्या माहिती प्रमाणे
                अस्तित्वात नाही. नोंदणी शुल्क रू. 50/- (अक्षरी पन्नास रूपये फक्त ) भरण्यासाठी तयार आहे.
            </p>
            <p style="text-align: center; font-weight: bold; margin-top: 20px;">
                तरी वरील संस्था नोंदणी अधिनियम 1860 अन्वये त्वरीत नोंदवावी अशी विनंती आहे.
            </p>
        </div>

        <div class="flex-between" style="margin-top: 50px;">
            <div>
                सहपत्रे :- वरील प्रमाणे
            </div>
            <div style="text-align: center;">
                आपला विश्वासु,<br><br><br>
                <b>${presidentName}</b><br>
                अध्यक्ष<br>
                " ${trustName} "<br>
                ${address}
            </div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 2: Memorandum -->
        <div class="title-lg">परिशिष्ट " ब "<br><span style="font-size: 15px; font-weight: normal; text-decoration: underline;">या संस्थेचे ज्ञापन</span></div>
        <div class="title-md" style="text-decoration: underline;">मेमोरंडम ऑफ असोसिएशन<br>(Memorandum of Association)</div>

        <table style="width: 100%; border: none; margin-bottom: 20px;">
            <tr>
                <td style="width: 30px; font-weight: bold; vertical-align: top;">1)</td>
                <td style="width: 180px; font-weight: bold; vertical-align: top;">संस्थेचे नांव :-</td>
                <td style="font-weight: bold; font-size: 16px;">" ${trustName} "</td>
            </tr>
            <tr>
                <td style="width: 30px; font-weight: bold; vertical-align: top; padding-top: 15px;">2)</td>
                <td style="width: 180px; font-weight: bold; vertical-align: top; padding-top: 15px;">संस्थेच्या कार्यालयाचा पत्ता :</td>
                <td style="padding-top: 15px;">${address}</td>
            </tr>
            <tr>
                <td style="width: 30px; font-weight: bold; vertical-align: top; padding-top: 15px;">3)</td>
                <td style="width: 180px; font-weight: bold; vertical-align: top; padding-top: 15px;">संस्थेचे उद्देश :</td>
                <td style="padding-top: 15px; text-decoration: underline; font-weight: bold;">या संस्थेचे उद्देश खालील प्रमाणे आहेत.</td>
            </tr>
        </table>

        <div style="margin-left: 50px;">
            ${objectives.map((obj, i) => `
                <div style="margin-bottom: 8px;"><b>${i + 1})</b> ${obj || '_____'}</div>
            `).join('')}
        </div>

        <div class="page-break"></div>

        <!-- PAGE 3: Executive Committee -->
        <div style="margin-bottom: 20px;">
            <b>4) " ${trustName} "</b> ${address}. या संस्थेचे 
            नियम व नियमावली प्रमाणे या कार्यकारी मंडळावर सदरहु संस्थेच्या कार्यकारी मंडळाचा संस्थेचा कार्यभार सोपविण्यात 
            आला आहे. त्या पहिल्या कार्यकारी मंडळाचा संपुर्ण पत्ता, हुद्दा, वय, व्यवसाय, राष्ट्रीयत्व खालील प्रमाणे आहे.
        </div>
        ${renderCommitteeTable()}
        <div class="flex-between mt-20" style="padding: 0 50px;">
            <div>अध्यक्ष: ${presidentName}</div>
            <div>उपाध्यक्ष: ${vicePresidentName}</div>
            <div>सचिव: ${secretaryName}</div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 4: Signatures -->
        <div style="margin-bottom: 20px;">
            <b>5.</b> आम्ही खालील सह्या करणार <b>" ${trustName} "</b> ${address}. 
            चे पदाधिकारी सदस्य जाहीर करतो की, संस्था अधिनियम 1860 अन्वये अभिप्रेत
            केलेली संस्था अस्तित्वात आणण्याची आमची ईच्छा असून वरील उद्देशाने आम्ही एकत्र येऊन 
            <b>" ${trustName} "</b> ${address}. ही संस्था आज दिनांक <b>${date}</b> रोजी स्थापन केली असून 
            संस्था नोंदणी अधिनियम 1860 अन्वये नोंदणी करण्यासाठी आम्ही या विधानपत्रावर सह्या केल्या आहेत.
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

        <!-- PAGE 5: Rules & Regulations -->
        <div class="title-lg">परिशिष्ट " क "</div>
        <div class="title-md">" ${trustName} "<br><span style="font-size: 14px; font-weight: normal;">${address}</span></div>
        <div class="title-sm text-center">या संस्थेचे नियम व नियमावली (Rules & Regulation/Constitution)</div>

        <div class="mb-20 mt-20">
            <b>1) नियमावलीतील संदर्भिय शब्दाची व्याख्या :-</b><br>
            अ) संस्था : संस्था म्हणजे " ${trustName} " ${address}. ही संस्था नोंदणी कायदा 1860 अन्वये नोंद होणारी संस्था.<br>
            ब) अध्यक्ष : अध्यक्ष म्हणजे " ${trustName} " ${address}. या संस्थेचा अध्यक्ष.<br>
            क) उपाध्यक्ष : उपाध्यक्ष म्हणजे " ${trustName} " ${address}. या संस्थेचा उपाध्यक्ष.<br>
            ड) सचिव : सचिव म्हणजे " ${trustName} " ${address}. या संस्थेचा सचिव<br>
            इ) सहसचिव : सहसचिव म्हणजे " ${trustName} " ${address}. या संस्थेचा सहसचिव.<br>
            फ) सभासद : सभासद म्हणजे " ${trustName} " ${address}. या संस्थेची वर्गणी भरून झालेला आजीव सभासद, वार्षिक सभासद व कार्यकारी मंडळावर निवडून आलेले सभासद.
        </div>
        <div class="mb-20">
            <b>2) कार्यक्षेत्र :</b> या संस्थेचे कार्यक्षेत्र संपूर्ण महाराष्ट्र राज्य राहील.<br>
            <b>3) हिशोबाचे वर्ष :</b> या संस्थेचे हिशोबाचे वर्ष 1 एप्रिल ते 31 मार्च असे राहील.<br>
            <b>4) सभासदत्व व त्याची नोंदणी पध्दती :-</b><br>
            अ) कोणत्याही भारतीय सज्ञान व्यक्तीस/महिलेस संस्थेचे सभासद होता येईल.<br>
            ब) सभासद होण्यासाठी त्याने/तीने संस्थेला लेखी अर्ज करावा.<br>
            क) कार्यकारी मंडळाचा या बाबतचा निर्णय अंतिम राहिल.<br>
        </div>
        <div class="mb-20">
            <b>5) सभासदांचे प्रकार :-</b><br>
            अ) आजीव सभासद :- आजिव सभासद होण्यासाठी प्रत्येकाने सभासद वर्गणी रूपये 101/- फी संस्थेस अदा केली पाहिजे.<br>
            ब) वार्षिक सभासद :- वार्षिक सभासद होण्यासाठी सभासदाने वा व्यक्तीने दरवर्षी 51/- रूपये सभासद वर्गणी अदा करावयास हवी.
        </div>

        <div class="page-break"></div>

        <!-- PAGE 6: Rules Contd -->
        <div class="mb-20">
            <b>6) सभासदत्व रद्द होणे :-</b> कोणताही सभासद कायदेशीर गुन्हेगार ठरला असेल, सभासद वर्गणी दिली नसेल, राजीनामा दिल्यास तो राजीनामा कार्यकारी मंडळाने मंजुर केल्यास, मयत झाल्यास, देश सोडून गेला असेल, संस्थेला हानी किंवा नुकसान पोहचवित असेल किंवा योग्य कारणावरून कार्यकारी मंडळाने बहुमताने ठराव मंजूर करून काढून टाकल्यास सभासदत्व रद्द झाले असे समजले जाईल.
        </div>
        <div class="mb-20">
            <b>7) सर्वसाधारण सभा तिचे अधिकार व कर्तव्ये :-</b><br>
            सर्वसाधारण सभा म्हणजे संस्थेच्या सभासदांची सभा संस्थेच्या आर्थिक वर्ष संपल्यानंतर दोन महीन्याच्या आत वार्षिक सर्वसाधारण सभा घेतली जाईल, सर्वसाधारण सभेचे कार्ये व अधिकार खालील प्रमाणे आहे.<br>
            अ) मागील सर्वसाधारण सभेचा वृत्तांत निर्णय वाचून कायम करणे.<br>
            ब) वार्षिक जमाखर्च मंजूर करणे, वार्षिक अहवाल मंजूर करणे, कार्यकारिणीच्या आर्थिक धोरणात्मक स्वरूपाच्या ठरावांना मान्यता देणे.<br>
            ड) आयत्यावेळी येणाऱ्या विषयावर अध्यक्षांच्या संमतीने निर्णय घेणे.
        </div>
        <div class="mb-20">
            <b>8) सर्वसाधारण सभेची सुचना व गणसंख्या :-</b><br>
            सचिव हे सर्वसाधारण सभेची सूचना ही प्रत्येक सभासदास सभेच्या तारखेच्या 15 दिवस अगोदर पोस्टाने किंवा समक्ष सही घेऊन देतील. त्या सुचनेवर सभेचे ठिकाण, विषय वेळ व दिनांक लिहिलेली असेल. या सभेत 3/5 सभासदांची गणसंख्या असेल.
        </div>
        <div class="mb-20">
            <b>9) विशेष सर्वसाधारण सभा तिचे कार्य :-</b><br>
            काही महत्त्वाच्या व तातडीच्या कामासाठी सर्वसाधारण सभा घेतली जाईल, त्यास विशेष सर्वसाधारण सभा संबोधले जाईल. या सभेस 3/5 सभासदांची गणसंख्या राहिल. या सभेस 15 दिवसांच्या नोटीस पोस्टाने वा समक्ष सही घेऊन दिली जाईल.
        </div>
        <div class="mb-20">
            <b>10) कार्यकारी मंडळ व पदाधिकारी यांची रचना :-</b><br>
            अ) संस्थेचे कार्यकारी मंडळ कमीत कमी 7 सदस्यांचे व जास्तीत जास्त 13 सदस्यांचे राहील.<br>
            ब) कार्यकारी मंडळावर संस्थेच्या सर्व सभासदास निवडून जाता येईल.<br>
            क) संस्थेच्या कार्यकारी मंडळात खालीलप्रमाणे पदाधिकारी असतील. एक-अध्यक्ष, एक-उपाध्यक्ष, एक- सचिव, एक - सहसचिव, एक- कोषाध्यक्ष व इतर सभासद असतील.
        </div>

        <div class="page-break"></div>

        <!-- PAGE 7: Rules 11-12 -->
        <div class="mb-20">
            <b>11) कार्यकारी मंडळाच्या बैठका व गणसंख्या :-</b><br>
            अ) कार्यकारी मंडळाच्या बैठका दर तीन महिन्यांनी एकदा घेतल्या जातील.<br>
            ब) कार्यकारी मंडळाची बैठक घेण्यासाठी एकूण सदस्यांच्या 1/2 इतकी गणसंख्या असणे आवश्यक आहे.<br>
            क) बैठकीची सूचना सचिवाने सात दिवस अगोदर सर्व सदस्यांना द्यावी.<br>
            ड) अध्यक्ष अनुपस्थित असल्यास उपाध्यक्ष बैठकीचे अध्यक्षपद भूषवितील.<br>
            इ) निर्णय बहुमताने घेतले जातील. समसमान मते पडल्यास अध्यक्षांचे मत निर्णायक असेल.
        </div>
        <div class="mb-20">
            <b>12) कार्यकारी मंडळाचे अधिकार व कर्तव्ये :-</b><br>
            अ) संस्थेच्या उद्देशाच्या पूर्ततेसाठी आवश्यक त्या सर्व उपाय योजना करणे.<br>
            ब) संस्थेच्या निधीचे व्यवस्थापन करणे.<br>
            क) संस्थेच्या वतीने करार, तह इत्यादी करणे.<br>
            ड) संस्थेच्या मालमत्तेचे संरक्षण व संवर्धन करणे.<br>
            इ) संस्थेच्या सर्व कर्मचाऱ्यांची नेमणूक, बडतर्फी व त्यांचे वेतन निश्चित करणे.<br>
            फ) वार्षिक अहवाल व जमाखर्च पत्रक तयार करणे व सर्वसाधारण सभेपुढे मांडणे.<br>
            ग) संस्थेच्या उद्देशाच्या पूर्ततेसाठी उपकमिट्या, उपसमित्या स्थापन करणे.<br>
            ह) सदस्यांच्या प्रवेशास मंजुरी देणे किंवा नाकारणे.
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
                <td style="padding-top: 15px;">_________________</td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding-top: 15px;">3)</td>
                <td style="font-weight: bold; padding-top: 15px;">संस्था नोंदणी अधिनियम :-</td>
                <td style="padding-top: 15px;">_________________</td>
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
                <td style="padding-top: 15px;">1860 नुसार नोंदणी क्र. _________</td>
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
                <td style="padding-top: 15px;">1860 नुसार नोंदणी क्र. _________</td>
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
        <div class="title-md text-center">परिशिष्ट - दोन (Schedule-2)<br><span style="text-decoration: underline;">(नियम - 8)</span><br><span style="text-decoration: underline;">संस्थेच्या नोकर वर्गाची माहिती देणारा तक्ता</span></div>
        <div class="mb-20">
            <b>संस्थेचे नाव :</b> " ${trustName} " ${address}
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px;">
            <thead>
                <tr>
                    <th style="border: 1px solid #000; padding: 6px;">अ.क्र.</th>
                    <th style="border: 1px solid #000; padding: 6px;">कर्मचाऱ्याचे नाव व हुद्दा</th>
                    <th style="border: 1px solid #000; padding: 6px;">वेतन</th>
                    <th style="border: 1px solid #000; padding: 6px;">पूर्ण वेळ / अर्धवेळ</th>
                    <th style="border: 1px solid #000; padding: 6px;">कायम / तात्पुरते</th>
                    <th style="border: 1px solid #000; padding: 6px;">मासिक भत्ता व इतर सोयी</th>
                    <th style="border: 1px solid #000; padding: 6px;">शेरा</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #000; padding: 15px; text-align: center;">1</td>
                    <td style="border: 1px solid #000; padding: 15px;">ग्रंथपाल (Librarian)</td>
                    <td style="border: 1px solid #000; padding: 15px; text-align: center;">मानधन</td>
                    <td style="border: 1px solid #000; padding: 15px; text-align: center;">अर्धवेळ</td>
                    <td style="border: 1px solid #000; padding: 15px; text-align: center;">तात्पुरते</td>
                    <td style="border: 1px solid #000; padding: 15px; text-align: center;">निरंक</td>
                    <td style="border: 1px solid #000; padding: 15px; text-align: center;">कार्यकारी मंडळाने नेमलेला</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000; padding: 15px; text-align: center;">2</td>
                    <td style="border: 1px solid #000; padding: 15px;">शिपाई (Peon)</td>
                    <td style="border: 1px solid #000; padding: 15px; text-align: center;">मानधन</td>
                    <td style="border: 1px solid #000; padding: 15px; text-align: center;">अर्धवेळ</td>
                    <td style="border: 1px solid #000; padding: 15px; text-align: center;">तात्पुरते</td>
                    <td style="border: 1px solid #000; padding: 15px; text-align: center;">निरंक</td>
                    <td style="border: 1px solid #000; padding: 15px; text-align: center;">कार्यकारी मंडळाने नेमलेला</td>
                </tr>
            </tbody>
        </table>
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
        <div class="title-lg text-center">सार्वजनिक विश्वस्त व्यवस्थेच्या नोंदणीसाठीचा अर्ज</div>
        <div class="title-md text-center">अनुसूची - २ (नियम ६ पहा)</div>
        <div class="mt-20 mb-20">
            प्रति,<br>
            मा. सहाय्यक धर्मादाय आयुक्त,<br>
            जालना विभाग जालना.<br><br>
            <b>विषय :- मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० चे कलम १८ अन्वये अर्ज...</b>
        </div>
        <div class="mb-20">
            महोदय,<br>
            <p class="indent">
                मी <b>${presidentName}</b> राहणार <b>${address}</b> या द्वारे निर्देशित सार्वजनिक विश्वस्त व्यवस्थेचा विश्वस्त या नात्याने सदर सार्वजनिक विश्वस्त व्यवस्थेच्या नोंदणीसाठी मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० च्या कलम १८ अन्वये अर्ज सादर करीत आहे. मी यासोबत विहित फी रु. ३/- (अक्षरी तीन रुपये फक्त) तसेच आवश्यक ती कागदपत्रे व माहिती सादर करीत आहे.
            </p>
        </div>
        <table style="width: 100%; border: none; margin-bottom: 20px;">
            <tr>
                <td style="width: 30px; font-weight: bold; vertical-align: top;">(१)</td>
                <td style="width: 250px; font-weight: bold; vertical-align: top;">सार्वजनिक विश्वस्त व्यवस्थेचे नाव व पत्ता :-</td>
                <td style="font-weight: bold; font-size: 15px;">"${trustName}"<br><span style="font-size: 13px; font-weight: normal;">${address}</span></td>
            </tr>
            <tr>
                <td style="width: 30px; font-weight: bold; vertical-align: top; padding-top: 15px;">(२)</td>
                <td style="width: 250px; font-weight: bold; vertical-align: top; padding-top: 15px;">विश्वस्त व व्यवस्थापक यांची नावे, पत्ता व पद :-</td>
                <td style="padding-top: 15px;">या पहिल्या संचालक मंडळाचा तपशील खालीलप्रमाणे आहे.</td>
            </tr>
        </table>
        ${renderCommitteeTable()}
        <div class="mt-20 flex-between">
            <div>स्थळ: ${place}</div>
            <div>दिनांक: ${date}</div>
        </div>
        <div style="margin-top: 40px; text-align: right;">
            अर्जदाराची सही<br><br><br>
            <b>${presidentName}</b>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 20: Application for Public Trust Registration (सार्वजनिक विश्वस्त व्यवस्थेच्या नोंदणीसाठीचा अर्ज - पान २) -->
        <div class="title-md text-center">सार्वजनिक विश्वस्त व्यवस्थेच्या नोंदणीसाठीचा अर्ज (पान २)</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px;">
            <tr>
                <td style="width: 50px; border: 1px solid #000; padding: 8px; font-weight: bold; text-align: center; vertical-align: top;">(३)</td>
                <td style="width: 250px; border: 1px solid #000; padding: 8px; font-weight: bold; vertical-align: top;">विश्वस्त व्यवस्थेचा हेतू (उद्देश) :-</td>
                <td style="border: 1px solid #000; padding: 8px; vertical-align: top;">या संस्थेचे उद्देश परिशिष्ट ( ब ) मेमोरंडम ऑफ असोसिएशन मधील उद्देशांनुसार राहतील.</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; text-align: center; vertical-align: top;">(४)</td>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; vertical-align: top;">
                    (अ) सार्वजनिक विश्वस्त व्यवस्था निर्माण करणाऱ्या दस्तऐवजाचा तपशील (नक्कल जोडा) :-<br><br>
                    (ब) सार्वजनिक विश्वस्त व्यवस्था उगम किंवा निर्मिती संबंधीचा दस्तऐवजाशिवाय इतर तपशील (नक्कल जोडा) :-
                </td>
                <td style="border: 1px solid #000; padding: 8px; vertical-align: top;">
                    (अ) संस्थेचा मेमोरंडम ऑफ असोसिएशन ची सत्यप्रत.<br><br>
                    (ब) - निरंक -
                </td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; text-align: center; vertical-align: top;">(५)</td>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; vertical-align: top;">सार्वजनिक विश्वस्त व्यवस्थेसंबंधी योजना कोणतीही असल्यास तिचा तपशील (नक्कल जोडा) :-</td>
                <td style="border: 1px solid #000; padding: 8px; vertical-align: top;">संस्थेची नियम व नियमावली (बाय-लॉज) ची सत्यप्रत.</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; text-align: center; vertical-align: top;">(६)</td>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; vertical-align: top;">जंगम मालमत्ता अशा मालमत्तेच्या प्रत्येक वर्गाच्या अंदाजे किंमतीसह (फर्निचर, पुस्तके वगैरे) :-</td>
                <td style="border: 1px solid #000; padding: 8px; vertical-align: top;">
                    १) संस्थेजवळ रोख रक्कम रुपये ७०७/- (सातशे सात रुपये फक्त) अध्यक्ष/सचिव यांच्याकडे जमा आहे.<br>
                    २) फर्निचर व इतर साहित्य - नवीन असल्यामुळे सध्या काही नाही.
                </td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; text-align: center; vertical-align: top;">(७)</td>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; vertical-align: top;">
                    (अ) जिथे स्थावर मालमत्ता असेल ते गाव, भूमापन क्रमांक, क्षेत्र, आकार दर्शविणारी माहिती :-<br><br>
                    (ब) प्रत्येक स्थावर मालमत्तेची अंदाजे किंमत :-
                </td>
                <td style="border: 1px solid #000; padding: 8px; vertical-align: top;">
                    (अ) - निरंक - (सध्या संस्थेच्या नावावर कोणतीही स्थावर मालमत्ता नाही.)<br><br>
                    (ब) - निरंक -
                </td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; text-align: center; vertical-align: top;">(८)</td>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; vertical-align: top;">सार्वजनिक विश्वस्त व्यवस्थेच्या उत्पन्नाची साधने :-</td>
                <td style="border: 1px solid #000; padding: 8px; vertical-align: top;">देणग्या, लोकवर्गणी, सभासद वर्गणी, प्रवेश फी, शासकीय व निमशासकीय अनुदान इत्यादी.</td>
            </tr>
        </table>
        <div class="mt-20 flex-between">
            <div>स्थळ: ${place}</div>
            <div style="text-align: center;">
                <b>अर्जदाराची सही</b><br><br>
                <b>${presidentName}</b>
            </div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 21: Application for Public Trust Registration (सार्वजनिक विश्वस्त व्यवस्थेच्या नोंदणीसाठीचा अर्ज - पान ३) -->
        <div class="title-md text-center">सार्वजनिक विश्वस्त व्यवस्थेच्या नोंदणीसाठीचा अर्ज (पान ३)</div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px;">
            <tr>
                <td style="width: 50px; border: 1px solid #000; padding: 8px; font-weight: bold; text-align: center; vertical-align: top;">(९)</td>
                <td style="width: 250px; border: 1px solid #000; padding: 8px; font-weight: bold; vertical-align: top;">सरासरी एकूण वार्षिक उत्पन्न :-</td>
                <td style="border: 1px solid #000; padding: 8px; vertical-align: top;">नवीन स्थापना असल्यामुळे सध्या काही नाही. (अंदाजे रुपये १०००/- ते ५०००/- वार्षिक वर्गणीद्वारे)</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; text-align: center; vertical-align: top;">(१०)</td>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; vertical-align: top;">सरासरी एकूण वार्षिक खर्च :-</td>
                <td style="border: 1px solid #000; padding: 8px; vertical-align: top;">नवीन स्थापना असल्यामुळे सध्या काही नाही. (संस्थेच्या उद्देशांवर खर्च केला जाईल.)</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; text-align: center; vertical-align: top;">(११)</td>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; vertical-align: top;">
                    सरासरी एकूण वार्षिक खर्चाची रक्कम :-<br>
                    (अ) विश्वस्त व व्यवस्थापक यांच्या पगारावर होणारा खर्च :-<br>
                    (ब) आस्थापना व नोकर वर्ग यावर होणारा खर्च :-<br>
                    (क) धार्मिक हेतू प्रीत्यर्थ होणारा खर्च :-<br>
                    (ड) या व्यतिरिक्त इतर किरकोळ खर्च :-
                </td>
                <td style="border: 1px solid #000; padding: 8px; vertical-align: top;">
                    <br>
                    (अ) - निरंक - (कोणतेही वेतन दिले जात नाही.)<br>
                    (ब) - निरंक - (सध्या मानधनावर सेवक असतील.)<br>
                    (क) - निरंक -<br>
                    (ड) अंदाजे रुपये ५००/- (कार्यालयीन टपाल व स्टेशनरी खर्च)
                </td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; text-align: center; vertical-align: top;">(१२)</td>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; vertical-align: top;">विश्वस्त व्यवस्थेच्या मालमत्तेवरील भाराचा तपशील (गहाण/कर्ज असल्यास) :-</td>
                <td style="border: 1px solid #000; padding: 8px; vertical-align: top;">- निरंक - (मालमत्तेवर कोणताही भार नाही.)</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; text-align: center; vertical-align: top;">(१३)</td>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; vertical-align: top;">मालकी हक्काच्या दस्तऐवजाचा तपशील व ते ताब्यात असणाऱ्या विश्वस्तांची नावे :-</td>
                <td style="border: 1px solid #000; padding: 8px; vertical-align: top;">सर्व मूळ दस्तऐवज संस्थेच्या कार्यालयात अध्यक्ष/सचिव यांच्या ताब्यात राहतील.</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; text-align: center; vertical-align: top;">(१४)</td>
                <td style="border: 1px solid #000; padding: 8px; font-weight: bold; vertical-align: top;">शेरे कोणतेही असल्यास :-</td>
                <td style="border: 1px solid #000; padding: 8px; vertical-align: top;">हिशोबाचे वर्ष १ एप्रिल ते ३१ मार्च असे राहील.</td>
            </tr>
        </table>
        <div class="mb-20 mt-20">
            ३. अर्ज फी रु. ३/- (अक्षरी तीन रुपये फक्त) सोबत दाखल केली आहे.<br>
            ४. सार्वजनिक विश्वस्त व्यवस्थेसंबंधी पत्रव्यवहार करावयाचा पत्ता :-<br>
            <b>" ${trustName} "</b> ${address}.
        </div>
        <div class="flex-between">
            <div>स्थळ: ${place}</div>
            <div style="text-align: center;">
                <b>अर्जदाराची सही</b><br><br><br>
                <b>${presidentName}</b>
            </div>
        </div>
        <hr style="border: 1px dashed #000; margin: 20px 0;">
        <div class="title-sm text-center">सत्यापन (Verification)</div>
        <div class="mb-10">
            मी, <b>${presidentName}</b>, वय <b>${presidentAge}</b> वर्षे, राहणार <b>${address}</b>, प्रतिज्ञेवर जाहीर करतो की, वरील अर्जातील १ ते १४ क्रमांकाच्या रकान्यात दिलेली माहिती माझ्या वैयक्तिक माहितीनुसार व समजुतीनुसार सत्य व खरी आहे.
        </div>
        <div class="flex-between">
            <div>स्थळ: ${place}<br>दिनांक: ${date}</div>
            <div style="text-align: center;">
                <b>अर्जदाराची सही</b><br><br><br>
                <b>${presidentName}</b>
            </div>
        </div>

        <div class="page-break"></div>

        <!-- PAGE 22: Consent Letter for Trust (संमतीपत्राचा नमुना) -->
        <div class="title-lg text-center">संमतीपत्राचा नमुना</div>
        <div class="mt-20 mb-20">
            प्रति,<br>
            मा. सहाय्यक धर्मादाय आयुक्त,<br>
            जालना विभाग जालना.<br><br>
            <b>विषय :- सार्वजनिक विश्वस्त व्यवस्था नोंदणीस संमती देणेबाबत...</b><br>
            <b>संस्थेचे नाव :- " ${trustName} "</b>
        </div>
        <div class="mb-20">
            महोदय,<br>
            <p class="indent">
                मी, व आम्ही खालील स्वाक्षरी करणारे विश्वस्त जाहीर करतो की, अर्जदार <b>${presidentName}</b> यांनी संस्था/सार्वजनिक विश्वस्त व्यवस्था नोंदणीसाठी मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० च्या कलम १८ अन्वये आपल्या कार्यालयाकडे दि. ${date} रोजी अर्ज सादर केला आहे. त्या अर्जातील व विवरणातील सर्व माहिती सत्य व खरी असून त्यास आमची पूर्ण संमती आहे.
            </p>
            <p class="indent">
                सदर अर्जाची सुनावणीची स्वतंत्र नोटीस आम्हास काढण्याची आवश्यकता नाही. तसेच सदर संस्था नोंदणीचे प्रमाणपत्र मुख्य अर्जदार <b>${presidentName}</b> यांच्या नावे देण्यास आमची कोणतीही हरकत नाही.
            </p>
        </div>
        ${renderCommitteeSignatures()}
        <div class="mt-20 flex-between">
            <div>स्थळ : ${place}<br>दिनांक : ${date}</div>
            <div style="text-align: center;">
                <b>अर्जदाराची सही: _________________</b>
            </div>
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
