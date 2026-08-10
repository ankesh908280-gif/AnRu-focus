/* =========================================================
   🌟 GRAMMAR DATA VAULT (डेटाबेस - यहाँ तू नए चैप्टर्स जोड़ेगा)
   ========================================================= */
const grammarData = {
    // --- 1. PRESENT TENSE ---
    "present_tense": {
        title: "Present Tense",
        icon: "fa-hourglass-start",
        desc: "Indefinite to Perfect Continuous",
        theme: "gradient-blue",
        rules: [
            {
                tag: "Rule 1 💡", title: "Present Indefinite",
                pehchan: "📌 पहचान: 'ता है', 'ती है', 'ते हैं' (आदत / सार्वभौमिक सत्य)",
                formula: "Sub + V1(s/es) + Obj",
                note: "Note: Singular (He/She/It) के साथ Verb में s/es लगता है। Plural (I/We/You/They) के साथ नहीं। Negative में Do/Does not लगता है।",
                examples: [
                    { hi: "सूरज पूरब में निकलता है।", en: "The sun rises in the east." },
                    { hi: "मैं झूठ नहीं बोलता हूँ।", en: "I do not tell a lie." }
                ]
            },
            {
                tag: "Rule 2 💡", title: "Present Continuous",
                pehchan: "📌 पहचान: 'रहा है', 'रही है', 'रहे हैं' (काम अभी चल रहा है)",
                formula: "Sub + is/am/are + V1(ing) + Obj",
                note: "Note: I ➔ am | He/She/It ➔ is | We/You/They ➔ are",
                examples: [
                    { hi: "वह किताब पढ़ रहा है।", en: "He is reading a book." },
                    { hi: "तुम क्यों रो रहे हो?", en: "Why are you crying?" }
                ]
            },
            {
                tag: "Rule 3 💡", title: "Present Perfect",
                pehchan: "📌 पहचान: 'चुका है', 'लिया है', 'दिया है' (काम अभी पूरा हुआ है)",
                formula: "Sub + has/have + V3 + Obj",
                note: "Note: Singular ➔ has | Plural & I ➔ have. हमेशा Verb की 3rd Form (V3) लगाएं।",
                examples: [
                    { hi: "मैंने खाना खा लिया है।", en: "I have eaten food." }
                ]
            },
            {
                tag: "Rule 4 💡", title: "Present Perfect Continuous",
                pehchan: "📌 पहचान: 'रहा है' + समय (Time) दिया हो।",
                formula: "Sub + has/have + been + V1(ing) + since/for + Time",
                note: "Note: निश्चित समय (Point of time) ➔ Since | अनिश्चित समय (Duration) ➔ For",
                examples: [
                    { hi: "सुबह से बारिश हो रही है।", en: "It has been raining since morning." }
                ]
            }
        ],
        practice: [
            { hi: "वह रोज़ स्कूल जाता है।", en: "He goes to school daily." },
            { hi: "मैं झूठ नहीं बोलता हूँ।", en: "I do not tell a lie." },
            { hi: "क्या तुम उसे जानते हो?", en: "Do you know him?" },
            { hi: "सूरज पूरब में निकलता है।", en: "The sun rises in the east." },
            { hi: "वह कहाँ रहता है?", en: "Where does he live?" },
            { hi: "मैं एक किताब पढ़ रहा हूँ।", en: "I am reading a book." },
            { hi: "आज बारिश हो रही है।", en: "It is raining today." },
            { hi: "वे टीवी नहीं देख रहे हैं।", en: "They are not watching TV." },
            { hi: "तुम क्यों रो रहे हो?", en: "Why are you crying?" },
            { hi: "क्या वह सो रहा है?", en: "Is he sleeping?" },
            { hi: "मैंने अपना काम कर लिया है।", en: "I have done my work." },
            { hi: "वह जा चुका है।", en: "He has gone." },
            { hi: "क्या तुमने ताजमहल देखा है?", en: "Have you seen the Taj Mahal?" },
            { hi: "उसने मुझे नहीं बुलाया है।", en: "He has not called me." },
            { hi: "ट्रेन अभी स्टेशन पर आई है।", en: "The train has just arrived at the station." },
            { hi: "मैं दो घंटे से पढ़ रहा हूँ।", en: "I have been reading for two hours." },
            { hi: "सुबह से बारिश हो रही है।", en: "It has been raining since morning." },
            { hi: "वह 2020 से यहाँ रह रहा है।", en: "He has been living here since 2020." },
            { hi: "तुम कल से क्या कर रहे हो?", en: "What have you been doing since yesterday?" },
            { hi: "वे कई दिनों से काम नहीं कर रहे हैं।", en: "They have not been working for many days." }
        ]
    },
    // --- 2. PAST TENSE ---
    "past_tense": {
        title: "Past Tense",
        icon: "fa-clock-rotate-left",
        desc: "Master the history!",
        theme: "gradient-purple",
        rules: [
            {
                tag: "Rule 1 💡", title: "Past Indefinite",
                pehchan: "📌 पहचान: 'ता था', 'या', 'यी', 'ये' (बीते समय में काम हुआ)",
                formula: "Sub + V2 + Obj",
                note: "Note: Simple वाक्य में V2 लगता है। Negative/Interrogative में 'did' + V1 लगता है।",
                examples: [
                    { hi: "उसने मुझे एक पेन दिया।", en: "He gave me a pen." },
                    { hi: "वह कल स्कूल नहीं गया।", en: "He did not go to school yesterday." }
                ]
            },
            {
                tag: "Rule 2 💡", title: "Past Continuous",
                pehchan: "📌 पहचान: 'रहा था', 'रही थी', 'रहे थे'",
                formula: "Sub + was/were + V1(ing) + Obj",
                note: "Note: I/He/She/It ➔ was | We/You/They ➔ were",
                examples: [
                    { hi: "मैं सो रहा था।", en: "I was sleeping." }
                ]
            },
            {
                tag: "Rule 3 💡", title: "Past Perfect",
                pehchan: "📌 पहचान: 'चुका था', 'लिया था' (Past में कोई काम पूरी तरह ख़त्म हो गया था)",
                formula: "Sub + had + V3 + Obj",
                note: "Note: सभी Subjects के साथ 'had' और Verb की 3rd Form लगती है।",
                examples: [
                    { hi: "ट्रेन जा चुकी थी।", en: "The train had gone." }
                ]
            },
            {
                tag: "Rule 4 💡", title: "Past Perfect Continuous",
                pehchan: "📌 पहचान: 'रहा था' + समय (Time)",
                formula: "Sub + had been + V1(ing) + since/for + Time",
                note: "Note: सभी Subjects के साथ 'had been' लगता है।",
                examples: [
                    { hi: "वह 2 घंटे से खेल रहा था।", en: "He had been playing for 2 hours." }
                ]
            }
        ],
        practice: [
            { hi: "उसने मुझे एक पत्र लिखा।", en: "He wrote a letter to me." },
            { hi: "मैं कल स्कूल नहीं गया।", en: "I did not go to school yesterday." },
            { hi: "क्या तुमने उसे देखा?", en: "Did you see him?" },
            { hi: "भारत 1947 में आज़ाद हुआ।", en: "India became free in 1947." },
            { hi: "उसने क्या कहा?", en: "What did he say?" },
            { hi: "मैं सो रहा था।", en: "I was sleeping." },
            { hi: "वे शोर नहीं मचा रहे थे।", en: "They were not making a noise." },
            { hi: "तुम कहाँ जा रहे थे?", en: "Where were you going?" },
            { hi: "बारिश हो रही थी।", en: "It was raining." },
            { hi: "क्या वह रो रही थी?", en: "Was she crying?" },
            { hi: "मेरे आने से पहले ट्रेन जा चुकी थी।", en: "The train had gone before I came." },
            { hi: "मैंने यह फिल्म पहले ही देख ली थी।", en: "I had already seen this film." },
            { hi: "क्या वह सो चुका था?", en: "Had he slept?" },
            { hi: "पुलिस के आने से पहले चोर भाग चुके थे।", en: "The thieves had run away before the police came." },
            { hi: "उसने मुझे नहीं बताया था।", en: "He had not told me." },
            { hi: "मैं 2 बजे से उसका इंतज़ार कर रहा था।", en: "I had been waiting for him since 2 o'clock." },
            { hi: "वह कई सालों से दिल्ली में रह रहा था।", en: "He had been living in Delhi for many years." },
            { hi: "तुम सुबह से क्या कर रहे थे?", en: "What had you been doing since morning?" },
            { hi: "वे 2 घंटे से नहीं खेल रहे थे।", en: "They had not been playing for 2 hours." },
            { hi: "क्या बारिश 3 दिनों से हो रही थी?", en: "Had it been raining for 3 days?" }
        ]
    },
    // --- 3. FUTURE TENSE ---
    "future_tense": {
        title: "Future Tense",
        icon: "fa-forward-fast",
        desc: "Predict the future!",
        theme: "gradient-gray",
        rules: [
            {
                tag: "Rule 1 💡", title: "Future Indefinite",
                pehchan: "📌 पहचान: 'गा', 'गी', 'गे' (काम भविष्य में होगा)",
                formula: "Sub + will/shall + V1 + Obj",
                note: "Note: I और We के साथ 'shall', बाकी सबके साथ 'will'। (Modern English में सबके साथ will लगा सकते हैं)।",
                examples: [
                    { hi: "मैं कल दिल्ली जाऊँगा।", en: "I shall go to Delhi tomorrow." }
                ]
            },
            {
                tag: "Rule 2 💡", title: "Future Continuous",
                pehchan: "📌 पहचान: 'रहा होगा', 'रही होगी'",
                formula: "Sub + will be/shall be + V1(ing) + Obj",
                note: "Note: Continuous में हमेशा V1 + ing आता है।",
                examples: [
                    { hi: "वह सो रहा होगा।", en: "He will be sleeping." }
                ]
            },
            {
                tag: "Rule 3 💡", title: "Future Perfect",
                pehchan: "📌 पहचान: 'चुका होगा', 'लिया होगा'",
                formula: "Sub + will have/shall have + V3 + Obj",
                note: "Note: भविष्य में किसी निश्चित समय तक काम ख़त्म हो चुका होगा।",
                examples: [
                    { hi: "वह घर पहुँच चुका होगा।", en: "He will have reached home." }
                ]
            }
        ],
        practice: [
            { hi: "मैं तुम्हारी मदद करूँगा।", en: "I shall help you." },
            { hi: "वह कल यहाँ आएगा।", en: "He will come here tomorrow." },
            { hi: "क्या तुम मेरे साथ चलोगे?", en: "Will you go with me?" },
            { hi: "हम मैच नहीं खेलेंगे।", en: "We shall not play the match." },
            { hi: "वह कौन सी किताब खरीदेगा?", en: "Which book will he buy?" },
            { hi: "वह सो रहा होगा।", en: "He will be sleeping." },
            { hi: "हम कल यात्रा कर रहे होंगे।", en: "We shall be travelling tomorrow." },
            { hi: "क्या वे क्रिकेट खेल रहे होंगे?", en: "Will they be playing cricket?" },
            { hi: "सीता गाना नहीं गा रही होगी।", en: "Sita will not be singing a song." },
            { hi: "कल इस समय बारिश हो रही होगी।", en: "It will be raining at this time tomorrow." },
            { hi: "वह अब तक पहुँच चुका होगा।", en: "He will have reached by now." },
            { hi: "तुम्हारे आने से पहले मैं काम ख़त्म कर चुका हूँगा।", en: "I shall have finished the work before you come." },
            { hi: "उसने यह खबर सुन ली होगी।", en: "He will have heard this news." },
            { hi: "क्या ट्रेन जा चुकी होगी?", en: "Will the train have gone?" },
            { hi: "हम शाम तक वापस आ चुके होंगे।", en: "We shall have returned by evening." },
            { hi: "वह कल स्कूल जाएगा।", en: "He will go to school tomorrow." },
            { hi: "क्या तुम यह काम करोगे?", en: "Will you do this work?" },
            { hi: "मैं उसे कभी माफ नहीं करूँगा।", en: "I shall never forgive him." },
            { hi: "क्या वह मेरी बात सुन रहा होगा?", en: "Will he be listening to me?" },
            { hi: "हम 2025 तक ग्रेजुएट हो चुके होंगे।", en: "We shall have graduated by 2025." }
        ]
    },
    
    // --- 4. ACTIVE & PASSIVE VOICE ---
    "active_passive_voice": {
        title: "Active & Passive Voice",
        icon: "fa-bullhorn",
        desc: "कर्ता से कर्म तक का सफर!",
        theme: "gradient-blue",
        rules: [
            {
                tag: "Rule 1 💡", title: "Basic Rules (मूल नियम)",
                pehchan: "📌 Active में Subject काम करता है, Passive में Object पर काम होता है।",
                formula: "Object + H.V. + V3 + by + Subject",
                note: "Note: Passive Voice में हमेशा Verb की 3rd Form (V3) लगती है। Subject को Object की जगह ले जाकर उससे पहले 'by' लगाते हैं (जैसे: I ➔ by me, He ➔ by him, They ➔ by them)।",
                examples: [
                    { hi: "Active: Ram writes a letter.", en: "Passive: A letter is written by Ram." },
                    { hi: "Active: I help him.", en: "Passive: He is helped by me." }
                ]
            },
            {
                tag: "Rule 2 💡", title: "Present Tense Changes",
                pehchan: "📌 Indefinite ➔ is/am/are | Continuous ➔ is/am/are + being | Perfect ➔ has/have + been",
                formula: "Helping Verb बदलें + V3 लगाएं",
                note: "Note: Present Perfect Continuous का Passive नहीं बनता है।",
                examples: [
                    { hi: "Active: He is eating an apple.", en: "Passive: An apple is being eaten by him." },
                    { hi: "Active: They have done the work.", en: "Passive: The work has been done by them." }
                ]
            },
            {
                tag: "Rule 3 💡", title: "Past & Future Tense Changes",
                pehchan: "📌 Past Ind ➔ was/were | Past Cont ➔ was/were + being | Past Perf ➔ had been",
                formula: "Future Ind ➔ will/shall be | Future Perf ➔ will/shall have been",
                note: "Note: Future Continuous और Perfect Continuous tenses का Passive नहीं बनता है।",
                examples: [
                    { hi: "Active: He bought a book. (Past Indefinite)", en: "Passive: A book was bought by him." },
                    { hi: "Active: She will sing a song. (Future Indefinite)", en: "Passive: A song will be sung by her." }
                ]
            },
            {
                tag: "Rule 4 💡", title: "Imperative Sentences (आज्ञासूचक)",
                pehchan: "📌 जिन वाक्यों में Order, Request या Advice हो (Subject छुपा रहता है)।",
                formula: "Let + Object + be + V3",
                note: "Note: Please वाले वाक्यों में 'You are requested to' से शुरू करते हैं। अगर Advice हो तो 'You are advised to' या 'should be' लगाते हैं।",
                examples: [
                    { hi: "Active: Open the door.", en: "Passive: Let the door be opened." },
                    { hi: "Active: Please help me.", en: "Passive: You are requested to help me." }
                ]
            }
        ],
        practice: [
            { hi: "Active: He reads a book. (Passive बनाओ)", en: "A book is read by him." },
            { hi: "Active: I do not like tea. (Passive बनाओ)", en: "Tea is not liked by me." },
            { hi: "Active: Are you playing cricket? (Passive बनाओ)", en: "Is cricket being played by you?" },
            { hi: "Active: She is cooking food. (Passive बनाओ)", en: "Food is being cooked by her." },
            { hi: "Active: They have won the match. (Passive बनाओ)", en: "The match has been won by them." },
            { hi: "Active: Who wrote this letter? (Passive बनाओ)", en: "By whom was this letter written?" },
            { hi: "Active: I bought a car yesterday. (Passive बनाओ)", en: "A car was bought by me yesterday." },
            { hi: "Active: The boys were making a noise. (Passive बनाओ)", en: "A noise was being made by the boys." },
            { hi: "Active: She had finished her work. (Passive बनाओ)", en: "Her work had been finished by her." },
            { hi: "Active: We shall play a match. (Passive बनाओ)", en: "A match will be played by us." },
            { hi: "Active: He will not help me. (Passive बनाओ)", en: "I shall not be helped by him." },
            { hi: "Active: Open the window. (Passive बनाओ)", en: "Let the window be opened." },
            { hi: "Active: Please give me a pen. (Passive बनाओ)", en: "You are requested to give me a pen." },
            { hi: "Active: Do not insult the poor. (Passive बनाओ)", en: "Let the poor not be insulted." },
            { hi: "Active: Respect your parents. (Passive बनाओ)", en: "Your parents should be respected." },
            { hi: "Active: He teaches me English. (Passive बनाओ)", en: "I am taught English by him." },
            { hi: "Active: People speak English all over the world. (Passive बनाओ)", en: "English is spoken all over the world." },
            { hi: "Active: Has he completed the project? (Passive बनाओ)", en: "Has the project been completed by him?" },
            { hi: "Active: I was writing a letter. (Passive बनाओ)", en: "A letter was being written by me." },
            { hi: "Active: The police arrested the thief. (Passive बनाओ)", en: "The thief was arrested by the police." }
        ]
    },
    
    
    // --- 5. NARRATION (Direct & Indirect Speech) ---
    "narration": {
        title: "Narration (Direct/Indirect)",
        icon: "fa-comments",
        desc: "Master the art of reporting!",
        theme: "gradient-gray",
        rules: [
            {
                tag: "Rule 1 💡", title: "Basic Rule & 'Said to'",
                pehchan: "📌 बाहर वाले हिस्से को Reporting Verb और अंदर वाले (Inverted commas) को Reported Speech कहते हैं।",
                formula: "said to ➔ told | says to ➔ tells",
                note: "Note: Inverted commas (\"\") हटाकर 'that' लगाते हैं। अगर Reporting Verb (बाहर) Present या Future (say/will say) में है, तो अंदर का Tense नहीं बदलता!",
                examples: [
                    { hi: "Direct: He says, \"I am ready.\"", en: "Indirect: He says that he is ready." },
                    { hi: "Direct: Ram said to me, \"You are good.\"", en: "Indirect: Ram told me that you were good. (Tense बदलेगा)" }
                ]
            },
            {
                tag: "Rule 2 💡", title: "Change of Tense (काल बदलना)",
                pehchan: "📌 अगर बाहर 'said' हो, तो अंदर का Present पूरा Past में बदल जाता है।",
                formula: "is/am/are ➔ was/were | has/have ➔ had | V1 ➔ V2",
                note: "Note: Past Indefinite (V2) ➔ Past Perfect (had + V3) में बदलता है।<br>will ➔ would, shall ➔ should, can ➔ could, may ➔ might.",
                examples: [
                    { hi: "Direct: She said, \"I am busy.\"", en: "Indirect: She said that she was busy." },
                    { hi: "Direct: He said, \"I went to Delhi.\"", en: "Indirect: He said that he had gone to Delhi." }
                ]
            },
            {
                tag: "Rule 3 💡", title: "SON Rule (Pronoun बदलना)",
                pehchan: "📌 S-O-N / 1-2-3 (1st Person ➔ Subject से, 2nd ➔ Object से, 3rd ➔ No Change)",
                formula: "1(I, We) ➔ S | 2(You) ➔ O | 3(He,She,It) ➔ N",
                note: "Note: I और We को बाहर वाले Subject के हिसाब से बदलो। You को 'said to' के बाद वाले Object के हिसाब से बदलो।",
                examples: [
                    { hi: "Direct: He said to me, \"You are my friend.\"", en: "Indirect: He told me that I was his friend." },
                    { hi: "Direct: I said to him, \"I can help you.\"", en: "Indirect: I told him that I could help him." }
                ]
            },
            {
                tag: "Rule 4 💡", title: "Time & Position Words",
                pehchan: "📌 पास वाली चीज़ों को दूर वाली चीज़ों में बदल देते हैं।",
                formula: "This ➔ That | Here ➔ There | Today ➔ That day",
                note: "Note: Tomorrow ➔ The next day<br>Yesterday ➔ The previous day<br>Now ➔ Then",
                examples: [
                    { hi: "Direct: Ram said, \"I am reading a book today.\"", en: "Indirect: Ram said that he was reading a book that day." }
                ]
            },
            {
                tag: "Rule 5 💡", title: "Interrogative (प्रश्नवाचक वाक्य)",
                pehchan: "📌 जब अंदर सवाल पूछा गया हो (?)",
                formula: "said to ➔ asked | that की जगह ➔ if / whether",
                note: "Note: अगर सवाल 'Wh- word' (What, Where, Why) से शुरू हो, तो 'if' नहीं लगाते, वही word जोड़ देते हैं। और वाक्य को Simple (Subject + Verb) कर देते हैं।",
                examples: [
                    { hi: "Direct: He said to me, \"Are you well?\"", en: "Indirect: He asked me if I was well." },
                    { hi: "Direct: She said to him, \"Where are you going?\"", en: "Indirect: She asked him where he was going." }
                ]
            }
        ],
        practice: [
            { hi: "He said, \"I am a good boy.\" (Indirect बनाओ)", en: "He said that he was a good boy." },
            { hi: "Ram said to me, \"You are my friend.\" (Indirect बनाओ)", en: "Ram told me that I was his friend." },
            { hi: "She said, \"I have done my work.\" (Indirect बनाओ)", en: "She said that she had done her work." },
            { hi: "He says, \"I am ready.\" (Indirect बनाओ)", en: "He says that he is ready." },
            { hi: "They said, \"We will play cricket.\" (Indirect बनाओ)", en: "They said that they would play cricket." },
            { hi: "The teacher said, \"The earth is round.\" (Universal Truth - Indirect बनाओ)", en: "The teacher said that the earth is round." },
            { hi: "I said to him, \"I can help you.\" (Indirect बनाओ)", en: "I told him that I could help him." },
            { hi: "She said to me, \"Where are you going?\" (Indirect बनाओ)", en: "She asked me where I was going." },
            { hi: "He said to her, \"Are you well?\" (Indirect बनाओ)", en: "He asked her if she was well." },
            { hi: "He said, \"I went to Delhi yesterday.\" (Indirect बनाओ)", en: "He said that he had gone to Delhi the previous day." },
            { hi: "Mohan said to me, \"I will not go there.\" (Indirect बनाओ)", en: "Mohan told me that he would not go there." },
            { hi: "She said to him, \"Do you know me?\" (Indirect बनाओ)", en: "She asked him if he knew her." },
            { hi: "Ram said, \"I am reading a book today.\" (Indirect बनाओ)", en: "Ram said that he was reading a book that day." },
            { hi: "He said, \"I bought this car.\" (Indirect बनाओ)", en: "He said that he had bought that car." },
            { hi: "She says to me, \"I am your sister.\" (Indirect बनाओ)", en: "She tells me that she is my sister." },
            { hi: "He said to me, \"What is your name?\" (Indirect बनाओ)", en: "He asked me what my name was." },
            { hi: "The boy said, \"I cannot do this.\" (Indirect बनाओ)", en: "The boy said that he could not do that." },
            { hi: "She said, \"I was waiting for you.\" (Indirect बनाओ)", en: "She said that she had been waiting for me." },
            { hi: "He said to us, \"You are good boys.\" (Indirect बनाओ)", en: "He told us that we were good boys." },
            { hi: "My mother said to me, \"When will you sleep?\" (Indirect बनाओ)", en: "My mother asked me when I would sleep." }
        ]
    },
    
    
    // --- 6. SYNTHESIS (वाक्यों को जोड़ना) ---
    "synthesis": {
        title: "Synthesis of Sentences",
        icon: "fa-link",
        desc: "Combine sentences like a Pro!",
        theme: "gradient-blue",
        rules: [
            {
                tag: "Rule 1 💡", title: "Simple Sentence (Participle)",
                pehchan: "📌 जब एक काम के तुरंत बाद दूसरा काम हो (V1+ing या Having + V3)।",
                formula: "V1+ing (करके/हुए) | Having + V3 (पूरा होने पर)",
                note: "Note: अगर दोनों वाक्यों का Subject एक ही है और एक काम खत्म होने के बाद दूसरा शुरू हो रहा है, तो पहले वाले काम की Verb में 'ing' लगा दो। (जैसे: He saw a lion. He ran away. ➔ Seeing a lion, he ran away.)",
                examples: [
                    { hi: "उसने शेर देखा। वह भाग गया।", en: "Seeing a lion, he ran away." },
                    { hi: "काम खत्म करके, वह घर गया।", en: "Having finished his work, he went home." }
                ]
            },
            {
                tag: "Rule 2 💡", title: "Simple Sentence (Infinitive)",
                pehchan: "📌 जब एक वाक्य में काम हो और दूसरे में उसका 'उद्देश्य' (Purpose) हो।",
                formula: "To + V1 (उद्देश्य बताने के लिए)",
                note: "Note: अगर वाक्य में 'very... cannot' है, तो उसे 'too... to' में बदल देते हैं।",
                examples: [
                    { hi: "मैं आगरा गया। मैं ताज देखना चाहता था।", en: "I went to Agra to see the Taj." },
                    { hi: "वह इतना कमज़ोर है कि चल नहीं सकता।", en: "He is too weak to walk." }
                ]
            },
            {
                tag: "Rule 3 💡", title: "Compound Sentence",
                pehchan: "📌 जब दो बराबर के (स्वतंत्र) वाक्यों को जोड़ना हो।",
                formula: "And, But, So, Or, Otherwise (FANBOYS)",
                note: "Note: 'But' (लेकिन) विरोधाभास के लिए, 'So' (इसलिए) परिणाम के लिए, 'Or' (या) विकल्प के लिए इस्तेमाल होता है।",
                examples: [
                    { hi: "वह गरीब है। वह ईमानदार है।", en: "He is poor but he is honest." },
                    { hi: "मेहनत करो। तुम फेल हो जाओगे।", en: "Work hard or you will fail." }
                ]
            },
            {
                tag: "Rule 4 💡", title: "Complex Sentence (Relative Clause)",
                pehchan: "📌 जब एक मुख्य वाक्य हो और दूसरा उस पर निर्भर हो (who, which, that)।",
                formula: "Who (इंसान) | Which (निर्जीव/जानवर) | Where (जगह)",
                note: "Note: 'Who' का मतलब यहाँ 'जो' होता है। 'Which' का मतलब भी 'जो' होता है लेकिन चीज़ों के लिए।",
                examples: [
                    { hi: "मैंने एक आदमी देखा। वह अँधा था।", en: "I saw a man who was blind." },
                    { hi: "मैंने एक पेन खरीदा। वह महँगा था।", en: "I bought a pen which was costly." }
                ]
            },
            {
                tag: "Rule 5 💡", title: "Complex Sentence (Adverb Clause)",
                pehchan: "📌 शर्त (Condition), कारण (Reason) या समय (Time) बताने के लिए।",
                formula: "If (यदि), Because (क्योंकि), When (जब), Although (हालाँकि)",
                note: "Note: If से शुरू होने वाले वाक्यों में अगर पहला हिस्सा Present में है, तो दूसरा Future में होता है।",
                examples: [
                    { hi: "अगर तुम सच बोलोगे, तो मैं तुम्हें माफ़ कर दूँगा।", en: "If you tell the truth, I shall pardon you." }
                ]
            }
        ],
        practice: [
            { hi: "He saw a lion. He ran away. (Simple बनाओ)", en: "Seeing a lion, he ran away." },
            { hi: "He took his pen. He wrote a letter. (Simple बनाओ)", en: "Taking his pen, he wrote a letter." },
            { hi: "He is very weak. He cannot walk. (Simple बनाओ)", en: "He is too weak to walk." },
            { hi: "I went to Agra. I wanted to see the Taj. (Simple बनाओ)", en: "I went to Agra to see the Taj." },
            { hi: "He is poor. He is honest. (Compound बनाओ)", en: "He is poor but he is honest." },
            { hi: "Work hard. You will fail. (Compound बनाओ)", en: "Work hard or you will fail." },
            { hi: "He finished his work. He went home. (Simple बनाओ)", en: "Having finished his work, he went home." },
            { hi: "I bought a pen. It was costly. (Complex बनाओ)", en: "I bought a pen which was costly." },
            { hi: "He worked hard. He failed. (Compound बनाओ)", en: "He worked hard but he failed." },
            { hi: "I know the man. He came here yesterday. (Complex बनाओ)", en: "I know the man who came here yesterday." },
            { hi: "Tell me the truth. I shall pardon you. (Complex बनाओ)", en: "If you tell me the truth, I shall pardon you." },
            { hi: "He is ill. He cannot go to school. (Compound बनाओ)", en: "He is ill so he cannot go to school." },
            { hi: "This is the boy. He stole my pen. (Complex बनाओ)", en: "This is the boy who stole my pen." },
            { hi: "You must work hard. You will get good marks. (Complex बनाओ)", en: "If you work hard, you will get good marks." },
            { hi: "I heard the news. I was glad. (Simple बनाओ)", en: "I was glad to hear the news." },
            { hi: "The thief saw the police. He ran away. (Simple बनाओ)", en: "Seeing the police, the thief ran away." },
            { hi: "It is raining. I cannot go out. (Complex बनाओ)", en: "I cannot go out because it is raining." },
            { hi: "He was punished. He was fined. (Compound बनाओ)", en: "He was not only punished but also fined." },
            { hi: "The sun set. The birds went to their nests. (Simple बनाओ)", en: "The sun having set, the birds went to their nests." },
            { hi: "I met a blind man. He was begging. (Complex बनाओ)", en: "I met a blind man who was begging." }
        ]
    },
    
    
    // --- 7. TRANSFORMATION OF SENTENCES ---
    "transformation": {
        title: "Transformation",
        icon: "fa-exchange-alt",
        desc: "Change form without changing meaning!",
        theme: "gradient-gray",
        rules: [
            {
                tag: "Rule 1 💡", title: "Removal of 'Too'",
                pehchan: "📌 'Too' को हटाकर उसकी जगह 'So' और आगे 'that... cannot/could not' लगाते हैं।",
                formula: "too...to ➔ so...that...cannot",
                note: "Note: अगर वाक्य Past में है (was/were), तो cannot की जगह could not आएगा।",
                examples: [
                    { hi: "He is too weak to walk.", en: "He is so weak that he cannot walk." },
                    { hi: "He was too tired to run.", en: "He was so tired that he could not run." }
                ]
            },
            {
                tag: "Rule 2 💡", title: "Degrees of Comparison",
                pehchan: "📌 Adjective के रूपों (Positive, Comparative, Superlative) को आपस में बदलना।",
                formula: "Positive (No other) | Comparative (than any other) | Superlative (the + Est)",
                note: "Note: 'No other' से शुरू होने वाले Positive वाक्य का Superlative बनाते समय 'the + superlative degree' आती है।",
                examples: [
                    { hi: "Delhi is the biggest city.", en: "No other city is as big as Delhi." },
                    { hi: "Iron is more useful than any other metal.", en: "Iron is the most useful metal." }
                ]
            },
            {
                tag: "Rule 3 💡", title: "Affirmative to Negative",
                pehchan: "📌 अर्थ बदले बिना वाक्य को नकारात्मक बनाना (Vilom/Antonym का प्रयोग करके)।",
                formula: "Main word का Opposites + Not",
                note: "Note: 'Always' को 'Never' में, और 'As soon as' को 'No sooner... than' में बदलते हैं।",
                examples: [
                    { hi: "He is a wise man.", en: "He is not a foolish man." },
                    { hi: "I shall always remember you.", en: "I shall never forget you." }
                ]
            },
            {
                tag: "Rule 4 💡", title: "Interrogative to Assertive",
                pehchan: "📌 प्रश्नवाचक वाक्य को साधारण वाक्य में बदलना।",
                formula: "Question mark हटाकर वाक्य को Statement में पलटना",
                note: "Note: अगर Interrogative में 'not' नहीं है, तो Assertive बनाते समय 'not' लगा देते हैं।",
                examples: [
                    { hi: "Who does not know Mahatma Gandhi?", en: "Everyone knows Mahatma Gandhi." },
                    { hi: "Is this the way to speak?", en: "This is not the way to speak." }
                ]
            },
            {
                tag: "Rule 5 💡", title: "Exclamatory to Assertive",
                pehchan: "📌 विस्मयादिबोधक (!) वाक्यों को साधारण वाक्य में बदलना।",
                formula: "Alas ➔ It is sad | Hurrah ➔ It is matter of joy | What a ➔ It is a great",
                note: "Note: 'What a' या 'How' से शुरू होने वाले वाक्यों में 'great' या 'very' का प्रयोग होता है।",
                examples: [
                    { hi: "What a piece of work is man!", en: "Man is a very great piece of work." },
                    { hi: "Alas! I am undone.", en: "It is a matter of sorrow that I am undone." }
                ]
            }
        ],
        practice: [
            { hi: "He is too weak to run. (Remove 'too')", en: "He is so weak that he cannot run." },
            { hi: "The tree is too high for me to climb. (Remove 'too')", en: "The tree is so high that I cannot climb it." },
            { hi: "He was too tired to stand. (Remove 'too')", en: "He was so tired that he could not stand." },
            { hi: "Mumbai is the biggest city in India. (Comparative बनाओ)", en: "Mumbai is bigger than any other city in India." },
            { hi: "Iron is more useful than any other metal. (Superlative बनाओ)", en: "Iron is the most useful metal." },
            { hi: "No other boy in the class is as tall as Rohan. (Superlative बनाओ)", en: "Rohan is the tallest boy in the class." },
            { hi: "He is an honest man. (Negative बनाओ)", en: "He is not a dishonest man." },
            { hi: "I shall always remember your help. (Negative बनाओ)", en: "I shall never forget your help." },
            { hi: "As soon as the teacher entered the class, the boys stood up. (Negative बनाओ)", en: "No sooner did the teacher enter the class than the boys stood up." },
            { hi: "Only Ram can do this. (Negative बनाओ)", en: "None but Ram can do this." },
            { hi: "Who does not know Sachin Tendulkar? (Assertive बनाओ)", en: "Everyone knows Sachin Tendulkar." },
            { hi: "Can a man change his habits? (Assertive बनाओ)", en: "A man cannot change his habits." },
            { hi: "What a beautiful flower this is! (Assertive बनाओ)", en: "This is a very beautiful flower." },
            { hi: "Alas! We have lost the match. (Assertive बनाओ)", en: "It is a matter of sorrow that we have lost the match." },
            { hi: "He is wiser than his brother. (Positive degree बनाओ)", en: "His brother is not as wise as he." },
            { hi: "Gold is the heaviest metal. (Positive degree बनाओ)", en: "No other metal is as heavy as gold." },
            { hi: "He is too intelligent not to understand this. (Remove 'too')", en: "He is so intelligent that he can understand this." },
            { hi: "She is richer than I. (Positive degree बनाओ)", en: "I am not as rich as she." },
            { hi: "Everybody knows him. (Interrogative बनाओ)", en: "Who does not know him?" },
            { hi: "No one could have prevented this. (Interrogative बनाओ)", en: "Who could have prevented this?" }
        ]
    },
    
    
    // --- 8. SYNTAX (वाक्य शुद्धि / Error Spotting) ---
    "syntax": {
        title: "Syntax",
        icon: "fa-magnifying-glass-check",
        desc: "Spot the errors and fix them!",
        theme: "gradient-purple",
        rules: [
            {
                tag: "Rule 1 💡", title: "Nouns (संज्ञा की गलतियां)",
                pehchan: "📌 कुछ Nouns हमेशा Singular (एकवचन) में ही रहते हैं, उनमें 's' नहीं लगता।",
                formula: "Scenery, Furniture, Hair, Information, Advice, Poetry",
                note: "Note: 'Sceneries', 'Furnitures', 'Hairs' लिखना गलत है। अगर गिनना हो तो 'pieces of' लगाते हैं।",
                examples: [
                    { hi: "❌ Incorrect: The sceneries of Kashmir are beautiful.", en: "✅ Correct: The scenery of Kashmir is beautiful." },
                    { hi: "❌ Incorrect: My hairs are black.", en: "✅ Correct: My hair is black." }
                ]
            },
            {
                tag: "Rule 2 💡", title: "Pronoun & Cases",
                pehchan: "📌 'One' के साथ हमेशा 'one's' आता है, 'his' नहीं। 2-3-1 Rule (You, He, I)।",
                formula: "One ➔ one's | Let के बाद ➔ Objective Case (me, him)",
                note: "Note: 'Let' और Prepositions (between, among) के बाद हमेशा Objective case (me, him, them) आता है, Subjective (I, he, they) नहीं।",
                examples: [
                    { hi: "❌ Incorrect: One should do his duty.", en: "✅ Correct: One should do one's duty." },
                    { hi: "❌ Incorrect: Let you and I go.", en: "✅ Correct: Let you and me go." }
                ]
            },
            {
                tag: "Rule 3 💡", title: "Adjectives (Senior, Junior, Prefer)",
                pehchan: "📌 कुछ Adjectives के बाद 'than' की जगह हमेशा 'to' आता है।",
                formula: "Senior, Junior, Superior, Inferior, Prefer ➔ 'to'",
                note: "Note: Prefer (अधिक पसंद करना) के साथ भी हमेशा 'to' आता है।",
                examples: [
                    { hi: "❌ Incorrect: He is senior than me.", en: "✅ Correct: He is senior to me." },
                    { hi: "❌ Incorrect: I prefer milk than tea.", en: "✅ Correct: I prefer milk to tea." }
                ]
            },
            {
                tag: "Rule 4 💡", title: "Subject-Verb Agreement",
                pehchan: "📌 कुछ Subjects दिखने में Plural लगते हैं, पर होते Singular हैं।",
                formula: "Physics, Mathematics, News, Innings ➔ Singular Verb (is/was)",
                note: "Note: Each, Every, Either, Neither के साथ हमेशा Singular verb (एकवचन क्रिया) आती है।",
                examples: [
                    { hi: "❌ Incorrect: Mathematics are a tough subject.", en: "✅ Correct: Mathematics is a tough subject." },
                    { hi: "❌ Incorrect: Neither of them were present.", en: "✅ Correct: Neither of them was present." }
                ]
            },
            {
                tag: "Rule 5 💡", title: "Prepositions",
                pehchan: "📌 कुछ शब्दों के साथ Fixed Preposition (निश्चित अव्यय) आते हैं।",
                formula: "Die of (बीमारी से), Suffer from, Prevent from",
                note: "Note: किसी बीमारी से मरने पर 'died of' आता है, 'died from' नहीं।",
                examples: [
                    { hi: "❌ Incorrect: He died from cholera.", en: "✅ Correct: He died of cholera." },
                    { hi: "❌ Incorrect: He is suffering with fever.", en: "✅ Correct: He is suffering from fever." }
                ]
            }
        ],
        practice: [
            { hi: "Incorrect: The sceneries of Kashmir are beautiful. (सही करो)", en: "The scenery of Kashmir is beautiful." },
            { hi: "Incorrect: One should do his duty. (सही करो)", en: "One should do one's duty." },
            { hi: "Incorrect: He prefers milk than tea. (सही करो)", en: "He prefers milk to tea." },
            { hi: "Incorrect: Mathematics are a tough subject. (सही करो)", en: "Mathematics is a tough subject." },
            { hi: "Incorrect: My hairs are black. (सही करो)", en: "My hair is black." },
            { hi: "Incorrect: He is senior than me. (सही करो)", en: "He is senior to me." },
            { hi: "Incorrect: Let you and I go there. (सही करो)", en: "Let you and me go there." },
            { hi: "Incorrect: He died from cholera. (सही करो)", en: "He died of cholera." },
            { hi: "Incorrect: I have many works to do. (सही करो)", en: "I have much work to do." },
            { hi: "Incorrect: Each of the boys were punished. (सही करो)", en: "Each of the boys was punished." },
            { hi: "Incorrect: He is suffering with fever. (सही करो)", en: "He is suffering from fever." },
            { hi: "Incorrect: He gave me many advices. (सही करो)", en: "He gave me much advice." },
            { hi: "Incorrect: Sun rises in east. (सही करो)", en: "The sun rises in the east." },
            { hi: "Incorrect: Neither Ram nor Shyam have come. (सही करो)", en: "Neither Ram nor Shyam has come." },
            { hi: "Incorrect: I and he went to Delhi. (सही करो)", en: "He and I went to Delhi." },
            { hi: "Incorrect: Distribute the sweets between the boys. (सही करो)", en: "Distribute the sweets among the boys." },
            { hi: "Incorrect: It is I who is your friend. (सही करो)", en: "It is I who am your friend." },
            { hi: "Incorrect: Tell me where are you going. (सही करो)", en: "Tell me where you are going." },
            { hi: "Incorrect: He told to me a story. (सही करो)", en: "He told me a story." },
            { hi: "Incorrect: I bought three dozens apples. (सही करो)", en: "I bought three dozen apples." }
        ]
    }





    // ⬇️ FUTURE MEIN VOICE AUR NARRATION YAHIN ADD KARENGE ⬇️
};


