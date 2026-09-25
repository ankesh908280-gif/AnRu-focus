/* =========================================================
   👾 AnRu Focus Pro - Solo Boss Battle: "The Backlog Monster"
   Turn your 48 class backlogs into an epic RPG boss dungeon!
   ========================================================= */

const BacklogBoss = (function() {

  function getBossData() {
    const allBacklogs = S.tasks ? S.tasks.filter(t => t.isBacklog) : [];
    const pendingBacklogs = allBacklogs.filter(t => !t.isDone);
    const defeatedBacklogs = allBacklogs.filter(t => t.isDone);

    const maxHp = Math.max(1, allBacklogs.length);
    const curHp = pendingBacklogs.length;
    const hpPct = Math.round((curHp / maxHp) * 100);

    return {
      allBacklogs,
      pendingBacklogs,
      defeatedBacklogs,
      maxHp,
      curHp,
      hpPct,
      isDefeated: curHp === 0 && allBacklogs.length > 0
    };
  }

  function openBossArena() {
    const data = getBossData();
    const mc = document.getElementById('modalContent');
    const ov = document.getElementById('modalOverlay');
    if (!mc || !ov) return;

    let monsterEmoji = "👹";
    let bossName = "Malakor — The Backlog Titan";
    let bossQuote = "Tumhara backlog kabhi khatam nahi hoga, Ankesh!";

    if (data.hpPct < 25) {
      monsterEmoji = "😵";
      bossQuote = "Nahi! Meri shaktiyaan khatam ho rahi hain...";
    } else if (data.hpPct < 60) {
      monsterEmoji = "👿";
      bossQuote = "Aah! Tumhare revision strikes mujhe kamzor kar rahe hain!";
    }

    if (data.isDefeated) {
      monsterEmoji = "💀";
      bossName = "Malakor (DEFEATED)";
      bossQuote = "Tumne saara backlog mita diya! You are the TRUE SLAYER!";
    }

    const tasksHtml = data.pendingBacklogs.slice(0, 5).map(t => `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:12px; gap:8px;">
        <div style="flex:1; min-width:0;">
          <div style="font-size:13px; font-weight:700; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${t.name}</div>
          <div style="font-size:10px; color:var(--textMuted);">${t.subj || 'Syllabus Backlog'} • Due: ${t.date}</div>
        </div>
        <button class="btn-sm" onclick="BacklogBoss.attackWithTask(${t.id})" style="background:linear-gradient(135deg, #ef4444, #f43f5e); color:#fff; font-size:11px; padding:6px 12px; border-radius:8px; flex-shrink:0;">
          Strike ⚔️
        </button>
      </div>
    `).join('');

    mc.innerHTML = `
      <div class="boss-arena-container" id="bossArenaBox" style="position:relative; text-align:center;">
        
        <!-- Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
          <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:#f87171;">
            <i class="fa-solid fa-dungeon"></i> Solo RPG Dungeon
          </div>
          <div style="font-size:11px; background:rgba(239,68,68,0.2); color:#f87171; border:1px solid rgba(239,68,68,0.4); padding:2px 8px; border-radius:8px; font-weight:700;">
            Tier: Class 12 Boss
          </div>
        </div>

        <!-- Boss Avatar Stage -->
        <div class="boss-stage" style="position:relative; padding:20px 0 10px; overflow:hidden;">
          <div id="bossAvatar" style="font-size:72px; filter:drop-shadow(0 0 25px rgba(239,68,68,0.6)); animation:bossPulse 2.5s infinite; transition:transform 0.2s;">
            ${monsterEmoji}
          </div>
          <div id="bossSlashEffect" style="display:none; position:absolute; inset:0; pointer-events:none; background:radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%);"></div>
          
          <div style="font-size:17px; font-weight:900; color:#fff; margin-top:8px; font-family:'Outfit', sans-serif;">
            ${bossName}
          </div>
          <div style="font-size:11px; color:var(--textMuted); font-style:italic; margin-top:2px;">
            "${bossQuote}"
          </div>
        </div>

        <!-- Boss Health Bar -->
        <div style="margin:16px 0;">
          <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:800; margin-bottom:5px;">
            <span style="color:#f87171;"><i class="fa-solid fa-heart-pulse"></i> BOSS HEALTH</span>
            <span style="color:#fff;">${data.curHp} / ${data.maxHp} HP (${data.hpPct}%)</span>
          </div>
          <div style="width:100%; height:14px; background:rgba(255,255,255,0.1); border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,0.15); box-shadow:inset 0 2px 4px rgba(0,0,0,0.5);">
            <div id="bossHpBarFill" style="width:${data.hpPct}%; height:100%; background:linear-gradient(90deg, #ef4444, #f97316, #fbbf24); border-radius:10px; transition:width 0.4s ease-out; box-shadow:0 0 10px rgba(239,68,68,0.8);"></div>
          </div>
        </div>

        <!-- Battle Instructions / Quest -->
        <div style="font-size:12px; color:#e2e8f0; margin-bottom:14px; text-align:left; background:rgba(0,0,0,0.3); padding:10px 12px; border-radius:10px; border-left:3px solid #f87171;">
          <i class="fa-solid fa-bolt" style="color:#fbbf24;"></i> <b>Battle Rule:</b> Complete any pending backlog lecture below to deal <b>-1 HP damage</b> and gain <b>+50 Battle XP</b>!
        </div>

        <!-- Backlog Target Tasks -->
        ${data.isDefeated ? `
          <div style="padding:20px; background:rgba(74,222,128,0.15); border:1px solid #4ade80; border-radius:14px; margin-bottom:15px;">
            <div style="font-size:32px;">🏆</div>
            <div style="font-size:16px; font-weight:900; color:#4ade80; margin-top:5px;">DUNGEON CLEARED!</div>
            <div style="font-size:12px; color:#e2e8f0; margin-top:4px;">Aapne saare backlogs mita diye hain! You unlocked <b>Backlog Slayer</b> title!</div>
          </div>
        ` : `
          <div style="text-align:left; font-size:12px; font-weight:800; color:var(--textSub); margin-bottom:8px;">
            Active Backlog Targets (${data.pendingBacklogs.length} remaining):
          </div>
          <div style="display:flex; flex-direction:column; gap:8px; max-height:200px; overflow-y:auto; margin-bottom:16px;" class="scroll-hide">
            ${data.pendingBacklogs.length ? tasksHtml : '<div style="font-size:12px; color:var(--textMuted); padding:10px;">Koi pending backlog nahi bacha!</div>'}
          </div>
        `}

        <!-- Footer Actions -->
        <div style="display:flex; gap:10px;">
          <button class="btn btn-grad" style="flex:1; border-radius:12px;" onclick="closeModal();">Exit Arena</button>
          <button class="btn" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); color:#fff; border-radius:12px;" onclick="switchPage('tasks'); closeModal();">
            View All Tasks
          </button>
        </div>

      </div>
    `;

    ov.classList.add('open');
    if (typeof playSfx === 'function') playSfx('click');
  }

  function attackWithTask(taskId) {
    const task = S.tasks ? S.tasks.find(t => t.id === taskId) : null;
    if (!task) return;

    task.isDone = true;
    S.xp = (S.xp || 0) + 50;

    if (typeof playSfx === 'function') playSfx('unlock');

    const avatar = document.getElementById('bossAvatar');
    const slash = document.getElementById('bossSlashEffect');

    if (avatar) {
      avatar.style.transform = 'scale(0.85) rotate(-10deg)';
      setTimeout(() => { avatar.style.transform = 'scale(1.1) rotate(10deg)'; }, 100);
      setTimeout(() => { avatar.style.transform = 'scale(1) rotate(0deg)'; }, 250);
    }

    if (slash) {
      slash.style.display = 'block';
      setTimeout(() => { slash.style.display = 'none'; }, 250);
    }

    if (typeof showToast === 'function') {
      showToast('⚔️ CRITICAL HIT! -1 Boss HP (+50 XP)', 'success');
    }

    if (window.confetti) {
      window.confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    }

    saveData();
    renderAll();

    setTimeout(() => {
      openBossArena();
    }, 450);
  }

  return {
    openBossArena,
    attackWithTask,
    getBossData
  };
})();

window.BacklogBoss = BacklogBoss;
