/* =========================================================
   🎧 AnRu Focus Pro - Built-in Procedural Audio Soundscapes
   Pure Web Audio API — 100% Offline, Audible on Speakers & Earphones
   ========================================================= */

const FocusAudio = (function() {
  let ctx = null;
  let currentSound = null;
  let activeNodes = [];
  let masterGain = null;
  let volume = 0.7;

  function initCtx() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  // 1. Gentle Rain (Pink Noise + Lowpass + Gentle Drops)
  function startRain() {
    stopCurrent();
    initCtx();

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.14;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.85, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    whiteNoise.start();
    activeNodes.push(whiteNoise, filter, gain);
    currentSound = 'rain';
    updateAudioUI();
  }

  // 2. 40Hz Gamma Focus Audio (432Hz Calming Carrier + 40Hz Gamma Isochronic Brainwave Pulse)
  // Perfectly audible on mobile phone speakers AND earphones!
  function startBinaural() {
    stopCurrent();
    initCtx();

    // Carrier 1: Warm 432Hz Sine Tone
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(432, ctx.currentTime);

    // Carrier 2: Subtle warm octave (216Hz) for body depth
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(216, ctx.currentTime);
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.2, ctx.currentTime);
    osc2.connect(gain2);

    // Pulse Gain Node
    const pulseGain = ctx.createGain();
    pulseGain.gain.setValueAtTime(0.45, ctx.currentTime);

    // 40Hz Gamma LFO (Low Frequency Oscillator)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(40, ctx.currentTime); // 40Hz Gamma Rate

    const lfoDepth = ctx.createGain();
    lfoDepth.gain.setValueAtTime(0.35, ctx.currentTime);

    lfo.connect(lfoDepth);
    lfoDepth.connect(pulseGain.gain);

    // Connect carriers to pulse gain
    osc1.connect(pulseGain);
    gain2.connect(pulseGain);

    // Lowpass filter for velvety smooth sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);

    pulseGain.connect(filter);
    filter.connect(masterGain);

    osc1.start();
    osc2.start();
    lfo.start();

    activeNodes.push(osc1, osc2, gain2, lfo, lfoDepth, pulseGain, filter);
    currentSound = 'binaural';
    updateAudioUI();
  }

  // 3. Relaxing Ocean Waves
  function startWaves() {
    stopCurrent();
    initCtx();

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.18;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(480, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.45, ctx.currentTime);

    const waveGain = ctx.createGain();
    waveGain.gain.setValueAtTime(0.55, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(masterGain);

    noise.start();
    lfo.start();
    activeNodes.push(noise, filter, lfo, lfoGain, waveGain);
    currentSound = 'waves';
    updateAudioUI();
  }

  function stopCurrent() {
    activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    activeNodes = [];
    currentSound = null;
    updateAudioUI();
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (masterGain && ctx) {
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    }
  }

  function toggle(type) {
    if (currentSound === type) {
      stopCurrent();
      if (typeof showToast === 'function') showToast('🔇 Ambient sound paused', 'info');
      return null;
    } else {
      if (type === 'rain') {
        startRain();
        if (typeof showToast === 'function') showToast('🌧️ Gentle Rain Audio Active', 'info');
      } else if (type === 'binaural') {
        startBinaural();
        if (typeof showToast === 'function') showToast('🧠 40Hz Gamma Focus Audio Active (Playing)', 'info');
      } else if (type === 'waves') {
        startWaves();
        if (typeof showToast === 'function') showToast('🌊 Ocean Waves Audio Active', 'info');
      }
      return type;
    }
  }

  function updateAudioUI() {
    const soundBtns = document.querySelectorAll('.sound-chip');
    soundBtns.forEach(btn => {
      const type = btn.getAttribute('data-sound');
      if (type === currentSound) {
        btn.classList.add('active');
        btn.style.borderColor = 'var(--p1, #a855f7)';
        btn.style.background = 'rgba(168, 85, 247, 0.25)';
      } else {
        btn.classList.remove('active');
        btn.style.borderColor = 'rgba(255,255,255,0.12)';
        btn.style.background = 'rgba(255,255,255,0.06)';
      }
    });

    const statusEl = document.getElementById('ambientAudioStatus');
    if (statusEl) {
      if (currentSound === 'rain') statusEl.textContent = '🌧️ Rain Ambient (Active)';
      else if (currentSound === 'binaural') statusEl.textContent = '🧠 40Hz Gamma Waves (Active)';
      else if (currentSound === 'waves') statusEl.textContent = '🌊 Ocean Waves (Active)';
      else statusEl.textContent = '🔇 Soundscapes Off';
    }
  }

  function closeSoundModal() {
    const customOv = document.getElementById('audioSoundModalOverlay');
    if (customOv) customOv.style.display = 'none';
    if (typeof closeModal === 'function') closeModal();
  }

  function openSoundModal() {
    let ov = document.getElementById('modalOverlay');
    let mc = document.getElementById('modalContent');

    if (!ov || !mc) {
      let customOv = document.getElementById('audioSoundModalOverlay');
      if (!customOv) {
        customOv = document.createElement('div');
        customOv.id = 'audioSoundModalOverlay';
        customOv.style.cssText = 'position:fixed; inset:0; z-index:99999; background:rgba(0,0,0,0.7); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); display:flex; align-items:center; justify-content:center; padding:20px;';
        customOv.innerHTML = `
          <div style="width:100%; max-width:380px; background:rgba(18,12,38,0.95); border:1px solid rgba(255,255,255,0.15); border-radius:24px; padding:24px; box-shadow:0 20px 50px rgba(0,0,0,0.6); position:relative; color:#fff; font-family:'Outfit',sans-serif;">
            <div id="audioSoundModalInner"></div>
          </div>
        `;
        document.body.appendChild(customOv);
      }
      ov = customOv;
      mc = document.getElementById('audioSoundModalInner');
      ov.style.display = 'flex';
    } else {
      ov.classList.add('open');
    }

    mc.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div style="font-family:'Outfit',sans-serif; font-size:20px; font-weight:800;"><i class="fa-solid fa-headphones" style="color:var(--p1,#a855f7);"></i> Focus Soundscapes</div>
        <button onclick="FocusAudio.closeSoundModal()" style="background:rgba(255,255,255,0.1); border:none; width:30px; height:30px; border-radius:50%; color:#fff; cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <p style="font-size:12px; color:rgba(255,255,255,0.6); margin-bottom:16px;">100% Offline Procedural Soundscapes for Deep Focus & Concentration.</p>
      
      <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:18px;">
        <div onclick="FocusAudio.toggle('rain'); FocusAudio.openSoundModal();" style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:rgba(255,255,255,0.06); border:1px solid ${currentSound === 'rain' ? '#60a5fa' : 'rgba(255,255,255,0.1)'}; border-radius:14px; cursor:pointer;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:38px; height:38px; border-radius:10px; background:rgba(96,165,250,0.2); color:#60a5fa; display:flex; align-items:center; justify-content:center; font-size:18px;"><i class="fa-solid fa-cloud-showers-heavy"></i></div>
            <div>
              <div style="font-size:14px; font-weight:700; color:#fff;">Gentle Rain</div>
              <div style="font-size:11px; color:rgba(255,255,255,0.6);">Soothing raindrops to block noise</div>
            </div>
          </div>
          <div style="font-size:13px; font-weight:700; color:${currentSound === 'rain' ? '#60a5fa' : 'rgba(255,255,255,0.4)'};">${currentSound === 'rain' ? '<i class="fa-solid fa-circle-pause"></i> Playing' : '<i class="fa-solid fa-circle-play"></i> Play'}</div>
        </div>

        <div onclick="FocusAudio.toggle('binaural'); FocusAudio.openSoundModal();" style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:rgba(255,255,255,0.06); border:1px solid ${currentSound === 'binaural' ? '#c084fc' : 'rgba(255,255,255,0.1)'}; border-radius:14px; cursor:pointer;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:38px; height:38px; border-radius:10px; background:rgba(168,85,247,0.2); color:#c084fc; display:flex; align-items:center; justify-content:center; font-size:18px;"><i class="fa-solid fa-brain"></i></div>
            <div>
              <div style="font-size:14px; font-weight:700; color:#fff;">40Hz Gamma Focus</div>
              <div style="font-size:11px; color:rgba(255,255,255,0.6);">432Hz + 40Hz pulse for deep retention</div>
            </div>
          </div>
          <div style="font-size:13px; font-weight:700; color:${currentSound === 'binaural' ? '#c084fc' : 'rgba(255,255,255,0.4)'};">${currentSound === 'binaural' ? '<i class="fa-solid fa-circle-pause"></i> Playing' : '<i class="fa-solid fa-circle-play"></i> Play'}</div>
        </div>

        <div onclick="FocusAudio.toggle('waves'); FocusAudio.openSoundModal();" style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:rgba(255,255,255,0.06); border:1px solid ${currentSound === 'waves' ? '#2dd4bf' : 'rgba(255,255,255,0.1)'}; border-radius:14px; cursor:pointer;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:38px; height:38px; border-radius:10px; background:rgba(45,212,191,0.2); color:#2dd4bf; display:flex; align-items:center; justify-content:center; font-size:18px;"><i class="fa-solid fa-water"></i></div>
            <div>
              <div style="font-size:14px; font-weight:700; color:#fff;">Ocean Waves</div>
              <div style="font-size:11px; color:rgba(255,255,255,0.6);">Rhythmic flow for deep work state</div>
            </div>
          </div>
          <div style="font-size:13px; font-weight:700; color:${currentSound === 'waves' ? '#2dd4bf' : 'rgba(255,255,255,0.4)'};">${currentSound === 'waves' ? '<i class="fa-solid fa-circle-pause"></i> Playing' : '<i class="fa-solid fa-circle-play"></i> Play'}</div>
        </div>
      </div>

      <div style="margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; color:rgba(255,255,255,0.6); margin-bottom:6px;">
          <span>Volume</span>
          <span id="audioVolVal">${Math.round(volume * 100)}%</span>
        </div>
        <input type="range" min="0" max="1" step="0.05" value="${volume}" oninput="FocusAudio.setVolume(this.value); document.getElementById('audioVolVal').textContent=Math.round(this.value*100)+'%';" style="width:100%; accent-color:#a855f7;">
      </div>

      <div style="display:flex; gap:10px;">
        <button style="flex:1; padding:12px; border:none; background:linear-gradient(135deg, #a855f7, #6366f1); color:#fff; font-weight:700; border-radius:12px; cursor:pointer;" onclick="FocusAudio.closeSoundModal();">Done</button>
        ${currentSound ? `<button style="padding:12px 18px; background:rgba(239,68,68,0.2); border:1px solid #ef4444; color:#ef4444; font-weight:700; border-radius:12px; cursor:pointer;" onclick="FocusAudio.stop(); FocusAudio.openSoundModal();">Stop All</button>` : ''}
      </div>
    `;

    if (typeof playSfx === 'function') playSfx('click');
  }

  return {
    toggle,
    stop: stopCurrent,
    setVolume,
    getCurrent: () => currentSound,
    openSoundModal,
    closeSoundModal
  };
})();

window.FocusAudio = FocusAudio;
window.openSoundModal = function() { FocusAudio.openSoundModal(); };