/* =========================================================
   🌟 APP STATE & SYSTEM VARIABLES
   ========================================================= */
let currentChapter = "";
let currentRuleIndex = 0;
let currentPracticeIndex = 0;

let currentSentenceEn = "";
let wordsBank = [];
let selectedWords = [];

// DOM Elements
const viewChapter = document.getElementById("chapter-view");
const viewRule = document.getElementById("rule-view");
const viewPractice = document.getElementById("practice-view");
const dynamicChapters = document.getElementById("dynamic-chapters-container");
const headerTitle = document.getElementById("header-title");
const backBtn = document.getElementById("header-back-btn");

const ruleCardContainer = document.getElementById("current-rule-card");
const progressFill = document.getElementById("rule-progress");
const stepText = document.getElementById("current-step-text");
const btnPrev = document.getElementById("prev-rule-btn");
const btnNext = document.getElementById("next-rule-btn");

const btnShowAnswer = document.getElementById("show-answer-btn");
const btnCheckAnswer = document.getElementById("check-answer-btn");
const btnClear = document.getElementById("clear-btn");
const successModal = document.getElementById("success-modal");


/* =========================================================
   🌟 INITIALIZATION (Dynamic Loading)
   ========================================================= */
window.onload = function() {
    loadDynamicChapters();
};

