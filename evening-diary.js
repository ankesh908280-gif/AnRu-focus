/* ==========================================================================
   🌙 AnRu Focus Pro - Evening Daily Reflection & Tomorrow Top-2 Planner
   ========================================================================== */

const EveningDiary = (function() {

  function openDiaryModal() {
    const mc = document.getElementById('modalContent');
    const ov = document.getElementById('modalOverlay');
    if (!mc || !ov) return;

    const todayStr = (typeof getTodayStr === 'function') ? getTodayStr() : new Date().toISOString().split('T')[0];
    const prevDiary = JSON.parse(localStorage.getItem('anru_diary_' + todayStr) || 'null') || {};

    mc.innerHTML = `
      <div style="text-align:left;">
        <div class="modal-title" style="margin-bottom:4px;">
          <i class="fa-solid fa-moon" style="color:#c084fc;"></i> 2-Minute Evening Reflection
        </div>
        <p style="font-size:12px; color:var(--textMuted); margin-bottom:14px;">
          Aaj ka hisaab-kitaab aur kal ke 2 sabse zaroori lakshya set karein.
        </p>

        <!-- Question 1: Today's Win -->
        <div style="margin-bottom:12px;">
          <label style="font-size:12px; font-weight:700; color:#fff; display:block; margin-bottom:4px;">
            1. Aaj Vidyakul / School ki kaunsi class ya topic complete kiya?
          </label>
          <input type="text" id="diaryWinInput" placeholder="e.g. Physics गति के नियम lecture 4 + DPP" value="${prevDiary.win || ''}" style="width:100%; font-size:13px;">
        </div>

        <!-- Question 2: Tomorrow's Top 2 -->
        <div style="margin-bottom:12px;">
          <label style="font-size:12px; font-weight:700; color:#fff; display:block; margin-bottom:4px;">
            2. Kal subah sabse pehle kaunse 2 kaam nipatane hain?
          </label>
          <input type="text" id="diaryTask1Input" placeholder="Top Priority 1 (e.g. Maths Trigonometry revision)" value="${prevDiary.task1 || ''}" style="width:100%; font-size:13px; margin-bottom:6px;">
          <input type="text" id="diaryTask2Input" placeholder="Top Priority 2 (e.g. Chemistry Mole concept notes)" value="${prevDiary.task2 || ''}" style="width:100%; font-size:13px;">
        </div>

        <!-- Question 3: Rating -->
        <div style="margin-bottom:16px;">
          <label style="font-size:12px; font-weight:700; color:#fff; display:block; margin-bottom:6px;">
            3. Aaj ka focus kaisa raha?
          </label>
          <div style="display:flex; gap:8px;" id="diaryStarRow">
            ${[1, 2, 3, 4, 5].map(st => `
              <button onclick="EveningDiary.setRating(${st})" class="diary-star-btn ${prevDiary.rating >= st ? 'active' : ''}" data-star="${st}" style="flex:1; padding:8px 0; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:10px; color:${prevDiary.rating >= st ? '#fbbf24' : 'rgba(255,255,255,0.4)'}; font-size:16px; cursor:pointer;">
                ★
              </button>
            `).join('')}
          </div>
        </div>

        <button class="btn btn-grad" style="width:100%; border-radius:12px;" onclick="EveningDiary.saveDiary()">
          Save & Plan Tomorrow (+40 XP) 🚀
        </button>
      </div>
    `;

    ov.classList.add('open');
    if (typeof playSfx === 'function') playSfx('click');
  }

  let selectedRating = 5;
  function setRating(r) {
    selectedRating = r;
    const btns = document.querySelectorAll('.diary-star-btn');
    btns.forEach(b => {
      const star = parseInt(b.getAttribute('data-star'), 10);
      b.style.color = star <= r ? '#fbbf24' : 'rgba(255,255,255,0.4)';
    });
    if (typeof playSfx === 'function') playSfx('click');
  }

  function saveDiary() {
    const todayStr = (typeof getTodayStr === 'function') ? getTodayStr() : new Date().toISOString().split('T')[0];
    const win = document.getElementById('diaryWinInput')?.value.trim() || "";
    const task1 = document.getElementById('diaryTask1Input')?.value.trim() || "";
    const task2 = document.getElementById('diaryTask2Input')?.value.trim() || "";

    const diaryData = {
      date: todayStr,
      win,
      task1,
      task2,
      rating: selectedRating,
      timestamp: Date.now()
    };

    localStorage.setItem('anru_diary_' + todayStr, JSON.stringify(diaryData));

    // Automatically create tomorrow's tasks if provided
    if (typeof S !== 'undefined' && S.tasks) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = (typeof getLocISO === 'function') ? getLocISO(tomorrow) : tomorrow.toISOString().split('T')[0];

      if (task1) {
        S.tasks.unshift({
          id: Date.now(),
          name: task1,
          date: tomorrowStr,
          subj: "Class 11",
          priority: "high",
          isDone: false,
          isBacklog: false
        });
      }
      if (task2) {
        S.tasks.unshift({
          id: Date.now() + 1,
          name: task2,
          date: tomorrowStr,
          subj: "Class 11",
          priority: "med",
          isDone: false,
          isBacklog: false
        });
      }

      S.xp = (S.xp || 0) + 40;
      if (typeof saveData === 'function') saveData();
      if (typeof renderAll === 'function') renderAll();
    }

    if (typeof playSfx === 'function') playSfx('success');
    if (typeof showToast === 'function') showToast("🌙 Evening Reflection Saved! Tomorrow tasks scheduled! (+40 XP)", "success");
    if (typeof closeModal === 'function') closeModal();
  }

  return {
    openDiaryModal,
    setRating,
    saveDiary
  };
})();

window.EveningDiary = EveningDiary;
