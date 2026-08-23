// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AlzaSyBPqJ7LIFBS5UV4r2BpUTfqH7coE4huG2c",
  authDomain: "anru-foucs.firebaseapp.com",
  projectId: "anru-foucs",
  storageBucket: "anru-foucs.firebasestorage.app",
  messagingSenderId: "503432672889",
  appId: "1:503432672889:web:193c620deec4b8906646a8"
};

// 2. Initialize Firebase & Firestore
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore(); 
const googleProvider = new firebase.auth.GoogleAuthProvider();

/* ████████████████████████████████████████████████████████████
                  1. APP STATE & TIMEZONE CONFIG
████████████████████████████████████████████████████████████ */
const S={
  session:null, tasks:[], subjects:[], filter:'all', pri:'med', emoji:'fa-book', notif:false, sfx:true, xp:0, 
  theme: 'default', 
  unlocks: { matrix:false, cyber:false, ocean:false, sunset:false, gold:false, badge_ninja:false, badge_scholar:false, badge_legend:false }, 
  freezeDate: null, lastDrainDate: null, lastMissionDate: null,
  eyeStrain: false, activeBuff: null, 
  timer:{running:false, interval:null, total:25*60, left:25*60, elapsed:0, mode:'focus', session:1, logs:[], targetTime:0, startTime:0}
};

const EMOJIS=['fa-book', 'fa-microscope', 'fa-calculator', 'fa-ruler-combined', 'fa-globe', 'fa-laptop-code', 'fa-palette', 'fa-book-open', 'fa-dna', 'fa-flask', 'fa-file-signature', 'fa-music', 'fa-dumbbell', 'fa-network-wired', 'fa-telescope'];

// 🔥 SMART MAPPING (Fixes Dropdowns & Legacy Data)
const FA_TO_EMOJI = {'fa-book':'📚', 'fa-microscope':'🔬', 'fa-calculator':'🧮', 'fa-ruler-combined':'📐', 'fa-globe':'🌍', 'fa-laptop-code':'💻', 'fa-palette':'🎨', 'fa-book-open':'📖', 'fa-dna':'🧬', 'fa-flask':'⚗️', 'fa-file-signature':'📝', 'fa-music':'🎵', 'fa-dumbbell':'🏋️', 'fa-network-wired':'🌐', 'fa-telescope':'🔭', 'fa-folder':'📁'};
const EMOJI_TO_FA = {'📚':'fa-book', '🔬':'fa-microscope', '🧮':'fa-calculator', '📐':'fa-ruler-combined', '🌍':'fa-globe', '💻':'fa-laptop-code', '🎨':'fa-palette', '📖':'fa-book-open', '🧬':'fa-dna', '⚗️':'fa-flask', '📝':'fa-file-signature', '🎵':'fa-music', '🏋️':'fa-dumbbell', '🌐':'fa-network-wired', '🔭':'fa-telescope', '📁':'fa-folder'};

function migrateLegacyData() {
    S.subjects.forEach(s => {
        if (s.emoji && !s.emoji.startsWith('fa-')) {
            s.emoji = EMOJI_TO_FA[s.emoji] || 'fa-folder'; 
        }
    });
}

const QUOTES=[
  `निकल पड़े हैं तो अब मंज़िल को पाकर ही दम लेंगे, खुद को साबित करके इतिहास रच देंगे! <i class="fa-solid fa-bolt" style="color:#fbbf24"></i>`,
  `अभी बाकी है असली इम्तिहान, शांत रहकर मेहनत करो और उड़ा दो आसमान! <i class="fa-solid fa-fire" style="color:#f87171"></i>`,
  `जो मुस्कुरा रहा है उसे दर्द ने पाला होगा, जो चल रहा है उसके पाँव में छाला होगा! <i class="fa-solid fa-crown" style="color:#fbbf24"></i>`,
  `AnRu Focus माइंडसेट: बहानों को पीछे छोड़ो, आज के काम पर ध्यान जोड़ो! <i class="fa-solid fa-rocket" style="color:#60a5fa"></i>`,
  `भविष्य का अंदाज़ा लगाने का सबसे बेस्ट तरीका है कि उसे आज की मेहनत से लिख डालो! <i class="fa-solid fa-wand-magic-sparkles" style="color:#a855f7"></i>`,
  `सपने बड़े हैं तो संघर्ष भी बड़ा होगा, बिना तपे तो सोना भी नहीं निखरेगा! <i class="fa-solid fa-star" style="color:#fbbf24"></i>`,
  `वक़्त से लड़कर जो नसीब बदल दे, इंसान वही जो अपनी तकदीर बदल दे! <i class="fa-solid fa-hourglass-half" style="color:#a855f7"></i>`,
  `आज किताबों के सामने झुक जाओ, कल दुनिया तुम्हारे सामने झुकेगी! <i class="fa-solid fa-book-open" style="color:#4ade80"></i>`,
  `जिद्दी बनो, जो लिखा नहीं मुकद्दर में उसे भी हासिल करना सीखो! <i class="fa-solid fa-dumbbell" style="color:#f87171"></i>`,
  `मुश्किलें केवल बेहतरीन लोगों के हिस्से में आती हैं, क्योंकि वे ही इसे बेहतरीन तरीके से अंजाम दे सकते हैं! <i class="fa-solid fa-trophy" style="color:#fbbf24"></i>`,
  `थक कर ना बैठ ऐ मंज़िल के मुसाफ़िर, मंज़िल भी मिलेगी और मिलने का मज़ा भी आएगा! <i class="fa-solid fa-rocket" style="color:#60a5fa"></i>`,
  `अगर सूरज की तरह जलना है, तो रोज़ उगना पड़ेगा! <i class="fa-solid fa-sun" style="color:#fbbf24"></i>`,
  `नींद से इतना भी प्यार न करो कि मंज़िल भी ख्वाब बन जाए! <i class="fa-solid fa-eye" style="color:#60a5fa"></i>`,
  `मेहनत इतनी खामोशी से करो, कि सफलता शोर मचा दे! <i class="fa-solid fa-volume-high" style="color:#4ade80"></i>`,
  `हौसलों के तरकश में कोशिश का वो तीर ज़िंदा रखो, हार जाओ चाहे ज़िंदगी में सब कुछ, मगर फिर से जीतने की उम्मीद ज़िंदा रखो! <i class="fa-solid fa-bullseye" style="color:#f87171"></i>`,
  `रास्ते कभी खत्म नहीं होते, बस लोग हिम्मत हार जाते हैं! <i class="fa-solid fa-person-walking" style="color:#a855f7"></i>`,
  `जीतने का असली मज़ा तो तब है, जब सब आपके हारने का इंतज़ार कर रहे हों! <i class="fa-solid fa-face-smile-wink" style="color:#fbbf24"></i>`,
  `जिनमें अकेले चलने के हौसले होते हैं, एक दिन उन्हीं के पीछे काफिले होते हैं! <i class="fa-solid fa-crown" style="color:#fbbf24"></i>`,
  `जो पढ़ाई आज तुम्हें दर्द लग रही है, कल वही तुम्हारी सबसे बड़ी ताकत बनेगी! <i class="fa-solid fa-lightbulb" style="color:#fbbf24"></i>`,
  `भीड़ हमेशा उस रास्ते पर चलती है जो आसान लगता है, पर अपना रास्ता खुद चुनो क्योंकि तुम्हें तुमसे बेहतर कोई नहीं जानता! <i class="fa-solid fa-road" style="color:#60a5fa"></i>`,
  `जिसने भी खुद को खर्च किया है, दुनिया ने उसी को Google पर सर्च किया है! <i class="fa-brands fa-google" style="color:#4ade80"></i>`,
  `कामयाबी के दरवाजे उन्हीं के लिए खुलते हैं, जो उन्हें खटखटाने की ताकत रखते हैं! <i class="fa-solid fa-door-open" style="color:#f87171"></i>`,
  `जब टूटने लगे हौसले तो बस ये याद रखना, बिना मेहनत के हासिल तख्तो-ताज नहीं होते! <i class="fa-solid fa-crown" style="color:#fbbf24"></i>`,
  `इंतज़ार करने वालों को सिर्फ उतना मिलता है, जितना कोशिश करने वाले छोड़ देते हैं! <i class="fa-solid fa-person-running" style="color:#60a5fa"></i>`,
  `आज का दर्द कल की जीत है, फोकस बनाए रखो! <i class="fa-solid fa-crosshairs" style="color:#f87171"></i>`,
  `सफलता एक दिन में नहीं मिलती, लेकिन ठान लो तो एक दिन ज़रूर मिलती है! <i class="fa-solid fa-hourglass-half" style="color:#a855f7"></i>`,
  `अपने लक्ष्य पर नज़र रखो और तब तक मत रुको जब तक उसे हासिल न कर लो! <i class="fa-solid fa-feather-pointed" style="color:#60a5fa"></i>`,
  `परिंदों को मंज़िल मिलेगी यकीनन, ये फैले हुए उनके पंख बोलते हैं! <i class="fa-solid fa-dove" style="color:#4ade80"></i>`,
  `बहाने बनाना छोड़ो, क्योंकि तुम्हारी सफलता सिर्फ तुम्हारी ज़िम्मेदारी है! <i class="fa-solid fa-fire" style="color:#f87171"></i>`,
  `जो अपने कदमों की काबिलियत पर विश्वास रखते हैं, वही अक्सर मंज़िल पर पहुँचते हैं! <i class="fa-solid fa-shoe-prints" style="color:#fbbf24"></i>`,
  `अगर तुम उस वक़्त मुस्कुरा सकते हो जब तुम पूरी तरह टूट चुके हो, तो यकीनन दुनिया में तुम्हें कोई नहीं हरा सकता! <i class="fa-solid fa-shield-halved" style="color:#a855f7"></i>`,
  `सफलता की राहों पर जब-जब काँटे चुभेंगे, समझ लेना तुम्हारी रफ़्तार बढ़ने वाली है! <i class="fa-solid fa-bolt" style="color:#fbbf24"></i>`,
  `मैदान में हारा हुआ इंसान फिर से जीत सकता है, लेकिन मन से हारा हुआ इंसान कभी नहीं जीत सकता! <i class="fa-solid fa-brain" style="color:#f87171"></i>`,
  `अपने सपनों को ज़िंदा रखो, अगर तुम्हारे सपनों की चिंगारी बुझ गई है तो समझो तुमने जीते जी आत्महत्या कर ली है! <i class="fa-solid fa-fire-flame-curved" style="color:#f87171"></i>`,
  `AnRu Focus का एक ही उसूल है: आज का काम आज ही खत्म! <i class="fa-solid fa-rocket" style="color:#60a5fa"></i>`
];
let usedQuoteIdx = [];
function pickQuote(){
  if(usedQuoteIdx.length >= QUOTES.length) usedQuoteIdx = [];
  let idx; do { idx = Math.floor(Math.random()*QUOTES.length); } while(usedQuoteIdx.includes(idx) && usedQuoteIdx.length < QUOTES.length);
  usedQuoteIdx.push(idx); return QUOTES[idx];
}
let modalEditingSubtasks = [];

function getLocISO(d=new Date()){ const l=new Date(d); l.setMinutes(l.getMinutes()-l.getTimezoneOffset()); return l.toISOString().split('T')[0]; }
function getTodayStr(){ return getLocISO(); }

/* ████████████████████████████████████████████████████████████
                  2. SOUND EFFECTS (SFX) ENGINE 
████████████████████████████████████████████████████████████ */
let _sfxCtx = null;
function getSfxCtx(){
  if(!_sfxCtx){ try{ _sfxCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; } }
  if(_sfxCtx.state === 'suspended') _sfxCtx.resume(); return _sfxCtx;
}
function sfxTone(freq, start, dur, type='sine', vol=0.18){
  const ctx = getSfxCtx(); if(!ctx) return;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime+start);
  gain.gain.setValueAtTime(0, ctx.currentTime+start);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime+start+0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+start+dur);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(ctx.currentTime+start); osc.stop(ctx.currentTime+start+dur+0.05);
}
function playSfx(name){
  if(!S.sfx) return;
  try{
    if(name==='click'){ sfxTone(700,0,0.06,'square',0.06); }
    else if(name==='task_complete'){ sfxTone(523.25,0,0.12,'sine',0.16); sfxTone(659.25,0.08,0.12,'sine',0.16); sfxTone(783.99,0.16,0.18,'sine',0.18); }
    else if(name==='coin'){ sfxTone(880,0,0.07,'square',0.12); sfxTone(1318.5,0.06,0.12,'square',0.12); }
    else if(name==='xp_gain'){ sfxTone(660,0,0.08,'sine',0.1); sfxTone(880,0.05,0.1,'sine',0.1); }
    else if(name==='timer_complete'){ sfxTone(440,0,0.15,'triangle',0.2); sfxTone(440,0.2,0.15,'triangle',0.2); sfxTone(440,0.4,0.25,'triangle',0.22); }
    else if(name==='error'){ sfxTone(220,0,0.18,'sawtooth',0.14); }
    else if(name==='success'){ sfxTone(587.33,0,0.1,'sine',0.15); sfxTone(739.99,0.07,0.1,'sine',0.15); sfxTone(880,0.14,0.2,'sine',0.18); }
    else if(name==='unlock'){ sfxTone(523.25,0,0.1,'sine',0.16); sfxTone(659.25,0.08,0.1,'sine',0.16); sfxTone(783.99,0.16,0.1,'sine',0.16); sfxTone(1046.5,0.24,0.22,'sine',0.2); }
  }catch(e){}
}
function toggleSfx(){ S.sfx = !S.sfx; updateSfxToggle(); localStorage.setItem('mceo_sfx', JSON.stringify(S.sfx)); if(S.sfx) playSfx('click'); showToast(S.sfx?'<i class="fa-solid fa-volume-high"></i> Sound Effects On!':'<i class="fa-solid fa-volume-xmark"></i> Sound Effects Off'); }
function updateSfxToggle(){ const sw=document.getElementById('sfxSw'); if(sw) sw.classList.toggle('on', S.sfx); }
function toggleNotif(){ S.notif=!S.notif; if(S.notif&&'Notification' in window&&Notification.permission!=='granted'){Notification.requestPermission().then(p=>{if(p!=='granted'){S.notif=false; updateNotifToggle();}});} updateNotifToggle(); localStorage.setItem('mceo_notif', JSON.stringify(S.notif)); showToast(S.notif?'<i class="fa-solid fa-bell"></i> Notifications Active!':'<i class="fa-solid fa-bell-slash"></i> Notifications Sleeping'); }
function updateNotifToggle(){const sw=document.getElementById('notifSw'); if(sw)sw.classList.toggle('on',S.notif);}