function loadDynamicChapters() {
    dynamicChapters.innerHTML = "";
    
    // Iterate over our grammarData object
    for (let key in grammarData) {
        let chap = grammarData[key];
        
        let cardHTML = `
        <div class="premium-card chapter-card" onclick="openChapter('${key}')">
            <div class="card-glow"></div>
            <div class="ch-icon-box ${chap.theme}"><i class="fa-solid ${chap.icon}"></i></div>
            <div class="ch-info">
                <h4>${chap.title}</h4>
                <p>${chap.desc}</p>
            </div>
            <button class="action-btn play-btn"><i class="fa-solid fa-play"></i></button>
        </div>`;
        
        dynamicChapters.innerHTML += cardHTML;
    }
}

function triggerVibration(ms = 50) {
    if (navigator.vibrate) navigator.vibrate(ms);
}


/* =========================================================
   🌟 NAVIGATION
   ========================================================= */
function openChapter(chapterId) {
    triggerVibration();
    currentChapter = chapterId;
    currentRuleIndex = 0;
    currentPracticeIndex = 0;
    
    viewChapter.classList.add("hidden");
    viewRule.classList.remove("hidden");
    viewPractice.classList.add("hidden");
    
    backBtn.setAttribute("onclick", "goHome()");
    headerTitle.innerHTML = `<i class="fa-solid fa-book-open"></i> ${grammarData[chapterId].title}`;
    
    renderRule();
}

