/* ==========================================================================
   📚 AnRu Focus Pro - Board Pocket Deck (UP Board Master Engine)
   Data & Controller for Classes 10, 11, 12 Formulae, Sahitya & Diagrams
   ========================================================================== */

(function() {
  'use strict';

  // 1. DATA REPOSITORY FOR UP BOARD 10, 11, 12
  const DECK_DATA = {
    // ══════════════════════════════════════════════════════════
    // CLASS 10 (High School Foundation)
    // ══════════════════════════════════════════════════════════
    "10": {
      subjects: [
        { id: "maths", name: "गणित (Maths)", icon: "fa-calculator" },
        { id: "science", name: "विज्ञान (Science)", icon: "fa-atom" },
        { id: "history", name: "सामाजिक (History)", icon: "fa-landmark" },
        { id: "hindi", name: "हिंदी साहित्य (Hindi)", icon: "fa-feather" },
        { id: "english", name: "English", icon: "fa-book-open" }
      ],
      cards: [
        // Maths
        {
          id: "10_m_1", subj: "maths", badge: "core", badgeText: "Core Formula",
          title: "द्विघात समीकरण (Quadratic Equation)",
          subtitle: "मानक रूप: ax² + bx + c = 0",
          formula: "x = [-b ± √(b² - 4ac)] / (2a)\nविविक्तकर (Discriminant): D = b² - 4ac",
          explanation: "• D > 0: दो भिन्न वास्तविक मूल\n• D = 0: दो बराबर वास्तविक मूल\n• D < 0: कोई वास्तविक मूल नहीं (काल्पनिक)"
        },
        {
          id: "10_m_2", subj: "maths", badge: "highyield", badgeText: "High Yield",
          title: "त्रिकोणमिति सर्वसमिकाएँ (Trig Identities)",
          subtitle: "UP Board में हर साल 6 अंक का सवाल पक्का",
          formula: "1) sin²θ + cos²θ = 1\n2) 1 + tan²θ = sec²θ\n3) 1 + cot²θ = cosec²θ",
          explanation: "sin(90° - θ) = cosθ | cos(90° - θ) = sinθ | tan(90° - θ) = cotθ"
        },
        {
          id: "10_m_3", subj: "maths", badge: "highyield", badgeText: "Formula Chart",
          title: "सांख्यिकी संबंध (Mean, Median, Mode)",
          subtitle: "मूलभूत आनुभविक संबंध सूत्र",
          formula: "बहुलक (Mode) = 3 × माध्यक (Median) - 2 × माध्य (Mean)",
          explanation: "माध्य x̄ = (Σfᵢxᵢ) / Σfᵢ | माध्यक = l + [(n/2 - cf)/f] × h"
        },

        // Science & Diagrams
        {
          id: "10_s_1", subj: "science", badge: "core", badgeText: "Physics Formula",
          title: "दर्पण एवं लेंस सूत्र (Optics)",
          subtitle: "प्रकाश का परावर्तन एवं अपवर्तन",
          formula: "दर्पण सूत्र: 1/f = 1/v + 1/u\nलेंस सूत्र: 1/f = 1/v - 1/u\nरेखीय आवर्धन: m = -v/u (दर्पण) | m = v/u (लेंस)",
          explanation: "चिह्न परिपाटी: आपतित किरण की दिशा में दूरियाँ (+) और विपरीत दिशा में (-) ली जाती हैं।"
        },
        {
          id: "10_s_2", subj: "science", badge: "core", badgeText: "Physics Formula",
          title: "ओम का नियम एवं विद्युत धारा",
          subtitle: "विद्युत परिपथ",
          formula: "V = I × R\nप्रतिरोधकता: R = ρ (l / A)\nविद्युत ऊर्जा: H = I²Rt = VIt",
          explanation: "श्रेणीक्रम: R = R₁ + R₂ + R₃ | समांतरक्रम: 1/R = 1/R₁ + 1/R₂ + 1/R₃"
        },
        {
          id: "10_s_diag_eye", subj: "science", badge: "diagram", badgeText: "Diagram (चित्र)",
          title: "मानव नेत्र की संरचना (Human Eye)",
          subtitle: "कक्षा 10वीं बोर्ड परीक्षा का पसंदीदा चित्र",
          hasDiagram: true,
          diagramSvg: `<svg viewBox="0 0 300 200" width="100%" height="100%">
            <circle cx="150" cy="100" r="75" fill="none" stroke="#60a5fa" stroke-width="4"/>
            <path d="M 85 70 A 75 75 0 0 1 85 130" fill="none" stroke="#c084fc" stroke-width="6"/>
            <circle cx="100" cy="100" r="14" fill="#fbbf24"/>
            <circle cx="100" cy="100" r="6" fill="#000"/>
            <path d="M 215 90 L 250 80" stroke="#f87171" stroke-width="2"/>
            <text x="255" y="83" fill="#fff" font-size="10" font-weight="bold">दृष्टिपटल (Retina)</text>
            <text x="35" y="70" fill="#fff" font-size="10" font-weight="bold">कॉर्निया (Cornea)</text>
            <text x="75" y="150" fill="#fff" font-size="10" font-weight="bold">नेत्र लेंस (Lens)</text>
            <text x="140" y="190" fill="#fff" font-size="10" font-weight="bold">कांचाभ द्रव (Vitreous)</text>
          </svg>`,
          explanation: "प्रमुख भाग: 1) कॉर्निया (स्वच्छ मंडल) 2) परितारिका (Iris) 3) पुतली (Pupil) 4) अभिनेत्र लेंस 5) दृष्टिपटल (Retina) 6) दृक तंत्रिका।"
        },
        {
          id: "10_s_diag_digest", subj: "science", badge: "diagram", badgeText: "Diagram (चित्र)",
          title: "मानव पाचन तंत्र (Digestive System)",
          subtitle: "बायोलॉजी 5 अंक चित्र प्रश्न",
          hasDiagram: true,
          diagramSvg: `<svg viewBox="0 0 300 200" width="100%" height="100%">
            <path d="M 150 20 L 150 70" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
            <path d="M 130 70 Q 180 80 150 115" fill="#f87171" stroke="#fff" stroke-width="2"/>
            <circle cx="150" cy="140" r="30" fill="#4ade80" opacity="0.6"/>
            <rect x="135" y="125" width="30" height="30" fill="#a855f7" rx="6"/>
            <text x="165" y="35" fill="#fff" font-size="10">ग्रसिका (Oesophagus)</text>
            <text x="180" y="90" fill="#fff" font-size="10">आमाशय (Stomach)</text>
            <text x="190" y="135" fill="#fff" font-size="10">यकृत (Liver)</text>
            <text x="170" y="170" fill="#fff" font-size="10">क्षुद्रांत्र (Small Intestine)</text>
          </svg>`,
          explanation: "पाचन का क्रम: मुखगुहा ➔ आमाशय (HCl + पेप्सिन) ➔ छोटी आंत (ट्रिप्सिन + लाइपेस) ➔ बड़ी आंत (जल अवशोषण)।"
        },

        // History / Dates
        {
          id: "10_h_1", subj: "history", badge: "highyield", badgeText: "Important Dates",
          title: "भारत में राष्ट्रवाद की प्रमुख तिथियाँ",
          subtitle: "इतिहास के 5 अंक के बहुविकल्पीय व मानचित्र प्रश्न",
          formula: "• 1919: रौलेट एक्ट एवं जलियांवाला बाग हत्याकांड (13 अप्रैल)\n• 1920-22: असहयोग आंदोलन (चौरी-चौरा कांड के बाद स्थगित)\n• 1930: दांडी मार्च एवं सविनय अवज्ञा आंदोलन\n• 1942: भारत छोड़ो आंदोलन (करो या मरो)",
          explanation: "महात्मा गांधी जी के मुख्य 3 जन आंदोलन: असहयोग (1920), सविनय अवज्ञा (1930), और भारत छोड़ो (1942)।"
        },

        // Hindi Sahitya
        {
          id: "10_hi_1", subj: "hindi", badge: "guaranteed", badgeText: "5-अंक जीवन परिचय",
          title: "महाकवि सूरदास (सूरसागर के रचयिता)",
          subtitle: "UP Board कक्षा 10 पद्य साहित्य",
          isSahitya: true,
          bioData: {
            "जन्म": "संवत 1535 (सन 1478 ईस्वी)",
            "जन्म स्थान": "रुनकता (आगरा-मथुरा मार्ग)",
            "गुरु का नाम": "महाप्रभु वल्लभाचार्य",
            "प्रमुख कृतियाँ": "सूरसागर, सूरसारावली, साहित्य लहरी",
            "भाषा-शैली": "सरस ब्रजभाषा, गेय पद शैली, वात्सल्य एवं श्रृंगार रस",
            "मृत्यु": "संवत 1640 (सन 1583 ईस्वी, पारसौली में)"
          },
          quotes: "सूर-सूर तुलसी ससी, उडुगन केसवदास। अब के कवि खद्योत सम, जहँ तहँ करत प्रकास॥"
        },
        {
          id: "10_hi_2", subj: "hindi", badge: "guaranteed", badgeText: "5-अंक जीवन परिचय",
          title: "गोस्वामी तुलसीदास (रामचरितमानस)",
          subtitle: "UP Board कक्षा 10 पद्य साहित्य",
          isSahitya: true,
          bioData: {
            "जन्म": "सन 1532 ईस्वी (संवत 1589)",
            "जन्म स्थान": "राजापुर (बांदा, उत्तर प्रदेश)",
            "माता-पिता": "हुल्सी देवी एवं आत्माराम दुबे",
            "गुरु का नाम": "नरहरिदास",
            "प्रमुख कृतियाँ": "श्रीरामचरितमानस, विनयपत्रिका, कवितावली, दोहावली, गीतावली",
            "भाषा-शैली": "अवधी और ब्रजभाषा, दोहा-चौपाई शैली",
            "मृत्यु": "सन 1623 ईस्वी (असी घाट, काशी)"
          },
          quotes: "संवत सोलह सौ असी, असी गंग के तीर। सावन शुक्ला सप्तमी, तुलसी तज्यो सरीर॥"
        },
        {
          id: "10_hi_gram", subj: "hindi", badge: "highyield", badgeText: "व्याकरण MCQ",
          title: "रस, छंद, अलंकार (10th Board स्पेशल)",
          subtitle: "हर साल 6 अंक का अनिवार्य प्रश्न",
          formula: "• हास्य रस: स्थायी भाव 'हास' (हंसी)\n• करुण रस: स्थायी भाव 'शोक' (दुःख)\n• रोला छंद: 4 चरण, प्रत्येक में 24 मात्राएँ (11 और 13 पर यति)\n• सोरठा छंद: दोहे का उल्टा (1 व 3 चरण में 11-11, 2 व 4 में 13-13)",
          explanation: "अलंकार: उपमा (सा/सी/से तुलना), रूपक (अभेद आरोप), उत्प्रेक्षा (मनु, मानहु, जनु, जानहु वाचक शब्द)।"
        },

        // English
        {
          id: "10_en_1", subj: "english", badge: "guaranteed", badgeText: "Central Idea",
          title: "Dust of Snow — Robert Frost",
          subtitle: "Poetry Class 10 (3 Marks Fixed)",
          formula: "Central Idea: The poem expresses the significance of small things in changing one's attitude. A simple incident of a crow shaking off dust of snow from a hemlock tree transformed the poet's sorrowful day into joy.",
          explanation: "Symbolism: Hemlock tree (sorrow/poison) & Crow (darkness) unexpectedly bring happiness."
        }
      ]
    },

    // ══════════════════════════════════════════════════════════
    // CLASS 11 (Current Session - Core Science & Base)
    // ══════════════════════════════════════════════════════════
    "11": {
      subjects: [
        { id: "physics", name: "भौतिक विज्ञान (Physics)", icon: "fa-bolt" },
        { id: "chemistry", name: "रसायन विज्ञान (Chemistry)", icon: "fa-flask" },
        { id: "maths", name: "गणित (Maths)", icon: "fa-calculator" },
        { id: "hindi", name: "हिंदी (Hindi Sahitya)", icon: "fa-feather" },
        { id: "english", name: "English Core", icon: "fa-book-open" }
      ],
      cards: [
        // Physics
        {
          id: "11_p_1", subj: "physics", badge: "core", badgeText: "Kinematics Formula",
          title: "गति के समीकरण एवं nवें सेकंड में दूरी",
          subtitle: "शुद्ध गतिकी (Kinematics) का मूल आधार",
          formula: "1) v = u + at\n2) S = ut + ½ at²\n3) v² = u² + 2aS\n4) nवें सेकंड में तय दूरी: Sₙ = u + ½ a(2n - 1)",
          explanation: "समाकलन विधि द्वारा $S_n$ का निगमन: $\int_{n-1}^{n} (u + at) dt = [ut + ½ at²]_{n-1}^{n} = u + ½ a(2n - 1)$।"
        },
        {
          id: "11_p_2", subj: "physics", badge: "highyield", badgeText: "Dynamics & Force",
          title: "न्यूटन के गति नियम एवं बल के मात्रक",
          subtitle: "संवेग, आवेग और गुरुत्वीय इकाइयाँ",
          formula: "F = ma = dp/dt\nआवेग (Impulse): J = F × Δt = Δp\nगुरुत्वीय मात्रक:\n• 1 kgf = 9.8 Newton\n• 1 gf = 980 Dyne",
          explanation: "संरक्षी बल (Conservative Force): जिनके द्वारा किया गया कार्य पथ पर निर्भर नहीं करता (जैसे गुरुत्वाकर्षण)। असंरक्षी बल: घर्षण बल।"
        },
        {
          id: "11_p_diag_proj", subj: "physics", badge: "diagram", badgeText: "Diagram (चित्र)",
          title: "प्रक्षेप्य गति का प्रक्षेप पथ (Projectile Trajectory)",
          subtitle: "परवलयाकार पथ का आरेख",
          hasDiagram: true,
          diagramSvg: `<svg viewBox="0 0 300 180" width="100%" height="100%">
            <line x1="30" y1="150" x2="270" y2="150" stroke="#fff" stroke-width="2"/>
            <line x1="30" y1="150" x2="30" y2="30" stroke="#fff" stroke-width="2"/>
            <path d="M 30 150 Q 150 10 270 150" fill="none" stroke="#fbbf24" stroke-width="4"/>
            <line x1="150" y1="80" x2="150" y2="150" stroke="#f87171" stroke-dasharray="4"/>
            <text x="155" y="115" fill="#f87171" font-size="11" font-weight="bold">महत्तम ऊँचाई (Hₘₐₓ)</text>
            <text x="130" y="170" fill="#60a5fa" font-size="11" font-weight="bold">परास (Range R)</text>
            <text x="40" y="130" fill="#fff" font-size="10">θ (प्रक्षेप कोण)</text>
          </svg>`,
          explanation: "R = (u² sin 2θ) / g | H = (u² sin²θ) / (2g) | उड्डयन काल T = (2u sinθ) / g। θ = 45° पर परास अधिकतम होती है।"
        },

        // Chemistry
        {
          id: "11_c_1", subj: "chemistry", badge: "core", badgeText: "Mole & Solutions",
          title: "मोल अवधारणा एवं संतृप्त विलयन",
          subtitle: "मूलभूत रासायनिक गणनाएँ",
          formula: "मोलों की संख्या (n) = भार (w) / अणुभार (M)\nमोलरता (M) = विलेय के मोल / विलयन का आयतन (L)\nएवोगेड्रो संख्या Nₐ = 6.022 × 10²³",
          explanation: "संतृप्त विलयन (Saturated Solution): वह विलयन जिसमें निश्चित ताप पर विलेय की और अधिक मात्रा नहीं घोली जा सकती।"
        },
        {
          id: "11_c_2", subj: "chemistry", badge: "highyield", badgeText: "Bonding & Thermo",
          title: "रासायनिक आबंधन एवं संकरण (VSEPR)",
          subtitle: "अणु की ज्यामिति एवं ऊष्मागतिकी",
          formula: "गिब्स मुक्त ऊर्जा: ΔG = ΔH - TΔS\n• ΔG < 0: प्रक्रम स्वतः (Spontaneous)\n• ΔG = 0: साम्यावस्था (Equilibrium)",
          explanation: "संकरण ज्यामिति: sp (रैखिक 180°), sp² (त्रिकोणीय समतलीय 120°), sp³ (चतुष्फलकीय 109.5° जैसे CH₄)।"
        },

        // Maths
        {
          id: "11_m_1", subj: "maths", badge: "core", badgeText: "Combinatorics",
          title: "क्रमचय एवं संचय (Permutations & Combinations)",
          subtitle: "शब्द विन्यास (MONDAY, MISSISSIPPI) के नियम",
          formula: "nPr = n! / (n - r)!\nnCr = n! / [r! (n - r)!]\n0! = 1 | nCr = nC(n - r)",
          explanation: "क्रमचय (P) में क्रम का महत्व होता है (व्यवस्था)। संचय (C) में केवल चयन का महत्व होता है (टीम/समूह बनाना)।"
        },
        {
          id: "11_m_2", subj: "maths", badge: "core", badgeText: "Calculus Limits",
          title: "अवकलन एवं सीमा (Limits & Derivatives)",
          subtitle: "12वीं के कैलकुलस का आधार",
          formula: "d/dx (xⁿ) = n xⁿ⁻¹\nd/dx (sin x) = cos x | d/dx (cos x) = -sin x\nd/dx (eˣ) = eˣ | d/dx (ln x) = 1/x",
          explanation: "गुणन नियम: d/dx (u·v) = u(dv/dx) + v(du/dx) | भाग नियम: d/dx (u/v) = [v(du/dx) - u(dv/dx)] / v²"
        },

        // Hindi Sahitya
        {
          id: "11_hi_1", subj: "hindi", badge: "guaranteed", badgeText: "5-अंक जीवन परिचय",
          title: "महाकवि कबीरदास (साखी, सबद, रमैनी)",
          subtitle: "निर्गुण ज्ञानाश्रयी शाखा के प्रतिनिधि कवि",
          isSahitya: true,
          bioData: {
            "जन्म": "संवत 1455 (सन 1398 ईस्वी)",
            "जन्म स्थान": "काशी (वाराणसी, उत्तर प्रदेश)",
            "पालन-पोषण": "नीरू और नीमा नामक जुलाहा दंपति",
            "गुरु का नाम": "स्वामी रामानंद",
            "प्रमुख कृतियाँ": "बीजक (साखी, सबद, रमैनी का संकलन)",
            "भाषा-शैली": "सधुक्कड़ी / पंचमेल खिचड़ी (अवधी, ब्रज, राजस्थानी, पंजाबी मिश्रित)",
            "मृत्यु": "संवत 1575 (सन 1518 ईस्वी, मगहर में)"
          },
          quotes: "जाति न पूछो साधु की, पूछ लीजिये ज्ञान। मोल करो तरवार का, पड़ा रहन दो म्यान॥"
        },
        {
          id: "11_hi_2", subj: "hindi", badge: "guaranteed", badgeText: "5-अंक जीवन परिचय",
          title: "भारतेंदु हरिश्चंद्र (आधुनिक हिंदी के जनक)",
          subtitle: "UP Board कक्षा 11 गद्य व पद्य",
          isSahitya: true,
          bioData: {
            "जन्म": "9 सितंबर 1850 ईस्वी",
            "जन्म स्थान": "वाराणसी (उत्तर प्रदेश)",
            "पिता का नाम": "बाबू गोपालचंद्र (उपनाम 'गिरिधरदास')",
            "प्रमुख कृतियाँ": "भारत दुर्दशा, अंधेर नगरी, चंद्रावली, प्रेम माधुरी, प्रेम तरंग",
            "भाषा-शैली": "गद्य में खड़ी बोली एवं पद्य में सरस ब्रजभाषा",
            "मृत्यु": "6 जनवरी 1885 ईस्वी (मात्र 35 वर्ष की अल्पायु में)"
          },
          quotes: "निज भाषा उन्नति अहै, सब उन्नति को मूल। बिन निज भाषा-ज्ञान के, मिटत न हिय को सूल॥"
        },
        {
          id: "11_hi_ras", subj: "hindi", badge: "highyield", badgeText: "व्याकरण रस MCQ",
          title: "काव्य के प्रमुख रस एवं स्थायी भाव",
          subtitle: "कक्षा 11वीं परीक्षा विशेष",
          formula: "1) श्रृंगार रस: स्थायी भाव 'रति'\n2) वीर रस: स्थायी भाव 'उत्साह'\n3) करुण रस: स्थायी भाव 'शोक'\n4) शांत रस: स्थायी भाव 'निर्वेद'",
          quotes: "करुण रस उदाहरण: देखि सुदामा की दीन दशा, करुणा करके करुणानिधि रोए। पानी परात को हाथ छुयो नहिं, नैनन के जल सों पग धोए॥"
        },

        // English
        {
          id: "11_en_1", subj: "english", badge: "highyield", badgeText: "Prose Summary",
          title: "Discovering Tut: The Saga Continues — A.R. Williams",
          subtitle: "Hornbill Class 11 Core Chapter",
          formula: "Core Theme: The mystery surrounding the life and untimely death of King Tutankhamun, the last heir of a powerful pharaoh family in ancient Egypt. Howard Carter discovered his tomb in 1922.",
          explanation: "Key Facts: In 1968, an anatomy professor X-rayed the mummy and revealed his breastbone and front ribs were missing. In 2005, CT scan reconstructed his diagnostic face."
        }
      ]
    },

    // ══════════════════════════════════════════════════════════
    // CLASS 12 (Target Board 85%+)
    // ══════════════════════════════════════════════════════════
    "12": {
      subjects: [
        { id: "physics", name: "भौतिक विज्ञान (Physics)", icon: "fa-bolt" },
        { id: "chemistry", name: "रसायन विज्ञान (Chemistry)", icon: "fa-flask" },
        { id: "maths", name: "गणित (Maths)", icon: "fa-calculator" },
        { id: "hindi", name: "हिंदी (Hindi Sahitya)", icon: "fa-feather" },
        { id: "english", name: "English Core", icon: "fa-book-open" }
      ],
      cards: [
        // Physics
        {
          id: "12_p_1", subj: "physics", badge: "core", badgeText: "Electrostatics",
          title: "कूलॉम का नियम एवं गॉस की प्रमेय",
          subtitle: "स्थिर वैद्युतिकी (हर साल 5 अंक का निगमन)",
          formula: "कूलॉम बल: F = [1 / (4πε₀)] × (q₁q₂ / r²)\nगॉस की प्रमेय: Φ = ∮ E · dA = q_in / ε₀\nबिंदु आवेश के कारण विभव: V = [1 / (4πε₀)] × (q / r)",
          explanation: "1 / (4πε₀) = 9 × 10⁹ N·m²/C² | ε₀ (निर्वात की विद्युतशीलता) = 8.85 × 10⁻¹² C²/(N·m²)।"
        },
        {
          id: "12_p_2", subj: "physics", badge: "highyield", badgeText: "Optics Formula",
          title: "लेंस मेकर सूत्र (Lens Maker's Formula)",
          subtitle: "किरण प्रकाशिकी का सबसे महत्वपूर्ण डेरिवेशन",
          formula: "1/f = (μ - 1) [ (1/R₁) - (1/R₂) ]",
          explanation: "μ = लेंस के पदार्थ का अपवर्तनांक | R₁, R₂ = दोनों पृष्ठों की वक्रता त्रिज्याएँ। उभयोत्तल लेंस में R₁ (+) और R₂ (-) होता है।"
        },
        {
          id: "12_p_diag_trans", subj: "physics", badge: "diagram", badgeText: "Diagram (चित्र)",
          title: "ट्रांसफॉर्मर की कार्यप्रणाली (Transformer)",
          subtitle: "अन्योन्य प्रेरण पर आधारित 5 अंक का प्रश्न",
          hasDiagram: true,
          diagramSvg: `<svg viewBox="0 0 300 180" width="100%" height="100%">
            <rect x="70" y="30" width="160" height="120" fill="none" stroke="#60a5fa" stroke-width="8" rx="10"/>
            <rect x="110" y="60" width="80" height="60" fill="#0d081f" stroke="#c084fc" stroke-width="3"/>
            <path d="M 60 50 Q 40 70 60 90 Q 40 110 60 130" stroke="#fbbf24" stroke-width="4" fill="none"/>
            <path d="M 240 50 Q 260 70 240 90 Q 260 110 240 130" stroke="#f87171" stroke-width="4" fill="none"/>
            <text x="15" y="95" fill="#fbbf24" font-size="10" font-weight="bold">प्राथमिक (Vₚ)</text>
            <text x="245" y="95" fill="#f87171" font-size="10" font-weight="bold">द्वितीयक (Vₛ)</text>
            <text x="95" y="168" fill="#fff" font-size="10">पटलित लौह क्रोड (Laminated Core)</text>
          </svg>`,
          explanation: "परिणमन अनुपात: r = Vₛ / Vₚ = Nₛ / Nₚ = Iₚ / Iₛ। स्टेप-अप ट्रांसफॉर्मर में Nₛ > Nₚ (वोल्टेज बढ़ता है, धारा घटती है)।"
        },

        // Chemistry
        {
          id: "12_c_1", subj: "chemistry", badge: "core", badgeText: "Physical Chem",
          title: "राउल्ट का नियम एवं नेर्न्स्ट समीकरण",
          subtitle: "विलयन एवं वैद्युतरसायन सूत्र",
          formula: "वाष्पदाब का आपेक्षिक अवनमन: (P° - Pₛ) / P° = n / (n + N)\nनेर्न्स्ट समीकरण:\nE_cell = E°_cell - (0.0591 / n) log₁₀ [उत्पाद] / [अभिकारक]",
          explanation: "मानक ताप 298 K पर। फैराडे नियतांक F = 96500 कूलॉम।"
        },
        {
          id: "12_c_2", subj: "chemistry", badge: "highyield", badgeText: "Name Reactions",
          title: "कार्बनिक रसायन की प्रमुख नाम अभिक्रियाएँ",
          subtitle: "बोर्ड में 5 नंबर की निश्चित पूछी जाने वाली रिएक्शंस",
          formula: "1) वुर्ट्ज अभिक्रिया: 2R-X + 2Na (ईथर) ➔ R-R + 2NaX\n2) कोल्बे अभिक्रिया: फिनॉल + CO₂ + NaOH ➔ सैलिसिलिक अम्ल\n3) कैनिजारो अभिक्रिया: 2HCHO + 50% NaOH ➔ CH₃OH + HCOONa",
          explanation: "कैनिजारो अभिक्रिया केवल वही एल्डिहाइड देते हैं जिनमें अल्फा-हाइड्रोजन नहीं होता (जैसे फॉर्मेल्डिहाइड HCHO और बेन्जेल्डिहाइड)।"
        },

        // Maths
        {
          id: "12_m_1", subj: "maths", badge: "core", badgeText: "Integration Formula",
          title: "समाकलन के मूल एवं मानक सूत्र (Integration)",
          subtitle: "12वीं बोर्ड में कैलकुलस = 44 अंक",
          formula: "∫ xⁿ dx = [xⁿ⁺¹ / (n + 1)] + C\n∫ (1/x) dx = ln|x| + C\n∫ eˣ dx = eˣ + C\n∫ 1/(x² + a²) dx = (1/a) tan⁻¹(x/a) + C\nखंडशः समाकलन: ∫ u·v dx = u ∫v dx - ∫ [du/dx ∫v dx] dx",
          explanation: "ILATE नियम: Inverse Trig, Logarithmic, Algebraic, Trigonometric, Exponential के क्रम में प्रथम फलन (u) चुनें।"
        },

        // Hindi Sahitya
        {
          id: "12_hi_1", subj: "hindi", badge: "guaranteed", badgeText: "5-अंक जीवन परिचय",
          title: "डॉ. वासुदेव शरण अग्रवाल ('राष्ट्र का स्वरूप')",
          subtitle: "UP Board कक्षा 12 गद्य साहित्य के शीर्ष विद्वान",
          isSahitya: true,
          bioData: {
            "जन्म": "7 अगस्त 1904 ईस्वी",
            "जन्म स्थान": "खेड़ा ग्राम (हापुड़, मेरठ, उत्तर प्रदेश)",
            "शिक्षा": "लखनऊ विश्वविद्यालय एवं काशी हिंदू विश्वविद्यालय से Ph.D. एवं D.Litt.",
            "प्रमुख कृतियाँ": "राष्ट्र का स्वरूप, पृथ्वी पुत्र, भारत की मौलिक एकता, कल्पवृक्ष",
            "भाषा-शैली": "संस्कृतनिष्ठ परिमार्जित खड़ी बोली, गवेषणात्मक एवं व्याख्यात्मक शैली",
            "मृत्यु": "सन 1967 ईस्वी"
          },
          quotes: "भूमि, भूमि पर बसने वाला जन, और जन की संस्कृति—इन तीनों के सम्मिलन से राष्ट्र का स्वरूप बनता है।"
        },
        {
          id: "12_hi_2", subj: "hindi", badge: "guaranteed", badgeText: "5-अंक जीवन परिचय",
          title: "महाकवि जयशंकर प्रसाद ('कामायनी')",
          subtitle: "छायावाद के चार स्तंभों में प्रमुख स्तंभ",
          isSahitya: true,
          bioData: {
            "जन्म": "सन 1889 ईस्वी",
            "जन्म स्थान": "काशी (वाराणसी)",
            "पारिवारिक उपनाम": "'सुंघनी साहू' घराना",
            "प्रमुख कृतियाँ": "कामायनी (महाकाव्य), आँसू, झरना, लहर, चंद्रगुप्त, स्कंदगुप्त, ध्रुवस्वामिनी",
            "भाषा-शैली": "तत्सम प्रधान भावपूर्ण खड़ी बोली, लाक्षणिक एवं चित्रात्मक शैली",
            "मृत्यु": "15 नवंबर 1937 ईस्वी"
          },
          quotes: "नारी! तुम केवल श्रद्धा हो, विश्वास-रजत-नग-पग-तल में। पीयूष-स्रोत सी बहा करो, जीवन के सुंदर समतल में॥"
        }
      ]
    }
  };

  // 2. STATE CONTROLLER
  let currentClass = "11"; // Default to user's class 11
  let currentSubj = "physics";
  let searchQuery = "";
  let starOnlyFilter = false;
  let starredIds = JSON.parse(localStorage.getItem('board_deck_stars') || '[]');

  // Active recall blurred cards
  const blurredCardIds = new Set();

  function saveStars() {
    localStorage.setItem('board_deck_stars', JSON.stringify(starredIds));
  }

  function toggleStar(cardId, e) {
    if (e) e.stopPropagation();
    if (starredIds.includes(cardId)) {
      starredIds = starredIds.filter(id => id !== cardId);
    } else {
      starredIds.push(cardId);
    }
    saveStars();
    renderCards();
    if (typeof playSfx === 'function') playSfx('click');
  }

  function toggleStarFilter() {
    starOnlyFilter = !starOnlyFilter;
    const btn = document.getElementById('starFilterBtn');
    if (btn) btn.classList.toggle('active', starOnlyFilter);
    renderCards();
  }

  function toggleBlur(cardId, e) {
    if (e) e.stopPropagation();
    if (blurredCardIds.has(cardId)) {
      blurredCardIds.delete(cardId);
    } else {
      blurredCardIds.add(cardId);
    }
    const box = document.getElementById('formula_' + cardId);
    if (box) {
      box.classList.toggle('is-blurred', blurredCardIds.has(cardId));
    }
    if (typeof playSfx === 'function') playSfx('click');
  }

  function renderSubjTabs() {
    const container = document.getElementById('subjTabsContainer');
    if (!container) return;
    const cData = DECK_DATA[currentClass];
    if (!cData) return;

    // Reset current subject to first available in this class if invalid
    if (!cData.subjects.some(s => s.id === currentSubj)) {
      currentSubj = cData.subjects[0].id;
    }

    container.innerHTML = cData.subjects.map(s => `
      <button class="subj-chip ${s.id === currentSubj ? 'active' : ''}" onclick="switchSubj('${s.id}', this)">
        <i class="fa-solid ${s.icon}"></i> ${s.name}
      </button>
    `).join('');
  }

  function switchClass(cls, btn) {
    currentClass = cls;
    document.querySelectorAll('.class-pill').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderSubjTabs();
    renderCards();
    if (typeof playSfx === 'function') playSfx('click');
  }

  function switchSubj(subjId, btn) {
    currentSubj = subjId;
    document.querySelectorAll('.subj-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderCards();
    if (typeof playSfx === 'function') playSfx('click');
  }

  function handleSearch(q) {
    searchQuery = q.trim().toLowerCase();
    const clearBtn = document.getElementById('searchClearBtn');
    if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
    renderCards();
  }

  function clearSearch() {
    searchQuery = "";
    const inp = document.getElementById('deckSearchInput');
    if (inp) inp.value = "";
    const clearBtn = document.getElementById('searchClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';
    renderCards();
  }

  function openLightbox(title, svgHtml, desc) {
    const lb = document.getElementById('deckLightbox');
    const tEl = document.getElementById('lightboxTitle');
    const bEl = document.getElementById('lightboxBody');
    const dEl = document.getElementById('lightboxDesc');
    if (!lb || !tEl || !bEl) return;

    tEl.textContent = title;
    bEl.innerHTML = svgHtml;
    if (dEl) dEl.textContent = desc || "";

    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (typeof playSfx === 'function') playSfx('click');
  }

  function closeLightbox(e) {
    const lb = document.getElementById('deckLightbox');
    if (lb) lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderCards() {
    const grid = document.getElementById('deckCardsGrid');
    const countLabel = document.getElementById('deckCountLabel');
    if (!grid) return;

    const cData = DECK_DATA[currentClass];
    if (!cData) return;

    let filtered = cData.cards.filter(c => {
      // Subject filter (unless searching globally)
      const matchesSubj = searchQuery ? true : (c.subj === currentSubj);
      
      // Star filter
      const matchesStar = starOnlyFilter ? starredIds.includes(c.id) : true;

      // Text search
      let matchesText = true;
      if (searchQuery) {
        const fullContent = (c.title + " " + c.subtitle + " " + (c.formula || "") + " " + (c.explanation || "") + " " + JSON.stringify(c.bioData || "")).toLowerCase();
        matchesText = fullContent.includes(searchQuery);
      }

      return matchesSubj && matchesStar && matchesText;
    });

    if (countLabel) {
      countLabel.textContent = `Showing ${filtered.length} Cards in Class ${currentClass}th`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="text-align:center; padding:50px 20px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:22px;">
          <div style="font-size:36px; margin-bottom:10px;">🔍</div>
          <div style="font-size:16px; font-weight:800; color:#fff;">Koi cards nahi mile!</div>
          <div style="font-size:12px; color:rgba(255,255,255,0.5); margin-top:4px;">Filter ya search query badal kar dekhein.</div>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(c => {
      const isStar = starredIds.includes(c.id);
      const isBlurred = blurredCardIds.has(c.id);
      let badgeCls = "badge-core";
      if (c.badge === "guaranteed") badgeCls = "badge-guaranteed";
      if (c.badge === "highyield") badgeCls = "badge-highyield";
      if (c.badge === "diagram") badgeCls = "badge-diagram";

      // Render Hindi Sahitya Layout
      if (c.isSahitya && c.bioData) {
        let tableRows = Object.keys(c.bioData).map(k => `
          <tr>
            <td class="sahitya-label">${k}</td>
            <td class="sahitya-val ${k.includes('कृतियाँ') ? 'highlight' : ''}">${c.bioData[k]}</td>
          </tr>
        `).join('');

        return `
          <div class="deck-card">
            <div class="card-top-bar">
              <span class="card-badge ${badgeCls}"><i class="fa-solid fa-award"></i> ${c.badgeText || 'जीवन परिचय'}</span>
              <div class="card-actions">
                <button class="card-action-btn ${isStar ? 'starred' : ''}" onclick="toggleStar('${c.id}', event)" title="Bookmark">
                  <i class="fa-solid fa-star"></i>
                </button>
              </div>
            </div>
            <h3 class="card-title"><i class="fa-solid fa-feather-pointed" style="color:#c084fc;"></i> ${c.title}</h3>
            <div class="card-subtitle">${c.subtitle}</div>
            
            <table class="sahitya-table">${tableRows}</table>
            ${c.quotes ? `<div class="sahitya-quotes">"${c.quotes}"</div>` : ''}
          </div>
        `;
      }

      // Render Labeled Diagram Card
      if (c.hasDiagram) {
        return `
          <div class="deck-card">
            <div class="card-top-bar">
              <span class="card-badge ${badgeCls}"><i class="fa-solid fa-image"></i> ${c.badgeText || 'Diagram'}</span>
              <div class="card-actions">
                <button class="card-action-btn ${isStar ? 'starred' : ''}" onclick="toggleStar('${c.id}', event)" title="Bookmark">
                  <i class="fa-solid fa-star"></i>
                </button>
              </div>
            </div>
            <h3 class="card-title">${c.title}</h3>
            <div class="card-subtitle">${c.subtitle}</div>

            <div class="diagram-preview-card" onclick='openLightbox("${c.title}", ${JSON.stringify(c.diagramSvg)}, "${c.explanation}")'>
              ${c.diagramSvg}
              <div class="diagram-zoom-badge"><i class="fa-solid fa-expand"></i> Tap to Fullscreen HD</div>
            </div>

            <div class="formula-explanation">${c.explanation}</div>
          </div>
        `;
      }

      // Render Standard Math / Physics / Chem Formula Card with Active Recall Eye
      return `
        <div class="deck-card">
          <div class="card-top-bar">
            <span class="card-badge ${badgeCls}"><i class="fa-solid fa-bolt"></i> ${c.badgeText || 'Formula'}</span>
            <div class="card-actions">
              <button class="card-action-btn" onclick="toggleBlur('${c.id}', event)" title="Active Recall Self-Test">
                <i class="fa-solid ${isBlurred ? 'fa-eye-slash' : 'fa-eye'}"></i>
              </button>
              <button class="card-action-btn ${isStar ? 'starred' : ''}" onclick="toggleStar('${c.id}', event)" title="Bookmark">
                <i class="fa-solid fa-star"></i>
              </button>
            </div>
          </div>

          <h3 class="card-title">${c.title}</h3>
          <div class="card-subtitle">${c.subtitle}</div>

          <div class="formula-box ${isBlurred ? 'is-blurred' : ''}" id="formula_${c.id}" onclick="toggleBlur('${c.id}', event)">
            <div class="formula-text">${c.formula ? c.formula.replace(/\n/g, '<br>') : ''}</div>
            <div class="blur-overlay-hint"><i class="fa-solid fa-hand-pointer"></i> Tap to Reveal Answer</div>
          </div>

          ${c.explanation ? `<div class="formula-explanation">${c.explanation.replace(/\n/g, '<br>')}</div>` : ''}
          ${c.quotes ? `<div class="sahitya-quotes">${c.quotes}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  // INITIALIZATION
  document.addEventListener('DOMContentLoaded', () => {
    renderSubjTabs();
    renderCards();
  });

  // Expose global methods
  window.switchClass = switchClass;
  window.switchSubj = switchSubj;
  window.handleSearch = handleSearch;
  window.clearSearch = clearSearch;
  window.toggleStar = toggleStar;
  window.toggleStarFilter = toggleStarFilter;
  window.toggleBlur = toggleBlur;
  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;

})();