/* ████████████████████████████████████████████████████████████
                  3. CLOUD SYNC & DATA MANAGEMENT ☁️
████████████████████████████████████████████████████████████ */
window.onload = async () => {
  S.session = JSON.parse(localStorage.getItem('mceo_sess') || 'null');
  updateTodayDate(); loadQuotesEngine();
  
  if(S.session) {
     loadDataLocal();
     bootApp();
     if(!S.session.isGuest) {
        try {
            const doc = await db.collection('users').doc(S.session.email).get();
            if(doc.exists) {
                loadDataFromObj(doc.data());
                migrateLegacyData(); // 🔥 FIXED LEGACY ICONS HERE
                renderAll(); updateShopUI();
            }
        } catch(e) { console.log("Network delay: Using local offline data."); }
     }
  }
};

function key(s){const id=S.session?.isGuest?'guest':(S.session?.email||'guest'); return `mceo_${id}_${s}`;}

function loadDataFromObj(data) {
    S.tasks = data.tasks || [];
    S.subjects = data.subjects || [{name:'Physics',emoji:'fa-microscope',flashcards:[]},{name:'Maths',emoji:'fa-calculator',flashcards:[]},{name:'Computer Science',emoji:'fa-laptop-code',flashcards:[]}];
    S.timer.logs = data.logs || []; S.xp = data.xp || 0; S.theme = data.theme || 'default';
    S.unlocks = { matrix:false, cyber:false, ocean:false, sunset:false, gold:false, badge_ninja:false, badge_scholar:false, badge_legend:false, ...(data.unlocks || {}) };
    S.freezeDate = data.freezeDate || null; S.lastDrainDate = data.lastDrainDate || null; S.lastMissionDate = data.lastMissionDate || null;
    S.eyeStrain = data.eyeStrain || false; S.activeBuff = data.activeBuff || null;
    S.notif=JSON.parse(localStorage.getItem('mceo_notif')||'false'); S.sfx=JSON.parse(localStorage.getItem('mceo_sfx')||'true');
    migrateLegacyData(); // 🔥 FIX APPLIED
}

function loadDataLocal(){
  S.tasks=JSON.parse(localStorage.getItem(key('tasks'))||'[]');
  S.subjects=JSON.parse(localStorage.getItem(key('subj'))||JSON.stringify([{name:'Physics',emoji:'fa-microscope'},{name:'Maths',emoji:'fa-calculator'},{name:'Computer Science',emoji:'fa-laptop-code'}]));
  S.subjects.forEach(s => { if(!s.flashcards) s.flashcards = []; });
  S.timer.logs=JSON.parse(localStorage.getItem(key('logs'))||'[]'); S.eyeStrain=JSON.parse(localStorage.getItem(key('eyeStrain'))||'false'); 
  S.activeBuff=JSON.parse(localStorage.getItem(key('buff'))||'null'); S.xp=parseInt(localStorage.getItem(key('xp'))||'0');
  S.theme=localStorage.getItem(key('theme'))||'default';
  let savedUnlocks = JSON.parse(localStorage.getItem(key('unlocks'))||'{}');
  S.unlocks = { matrix:false, cyber:false, ocean:false, sunset:false, gold:false, badge_ninja:false, badge_scholar:false, badge_legend:false, ...savedUnlocks };
  S.freezeDate=localStorage.getItem(key('freeze'))||null; S.lastDrainDate=localStorage.getItem(key('drain'))||null;
  S.lastMissionDate=localStorage.getItem(key('lastMissionDate'))||null;
  S.notif=JSON.parse(localStorage.getItem('mceo_notif')||'false'); S.sfx=JSON.parse(localStorage.getItem('mceo_sfx')||'true');
  migrateLegacyData(); // 🔥 FIX APPLIED
}

async function saveToCloud() {
  if(!S.session || S.session.isGuest) return; 
  try {
    await db.collection('users').doc(S.session.email).set({
      profile: S.session, tasks: S.tasks, subjects: S.subjects, logs: S.timer.logs, xp: S.xp, theme: S.theme, unlocks: S.unlocks,
      freezeDate: S.freezeDate, lastDrainDate: S.lastDrainDate, lastMissionDate: S.lastMissionDate, eyeStrain: S.eyeStrain, activeBuff: S.activeBuff
    });
  } catch(e) { console.error("Cloud Save Failed", e); }
}

function saveData(){
  localStorage.setItem(key('tasks'),JSON.stringify(S.tasks)); localStorage.setItem(key('subj'),JSON.stringify(S.subjects));
  localStorage.setItem(key('logs'),JSON.stringify(S.timer.logs)); localStorage.setItem(key('eyeStrain'),JSON.stringify(S.eyeStrain)); 
  if(S.activeBuff) localStorage.setItem(key('buff'),JSON.stringify(S.activeBuff)); else localStorage.removeItem(key('buff')); 
  localStorage.setItem(key('xp'),S.xp.toString()); localStorage.setItem(key('theme'),S.theme); localStorage.setItem(key('unlocks'),JSON.stringify(S.unlocks));
  if(S.freezeDate) localStorage.setItem(key('freeze'), S.freezeDate);
  if(S.lastDrainDate) localStorage.setItem(key('drain'), S.lastDrainDate);
  if(S.lastMissionDate) localStorage.setItem(key('lastMissionDate'), S.lastMissionDate);
  saveToCloud();
}

let buffInterval = null; 
function bootApp(){
  document.getElementById('loginScreen').classList.remove('active'); document.getElementById('appScreen').classList.add('active');
  applyTheme(S.theme); checkAccountabilityDrain(); updateNavUser(); initEmojiPicker(); updateNotifToggle(); updateSfxToggle(); updateEyeStrainToggle(); loadSecretMission(); 
  if(buffInterval) clearInterval(buffInterval);
  buffInterval = setInterval(checkBuffState, 1000); 
  renderAll(); updateShopUI();
}

/* ████████████████████████████████████████████████████████████
                  4. CLOUD AUTHENTICATION 
████████████████████████████████████████████████████████████ */
function switchAuthTab(t){
  document.getElementById('tabLogin').classList.toggle('active',t==='login'); document.getElementById('tabReg').classList.toggle('active',t==='reg');
  document.getElementById('panelLogin').classList.toggle('active',t==='login'); document.getElementById('panelReg').classList.toggle('active',t==='reg');
  document.getElementById('authErr').style.display='none';
}
function showAuthErr(m){const e=document.getElementById('authErr'); e.innerHTML=m; e.style.display='block';}

async function doRegister(){
  const name=document.getElementById('reName').value.trim(); const email=document.getElementById('reEmail').value.trim().toLowerCase();
  const course=document.getElementById('reCourse').value.trim(); const pass=document.getElementById('rePass').value;
  if(!name){ playSfx('error'); return showAuthErr('Naam daal bhai! <i class="fa-solid fa-face-smile-sweat"></i>'); }
  if(!email||!email.includes('@')){ playSfx('error'); return showAuthErr('Valid email daal!'); }
  if(pass.length<4){ playSfx('error'); return showAuthErr('Password kam se kam 4 characters!'); }
  document.getElementById('authErr').style.display='none'; showToast('Creating Cloud Account... <i class="fa-solid fa-cloud"></i>');
  try {
      const doc = await db.collection('users').doc(email).get();
      if(doc.exists) { playSfx('error'); return showAuthErr('Email already registered!'); }
      await syncAndLogin(email, name, course, null, pass);
      playSfx('success'); showToast('<i class="fa-solid fa-cloud-arrow-up"></i> Cloud Account Created!','success');
  } catch (error) { playSfx('error'); showAuthErr("Network Error. Check connection."); }
}

async function doLogin(){
  const email=document.getElementById('liEmail').value.trim().toLowerCase(); const pass=document.getElementById('liPass').value;
  if(!email || !pass){ playSfx('error'); return showAuthErr('Details daal bhai! <i class="fa-solid fa-face-smile-sweat"></i>'); }
  document.getElementById('authErr').style.display='none'; showToast('Fetching Cloud Data... <i class="fa-solid fa-cloud-arrow-down"></i>');
  try {
      const doc = await db.collection('users').doc(email).get();
      if(!doc.exists){ playSfx('error'); return showAuthErr('Account not found! <i class="fa-solid fa-circle-question"></i>'); }
      const data = doc.data();
      if(data.profile && data.profile.pass !== pass) { playSfx('error'); return showAuthErr('Wrong password! <i class="fa-solid fa-circle-xmark"></i>'); }
      S.session = data.profile; localStorage.setItem('mceo_sess', JSON.stringify(S.session)); loadDataFromObj(data); bootApp();
      playSfx('success'); showToast('<i class="fa-solid fa-bolt"></i> Cloud Sync Successful!','success');
  } catch (error) { playSfx('error'); showAuthErr("Network Error. Check connection."); }
}

async function continueWithGoogle() {
  try {
    const result = await auth.signInWithPopup(googleProvider); const user = result.user;
    document.getElementById('loginScreen').classList.remove('active'); showToast('Syncing cloud data... <i class="fa-solid fa-cloud-arrow-down"></i>');
    await syncAndLogin(user.email.toLowerCase(), user.displayName, null, user.photoURL, "google_oauth");
  } catch(error) { showAuthErr("Error: " + error.message); }
}

async function syncAndLogin(email, name, course, pfp, pass) {
  const userRef = db.collection('users').doc(email); const doc = await userRef.get();
  if(doc.exists) {
    const data = doc.data(); S.session = data.profile;
    if(pfp && !S.session.pfp) S.session.pfp = pfp; loadDataFromObj(data);
  } else {
    S.session = { name, email, course: course||'', pass, pfp, isGuest:false };
    S.tasks=[]; S.subjects=[{name:'Physics',emoji:'fa-microscope',flashcards:[]},{name:'Maths',emoji:'fa-calculator',flashcards:[]},{name:'Computer Science',emoji:'fa-laptop-code',flashcards:[]}];
    S.timer.logs=[]; S.xp=0; S.theme='default'; S.activeBuff=null; S.freezeDate=null; S.lastDrainDate=null; S.lastMissionDate=null; S.eyeStrain=false;
    S.unlocks={matrix:false, cyber:false, ocean:false, sunset:false, gold:false, badge_ninja:false, badge_scholar:false, badge_legend:false};
  }
  localStorage.setItem('mceo_sess', JSON.stringify(S.session)); await saveToCloud(); bootApp();
}

let verifiedFpEmail = ""; 
function doForgotPassword() {
  document.getElementById('fpEmail').value = ''; document.getElementById('fpNewPass').value = '';
  document.getElementById('fpStep1').style.display = 'block'; document.getElementById('fpStep2').style.display = 'none';
  document.getElementById('fpSubText').textContent = 'Enter your registered email address to verify your account.';
  document.getElementById('forgotPassModal').classList.add('open');
}