function goHome() {
    triggerVibration();
    viewChapter.classList.remove("hidden");
    viewRule.classList.add("hidden");
    viewPractice.classList.add("hidden");
    backBtn.setAttribute("onclick", "window.location.href='index.html'");
    headerTitle.innerHTML = `<i class="fa-solid fa-rocket"></i> Grammar Vault`;
}


/* =========================================================
   🌟 RULE ENGINE
   ========================================================= */
function renderRule() {
    const rules = grammarData[currentChapter].rules;
    const rule = rules[currentRuleIndex];
    
    stepText.innerText = `Rule ${currentRuleIndex + 1} of ${rules.length}`;
    progressFill.style.width = `${((currentRuleIndex + 1) / rules.length) * 100}%`;

    let examplesHtml = "";
    if(rule.examples && rule.examples.length > 0) {
        examplesHtml = `<div class="rule-examples-box mt-20">
            <div class="ex-title">Examples (उदाहरण)</div>`;
        rule.examples.forEach(ex => {
            examplesHtml += `
                <div class="example-item">
                    <div class="ex-hi">🇮🇳 ${ex.hi}</div>
                    <div class="ex-en">🇬🇧 ${ex.en}</div>
                </div>`;
        });
        examplesHtml += `</div>`;
    }

    ruleCardContainer.innerHTML = `
        <div class="rule-tag">${rule.tag}</div>
        <h2 class="rule-title">${rule.title}</h2>
        <div class="rule-pehchan">${rule.pehchan}</div>
        <div class="rule-formula">${rule.formula}</div>
        <div class="rule-note">${rule.note}</div>
        ${examplesHtml}
    `;

    btnPrev.disabled = currentRuleIndex === 0;
    
    if (currentRuleIndex === rules.length - 1) {
        btnNext.innerHTML = 'Practice Mode 🎯';
        btnNext.style.background = "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)";
    } else {
        btnNext.innerHTML = 'Next Rule <i class="fa-solid fa-angle-right"></i>';
        btnNext.style.background = "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)";
    }
}

