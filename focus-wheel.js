/* =========================================================
   🎡 AnRu Focus Pro - Daily Focus Wheel (Lucky Spin)
   Daily reward wheel unlocked by completing your daily target!
   ========================================================= */

const FocusWheel = (function() {

  const PRIZES = [
    { label: "+50 XP", type: "xp", value: 50, color: "#8b5cf6", icon: "fa-star" },
    { label: "Streak Freeze", type: "freeze", value: 1, color: "#06b6d4", icon: "fa-snowflake" },
    { label: "+100 XP", type: "xp", value: 100, color: "#ec4899", icon: "fa-bolt" },
    { label: "2x XP Potion", type: "potion", value: 3600000, color: "#10b981", icon: "fa-flask" },
    { label: "+25 XP", type: "xp", value: 25, color: "#f59e0b", icon: "fa-coins" },
    { label: "Mystery Box", type: "mystery", value: 1, color: "#6366f1", icon: "fa-gift" },
    { label: "+150 XP", type: "xp", value: 150, color: "#ef4444", icon: "fa-crown" },
    { label: "200 XP Boost", type: "xp", value: 200, color: "#3b82f6", icon: "fa-wand-magic-sparkles" }
  ];

  let isSpinning = false;
  let currentAngle = 0;

  function canSpinToday() {
    const todayStr = (typeof getTodayStr === 'function') ? getTodayStr() : new Date().toISOString().split('T')[0];
    const target = 2;
    const todayCompleted = S.tasks ? S.tasks.filter(t => t.date === todayStr && t.isDone && !t.isBacklog).length : 0;
    const isTargetMet = todayCompleted >= target;
    const alreadySpun = S.lastSpinDate === todayStr;

    return {
      canSpin: isTargetMet && !alreadySpun,
      todayCompleted,
      target,
      alreadySpun,
      isTargetMet
    };
  }

  function openWheelModal() {
    const status = canSpinToday();
    const mc = document.getElementById('modalContent');
    const ov = document.getElementById('modalOverlay');
    if (!mc || !ov) return;

    mc.innerHTML = `
      <div style="text-align:center;">
        <div class="modal-title" style="margin-bottom:4px;">
          <i class="fa-solid fa-dharmachakra" style="color:#fbbf24;"></i> Daily Focus Wheel
        </div>
        <p style="font-size:12px; color:var(--textMuted); margin-bottom:14px;">
          Rozana 2 Daily Tasks complete karein aur 1 Free Lucky Spin paayein!
        </p>

        <!-- Status Card -->
        <div style="padding:10px 14px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:12px; margin-bottom:16px; font-size:12px;">
          ${status.alreadySpun ? `
            <span style="color:#4ade80;"><i class="fa-solid fa-circle-check"></i> Aaj ka free spin use ho chuka hai! Kal naya spin aayega.</span>
          ` : status.isTargetMet ? `
            <span style="color:#fbbf24; font-weight:700;"><i class="fa-solid fa-gift"></i> Daily Target Completed (${status.todayCompleted}/${status.target})! Spin Available!</span>
          ` : `
            <span style="color:#f87171;"><i class="fa-solid fa-lock"></i> Target Pending: Aaj ke ${status.todayCompleted}/${status.target} tasks huye hain. 2 tasks poore karke spin unlock karein!</span>
          `}
        </div>

        <!-- Wheel Container -->
        <div style="position:relative; width:280px; height:280px; margin:0 auto 16px;">
          <!-- Pointer -->
          <div style="position:absolute; top:-12px; left:50%; transform:translateX(-50%); width:0; height:0; border-left:14px solid transparent; border-right:14px solid transparent; border-top:22px solid #fbbf24; z-index:10; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));"></div>
          
          <!-- Canvas -->
          <canvas id="focusWheelCanvas" width="280" height="280" style="border-radius:50%; box-shadow:0 0 25px rgba(168,85,247,0.4); border:3px solid rgba(255,255,255,0.2);"></canvas>
          
          <!-- Center Button -->
          <div onclick="FocusWheel.startSpin()" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:60px; height:60px; border-radius:50%; background:linear-gradient(135deg, #181135, #2e1065); border:3px solid #fbbf24; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:13px; cursor:pointer; box-shadow:0 0 15px rgba(251,191,36,0.6); z-index:5;">
            SPIN
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display:flex; gap:10px;">
          <button class="btn btn-grad" style="flex:1; border-radius:12px;" onclick="FocusWheel.startSpin()">
            ${status.alreadySpun ? 'Already Claimed' : 'Spin the Wheel 🎡'}
          </button>
          <button class="btn" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); color:#fff; border-radius:12px;" onclick="closeModal();">
            Close
          </button>
        </div>
      </div>
    `;

    ov.classList.add('open');
    drawWheel();
    if (typeof playSfx === 'function') playSfx('click');
  }

  function drawWheel() {
    const canvas = document.getElementById('focusWheelCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const numSlices = PRIZES.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(currentAngle);

    for (let i = 0; i < numSlices; i++) {
      const p = PRIZES[i];
      const start = i * sliceAngle;
      const end = start + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.stroke();

      ctx.save();
      ctx.rotate(start + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px Outfit, sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 4;
      ctx.fillText(p.label, radius - 18, 4);
      ctx.restore();
    }

    ctx.restore();
  }

  function startSpin() {
    if (isSpinning) return;
    const status = canSpinToday();

    if (!status.isTargetMet) {
      if (typeof showToast === 'function') showToast(`⚠️ Pehle aaj ke 2 daily target poore karo! (${status.todayCompleted}/2 done)`, 'error');
      if (typeof playSfx === 'function') playSfx('error');
      return;
    }

    if (status.alreadySpun) {
      if (typeof showToast === 'function') showToast('ℹ️ Aaj ka spin ho chuka hai! Kal naya spin milega.', 'info');
      return;
    }

    isSpinning = true;
    const prizeIdx = Math.floor(Math.random() * PRIZES.length);
    const numSlices = PRIZES.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    const extraRounds = 7;
    const targetSliceAngle = (numSlices - prizeIdx - 0.5) * sliceAngle;
    const targetRotation = (extraRounds * 2 * Math.PI) + targetSliceAngle - (Math.PI / 2);

    let start = null;
    const duration = 4500;
    const initialAngle = currentAngle % (2 * Math.PI);

    function animate(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(1, elapsed / duration);

      const ease = 1 - Math.pow(1 - progress, 3);
      currentAngle = initialAngle + (targetRotation * ease);
      drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isSpinning = false;
        applyPrize(PRIZES[prizeIdx]);
      }
    }

    if (typeof playSfx === 'function') playSfx('click');
    requestAnimationFrame(animate);
  }

  function applyPrize(prize) {
    const todayStr = (typeof getTodayStr === 'function') ? getTodayStr() : new Date().toISOString().split('T')[0];
    S.lastSpinDate = todayStr;

    if (prize.type === 'xp') {
      S.xp = (S.xp || 0) + prize.value;
      if (typeof showToast === 'function') showToast(`🎉 CONGRATS! You won ${prize.label}!`, 'success');
    } else if (prize.type === 'freeze') {
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      S.freezeDate = (typeof getLocISO === 'function') ? getLocISO(tomorrow) : tomorrow.toISOString().split('T')[0];
      if (typeof showToast === 'function') showToast('❄️ WOW! You won a FREE Streak Freeze!', 'success');
    } else if (prize.type === 'potion') {
      S.activeBuff = { type: '2x', exp: Date.now() + 3600000 };
      if (typeof showToast === 'function') showToast('🧪 AWESOME! 1 Hour 2x XP Potion Activated!', 'success');
    } else if (prize.type === 'mystery') {
      S.xp = (S.xp || 0) + 120;
      if (typeof showToast === 'function') showToast('🎁 MYSTERY GIFT! +120 Bonus XP!', 'success');
    }

    if (typeof playSfx === 'function') playSfx('success');
    if (window.confetti) {
      window.confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }

    saveData();
    renderAll();

    setTimeout(() => {
      openWheelModal();
    }, 1200);
  }

  return {
    openWheelModal,
    startSpin,
    canSpinToday
  };
})();

window.FocusWheel = FocusWheel;