async function fpVerifyEmail() {
  const email = document.getElementById('fpEmail').value.trim();
  if (!email) { playSfx('error'); return showToast('Bhai pehle email daal! <i class="fa-solid fa-face-smile-sweat"></i>', 'error'); }
  const lowerEmail = email.toLowerCase(); showToast('Searching Cloud... <i class="fa-solid fa-magnifying-glass"></i>');
  const userRef = db.collection('users').doc(lowerEmail); const doc = await userRef.get();
  if (!doc.exists) { playSfx('error'); return showToast('यह ईमेल रजिस्टर्ड नहीं है! <i class="fa-solid fa-circle-question"></i>', 'error'); }
  if (doc.data().profile.pass === "google_oauth") { playSfx('error'); return showToast('Google login वाले अकाउंट का पासवर्ड चेंज नहीं होता!', 'error'); }
  verifiedFpEmail = lowerEmail; playSfx('success');
  document.getElementById('fpStep1').style.display = 'none'; document.getElementById('fpStep2').style.display = 'block';
  document.getElementById('fpSubText').textContent = 'Email verified! Create a strong new password.';
}

async function fpSaveNewPassword() {
  const newPass = document.getElementById('fpNewPass').value;
  if (!newPass || newPass.length < 4) { playSfx('error'); return showToast('Password कम से कम 4 characters का होना चाहिए!', 'error'); }
  showToast('Updating Password... <i class="fa-solid fa-spinner fa-spin"></i>');
  const userRef = db.collection('users').doc(verifiedFpEmail); const doc = await userRef.get();
  const data = doc.data(); data.profile.pass = newPass; await userRef.set(data);
  playSfx('success'); showToast('<i class="fa-solid fa-party-horn"></i> Password successfully reset! Please login.', 'success'); 
  document.getElementById('forgotPassModal').classList.remove('open');
}

function guestLogin(){
   S.session = {name:'Guest',email:'guest@mceo.app',course:'',isGuest:true,pfp:null};
   localStorage.setItem('mceo_sess',JSON.stringify(S.session)); loadDataLocal(); bootApp();
   playSfx('success'); showToast('<i class="fa-solid fa-user-astronaut"></i> Guest mode mein ho! Data Cloud me save nahi hoga.','success');
}

function doLogout(){
  if(!confirm('Logout karna chahte ho?'))return;
  saveData(); S.session=null; localStorage.removeItem('mceo_sess'); stopTimer(); playSfx('click');
  document.body.className = ''; document.getElementById('appScreen').classList.remove('active'); document.getElementById('loginScreen').classList.add('active'); showToast('<i class="fa-solid fa-hand-sparkles"></i> Phir milenge!');
}

/* ████████████████████████████████████████████████████████████
                  5. THEME, SHOP, XP BUFFS & LEVEL 
████████████████████████████████████████████████████████████ */
function checkAccountabilityDrain() {
  const todayStr = getTodayStr();
  if(S.lastDrainDate !== todayStr) {
    if(S.lastDrainDate) { 
      const overdue = S.tasks.filter(t => !t.isDone && t.date < todayStr);
      if(overdue.length > 0) {
        const penalty = overdue.length * 5; S.xp = Math.max(0, S.xp - penalty);
        setTimeout(() => { showToast(`<i class="fa-solid fa-arrow-trend-down"></i> Accountability Drain: Lost ${penalty} XP for ${overdue.length} overdue task(s)!`, 'error'); }, 2500);
      }
    }
    S.lastDrainDate = todayStr; saveData();
  }
}

function applyTheme(th) { S.theme = th; saveData(); document.body.className = th === 'default' ? '' : `theme-${th}`; }

function buyShopItem(item, cost) {
  if(item === 'default') { applyTheme('default'); playSfx('click'); showToast('<i class="fa-solid fa-meteor"></i> Restored AnRu Dark Theme!', 'success'); updateShopUI(); return; }
  if(item === 'potion') {
    if(S.xp < cost){ playSfx('error'); return showToast(`Not enough XP! Need ${cost}`, 'error'); }
    S.xp -= cost; S.activeBuff = { type: 'xp_boost', endTime: Date.now() + (1 * 60 * 60 * 1000) };
    saveData(); renderDashboard(); updateShopUI(); playSfx('unlock'); checkBuffState(); showToast('<i class="fa-solid fa-flask"></i> 2x XP Potion Active for 1 Hour!', 'success'); return;
  }
  if(item === 'timetravel') {
     if(S.xp < cost){ playSfx('error'); return showToast(`Not enough XP! Need ${cost}`, 'error'); }
     S.xp -= cost; let yest = new Date(); yest.setDate(yest.getDate() - 1);
     S.tasks.push({ id:Date.now(), name: "Time Travel Recovery", date: getLocISO(yest), subj: "", priority: "med", isDone: true, isBacklog: false });
     saveData(); renderDashboard(); updateShopUI(); playSfx('unlock'); showToast('<i class="fa-solid fa-hourglass-start"></i> Timeline Restored! Streak Saved.', 'success'); return;
  }
  if(item === 'freeze') {
    if(S.xp < cost){ playSfx('error'); return showToast(`Not enough XP! Need ${cost}`, 'error'); }
    S.xp -= cost; let tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); S.freezeDate = getLocISO(tomorrow);
    saveData(); renderDashboard(); updateShopUI(); playSfx('unlock'); showToast('<i class="fa-solid fa-snowflake"></i> Streak Freeze active for tomorrow!', 'success'); return;
  } 
  if(S.unlocks[item]) { 
     if(item.startsWith('theme_') || ['sunset','gold','matrix','cyber','ocean'].includes(item)) { applyTheme(item); playSfx('click'); showToast(`<i class="fa-solid fa-palette"></i> Applied theme!`, 'success'); } 
     else if (item.startsWith('badge_')) { playSfx('click'); showToast(`<i class="fa-solid fa-medal"></i> Badge is already equipped!`, 'success'); }
     updateShopUI(); updateNavUser(); return; 
  }
  if(S.xp < cost){ playSfx('error'); return showToast(`Not enough XP! Need ${cost}`, 'error'); }
  S.xp -= cost; S.unlocks[item] = true; 
  if(['sunset','gold','matrix','cyber','ocean'].includes(item)) applyTheme(item);
  saveData(); renderDashboard(); updateShopUI(); updateNavUser(); playSfx('unlock'); showToast(`<i class="fa-solid fa-unlock-keyhole"></i> Unlocked successfully!`, 'success');
}

function buyMysteryBox() {
  if (S.xp < 150) { playSfx('error'); return showToast('Not enough XP! Need 150 XP', 'error'); }
  S.xp -= 150; const roll = Math.random(); let rewardMsg = "";
  if (roll < 0.25) { 
      S.xp += 300; rewardMsg = `<i class="fa-solid fa-coins"></i> JACKPOT! You found 300 XP!`; if (typeof confetti === 'function') confetti({ particleCount: 200, spread: 100, zIndex: 9999 }); playSfx('unlock'); 
  } else if (roll < 0.5) { 
      let tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); S.freezeDate = getLocISO(tomorrow);
      rewardMsg = `<i class="fa-solid fa-snowflake"></i> EPIC! You found a free Streak Freeze!`; playSfx('success'); 
  } else if (roll < 0.75) {
      S.activeBuff = { type: 'xp_boost', endTime: Date.now() + (2 * 60 * 60 * 1000) }; rewardMsg = `<i class="fa-solid fa-bolt"></i> LEGENDARY! 2x XP Multiplier Active for 2 Hours!`; 
      if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 70, origin: {y:0.4}, zIndex: 9999 }); playSfx('unlock'); checkBuffState();
  } else { S.xp += 50; rewardMsg = `<i class="fa-solid fa-gift"></i> You found 50 XP! Better luck next time.`; playSfx('coin'); }
  saveData(); renderProfile(); renderDashboard(); showToast(rewardMsg, 'success');
}

function checkBuffState() {
  const buffUi = document.getElementById('activeBuffUI'); const timerUi = document.getElementById('buffTimerUI');
  if(!buffUi || !timerUi) return;
  if(S.activeBuff && S.activeBuff.endTime > Date.now()) {
      buffUi.style.display = 'flex'; const left = Math.floor((S.activeBuff.endTime - Date.now()) / 1000);
      const h = Math.floor(left / 3600).toString().padStart(2, '0'); const m = Math.floor((left % 3600) / 60).toString().padStart(2, '0'); const s = (left % 60).toString().padStart(2, '0');
      timerUi.textContent = `${h}:${m}:${s}`;
  } else {
      if(S.activeBuff) { S.activeBuff = null; saveData(); }
      buffUi.style.display = 'none';
  }
}

function getExtraBuffXP() { return (S.activeBuff && S.activeBuff.endTime > Date.now()) ? 20 : 0; }

function updateShopUI() {
  const dBtn = document.getElementById('btnThemeDefault'); if(dBtn) dBtn.textContent = (S.theme==='default'?'Applied':'Use');
  const mBtn = document.getElementById('btnThemeMatrix'); if(mBtn) mBtn.textContent = S.unlocks.matrix ? (S.theme==='matrix'?'Applied':'Use') : '500 XP';
  const cBtn = document.getElementById('btnThemeCyber'); if(cBtn) cBtn.textContent = S.unlocks.cyber ? (S.theme==='cyber'?'Applied':'Use') : '1000 XP';
  const oBtn = document.getElementById('btnThemeOcean'); if(oBtn) oBtn.textContent = S.unlocks.ocean ? (S.theme==='ocean'?'Applied':'Use') : '300 XP';
  const sBtn = document.getElementById('btnThemeSunset'); if(sBtn) sBtn.textContent = S.unlocks.sunset ? (S.theme==='sunset'?'Applied':'Use') : '400 XP';
  const gBtn = document.getElementById('btnThemeGold'); if(gBtn) gBtn.textContent = S.unlocks.gold ? (S.theme==='gold'?'Applied':'Use') : '800 XP';
  const bNinja = document.getElementById('btnBadgeNinja'); if(bNinja) bNinja.textContent = S.unlocks.badge_ninja ? 'Unlocked' : '300 XP';
  const bScholar = document.getElementById('btnBadgeScholar'); if(bScholar) bScholar.textContent = S.unlocks.badge_scholar ? 'Unlocked' : '500 XP';
  const bLegend = document.getElementById('btnBadgeLegend'); if(bLegend) bLegend.textContent = S.unlocks.badge_legend ? 'Unlocked' : '1000 XP';
}

function getRank(xp) {
  let level = Math.floor(xp / 1000) + 1; if (level > 50) level = 50; 
  let title = `Batch Beginner <i class="fa-solid fa-school" style="color:var(--warn)"></i>`;
  if (level >= 5) title = `Focus Novice <i class="fa-solid fa-medal" style="color:var(--warn)"></i>`; 
  if (level >= 15) title = `Backlog Slayer <i class="fa-solid fa-fire" style="color:var(--danger)"></i>`;
  if (level >= 30) title = `Syllabus Destroyer <i class="fa-solid fa-bomb" style="color:var(--danger)"></i>`; 
  if (level >= 50) title = `Class 11th Legend <i class="fa-solid fa-crown" style="color:var(--warn)"></i>`;
  return `Level ${level}: ${title}`;
}

function checkLevelUp() {
  let currentLevel = Math.floor(S.xp / 1000) + 1; if (currentLevel > 50) currentLevel = 50;
  if (!S.savedLevel) S.savedLevel = currentLevel; 
  if (currentLevel > S.savedLevel) { S.savedLevel = currentLevel; if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 }); playSfx('unlock'); setTimeout(() => showToast(`<i class="fa-solid fa-arrow-up-right-dots"></i> LEVEL UP! Welcome to Level ${currentLevel}!`, 'success'), 500); } 
  else if (currentLevel < S.savedLevel) { S.savedLevel = currentLevel; }
}

/* ████████████████████████████████████████████████████████████
                  6. DAILY SECRET MISSION LOGIC 
████████████████████████████████████████████████████████████ */
const SECRET_MISSIONS = [
  { id: 0, text: `<i class="fa-solid fa-stopwatch" style="color:var(--p1)"></i> आज टाइमर चालू करके कम से कम 20 मिनट पढ़ाई करो!`, check: () => { const todayStr = getTodayStr(); return S.timer.logs.filter(l => l.dateStr === todayStr).reduce((a, l) => a + l.duration, 0) >= 20; }},
  { id: 1, text: `<i class="fa-solid fa-clipboard-list" style="color:var(--success)"></i> अपने मिशन लिस्ट में कम से कम 1 टास्क को Complete (Done) करो!`, check: () => S.tasks.some(t => t.isDone) },
  { id: 2, text: `<i class="fa-solid fa-circle-exclamation" style="color:var(--danger)"></i> Mission list में कम से कम 1 HIGH Priority टास्क ऐड करो!`, check: () => S.tasks.some(t => t.priority === 'high') },
  { id: 3, text: `<i class="fa-solid fa-folder-open" style="color:var(--warn)"></i> Subjects list में कम से कम 2 सब्जेक्ट्स ऐड रखो!`, check: () => S.subjects.length >= 2 },
  { id: 4, text: `<i class="fa-solid fa-mug-hot" style="color:var(--p1)"></i> आज कम से कम 1 'Short Break' टाइमर लॉग करो!`, check: () => { const todayStr = getTodayStr(); return S.timer.logs.some(l => l.dateStr === todayStr && l.mode === 'short'); }},
  { id: 5, text: `<i class="fa-solid fa-fire-flame-curved" style="color:var(--danger)"></i> आज 45 मिनट का टोटल फोकस टाइम पूरा करो!`, check: () => { const todayStr = getTodayStr(); return S.timer.logs.filter(l => l.dateStr === todayStr).reduce((a, l) => a + l.duration, 0) >= 45; }},
  { id: 6, text: `<i class="fa-solid fa-check-double" style="color:var(--success)"></i> अपने मिशन लिस्ट से 2 टास्क को पूरा (Complete) करो!`, check: () => S.tasks.filter(t => t.isDone).length >= 2 },
  { id: 7, text: `<i class="fa-solid fa-box-archive" style="color:var(--warn)"></i> कम से कम 1 पेंडिंग काम को 'Backlog Vault' में भेजो!`, check: () => S.tasks.some(t => t.isBacklog) },
  { id: 8, text: `<i class="fa-solid fa-video" style="color:var(--p3)"></i> Lecture + Notes Split Mode वाला 1 टास्क ऐड करो!`, check: () => S.tasks.some(t => t.isTwoStep) },
  { id: 9, text: `<i class="fa-solid fa-stopwatch" style="color:var(--p1)"></i> Count-Up (स्टॉपवॉच) मोड में 5 मिनट का सेशन रिकॉर्ड करो!`, check: () => { const todayStr = getTodayStr(); return S.timer.logs.some(l => l.dateStr === todayStr && l.mode === 'stopwatch' && l.duration >= 5); }}
];