function nextRule() {
    triggerVibration();
    const rules = grammarData[currentChapter].rules;
    if (currentRuleIndex < rules.length - 1) {
        currentRuleIndex++;
        animateCard();
        renderRule();
    } else {
        startPractice();
    }
}

function prevRule() {
    triggerVibration();
    if (currentRuleIndex > 0) {
        currentRuleIndex--;
        animateCard();
        renderRule();
    }
}

function animateCard() {
    ruleCardContainer.classList.remove("fade-in");
    void ruleCardContainer.offsetWidth; 
    ruleCardContainer.classList.add("fade-in");
}


/* =========================================================
   🌟 SENTENCE BUILDER GAME
   ========================================================= */
function startPractice() {
    triggerVibration();
    viewRule.classList.add("hidden");
    viewPractice.classList.remove("hidden");
    headerTitle.innerHTML = `<i class="fa-solid fa-dumbbell"></i> Practice Mode`;
    backBtn.setAttribute("onclick", "openChapter('"+currentChapter+"')");
    
    currentPracticeIndex = 0;
    loadPracticeQuestion();
}

function loadPracticeQuestion() {
    const practices = grammarData[currentChapter].practice;
    
    if(currentPracticeIndex >= practices.length) {
        showSuccessModal();
        return;
    }

    // Reset Buttons for new question
    btnShowAnswer.style.display = "flex";
    btnClear.style.display = "flex";
    btnCheckAnswer.innerHTML = 'Check Answer <i class="fa-solid fa-check-double"></i>';
    btnCheckAnswer.style.background = "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)";
    btnCheckAnswer.setAttribute("onclick", "checkAnswer()");

    const currentQ = practices[currentPracticeIndex];
    document.getElementById("target-hindi").innerText = `(${currentPracticeIndex + 1}/${practices.length}) ${currentQ.hi}`;
    currentSentenceEn = currentQ.en; 

    // Create Word Bank (Strip punctuation and split)
    let cleanSentence = currentQ.en.replace(/[.,?]/g, "");
    wordsBank = cleanSentence.split(" ");
    
    // Add Dummy Words to make it slightly challenging
    const dummies = ["was", "will", "had", "been", "does", "are", "is", "have"];
    let randomDummy = dummies[Math.floor(Math.random() * dummies.length)];
    if(!wordsBank.includes(randomDummy)) {
        wordsBank.push(randomDummy);
    }
    
    wordsBank = shuffleArray(wordsBank);
    selectedWords = [];
    
    renderGameUI();
}

