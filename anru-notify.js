/* ==========================================================================
   AnRu Focus - Duolingo-Style Smart Notification & Timer Controller
   Zero-Audio-Ducking Engine | 100% Native Web & Service Worker Architecture
   ========================================================================== */

(function(window) {
    'use strict';

    const NOTIFY_CONFIG = {
        swPath: 'sw.js?v=3.0',
        minIntervalHours: 2.5, // Throttling: at least 2.5 hours between smart reminders
        storageKeyLast: 'anru_last_smart_notify_ts',
        storageKeyHistory: 'anru_notify_history',
        logsKey: 'anru_focus_logs'
    };

    let swRegistration = null;
    let smartCheckInterval = null;

    // ================= 1. INITIALIZATION & SERVICE WORKER =================

    async function initNotifier() {
        if ('serviceWorker' in navigator) {
            try {
                swRegistration = await navigator.serviceWorker.register(NOTIFY_CONFIG.swPath);
                console.log('[AnRu Notifier] Service Worker registered successfully');
            } catch (err) {
                console.warn('[AnRu Notifier] Service Worker registration failed:', err);
            }
        }

        // Check and prompt for notification permission if not decided
        checkPermissionBanner();

        // Start Smart Scheduler
        startSmartScheduler();
    }

    function checkPermissionBanner() {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'default') {
            const dismissedUntil = parseInt(localStorage.getItem('anru_notify_dismissed_until') || '0', 10);
            if (Date.now() < dismissedUntil) return;
            setTimeout(showPermissionPrompt, 3000);
        }
    }

    function showPermissionPrompt() {
        if (document.getElementById('anru-perm-prompt')) return;

        const promptHtml = `
            <div id="anru-perm-prompt" style="position:fixed; top:20px; left:50%; transform:translateX(-50%); width:92%; max-width:400px; background:linear-gradient(135deg, rgba(26,16,63,0.96), rgba(15,8,36,0.98)); border:1px solid rgba(168,85,247,0.4); box-shadow:0 12px 35px rgba(0,0,0,0.8), 0 0 15px rgba(168,85,247,0.3); border-radius:20px; padding:16px 20px; z-index:999999; backdrop-filter:blur(15px); animation:slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
                <div style="display:flex; align-items:flex-start; gap:12px;">
                    <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg,#a855f7,#ec4899); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:20px;">
                        🔔
                    </div>
                    <div style="flex:1;">
                        <h4 style="margin:0 0 4px; color:#fff; font-size:14px; font-weight:700;">Smart Study & Streak Alerts</h4>
                        <p style="margin:0 0 12px; color:#cbd5e1; font-size:12px; line-height:1.4;">Bhai, Duolingo jaise daily lecture targets, streak bachaane aur 49 backlog alerts ke notifications on karein?</p>
                        <div style="display:flex; gap:10px;">
                            <button id="anru-allow-notify" style="flex:1; background:linear-gradient(135deg,#a855f7,#ec4899); color:#fff; border:none; border-radius:10px; padding:8px 12px; font-size:12px; font-weight:700; cursor:pointer;">
                                Allow Alerts 🚀
                            </button>
                            <button id="anru-later-notify" style="background:rgba(255,255,255,0.08); color:#94a3b8; border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:8px 12px; font-size:12px; font-weight:600; cursor:pointer;">
                                Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                @keyframes slideDown {
                    from { opacity:0; transform:translate(-50%, -30px); }
                    to { opacity:1; transform:translate(-50%, 0); }
                }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', promptHtml);

        document.getElementById('anru-allow-notify')?.addEventListener('click', async () => {
            document.getElementById('anru-perm-prompt')?.remove();
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    showInAppToast("🔔 Notifications Active! Ab ek bhi class aur streak miss nahi hogi.", "success");
                }
            } catch (e) {}
        });

        document.getElementById('anru-later-notify')?.addEventListener('click', () => {
            document.getElementById('anru-perm-prompt')?.remove();
            localStorage.setItem('anru_notify_dismissed_until', (Date.now() + 3 * 24 * 60 * 60 * 1000).toString());
        });
    }

    // ================= 2. LIVE FOCUS TIMER NOTIFICATION (ZERO AUDIO DUCKING) =================

    async function updateTimerNotification(seconds, isRunning, mode, totalDuration) {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;

        let m = Math.floor(seconds / 60);
        let s = Math.floor(seconds % 60);
        let timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

        let title = '';
        let body = '';

        if (isRunning) {
            title = mode === 'stopwatch' ? `⏱️ Studying: ${timeStr}` : `⏳ Focus: ${timeStr} Left`;
            body = 'AnRu Focus • Live Class Mode (Tap to open)';
        } else {
            title = `⏸️ Focus Paused: ${timeStr}`;
            body = 'Paused • Tap to resume your focus session.';
        }

        const actions = isRunning
            ? [
                { action: 'pause', title: 'Pause ⏸️' },
                { action: 'finish', title: 'Finish ⏹️' }
              ]
            : [
                { action: 'resume', title: 'Resume ▶️' },
                { action: 'finish', title: 'Finish ⏹️' }
              ];

        // Route through Service Worker (100% native Android background system notification)
        if (swRegistration && swRegistration.showNotification) {
            try {
                await swRegistration.showNotification(title, {
                    body: body,
                    tag: 'anru-focus-timer',
                    renotify: false,
                    silent: true, // STRICTLY SILENT - Absolute ZERO audio ducking! Music/video won't lower!
                    icon: 'https://img.icons8.com/fluency/192/brain.png',
                    badge: 'https://img.icons8.com/fluency/96/brain.png',
                    actions: actions,
                    data: { url: 'focus.html' }
                });
            } catch (err) {
                console.warn('[AnRu Notifier] Timer notification update error:', err);
            }
        }
    }

    async function clearTimerNotification() {
        if (swRegistration && swRegistration.getNotifications) {
            try {
                const notifications = await swRegistration.getNotifications({ tag: 'anru-focus-timer' });
                notifications.forEach(n => n.close());
            } catch (err) {}
        }
    }

    async function showSessionCompletedNotification(minutes) {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;

        if (swRegistration && swRegistration.showNotification) {
            try {
                await swRegistration.showNotification(`🎉 Great Job! ${minutes}m Focus Completed!`, {
                    body: 'Shabaash! Aapka study session save ho chuka hai. Mission 85%+ in progress!',
                    tag: 'anru-completed-alert',
                    renotify: true,
                    vibrate: [200, 100, 200],
                    icon: 'https://img.icons8.com/fluency/192/trophy.png',
                    data: { url: 'focus.html' }
                });
            } catch (err) {}
        }
    }

    // ================= 3. DUOLINGO-STYLE SMART NOTIFICATION ENGINE =================

    function isTimeInActiveWindow() {
        const now = new Date();
        const hour = now.getHours();
        // Allowed windows: Morning 5 AM - 9 AM OR Afternoon/Night 3 PM - 11 PM (15 to 23)
        const isMorning = hour >= 5 && hour < 9;
        const isEvening = hour >= 15 && hour <= 23;
        return isMorning || isEvening;
    }

    function canSendSmartNotification() {
        const lastTs = parseInt(localStorage.getItem(NOTIFY_CONFIG.storageKeyLast) || '0', 10);
        const now = Date.now();
        const minMs = NOTIFY_CONFIG.minIntervalHours * 60 * 60 * 1000;
        return (now - lastTs) >= minMs;
    }

    function recordSmartNotification(type) {
        localStorage.setItem(NOTIFY_CONFIG.storageKeyLast, Date.now().toString());
        let hist = JSON.parse(localStorage.getItem(NOTIFY_CONFIG.storageKeyHistory) || '[]');
        hist.push({ type: type, timestamp: Date.now(), timeStr: new Date().toLocaleTimeString() });
        if (hist.length > 20) hist.shift();
        localStorage.setItem(NOTIFY_CONFIG.storageKeyHistory, JSON.stringify(hist));
    }

    function getTodayStudyMins() {
        try {
            const logs = JSON.parse(localStorage.getItem(NOTIFY_CONFIG.logsKey) || '[]');
            const todayStr = new Date().toISOString().split('T')[0];
            return logs.filter(l => l.dateStr === todayStr).reduce((a, c) => a + (c.duration || 0), 0);
        } catch (e) {
            return 0;
        }
    }

    // Evaluates intelligent Duolingo-style rules
    function evaluateSmartRules() {
        if (!isTimeInActiveWindow()) return null;
        if (!canSendSmartNotification()) return null;

        // If user is currently running a focus session in app, do not disturb!
        if (window.isRun) return null;

        const now = new Date();
        const hour = now.getHours();
        const todayMins = getTodayStudyMins();

        // 1. NIGHT STREAK SAVER EMERGENCY (8:30 PM - 10:45 PM, 0 mins studied)
        if (hour >= 20 && hour <= 22 && todayMins === 0) {
            let hrsLeft = 24 - hour;
            return {
                type: 'STREAK_EMERGENCY',
                title: '🔥 Streak Danger Alert!',
                body: `Bhai aaj ka streak tootne me sirf ${hrsLeft} ghante bache hain! Bachaane ke liye bas 1 session Focus timer chalao ya 2-min brain game!`,
                icon: 'https://img.icons8.com/fluency/192/fire-element.png',
                targetUrl: 'focus.html'
            };
        }

        // 2. DAILY LECTURE TARGET (7:00 AM - 8:59 AM)
        if (hour >= 7 && hour < 9) {
            return {
                type: 'DAILY_TARGET',
                title: '📚 Daily Target: Mission 85%+',
                body: 'Bhai daily lecture target pura karo, abhi baki hai! Subah ka pehla 25-min focus session shuru karein?',
                icon: 'https://img.icons8.com/fluency/192/books.png',
                targetUrl: 'focus.html'
            };
        }

        // 3. 49 BACKLOG DESTROYER ALERT (3:00 PM - 5:30 PM)
        if (hour >= 15 && hour < 18) {
            return {
                type: 'BACKLOG_DESTROYER',
                title: '🎯 49 Backlog Destroyer Mode!',
                body: 'Aaj class nahi hai ya free time hai? Aao apne 49 pending backlogs me se 1-2 lectures niptayein!',
                icon: 'https://img.icons8.com/fluency/192/target.png',
                targetUrl: 'notes-vault.html'
            };
        }

        // 4. SPACED REVISION ALERT (6:00 PM - 8:00 PM)
        if (hour >= 18 && hour < 20) {
            return {
                type: 'SPACED_REVISION',
                title: '🧠 Spaced Revision Slot (1-3-7 Day Rule)',
                body: '3 din pehle padhe hue Physics/Maths topics ka 15-min revision slot ready hai. Quick recap karo taaki exam me yaad rahe!',
                icon: 'https://img.icons8.com/fluency/192/brain.png',
                targetUrl: 'focus.html'
            };
        }

        // 5. TRAIN YOUR BRAIN / FOCUS RESET (3:30 PM - 5:00 PM)
        if (hour >= 15 && hour < 17) {
            return {
                type: 'TRAIN_BRAIN',
                title: '⚡ Train Your Brain Workout!',
                body: 'Dopahar me aalas bhagane ke liye aao 2 minute speed math aur memory drills solve karo!',
                icon: 'https://img.icons8.com/fluency/192/lightning-bolt.png',
                targetUrl: 'train-brain.html'
            };
        }

        // 6. NIGHT SATISFACTION / SLEEP CHECK (10:30 PM - 11:00 PM)
        if (hour >= 22 && hour <= 23) {
            return {
                type: 'NIGHT_WRAPUP',
                title: '🌙 Daily Focus Wrap-Up',
                body: `Shaabaash! Aaj aapne ${todayMins > 0 ? todayMins + 'm' : 'mehnat'} padhai ki. Ab aaram se so jao, kal subah 6 baje fir fresh start karenge!`,
                icon: 'https://img.icons8.com/fluency/192/crescent-moon.png',
                targetUrl: 'focus.html'
            };
        }

        return null;
    }

    async function triggerSmartNotification(rule) {
        if (!rule) return;

        recordSmartNotification(rule.type);

        // 1. Dispatch Web/System Notification
        if ('Notification' in window && Notification.permission === 'granted' && swRegistration) {
            try {
                await swRegistration.showNotification(rule.title, {
                    body: rule.body,
                    tag: 'anru-smart-' + rule.type,
                    renotify: true,
                    silent: true, // Zero audio ducking!
                    icon: rule.icon,
                    badge: 'https://img.icons8.com/fluency/96/brain.png',
                    data: { url: rule.targetUrl }
                });
            } catch (err) {
                console.warn('[AnRu Notifier] Push notification trigger error:', err);
            }
        }

        // 2. Dispatch In-App Banner (Interactive fallback / in-app delight)
        showInAppBanner(rule);
    }

    function showInAppBanner(rule) {
        if (document.getElementById('anru-inapp-banner')) return;

        const bannerHtml = `
            <div id="anru-inapp-banner" onclick="window.location.href='${rule.targetUrl}'" style="position:fixed; top:20px; left:50%; transform:translateX(-50%); width:92%; max-width:420px; background:linear-gradient(135deg, rgba(20,12,48,0.97), rgba(35,16,70,0.97)); border:1px solid rgba(168,85,247,0.5); box-shadow:0 15px 40px rgba(0,0,0,0.85), 0 0 20px rgba(168,85,247,0.4); border-radius:18px; padding:14px 18px; z-index:999999; backdrop-filter:blur(15px); cursor:pointer; animation:slideInTop 0.4s ease;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <img src="${rule.icon}" style="width:36px; height:36px; object-fit:contain; flex-shrink:0;">
                    <div style="flex:1;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <h4 style="margin:0; color:#fff; font-size:13px; font-weight:800; letter-spacing:0.3px;">${rule.title}</h4>
                            <span onclick="event.stopPropagation(); document.getElementById('anru-inapp-banner').remove();" style="color:#94a3b8; font-size:16px; padding:0 4px; cursor:pointer;">&times;</span>
                        </div>
                        <p style="margin:4px 0 0; color:#cbd5e1; font-size:12px; line-height:1.4;">${rule.body}</p>
                    </div>
                </div>
            </div>
            <style>
                @keyframes slideInTop {
                    from { opacity:0; transform:translate(-50%, -40px); }
                    to { opacity:1; transform:translate(-50%, 0); }
                }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', bannerHtml);

        // Auto remove banner after 9 seconds
        setTimeout(() => {
            const el = document.getElementById('anru-inapp-banner');
            if (el) {
                el.style.opacity = '0';
                el.style.transition = 'opacity 0.5s ease';
                setTimeout(() => el.remove(), 500);
            }
        }, 9000);
    }

    function showInAppToast(msg, type = "info") {
        const toast = document.createElement('div');
        toast.style.cssText = "position:fixed; bottom:25px; left:50%; transform:translateX(-50%); background:rgba(18,12,38,0.95); border:1px solid #a855f7; color:#fff; padding:12px 24px; border-radius:30px; font-weight:700; font-size:13px; box-shadow:0 10px 30px rgba(0,0,0,0.8); z-index:999999; backdrop-filter:blur(10px); animation:fadeIn 0.3s ease;";
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    function startSmartScheduler() {
        if (smartCheckInterval) clearInterval(smartCheckInterval);
        
        // Initial check after 5 seconds of app launch
        setTimeout(() => {
            const rule = evaluateSmartRules();
            if (rule) triggerSmartNotification(rule);
        }, 5000);

        // Periodic check every 15 minutes
        smartCheckInterval = setInterval(() => {
            const rule = evaluateSmartRules();
            if (rule) triggerSmartNotification(rule);
        }, 15 * 60 * 1000);
    }

    // ================= 4. PUBLIC API =================

    window.AnruNotifier = {
        init: initNotifier,
        updateTimerNotification: updateTimerNotification,
        clearTimerNotification: clearTimerNotification,
        showSessionCompleted: showSessionCompletedNotification,
        triggerRuleCheck: () => {
            const rule = evaluateSmartRules();
            if (rule) triggerSmartNotification(rule);
            return rule;
        }
    };

    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNotifier);
    } else {
        initNotifier();
    }

})(window);