function loadSecretMission() {
  let activeIdx = localStorage.getItem(key('sm_active_idx'));
  if (activeIdx === null) { activeIdx = Math.floor(Math.random() * SECRET_MISSIONS.length); localStorage.setItem(key('sm_active_idx'), activeIdx); }
  const currentMission = SECRET_MISSIONS[parseInt(activeIdx)];
  const smText = document.getElementById('smText'); const smBtn = document.getElementById('smBtn');
  
  if (smText && smBtn && currentMission) { 
      smText.innerHTML = currentMission.text; 
      const todayStr = getTodayStr();
      if (S.lastMissionDate === todayStr) {
          smBtn.innerHTML = `Claimed! Come back tomorrow <i class="fa-solid fa-moon"></i>`; smBtn.style.background = "var(--glass)"; smBtn.disabled = true;
      } else {
          smBtn.innerHTML = `Verify & Claim Reward <i class="fa-solid fa-gift"></i>`; smBtn.style.background = "var(--grad)"; smBtn.disabled = false; 
      }
  }
}

function claimSecretMission() {
  const todayStr = getTodayStr();
  if (S.lastMissionDate === todayStr) return; 
  const activeIdx = localStorage.getItem(key('sm_active_idx')); if (activeIdx === null) return;
  const currentMission = SECRET_MISSIONS[parseInt(activeIdx)];
  
  if (currentMission && currentMission.check()) {
    S.xp += 50; S.lastMissionDate = todayStr; saveData(); renderDashboard();
    if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
    playSfx('success'); showToast('<i class="fa-solid fa-trophy" style="color:var(--warn)"></i> Mission Verified! +50 XP Awarded!', 'success');
    loadSecretMission(); 
  } else { playSfx('error'); showToast('<i class="fa-solid fa-triangle-exclamation"></i> Abhi poora nahi hua hai bhai! Pehle target complete karo.', 'error'); }
}

function changeSecretMission() {
  const todayStr = getTodayStr();
  if (S.lastMissionDate === todayStr) { showToast('Already claimed today!', 'error'); return; }
  const activeIdx = localStorage.getItem(key('sm_active_idx')); let nextIdx;
  do { nextIdx = Math.floor(Math.random() * SECRET_MISSIONS.length); } while (nextIdx === parseInt(activeIdx) && SECRET_MISSIONS.length > 1);
  localStorage.setItem(key('sm_active_idx'), nextIdx); loadSecretMission(); playSfx('click'); showToast('<i class="fa-solid fa-rotate"></i> Mission changed successfully!');
}

/* ████████████████████████████████████████████████████████████
                  7. NAVIGATION & PROFILE 
████████████████████████████████████████████████████████████ */
function switchPage(page,navEl){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active')); document.getElementById('page-'+page).classList.add('active');
  document.querySelectorAll('.bnav-item').forEach(n=>n.classList.remove('active')); const tgt=navEl||document.getElementById('bn-'+page); if(tgt)tgt.classList.add('active');
  if(page==='dash')renderDashboard();
  if(page==='tasks'){renderTasks();populateSubjDropdown();}
  if(page==='subjects')renderSubjects();
  if(page==='profile'){renderProfile(); renderWeeklyStudyChart(); updateShopUI();}
  if(page==='timer')renderTimerLog();
}

function updateNavUser(){
  const u=S.session; if(!u)return;
  const init=u.name.charAt(0).toUpperCase(); const nAv=document.getElementById('navAv'); const pAv=document.getElementById('profAv');
  if(u.pfp){ nAv.textContent=''; pAv.textContent=''; nAv.style.backgroundImage=`url(${u.pfp})`; pAv.style.backgroundImage=`url(${u.pfp})`; } 
  else { nAv.textContent=init; pAv.textContent=init; nAv.style.backgroundImage=''; pAv.style.backgroundImage=''; }
  document.getElementById('profName').textContent=u.name; document.getElementById('profEmail').textContent=u.email;
  
  let rLabel = getRank(S.xp);
  if (S.unlocks?.badge_legend) rLabel = `<i class="fa-solid fa-crown" style="color:#fbbf24"></i> Legend Focus CEO`;
  else if (S.unlocks?.badge_scholar) rLabel = `<i class="fa-solid fa-graduation-cap" style="color:#a855f7"></i> Elite Scholar`;
  else if (S.unlocks?.badge_ninja) rLabel = `<i class="fa-solid fa-user-ninja" style="color:#94a3b8"></i> Silent Ninja`;
  
  document.getElementById('profBadge').innerHTML=`Rank: ${rLabel}`;
  const labelEl = document.getElementById('ceoRankLabel'); if(labelEl) labelEl.innerHTML = `${rLabel}`;
  document.getElementById('wMsg').innerHTML=`Hey, ${u.name.split(' ')[0]}! <i class="fa-solid fa-hand-sparkles" style="color:#fbbf24"></i>`;
  const cd=document.getElementById('courseDisplay'); if(cd)cd.textContent=u.course||'Not set';
}

function handlePfpUpload(e) {
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload=(ev)=>{
    const img=new Image();
    img.onload=()=>{
      const canvas=document.createElement('canvas'); const max=400; let w=img.width, h=img.height;
      if(w>h){ if(w>max){ h*=max/w; w=max;} } else { if(h>max){ w*=max/h; h=max;} }
      canvas.width=w; canvas.height=h; const ctx=canvas.getContext('2d'); ctx.drawImage(img,0,0,w,h);
      const compressedUrl = canvas.toDataURL('image/jpeg',0.85); S.session.pfp = compressedUrl;
      saveData(); updateNavUser(); showToast('<i class="fa-solid fa-camera"></i> Profile image synced to Cloud!','success');
    }; img.src=ev.target.result;
  }; reader.readAsDataURL(file);
}

/* ████████████████████████████████████████████████████████████
                  8. TASKS & SPACED REPETITION 
████████████████████████████████████████████████████████████ */
function selPri(p){S.pri=p;['low','med','high'].forEach(x=>{document.getElementById('pb-'+x).className='pri-btn'+(x===p?' sel-'+x:'');});}

function addTask(){
  const name=document.getElementById('tName').value.trim(); const date=document.getElementById('tDate').value;
  const note=document.getElementById('tNote').value.trim(); const subj=document.getElementById('tSubj').value;
  const isTwoStep = document.getElementById('tIsTwoStep').checked;
  if(!name || !date) return showToast('Name and Date are required!','error');
  
  S.tasks.unshift({
    id:Date.now(),name,date,note,subj,priority:S.pri,isDone:false,
    isTwoStep, watched: false, notesMade: false, subtasks:[], repScheduled: false, isRevision: false, isBacklog: false
  });
  
  S.xp += 15; saveData(); playSfx('coin');
  ['tName','tNote'].forEach(id=>document.getElementById(id).value=''); document.getElementById('tDate').value=''; document.getElementById('tSubj').value='';
  selPri('med'); renderAll(); showToast('<i class="fa-solid fa-cloud-arrow-up"></i> Task Synced to Cloud (+15 XP)!','success');
}

function scheduleRevision(task) {
  if (task.repScheduled || task.isRevision) return;
  task.repScheduled = true;
  const today = new Date(); const d7 = new Date(today); d7.setDate(today.getDate() + 7); const d30 = new Date(today); d30.setDate(today.getDate() + 30);
  const formatDt = (d) => getLocISO(d);
  S.tasks.push({ id: Date.now() + 1, name: task.name + " (Revision 1)", date: formatDt(d7), note: "Spaced Repetition: 7 Day Review", subj: task.subj, priority: 'med', isDone: false, isTwoStep: false, isRevision: true, isBacklog: false });
  S.tasks.push({ id: Date.now() + 2, name: task.name + " (Revision 2)", date: formatDt(d30), note: "Spaced Repetition: 30 Day Review", subj: task.subj, priority: 'med', isDone: false, isTwoStep: false, isRevision: true, isBacklog: false });
  saveData(); showToast('<i class="fa-solid fa-clock"></i> Auto-Scheduled Revision for 7 & 30 Days!', 'success');
}

function toggleTask(id){
  const t=S.tasks.find(x=>x.id===id);
  if(t){
    if(t.isTwoStep && (!t.watched || !t.notesMade)) { playSfx('error'); showToast('<i class="fa-solid fa-triangle-exclamation"></i> Please use Watched & Notes buttons to complete!','error'); return; }
    t.isDone=!t.isDone;
    if(t.isDone){ 
      let extraXP = getExtraBuffXP(); S.xp += (40 + extraXP); playSfx('task_complete'); 
      showToast(`<i class="fa-solid fa-check-double"></i> Mission complete (+${40 + extraXP} XP)!${extraXP>0?' <i class="fa-solid fa-bolt"></i> Buffed!':''}`,'success'); 
      if(t.subtasks){ t.subtasks.forEach(st=>st.done=true); } 
      if(t.isTwoStep && !t.repScheduled) { setTimeout(() => { if(confirm("🏆 Task completed! Do you want to schedule automatic 7 & 30 Days Revisions for this topic?")) { scheduleRevision(t); } }, 500); }
    } else { S.xp = Math.max(0, S.xp - 40); playSfx('click'); }
    saveData(); renderAll();
  }
}

function toggleSplitStep(id, step) {
  const t = S.tasks.find(x=>x.id===id); if(!t) return;
  if(step === 'watched') { t.watched = !t.watched; if(t.watched){ S.xp += 10; playSfx('xp_gain'); } else { S.xp = Math.max(0, S.xp - 10); playSfx('click'); } } 
  else if (step === 'notes') { t.notesMade = !t.notesMade; if(t.notesMade){ S.xp += 20; playSfx('xp_gain'); } else { S.xp = Math.max(0, S.xp - 20); playSfx('click'); } }
  
  if(t.watched && t.notesMade) { 
      t.isDone = true; let extraXP = getExtraBuffXP(); S.xp += (20 + extraXP); playSfx('task_complete'); 
      showToast(`<i class="fa-solid fa-trophy"></i> Mastered: Lecture + Notes (+${20+extraXP} Bonus XP)!${extraXP>0?' <i class="fa-solid fa-bolt"></i> Buffed!':''}`, 'success'); 
      if(!t.repScheduled) { setTimeout(() => { if(confirm("🏆 Mastered! Do you want to schedule automatic 7 & 30 Days Revisions for this topic?")) { scheduleRevision(t); } }, 500); }
  } else { t.isDone = false; }
  saveData(); renderAll();
}

function toggleBacklogVault(id) {
  const t = S.tasks.find(x=>x.id===id); if(!t) return;
  t.isBacklog = !t.isBacklog; saveData(); renderAll();
  if(t.isBacklog){ playSfx('click'); showToast('<i class="fa-solid fa-box-archive"></i> Sent to Backlog Vault!'); } else { playSfx('success'); showToast('<i class="fa-solid fa-rotate-left"></i> Restored back to Live Tasks!'); }
  closeModal();
}

function deleteTask(id){
  if(!confirm('🗑️ Are you sure you want to permanently delete this task?')) return;
  playSfx('delete'); S.tasks=S.tasks.filter(x=>x.id!==id); saveData(); renderAll(); showToast('<i class="fa-solid fa-trash-can"></i> Task deleted!');
}