function renderGameUI() {
    const bankDiv = document.getElementById("word-bank");
    const ansDiv = document.getElementById("answer-zone");
    
    bankDiv.innerHTML = "";
    ansDiv.innerHTML = "";
    ansDiv.style.borderColor = "";
    ansDiv.style.background = "";
    
    selectedWords.forEach((word, index) => {
        const chip = document.createElement("div");
        chip.className = "word-chip gradient-purple fade-in";
        chip.innerText = word;
        chip.onclick = () => returnToBank(index);
        ansDiv.appendChild(chip);
    });

    wordsBank.forEach((word, index) => {
        const chip = document.createElement("div");
        chip.className = "word-chip";
        chip.innerText = word;
        chip.onclick = () => selectWord(index);
        bankDiv.appendChild(chip);
    });

    if(selectedWords.length > 0) ansDiv.classList.add("active");
    else ansDiv.classList.remove("active");
}

function selectWord(index) {
    triggerVibration(20);
    selectedWords.push(wordsBank.splice(index, 1)[0]);
    renderGameUI();
}

function returnToBank(index) {
    triggerVibration(20);
    wordsBank.push(selectedWords.splice(index, 1)[0]);
    renderGameUI();
}

function clearSentence() {
    triggerVibration(30);
    if(selectedWords.length === 0) return;
    wordsBank.push(...selectedWords);
    selectedWords = [];
    renderGameUI();
}