function openEditTask(id){
  const t=S.tasks.find(x=>x.id===id); if(!t) return;
  modalEditingSubtasks = t.subtasks ? JSON.parse(JSON.stringify(t.subtasks)) : [];
  
  // 🔥 FIX FOR DROPDOWN EMOJIS IN EDIT MODAL
  const opts=S.subjects.map(s=>{
      let emj = FA_TO_EMOJI[s.emoji] || '📁';
      return `<option value="${s.name}" ${s.name===t.subj?'selected':''}>${emj} ${s.name}</option>`;
  }).join('');
  
  const mc=document.getElementById('modalContent');
  mc.innerHTML=`
    <div class="modal-title"><i class="fa-solid fa-pen-to-square" style="color:var(--p1)"></i> Manage Task / Backlog</div>
    <div class="inp-wrap"><input type="text" id="editTName" value="${t.name}"></div>
    <div class="row2"><div class="inp-wrap"><input type="date" id="editTDate" value="${t.date}"></div><div class="inp-wrap"><select id="editTSubj"><option value="">📁 Subject</option>${opts}</select></div></div>
    <div class="inp-wrap area"><textarea id="editTNote" rows="2">${t.note||''}</textarea></div>
    <div style="font-size:13px; font-weight:700; margin-bottom:6px; color:var(--textSub);">Sub-Tasks:</div>
    <div class="modal-subtask-creator"><input type="text" id="newSubtaskInp" placeholder="Add step..." style="padding:8px; font-size:12px;"><button class="btn btn-sm" onclick="addModalSubtask()"><i class="fa-solid fa-plus"></i></button></div>
    <div class="modal-subtask-list" id="modalSubtaskList"></div>
    <div style="display:flex; gap:8px;">
      <button class="btn btn-glass" style="flex:1; border-color:var(--warn); color:var(--warn)" onclick="toggleBacklogVault(${t.id})">${t.isBacklog ? '<i class="fa-solid fa-xmark"></i> Remove Backlog' : '<i class="fa-solid fa-box-archive"></i> Mark as Backlog'}</button>
      <button class="btn btn-grad" style="flex:1;" onclick="saveEditTask(${t.id})">Save Changes</button>
    </div>
  `;
  renderModalSubtasks(); document.getElementById('modalOverlay').classList.add('open');
}
function addModalSubtask(){ const inp=document.getElementById('newSubtaskInp'); const txt=inp.value.trim(); if(!txt)return; modalEditingSubtasks.push({id:Date.now(), text:txt, done:false}); inp.value=''; renderModalSubtasks(); }
function deleteModalSubtask(id){ modalEditingSubtasks=modalEditingSubtasks.filter(st=>st.id!==id); renderModalSubtasks(); }
function renderModalSubtasks(){
  const box=document.getElementById('modalSubtaskList');
  if(!modalEditingSubtasks.length){ box.innerHTML='<div style="font-size:11px; color:var(--textMuted)">No sub-tasks yet.</div>'; return; }
  box.innerHTML=modalEditingSubtasks.map(st=>`<div class="modal-subtask-item"><span style="${st.done?'text-decoration:line-through;opacity:0.6':''}">${st.text}</span><button class="btn-icon" onclick="deleteModalSubtask(${st.id})" style="width:24px;height:24px;font-size:11px;color:var(--danger)"><i class="fa-solid fa-xmark"></i></button></div>`).join('');
}
function saveEditTask(id){
  const t=S.tasks.find(x=>x.id===id); if(!t) return;
  t.name=document.getElementById('editTName').value.trim(); t.date=document.getElementById('editTDate').value; t.subj=document.getElementById('editTSubj').value; t.note=document.getElementById('editTNote').value.trim(); t.subtasks=JSON.parse(JSON.stringify(modalEditingSubtasks));
  if(!t.name) return showToast('Name empty!','error'); saveData(); closeModal(); renderAll(); showToast('<i class="fa-solid fa-pen"></i> Task Updated!','success');
}
function toggleSubtaskInline(taskId, subtaskId) { const t=S.tasks.find(x=>x.id===taskId); if(!t)return; const st=t.subtasks.find(x=>x.id===subtaskId); if(!st)return; st.done=!st.done; saveData(); renderAll(); }
function setFilter(f,el){ S.filter=f; document.querySelectorAll('.fchip').forEach(c=>c.classList.remove('active')); el.classList.add('active'); renderTasks(); }

function setSubjFilter(val) { S.subjFilter = val; renderTasks(); }

function getFiltered(){
  const standardTasks = S.tasks.filter(t => !t.isBacklog);
  let result = standardTasks;
  switch(S.filter){
    case 'pending': result = result.filter(t=>!t.isDone); break;
    case 'done': result = result.filter(t=>t.isDone); break;
    case 'high': result = result.filter(t=>t.priority==='high'); break;
  }
  if(S.subjFilter && S.subjFilter !== 'all') result = result.filter(t => t.subj === S.subjFilter);
  return result;
}

function openBacklogVaultModal() {
  const backlogTasks = S.tasks.filter(t => t.isBacklog);
  const mc = document.getElementById('modalContent');
  let listHtml = backlogTasks.map(t => taskCard(t, true)).join('');
  if(!backlogTasks.length) listHtml = `<div class="empty"><p>Your Backlog Vault is clean! Super Job! <i class="fa-solid fa-rocket" style="color:var(--p1)"></i></p></div>`;
  mc.innerHTML = `<div class="modal-title"><i class="fa-solid fa-box-archive" style="color:var(--danger)"></i> Backlog Crusher Vault</div><p style="font-size:12px; color:var(--textMuted); margin-bottom:12px;">Complete these alongside your daily workflow:</p><div style="max-height:300px; overflow-y:auto;">${listHtml}</div>`;
  document.getElementById('modalOverlay').classList.add('open');
}

function taskCard(t,mini=false){
  const pm={low:'<i class="fa-solid fa-circle" style="color:var(--success)"></i>',med:'<i class="fa-solid fa-circle" style="color:var(--warn)"></i>',high:'<i class="fa-solid fa-circle" style="color:var(--danger)"></i>'};
  let subHtml=''; if(t.subtasks && t.subtasks.length>0 && !mini){ subHtml = `<div class="subtasks-container">` + t.subtasks.map(st=>`<div class="subtask-row"><div class="subtask-check ${st.done?'checked':''}" onclick="toggleSubtaskInline(${t.id}, ${st.id})">${st.done?'<i class="fa-solid fa-check"></i>':''}</div><span class="subtask-text ${st.done?'done':''}">${st.text}</span></div>`).join('') + `</div>`; }
  let badgeText=''; if(t.subtasks && t.subtasks.length>0){ const dCount=t.subtasks.filter(st=>st.done).length; badgeText=`<span class="ttag"><i class="fa-solid fa-layer-group" style="color:var(--p1)"></i> ${dCount}/${t.subtasks.length}</span>`; }
  let revBadge = t.isRevision ? `<span class="ttag neon-rev"><i class="fa-solid fa-clock"></i> Revision Due</span>` : '';
  let splitUiHtml = ''; let pendingClass = '';
  if(t.isTwoStep && !t.isDone) {
    pendingClass = t.watched ? 'notes-pending' : '';
    let watchedActive = t.watched ? 'active-watched' : ''; let notesActive = t.notesMade ? 'active-notes' : '';
    splitUiHtml = `<div class="split-btn-group"><button class="split-btn ${watchedActive}" onclick="event.stopPropagation(); toggleSplitStep(${t.id}, 'watched')"><i class="fa-solid fa-video"></i> Watched ${t.watched?'<i class="fa-solid fa-check"></i>':''}</button><button class="split-btn ${notesActive}" onclick="event.stopPropagation(); toggleSplitStep(${t.id}, 'notes')"><i class="fa-solid fa-pen"></i> Notes ${t.notesMade?'<i class="fa-solid fa-check"></i>':''}</button></div>${t.watched && !t.notesMade ? `<div style="font-size:11px; color:var(--warn); font-weight:700; margin-top:6px;">Lecture Done, Notes Pending! <i class="fa-solid fa-hourglass-half"></i></div>` : ''}`;
  }
  let restoreBtn = mini ? `<button class="btn-sm" style="margin-top:10px; width:100%; background: rgba(74,222,128,0.2); color:var(--success); border:1px solid var(--success);" onclick="toggleBacklogVault(${t.id})"><i class="fa-solid fa-rotate-left"></i> Move back to Live</button>` : '';

  // 🔥 FIX TASK CARD ICON (Get Subject's FA Class)
  let subIconClass = 'fa-folder';
  if(t.subj) {
      const matchedSubj = S.subjects.find(s => s.name === t.subj);
      if(matchedSubj) subIconClass = matchedSubj.emoji;
  }

  return `<div class="task-item p-${t.priority} ${t.isDone?'done':''} ${pendingClass}">
    <button class="check-circle ${t.isDone?'checked':''}" onclick="toggleTask(${t.id})">${t.isDone?'<i class="fa-solid fa-check"></i>':''}</button>
    <div class="task-body">
      <div class="task-name">${t.name}</div>
      <div class="task-tags"><span class="ttag"><i class="fa-regular fa-calendar-days"></i> ${t.date}</span>${t.subj?`<span class="ttag"><i class="fa-solid ${subIconClass}"></i> ${t.subj}</span>`:''}<span class="ttag">${pm[t.priority]} ${t.priority}</span>${badgeText}${revBadge}</div>
      ${t.note&&!mini?`<div class="task-note"><i class="fa-solid fa-comment-dots"></i> ${t.note}</div>`:''}
      ${splitUiHtml}
      ${subHtml}
      ${restoreBtn}
    </div>
    ${!mini?`<div class="task-actions"><button class="btn btn-icon" style="color:var(--p1);background:none;border:none" onclick="openEditTask(${t.id})"><i class="fa-solid fa-pen"></i></button><button class="btn btn-icon" style="color:var(--danger);background:none;border:none" onclick="deleteTask(${t.id})"><i class="fa-solid fa-trash-can"></i></button></div>`:''}
  </div>`;
}

function renderTasks(){
  const list=document.getElementById('taskList'); const filtered=getFiltered();
  if(!filtered.length){list.innerHTML=`<div class="empty"><div class="ei"><i class="fa-solid fa-box-open" style="font-size:40px; color:var(--textMuted)"></i></div><p>No tasks found.</p></div>`;return;}
  list.innerHTML=filtered.map(t=>taskCard(t)).join('');
  const pending=S.tasks.filter(t=>!t.isDone).length; const badge=document.getElementById('pendingBadge');
  if(badge){badge.style.display=pending?'flex':'none'; badge.textContent=pending;}
}

// 🔥 FIX NATIVE DROPDOWN COMPATIBILITY
function populateSubjDropdown(){
  const sel = document.getElementById('tSubj'); 
  if(sel) {
      const cur = sel.value;
      sel.innerHTML = '<option value="">📁 Subject</option>' + S.subjects.map(s=>{
          let emj = FA_TO_EMOJI[s.emoji] || '📁';
          return `<option value="${s.name}" ${s.name===cur?'selected':''}>${emj} ${s.name}</option>`;
      }).join('');
  }
  const filterSel = document.getElementById('subjFilterSelect');
  if(filterSel) {
      const curFilter = filterSel.value || 'all';
      filterSel.innerHTML = '<option value="all">📁 All Subjects</option>' + S.subjects.map(s=>{
          let emj = FA_TO_EMOJI[s.emoji] || '📁';
          return `<option value="${s.name}" ${s.name===curFilter?'selected':''}>${emj} ${s.name}</option>`;
      }).join('');
      S.subjFilter = filterSel.value; 
  }
}

/* ████████████████████████████████████████████████████████████
                  9. TIMER, ZEN MODE & EYE STRAIN 
████████████████████████████████████████████████████████████ */
const MODES={focus:25*60, short:5*60, long:15*60, stopwatch:0};
const MODE_NAMES={focus:'Focus Session', short:'Short Break', long:'Long Break', stopwatch:'Count-Up Tracking'};

function setTimerMode(m,el){
  if(S.timer.running)return; S.timer.mode=m;
  document.querySelectorAll('.tmode-btn').forEach(b=>b.classList.remove('active')); el.classList.add('active');
  const presetsBox=document.getElementById('timerPresetsBox');
  if(m==='stopwatch'){ S.timer.elapsed=0; presetsBox.style.display='none'; }
  else { S.timer.total=MODES[m]; S.timer.left=MODES[m]; presetsBox.style.display='grid'; document.querySelectorAll('.preset-btn').forEach(b=>b.classList.remove('active')); if(m==='focus') document.querySelectorAll('.preset-btn')[0].classList.add('active'); }
  updateTimerDisplay();
}
function setPreset(mins,el){
  if(S.timer.running || S.timer.mode==='stopwatch')return;
  S.timer.total=mins*60; S.timer.left=mins*60; document.querySelectorAll('.preset-btn').forEach(b=>b.classList.remove('active')); el.classList.add('active'); updateTimerDisplay();
}
function customTimer(el){
  if(S.timer.running || S.timer.mode==='stopwatch')return;
  let customMins = prompt("Enter personalized focus minutes (e.g. 20):", "20"); customMins = parseInt(customMins);
  if(!isNaN(customMins) && customMins > 0){ S.timer.total = customMins * 60; S.timer.left = customMins * 60; document.querySelectorAll('.preset-btn').forEach(b=>b.classList.remove('active')); el.classList.add('active'); updateTimerDisplay(); }
}