/* =========================================================
   🌟 LOGIC: CHECK & SHOW ANSWER
   ========================================================= */
function checkAnswer() {
    triggerVibration(50);
    if(selectedWords.length === 0) return;

    let userSentence = selectedWords.join(" ");
    let correctClean = currentSentenceEn.replace(/[.,?]/g, "").trim().toLowerCase();
    let userClean = userSentence.trim().toLowerCase();

    const ansDiv = document.getElementById("answer-zone");

    if (userClean === correctClean) {
        // Correct
        document.getElementById("sound-correct").play().catch(e=>{});
        ansDiv.style.borderColor = "#05c46b";
        ansDiv.style.background = "rgba(5, 196, 107, 0.2)";
        
        let streak = document.getElementById("streak-count");
        if(streak) streak.innerText = parseInt(streak.innerText) + 1;

        btnCheckAnswer.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Moving...';
        
        setTimeout(() => {
            currentPracticeIndex++;
            loadPracticeQuestion();
        }, 1500);

    } else {
        // Wrong
        document.getElementById("sound-wrong").play().catch(e=>{});
        triggerVibration([50, 100, 50]);
        ansDiv.style.borderColor = "#ff4757";
        ansDiv.style.background = "rgba(255, 71, 87, 0.2)";
        ansDiv.classList.add("shake-anim");
        
        setTimeout(() => {
            ansDiv.style.borderColor = "";
            ansDiv.style.background = "";
            ansDiv.classList.remove("shake-anim");
        }, 800);
    }
}

function showAnswer() {
    triggerVibration();
    const ansDiv = document.getElementById("answer-zone");
    
    // Visual presentation of the correct answer
    ansDiv.innerHTML = `<div class="fade-in" style="width: 100%; text-align: center; color: #fbc531; font-size: 1.1rem; padding: 15px;">
        💡 <b>सही जवाब (Correct Answer):</b><br><br><span style="color:#fff; font-size: 1.4rem; font-weight:bold;">${currentSentenceEn}</span>
    </div>`;
    
    ansDiv.style.borderColor = "#fbc531";
    ansDiv.style.background = "rgba(251, 197, 49, 0.1)";
    
    // Hide word bank and secondary buttons
    document.getElementById("word-bank").innerHTML = "";
    btnShowAnswer.style.display = "none";
    btnClear.style.display = "none";
    
    // Morph Check Button into Next Button
    btnCheckAnswer.innerHTML = 'Next Question <i class="fa-solid fa-arrow-right"></i>';
    btnCheckAnswer.style.background = "linear-gradient(135deg, #f39c12 0%, #d35400 100%)";
    btnCheckAnswer.setAttribute("onclick", "nextQuestionManual()");
}

function nextQuestionManual() {
    currentPracticeIndex++;
    loadPracticeQuestion();
}


/* =========================================================
   🌟 SUCCESS MODAL & CONFETTI (Celebration)
   ========================================================= */
function showSuccessModal() {
    document.getElementById("sound-complete").play().catch(e=>{});
    triggerVibration([100, 50, 100, 50, 100]);
    
    // Update streak in modal
    document.getElementById("modal-streak").innerText = "🔥 " + document.getElementById("streak-count").innerText;
    
    successModal.classList.remove("hidden");
    fireConfetti();
}

function closeSuccessModal() {
    triggerVibration();
    successModal.classList.add("hidden");
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.classList.add("hidden");
    
    goHome();
}

// Simple Confetti Logic
function fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    canvas.classList.remove('hidden');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    
    const pieces = [];
    const colors = ['#fbc531', '#00d2ff', '#ff4757', '#05c46b', '#8e2de2'];
    
    for(let i=0; i<100; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 10 + 5,
            c: colors[Math.floor(Math.random() * colors.length)],
            s: Math.random() * 5 + 2,
            rot: Math.random() * 360,
            rs: Math.random() * 5 - 2.5
        });
    }

    function animate() {
        if(successModal.classList.contains("hidden")) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.y += p.s;
            p.rot += p.rs;
            if(p.y > canvas.height) p.y = -10;
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillStyle = p.c;
            ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
            ctx.restore();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}