let isZenMode = false;
function openZenMode() { isZenMode = true; document.getElementById('zenOverlay').classList.add('active'); document.getElementById('zenQuote').innerHTML = QUOTES[Math.floor(Math.random()*QUOTES.length)]; }
function exitZenMode() { isZenMode = false; document.getElementById('zenOverlay').classList.remove('active'); }

function toggleTimer(){ S.timer.running ? pauseTimer() : startTimer(); }
function startTimer(){
  if(S.timer.mode!=='stopwatch' && S.timer.left<=0) resetTimer();
  S.timer.running=true; document.getElementById('timerPlayBtn').innerHTML='<i class="fa-solid fa-pause"></i>'; document.getElementById('zenBtn').style.display = 'block';
  if(S.timer.mode==='stopwatch') S.timer.startTime = Date.now() - (S.timer.elapsed * 1000);
  else S.timer.targetTime = Date.now() + (S.timer.left * 1000);

  S.timer.interval=setInterval(()=>{
    if(S.timer.mode==='stopwatch'){ 
        S.timer.elapsed = Math.round((Date.now() - S.timer.startTime)/1000); updateTimerDisplay(); 
        if(S.eyeStrain && S.timer.elapsed > 0 && S.timer.elapsed % (45 * 60) === 0) triggerEyeStrainAlert();
    } 
    else {
      S.timer.left = Math.max(0, Math.round((S.timer.targetTime - Date.now())/1000)); updateTimerDisplay();
      let runTime = S.timer.total - S.timer.left;
      if(S.eyeStrain && runTime > 0 && runTime % (45 * 60) === 0) triggerEyeStrainAlert();

      if(S.timer.left<=0){
        clearInterval(S.timer.interval); S.timer.running=false; document.getElementById('timerPlayBtn').innerHTML='<i class="fa-solid fa-play"></i>'; document.getElementById('zenBtn').style.display = 'none'; exitZenMode(); logSession(); playSfx('timer_complete'); showToast('🎉 Session complete! XP awarded!','success');
        if(S.notif&&'Notification' in window&&Notification.permission==='granted'){ new Notification('AnRu Focus',{body:MODE_NAMES[S.timer.mode]+' complete! 🏆 Take a break.'}); }
      }
    }
  },1000);
}

function triggerEyeStrainAlert() {
  playSfx('error'); showToast('<i class="fa-solid fa-eye"></i> Champion, 20 seconds ke liye phone se door dekho!', 'error');
  if(S.notif && 'Notification' in window && Notification.permission==='granted') { new Notification('AnRu Focus', {body: 'Rest your eyes! Look 20 feet away for 20 seconds. 👁️'}); }
}

function pauseTimer(){ clearInterval(S.timer.interval); S.timer.running=false; document.getElementById('timerPlayBtn').innerHTML='<i class="fa-solid fa-play"></i>'; document.getElementById('zenBtn').style.display = 'none'; exitZenMode(); }
function stopTimer(){ clearInterval(S.timer.interval); S.timer.running=false; document.getElementById('zenBtn').style.display = 'none'; exitZenMode();}
function resetTimer(){ pauseTimer(); S.timer.left=S.timer.total; S.timer.elapsed=0; updateTimerDisplay(); }
function skipTimer(){
  if(S.timer.running){ clearInterval(S.timer.interval); S.timer.running=false; document.getElementById('timerPlayBtn').innerHTML='<i class="fa-solid fa-play"></i>'; document.getElementById('zenBtn').style.display = 'none'; exitZenMode(); }
  logSession(); if(S.timer.mode==='focus'||S.timer.mode==='stopwatch'){ document.getElementById('tm-short').click(); } else { document.getElementById('tm-focus').click(); S.timer.session++; }
}
function logSession(){
  if(S.timer.mode!=='focus' && S.timer.mode!=='stopwatch') return;
  let durationMins = S.timer.mode==='stopwatch' ? Math.floor(S.timer.elapsed/60) : Math.floor((S.timer.total - S.timer.left)/60);
  if(durationMins < 1) return;
  const log={ id:Date.now(), dateStr: getTodayStr(), time: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}), duration:durationMins, mode:S.timer.mode, session:S.timer.session };
  S.timer.logs.unshift(log); if(S.timer.logs.length>100) S.timer.logs.pop(); 
  S.xp += (durationMins * 8); S.timer.session++; saveData(); renderTimerLog(); updateNavUser();
}
function updateTimerDisplay(){
  let m=0, s=0, pct=0;
  if(S.timer.mode==='stopwatch'){ m=Math.floor(S.timer.elapsed/60); s=S.timer.elapsed%60; pct=(s/60); }
  else { m=Math.floor(S.timer.left/60); s=S.timer.left%60; pct=S.timer.total?(S.timer.left/S.timer.total):0; }
  const timeStr = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  document.getElementById('timerDisplay').textContent=timeStr; document.getElementById('zenDisplay').textContent=timeStr;
  document.getElementById('timerLabel').textContent=MODE_NAMES[S.timer.mode]; document.getElementById('timerSess').textContent=`Session #${S.timer.session}`;
  const circ=document.getElementById('timerCircle'); if(circ) circ.style.strokeDashoffset=(628*(1-pct)).toFixed(1);
}
function renderTimerLog(){
  const el=document.getElementById('sessionLog');
  if(!S.timer.logs.length){ el.innerHTML=`<div class="empty"><div class="ei"><i class="fa-solid fa-stopwatch" style="font-size:40px; color:var(--textMuted)"></i></div><p>No sessions recorded.</p></div>`; document.getElementById('totalStudyTime').textContent='0h 0m total'; return; }
  const todayStr = getTodayStr();
  const totalMins=S.timer.logs.filter(l=>l.dateStr===todayStr).reduce((a,l)=>a+l.duration,0); document.getElementById('totalStudyTime').textContent=`${Math.floor(totalMins/60)}h ${totalMins%60}m today`;
  const todayLogs = S.timer.logs.filter(l=>l.dateStr===todayStr).slice(0,10);
  const colors={focus:'var(--p1)',short:'var(--success)',long:'var(--p3)',stopwatch:'var(--warn)'};
  el.innerHTML=todayLogs.map(l=>`<div class="session-entry"><div class="se-dot" style="background:${colors[l.mode]};box-shadow:0 0 6px ${colors[l.mode]}"></div><div class="se-info"><div class="se-time">Session #${l.session}</div><div class="se-label">${l.time}</div></div><div class="se-dur"><i class="fa-solid fa-stopwatch"></i> ${l.duration} min</div></div>`).join('');
}

document.addEventListener("visibilitychange", () => {
  if(document.visibilityState === 'hidden' && S.timer.running) {
    S.xp = Math.max(0, S.xp - 10); saveData(); localStorage.setItem('mceo_distracted', 'true');
  } else if(document.visibilityState === 'visible' && localStorage.getItem('mceo_distracted') === 'true') {
    localStorage.removeItem('mceo_distracted'); showToast('⚠️ FOCUS! You looked away! (-10 XP Penalty)', 'error'); playSfx('error'); updateNavUser(); renderDashboard();
  }
});

/* ████████████████████████████████████████████████████████████
                  10. FLOATING TIMESTAMP NOTE LOGIC 
████████████████████████████████████████████████████████████ */
function openTimestampModal() {
  const activeTasks = S.tasks.filter(t => !t.isDone && !t.isBacklog);
  const sel = document.getElementById('tsTaskSelect');
  if(sel) { sel.innerHTML = '<option value="">(Optional) Link to Active Task...</option>' + activeTasks.map(t => `<option value="${t.id}">${t.name}</option>`).join(''); }
  document.getElementById('tsNoteInput').value = ''; document.getElementById('timestampModal').classList.add('open');
}

function saveTimestampNote() {
  const noteText = document.getElementById('tsNoteInput').value.trim(); const taskId = document.getElementById('tsTaskSelect').value;
  if(!noteText) { playSfx('error'); return showToast('Bhai note toh likh! <i class="fa-solid fa-face-smile-sweat"></i>', 'error'); }
  if(!taskId) {
      S.tasks.unshift({ id:Date.now(), name: '⏱️ Quick Note', date: getTodayStr(), note: noteText, subj: '', priority: 'med', isDone: false, isTwoStep: false, watched: false, notesMade: false, subtasks:[], repScheduled: false, isRevision: false, isBacklog: false });
  } else {
      const t = S.tasks.find(x => x.id == taskId); if(t) { t.note = t.note ? t.note + '\n\n📌 ' + noteText : '📌 ' + noteText; }
  }
  saveData(); renderAll(); document.getElementById('timestampModal').classList.remove('open'); playSfx('success'); showToast('<i class="fa-solid fa-thumbtack"></i> Timestamp Note Saved!', 'success');
}

/* ████████████████████████████████████████████████████████████
                  11. SUBJECTS & FLASHCARDS 
████████████████████████████████████████████████████████████ */
function initEmojiPicker(){ document.getElementById('emojiRow').innerHTML=EMOJIS.map(e=>`<button class="emj ${e===S.emoji?'sel':''}" onclick="pickEmoji('${e}',this)"><i class="fa-solid ${e}"></i></button>`).join(''); }
function pickEmoji(e,el){ S.emoji=e; document.querySelectorAll('.emj').forEach(b=>b.classList.remove('sel')); el.classList.add('sel'); }
function addSubject(){
  const name=document.getElementById('sName').value.trim(); if(!name){ playSfx('error'); return showToast('Subject ka naam daal! <i class="fa-solid fa-folder"></i>','error'); }
  if(S.subjects.find(s=>s.name.toLowerCase()===name.toLowerCase())){ playSfx('error'); return showToast('Subject exists!','error'); }
  S.subjects.push({name,emoji:S.emoji, flashcards:[]}); document.getElementById('sName').value='';
  saveData(); renderSubjects(); populateSubjDropdown(); playSfx('success'); showToast('<i class="fa-solid fa-book"></i> Subject added!','success');
}
function deleteSubject(i){ if(!confirm('Subject delete karo?'))return; playSfx('delete'); S.subjects.splice(i,1); saveData(); renderSubjects(); populateSubjDropdown(); }

function openFlashcards(subName) {
  const subj = S.subjects.find(s=>s.name===subName); if(!subj) return;
  if(!subj.flashcards) subj.flashcards = [];
  let playHtml = '';
  if(subj.flashcards.length > 0) {
      const randomCard = subj.flashcards[Math.floor(Math.random() * subj.flashcards.length)];
      playHtml = `<div class="fc-scene" onclick="this.querySelector('.fc-card').classList.toggle('is-flipped')"><div class="fc-card"><div class="fc-face fc-front">Q/Formula: ${randomCard.q} <br><br><span style="font-size:10px;opacity:0.6;font-weight:400">(Tap to flip)</span></div><div class="fc-face fc-back">A/Derivation: ${randomCard.a}</div></div></div><button class="btn btn-glass" onclick="openFlashcards('${subName}')" style="margin-bottom:15px; width:100%"><i class="fa-solid fa-shuffle"></i> Next Random Cheat-Card</button><hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin-bottom:15px;">`;
  } else { playHtml = `<div class="empty" style="padding:10px"><p>No equations saved yet.</p></div>`; }
  const listHtml = subj.flashcards.map(fc => `<div class="fc-list-item"><div style="font-size:12px;text-align:left;flex:1"><b>Q:</b> ${fc.q}</div><button class="btn-icon" style="width:26px;height:26px;font-size:11px;color:var(--danger);background:rgba(248,113,113,0.1);border:none" onclick="deleteFlashcard('${subName}', ${fc.id})"><i class="fa-solid fa-xmark"></i></button></div>`).join('');
  const mc = document.getElementById('modalContent');
  mc.innerHTML = `<div class="modal-title" style="display:flex;align-items:center;gap:8px"><i class="fa-solid ${subj.emoji}" style="color:var(--p1)"></i> ${subj.name} Formula Vault</div>${playHtml}<div style="font-size:13px; font-weight:700; margin-bottom:8px; color:var(--textSub)">Create Cheat-Card:</div><div class="inp-wrap"><input type="text" id="fcQ" placeholder="Formula or Question..."></div><div class="inp-wrap"><input type="text" id="fcA" placeholder="Concept or Answer..."></div><button class="btn btn-grad" onclick="addFlashcard('${subName}')" style="margin-bottom:15px">Add to Cheat-Sheet <i class="fa-solid fa-plus"></i></button><div class="fc-list">${listHtml}</div>`;
  document.getElementById('modalOverlay').classList.add('open');
}
function addFlashcard(subName) {
  const q = document.getElementById('fcQ').value.trim(); const a = document.getElementById('fcA').value.trim();
  if(!q || !a){ playSfx('error'); return showToast('Dono parameters bharo!','error'); }
  const subj = S.subjects.find(s=>s.name===subName); if(!subj) return;
  if(!subj.flashcards) subj.flashcards = []; subj.flashcards.push({id: Date.now(), q, a});
  saveData(); renderSubjects(); openFlashcards(subName); playSfx('success'); showToast('Formula Added!','success');
}
function deleteFlashcard(subName, id) { const subj = S.subjects.find(s=>s.name===subName); if(!subj) return; subj.flashcards = subj.flashcards.filter(fc => fc.id !== id); saveData(); renderSubjects(); openFlashcards(subName); playSfx('delete'); }

/* ████████████████████████████████████████████████████████████
                  12. LIVE GRID & SKILL TREE RENDERING 
████████████████████████████████████████████████████████████ */
function renderSubjects(){
  const todayStr = getTodayStr();
  const liveCountUI = document.getElementById('liveCountUI'); 
  const revisionCountUI = document.getElementById('revisionCountUI'); 
  const backlogCountUI = document.getElementById('backlogCountUI');
  
  if(liveCountUI) liveCountUI.textContent = S.tasks.filter(t => !t.isBacklog && !t.isRevision && !t.isDone && t.date <= todayStr).length;
  if(revisionCountUI) revisionCountUI.textContent = S.tasks.filter(t => !t.isDone && t.isRevision && t.date <= todayStr).length;
  if(backlogCountUI) backlogCountUI.textContent = S.tasks.filter(t => t.isBacklog && !t.isDone).length;

  const stCont = document.getElementById('skillTreeContainer');
  if(stCont) {
      if(S.subjects.length === 0) { stCont.innerHTML = '<div style="font-size:13px; color:var(--textSub); text-align:center; padding:10px;">Add subjects to grow your skill tree! <i class="fa-solid fa-seedling" style="color:var(--success)"></i></div>'; } 
      else {
          stCont.innerHTML = S.subjects.map((s, i) => {
              const subjTasks = S.tasks.filter(t => t.subj === s.name); const doneTasks = subjTasks.filter(t => t.isDone).length; const total = subjTasks.length;
              const isUnlocked = total > 0 && doneTasks === total; let cls = isUnlocked ? 'unlocked' : ''; let lineCls = (i < S.subjects.length - 1 && isUnlocked) ? 'unlocked' : '';
              let html = `<div class="tree-node ${cls}"><div style="display:flex; align-items:center; gap:10px;"><span style="font-size:20px; color:var(--p1)"><i class="fa-solid ${s.emoji}"></i></span><div><div style="font-weight:700; font-size:14px; color:${isUnlocked ? 'var(--success)' : '#fff'}">${s.name}</div><div style="font-size:11px; color:var(--textMuted)">${doneTasks}/${total} Mastery</div></div></div><div style="font-size:18px;">${isUnlocked ? '<i class="fa-solid fa-star" style="color:var(--warn)"></i>' : '<i class="fa-solid fa-lock" style="color:var(--textMuted)"></i>'}</div></div>`;
              if(i < S.subjects.length - 1) { html += `<div class="tree-line ${lineCls}"></div>`; } return html;
          }).join('');
      }
  }

  const g=document.getElementById('subjGrid'); if(!S.subjects.length){ g.innerHTML=`<div class="empty" style="grid-column:1/-1"><p>No subjects yet.</p></div>`;return;}
  g.innerHTML=S.subjects.map((s,i)=>{
    const total=S.tasks.filter(t=>t.subj===s.name).length; const done=S.tasks.filter(t=>t.subj===s.name&&t.isDone).length; const pct=total?Math.round(done/total*100):0; const fcCount = s.flashcards ? s.flashcards.length : 0;
    return `<div class="subj-card"><button class="del-subj-btn" onclick="deleteSubject(${i})"><i class="fa-solid fa-xmark"></i></button><span class="se" style="color:var(--p1)"><i class="fa-solid ${s.emoji}"></i></span><div class="sn">${s.name}</div><div class="sc">${done}/${total} completed</div><div class="subj-bar"><div class="subj-fill" style="width:${pct}%"></div></div><button class="btn btn-glass" style="width:100%; margin-top:12px; padding:8px; font-size:12px; border-radius:8px;" onclick="openFlashcards('${s.name}')"><i class="fa-solid fa-book-open"></i> Formulas (${fcCount})</button></div>`;
  }).join('');
}

/* ████████████████████████████████████████████████████████████
                  13. CHARTS & DASHBOARD RENDERING 
████████████████████████████████████████████████████████████ */
window.showChartTooltip = function(e, text) {
    const tt = document.getElementById('chartTooltip'); if(!tt) return;
    tt.textContent = text; tt.style.display = 'block';
    const rect = e.currentTarget.getBoundingClientRect(); const containerRect = document.getElementById('weeklyStudyChart').getBoundingClientRect();
    tt.style.left = (rect.left - containerRect.left + (rect.width/2)) + 'px'; tt.style.top = '-10px';
}
window.hideChartTooltip = function() { const tt = document.getElementById('chartTooltip'); if(tt) tt.style.display = 'none'; }

function renderWeeklyStudyChart(){
  const container=document.getElementById('weeklyStudyChart'); if(!container) return;
  const filterType = document.getElementById('chartFilter').value; let trackingPoints = []; let maxMin = 30; 
  if(filterType === '7' || filterType === '30') {
    const daysCount = parseInt(filterType);
    for(let i=daysCount-1; i>=0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); const dateStr = getLocISO(d);
      const lbl = filterType === '7' ? d.toLocaleDateString('en-IN',{weekday:'short'}).charAt(0) : d.getDate(); trackingPoints.push({ id: dateStr, label: lbl, desc: d.toLocaleDateString('en-IN',{weekday:'long', month:'short', day:'numeric'}) });
    }
    trackingPoints.forEach(pt => { pt.minutes = S.timer.logs.filter(l=>l.dateStr === pt.id).reduce((acc,curr)=>acc+curr.duration, 0); if(pt.minutes > maxMin) maxMin = pt.minutes; });
  } else if (filterType === '365') {
    for(let i=11; i>=0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i); const mStr = getLocISO(d).substring(0,7); 
      trackingPoints.push({ id: mStr, label: d.toLocaleDateString('en-IN',{month:'short'}).charAt(0), desc: d.toLocaleDateString('en-IN',{month:'long', year:'numeric'}) });
    }
    trackingPoints.forEach(pt => { pt.minutes = S.timer.logs.filter(l=>l.dateStr.startsWith(pt.id)).reduce((acc,curr)=>acc+curr.duration, 0); if(pt.minutes > maxMin) maxMin = pt.minutes; });
  }
  
  container.innerHTML = trackingPoints.map(pt=>{
    const barPct = Math.round((pt.minutes / maxMin)*100); 
    return `<div class="chart-bar-wrapper" onmouseover="showChartTooltip(event, '${pt.minutes} mins studied in ${pt.desc}')" onmouseout="hideChartTooltip()" onclick="event.stopPropagation(); showToast('${pt.minutes} mins studied in ${pt.desc}', 'success')"><div class="chart-val" style="display:${filterType==='30'?'none':'block'}">${pt.minutes > 0 ? (pt.minutes > 999 ? '1k+' : pt.minutes) : ''}</div><div class="chart-bar" style="height: ${barPct}%;"></div><div class="chart-label">${pt.label}</div></div>`;
  }).join('');
}

function renderDashboard(){
  const todayStr = getTodayStr();
  const revAlert = document.getElementById('revisionAlertUI');
  const revCount = S.tasks.filter(t => !t.isDone && t.isRevision && t.date <= todayStr).length;
  if(revAlert) {
      if(revCount > 0) { revAlert.style.display = 'flex'; document.getElementById('revAlertText').textContent = `You have ${revCount} task(s) pending for revision!`; } 
      else { revAlert.style.display = 'none'; }
  }

  const target = 2; 
  const todayCompleted = S.tasks.filter(t => t.date === todayStr && t.isDone && !t.isBacklog).length;
  const targetText = document.getElementById('targetTextUI'); const targetBar = document.getElementById('targetBarUI');
  if(targetText) targetText.textContent = `${todayCompleted}/${target} Done`; if(targetBar) targetBar.style.width = `${Math.min(100, (todayCompleted/target)*100)}%`;

  const aiUi = document.getElementById('aiSuggesterUI');
  if(aiUi) {
     const liveToday = S.tasks.filter(t => t.date === todayStr && !t.isBacklog && !t.isDone).length; const pendingBacklogs = S.tasks.filter(t => t.isBacklog && !t.isDone).length;
     if(liveToday <= 1 && pendingBacklogs > 0) { aiUi.style.display = 'flex'; } else { aiUi.style.display = 'none'; }
  }

  const standardTasks = S.tasks.filter(t => !t.isBacklog); 
  const total = S.tasks.length; const done = S.tasks.filter(t => t.isDone).length; const pending = total - done; 
  const pct = total ? Math.round((done / total) * 100) : 0;
  const backlogCount = S.tasks.filter(t => t.isBacklog && !t.isDone).length; document.getElementById('backlogBannerDesc').textContent = `${backlogCount} class backlogs active`;
  animNum('dTotal',total); animNum('dPending',pending); animNum('dXP',S.xp); animNum('dStreak',calcStreak());
  setTimeout(()=>{const r = document.getElementById('pRing'); if(r) r.style.strokeDashoffset=(239-239*pct/100).toFixed(1);},100);
  document.getElementById('pPct').textContent=pct+'%'; document.getElementById('pDone').textContent=`${done}/${total}`; document.getElementById('pBar').style.width=pct+'%';
  document.getElementById('pDesc').innerHTML=total===0?'Add tasks to start tracking your mission!':pct===100?'<i class="fa-solid fa-trophy" style="color:var(--warn)"></i> All tasks complete! You are unstoppable!':`${done} of ${total} tasks complete — keep pushing!`;
  
  const rd=document.getElementById('recentList'); const recent=standardTasks.filter(t=>!t.isDone).slice(0,3);
  rd.innerHTML=recent.length?recent.map(t=>taskCard(t,true)).join(''):`<div class="empty" style="padding:20px"><div class="ei"><i class="fa-solid fa-hands-clapping" style="font-size:40px; color:var(--warn)"></i></div><p style="font-size:13px">All clear configuration done!</p></div>`;
  const badge=document.getElementById('pendingBadge'); if(badge){badge.style.display=pending?'flex':'none'; badge.textContent=pending;}
}

function animNum(id,target){
  const el=document.getElementById(id); if(!el)return;
  const start=parseInt(el.textContent)||0; const diff=target-start; if(diff===0){el.textContent=target; return;}
  let i=0; const t=setInterval(()=>{ i++; el.textContent=Math.round(start+diff*(i/20)); if(i>=20){clearInterval(t); el.textContent=target;} },20);
}

function calcStreak(){
  const doneDates=[...new Set(S.tasks.filter(t=>t.isDone).map(t=>t.date))].sort().reverse(); 
  let streak=0,cur=new Date(); const todayStr = getTodayStr();
  let hasFreeze = S.freezeDate && S.freezeDate >= todayStr;
  if(hasFreeze) document.getElementById('streakLabel').innerHTML = 'Day Streak <i class="fa-solid fa-snowflake" style="color:var(--p1)"></i>'; else document.getElementById('streakLabel').innerHTML = 'Day Streak';
  if(!doneDates.length) return 0;
  for(const d of doneDates){
    const dd=new Date(d); const diff=Math.round((cur-dd)/86400000);
    if(diff<=1) { streak++; cur=dd; } else if(diff === 2 && hasFreeze) { streak++; cur=dd; } else break;
  } return streak;
}

function renderProfile(){
  updateNavUser(); document.getElementById('ps1').textContent=S.tasks.length; document.getElementById('ps2').textContent=S.tasks.filter(t=>t.isDone).length; document.getElementById('ps3').textContent=S.subjects.length;
  const completedTasks = S.tasks.filter(t => t.isDone && t.subj); const subjCounts = {}; let totalSubjTasks = 0; completedTasks.forEach(t => { subjCounts[t.subj] = (subjCounts[t.subj] || 0) + 1; totalSubjTasks++; });
  const grid = document.getElementById('subjectTimeGrid'); const labels = document.getElementById('subjectTimeLabels');
  if(grid && labels) {
      if(totalSubjTasks === 0) { grid.innerHTML = '<div style="width:100%; background:var(--glassBorder);"></div>'; labels.innerHTML = '<span style="font-size:10px; color:var(--textMuted)">No data yet</span>'; } 
      else {
          const colors = ['#ec4899', '#a855f7', '#667eea', '#4ade80', '#fbbf24', '#f87171']; let gHtml = ''; let lHtml = ''; let cIdx = 0;
          for(let s in subjCounts) { const pct = Math.round((subjCounts[s] / totalSubjTasks) * 100); const color = colors[cIdx % colors.length]; gHtml += `<div style="width:${pct}%; height:100%; background:${color};" title="${s}: ${pct}%"></div>`; lHtml += `<div style="display:flex; align-items:center; gap:4px; font-size:10px;"><span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${color}"></span>${s} (${pct}%)</div>`; cIdx++; }
          grid.innerHTML = gHtml; labels.innerHTML = lHtml;
      }
  }
}

/* ████████████████████████████████████████████████████████████
                  14. FEATURE 18: WEEKLY REPORT ENGINE 
████████████████████████████████████████████████████████████ */
function openReportModal() {
  const today = new Date(); const d7 = new Date(); d7.setDate(today.getDate() - 7);
  document.getElementById('reportDateRange').textContent = `Date: ${d7.toLocaleDateString('en-IN')} to ${today.toLocaleDateString('en-IN')}`;
  document.getElementById('reportStudentName').textContent = S.session?.name || 'Champion';

  const last7DaysStr = [];
  for(let i=0; i<7; i++) {
      let d = new Date(); d.setDate(today.getDate() - i);
      last7DaysStr.push(getLocISO(d));
  }

  let time = 0; S.timer.logs.forEach(l => { if(last7DaysStr.includes(l.dateStr)) time += l.duration; });
  document.getElementById('reportTotalTime').textContent = `${Math.floor(time/60)}h ${time%60}m`;

  let tasksDone = 0; let backlogsCleared = 0;
  S.tasks.forEach(t => {
      if(t.isDone && last7DaysStr.includes(t.date)) { tasksDone++; if(t.isBacklog) backlogsCleared++; }
  });
  
  document.getElementById('reportTasksDone').textContent = tasksDone; document.getElementById('reportBacklogsCleared').textContent = backlogsCleared;
  document.getElementById('reportModal').classList.add('open'); playSfx('click');
}

function printReport() { window.print(); playSfx('success'); showToast('<i class="fa-solid fa-file-pdf"></i> PDF Ready!', 'success'); }

/* ████████████████████████████████████████████████████████████
                  15. SETTINGS, NOTIFS & MODALS 
████████████████████████████████████████████████████████████ */
function toggleEyeStrain() { S.eyeStrain = !S.eyeStrain; updateEyeStrainToggle(); saveData(); showToast(S.eyeStrain ? '<i class="fa-solid fa-eye-low-vision"></i> Eye-Strain Break ON (45m)' : '<i class="fa-solid fa-eye"></i> Eye-Strain Break OFF'); }
function updateEyeStrainToggle() { const sw=document.getElementById('eyeStrainSw'); if(sw) sw.classList.toggle('on', S.eyeStrain); }

function exportBackupData() {
  const packagedData = { tasks: S.tasks, subjects: S.subjects, logs: S.timer.logs, xp: S.xp, notif: S.notif, unlocks: S.unlocks, theme: S.theme, freezeDate: S.freezeDate, drainDate: S.lastDrainDate, eyeStrain: S.eyeStrain, activeBuff: S.activeBuff };
  const backupStr = btoa(unescape(encodeURIComponent(JSON.stringify(packagedData))));
  const mc = document.getElementById('modalContent');
  mc.innerHTML = `<div class="modal-title"><i class="fa-solid fa-floppy-disk" style="color:var(--p1)"></i> Save Backup Code</div>
    <p style="font-size:12px; color:var(--textMuted); margin-bottom:12px;">Apna data save rakhne ke liye is code ko COPY karke Notes/WhatsApp par rakh lo!</p>
    <div class="inp-wrap area"><textarea id="bCodeArea" rows="5" readonly style="font-size:11px; color:var(--warn); font-family:monospace; word-break:break-all;">${backupStr}</textarea></div>
    <button class="btn btn-grad" onclick="navigator.clipboard.writeText(document.getElementById('bCodeArea').value); showToast('<i class=\\'fa-solid fa-check\\'></i> Code Copied!'); closeModal(); playSfx('success');"><i class="fa-solid fa-clipboard"></i> Copy Code</button>`;
  document.getElementById('modalOverlay').classList.add('open');
}

function processRestoreCode() {
    const code = document.getElementById('backupPasteArea').value.trim();
    if(!code) { playSfx('error'); return showToast('Code daalo bhai!', 'error'); }
    try {
        const restoredJson = JSON.parse(decodeURIComponent(escape(atob(code))));
        if(restoredJson.tasks) S.tasks = restoredJson.tasks; if(restoredJson.subjects) S.subjects = restoredJson.subjects;
        if(restoredJson.logs) S.timer.logs = restoredJson.logs; if(restoredJson.xp) S.xp = restoredJson.xp;
        if(restoredJson.unlocks) S.unlocks = { ...S.unlocks, ...restoredJson.unlocks }; if(restoredJson.theme) S.theme = restoredJson.theme;
        if(restoredJson.freezeDate) S.freezeDate = restoredJson.freezeDate; if(restoredJson.drainDate) S.lastDrainDate = restoredJson.drainDate;
        if(restoredJson.eyeStrain !== undefined) S.eyeStrain = restoredJson.eyeStrain;
        if(restoredJson.activeBuff !== undefined) S.activeBuff = restoredJson.activeBuff;
        saveData(); applyTheme(S.theme); renderAll(); updateNavUser(); updateShopUI(); playSfx('success'); showToast('<i class="fa-solid fa-file-import"></i> Data restored!','success');
        closeModal();
    } catch(err) { playSfx('error'); showToast('<i class="fa-solid fa-circle-xmark"></i> Invalid Backup Code!','error'); }
}

function importBackupData(e) {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const restoredJson = JSON.parse(ev.target.result);
      if(restoredJson.tasks) S.tasks = restoredJson.tasks; if(restoredJson.subjects) S.subjects = restoredJson.subjects;
      if(restoredJson.logs) S.timer.logs = restoredJson.logs; if(restoredJson.xp) S.xp = restoredJson.xp;
      if(restoredJson.unlocks) S.unlocks = { ...S.unlocks, ...restoredJson.unlocks }; if(restoredJson.theme) S.theme = restoredJson.theme;
      if(restoredJson.freezeDate) S.freezeDate = restoredJson.freezeDate; if(restoredJson.drainDate) S.lastDrainDate = restoredJson.drainDate;
      if(restoredJson.eyeStrain !== undefined) S.eyeStrain = restoredJson.eyeStrain;
      if(restoredJson.activeBuff !== undefined) S.activeBuff = restoredJson.activeBuff;
      saveData(); applyTheme(S.theme); renderAll(); updateNavUser(); updateShopUI(); playSfx('success'); showToast('<i class="fa-solid fa-file-import"></i> Data restored from file!','success');
    } catch(err) { playSfx('error'); showToast('<i class="fa-solid fa-circle-xmark"></i> Invalid Backup File!','error'); }
    e.target.value = ''; 
  };
  reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
     const importDiv = document.querySelector('div[onclick="document.getElementById(\'importBackupInput\').click()"]');
     if(importDiv) {
        importDiv.onclick = function() {
          const mc = document.getElementById('modalContent');
          mc.innerHTML = `<div class="modal-title"><i class="fa-solid fa-file-import"></i> Restore Backup</div>
            <p style="font-size:12px; color:var(--textMuted); margin-bottom:12px;">Apna save kiya hua code yahan paste karo.</p>
            <div class="inp-wrap area"><textarea id="backupPasteArea" rows="5" placeholder="Paste your code here..."></textarea></div>
            <button class="btn btn-grad" onclick="processRestoreCode()">Restore Data <i class="fa-solid fa-rocket"></i></button>`;
          document.getElementById('modalOverlay').classList.add('open');
        };
     }
  }, 500);
});

function openModal(type){
  const ov=document.getElementById('modalOverlay'); const mc=document.getElementById('modalContent');
  if(type==='editName'){ mc.innerHTML=`<div class="modal-title"><i class="fa-solid fa-user-pen"></i> Edit Name</div><div class="inp-wrap"><span class="ico"><i class="fa-solid fa-user"></i></span><input type="text" id="mInp" placeholder="Your name" value="${S.session?.name||''}"></div><button class="btn btn-grad" onclick="saveModal('name')">Save</button>`; }
  else if(type==='editPass'){ if(S.session?.isGuest) return showToast('Guest account password error!','error'); mc.innerHTML=`<div class="modal-title"><i class="fa-solid fa-lock"></i> Change Password</div><div class="inp-wrap"><span class="ico"><i class="fa-solid fa-lock"></i></span><input type="password" id="mOld" placeholder="Current password"></div><div class="inp-wrap"><span class="ico"><i class="fa-solid fa-wand-magic-sparkles"></i></span><input type="password" id="mNew" placeholder="New password (min 4 chars)"></div><button class="btn btn-grad" onclick="saveModal('pass')">Update</button>`; }
  else if(type==='editCourse'){ mc.innerHTML=`<div class="modal-title"><i class="fa-solid fa-graduation-cap"></i> Edit Course</div><div class="inp-wrap"><span class="ico"><i class="fa-solid fa-graduation-cap"></i></span><input type="text" id="mInp" placeholder="Course / College" value="${S.session?.course||''}"></div><button class="btn btn-grad" onclick="saveModal('course')">Save</button>`; }
  else if(type==='clearData'){ mc.innerHTML=`<div class="modal-title" style="color:var(--danger)"><i class="fa-solid fa-trash-can"></i> Clear All Data</div><p style="color:var(--textSub);font-size:14px;margin-bottom:20px">Sare records flush ho jayenge! This cannot be rolled back.</p><button class="btn btn-grad" style="background:var(--danger)" onclick="confirmClearData()">Yes, Delete All</button>`; }
  ov.classList.add('open');
}
function closeModal(){document.getElementById('modalOverlay').classList.remove('open');}
function saveModal(type){
  if(type==='name'){ const val=document.getElementById('mInp').value.trim(); if(!val){ playSfx('error'); return showToast('Validation Error!','error'); } S.session.name=val; localStorage.setItem('mceo_sess',JSON.stringify(S.session)); saveData(); updateNavUser(); closeModal(); playSfx('success'); showToast('<i class="fa-solid fa-check"></i> Name updated!','success'); }
  else if(type==='pass'){ const oldP=document.getElementById('mOld').value; const newP=document.getElementById('mNew').value; if(S.session.pass!==oldP){ playSfx('error'); return showToast('Old key invalid!','error'); } if(newP.length<4){ playSfx('error'); return showToast('Min 4 chars!','error'); } S.session.pass=newP; localStorage.setItem('mceo_sess',JSON.stringify(S.session)); saveData(); closeModal(); playSfx('success'); showToast('<i class="fa-solid fa-lock"></i> Password locked!','success'); }
  else if(type==='course'){ const val=document.getElementById('mInp').value.trim(); S.session.course=val; localStorage.setItem('mceo_sess',JSON.stringify(S.session)); saveData(); updateNavUser(); closeModal(); playSfx('success'); showToast('<i class="fa-solid fa-graduation-cap"></i> Course metrics saved!','success'); }
}
function confirmClearData(){ S.tasks=[]; S.subjects=[{name:'Physics',emoji:'fa-microscope'},{name:'Maths',emoji:'fa-calculator'},{name:'Computer Science',emoji:'fa-laptop-code'}]; S.subjects.forEach(s => s.flashcards = []); S.timer.logs=[]; S.xp=0; S.theme='default'; S.unlocks={matrix:false, cyber:false, ocean:false, sunset:false, gold:false, badge_ninja:false, badge_scholar:false, badge_legend:false}; S.freezeDate=null; S.lastDrainDate=null; S.lastMissionDate=null; S.eyeStrain=false; S.activeBuff=null; applyTheme('default'); saveData(); closeModal(); renderAll(); updateShopUI(); playSfx('delete'); showToast('<i class="fa-solid fa-trash-can"></i> Architecture wiped clean!'); }

/* Global Events */
document.addEventListener('click', function(e){ const el = e.target.closest('.btn, .btn-sm, .btn-glass, .btn-icon, .tbtn, .bnav-item, .fchip, .pri-btn, .tmode-btn, .preset-btn, .tab-btn, .emj, .see-all, .sitem, .toggle-sw, .modal-close, .del-subj-btn'); if(el) playSfx('click'); }, true);
document.getElementById('modalOverlay').addEventListener('click',function(e){if(e.target===this)closeModal();});
document.getElementById('timestampModal').addEventListener('click',function(e){if(e.target===this) this.classList.remove('open');});
document.getElementById('reportModal').addEventListener('click',function(e){if(e.target===this) this.classList.remove('open');});

let toastTimer;
function showToast(msg,type=''){ const t=document.getElementById('toast'); t.innerHTML=msg; t.className='toast show'+(type?' '+type:''); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.className='toast',2800); }

// MASTER RENDER
function renderAll(){ checkLevelUp(); checkBuffState(); renderDashboard(); renderTasks(); renderSubjects(); renderProfile(); renderTimerLog(); populateSubjDropdown(); updateTodayDate(); renderWeeklyStudyChart(); }

/* ████ MISSING FUNCTIONS FIX (DATE & MOTIVATION) ████ */
function updateTodayDate() {
    const today = new Date();
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const dateEl = document.getElementById('todayDate');
    if (dateEl) dateEl.textContent = today.toLocaleDateString('en-IN', options);
}

function loadQuotesEngine() {
    const quoteEl = document.getElementById('dashQuote');
    if (quoteEl) {
        quoteEl.innerHTML = pickQuote();
        setInterval(() => { quoteEl.innerHTML = pickQuote(); }, 12000);
    }
}
