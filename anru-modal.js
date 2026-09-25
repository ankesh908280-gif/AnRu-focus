/* ==========================================================================
   AnRu Focus - Apple-Style Frosted Glassmorphism Modal Controller
   ========================================================================== */

(function(window) {
    'use strict';

    let modalOverlay = null;

    function ensureModalDOM() {
        if (modalOverlay) return modalOverlay;

        modalOverlay = document.getElementById('anruModalOverlay');
        if (!modalOverlay) {
            modalOverlay = document.createElement('div');
            modalOverlay.id = 'anruModalOverlay';
            modalOverlay.className = 'anru-modal-overlay';
            modalOverlay.innerHTML = `
                <div class="anru-modal-card" id="anruModalCard">
                    <div class="anru-modal-icon-badge purple" id="anruModalIcon"><i class="fa-solid fa-bell"></i></div>
                    <h3 class="anru-modal-title" id="anruModalTitle">Notification</h3>
                    <p class="anru-modal-msg" id="anruModalMsg">Message details here...</p>
                    <div id="anruModalInputArea" style="display:none; width:100%;"></div>
                    <div class="anru-modal-btns" id="anruModalBtns"></div>
                </div>
            `;
            document.body.appendChild(modalOverlay);
        }
        return modalOverlay;
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        if (navigator.vibrate) navigator.vibrate(30);
    }

    function openModal() {
        ensureModalDOM();
        modalOverlay.classList.add('active');
        if (navigator.vibrate) navigator.vibrate(40);
    }

    window.AnruModal = {
        alert: function(options) {
            const {
                title = "Alert",
                message = "",
                icon = "fa-circle-info",
                badgeClass = "purple",
                confirmText = "OK",
                onConfirm = null
            } = options;

            ensureModalDOM();
            document.getElementById('anruModalIcon').className = `anru-modal-icon-badge ${badgeClass}`;
            document.getElementById('anruModalIcon').innerHTML = `<i class="fa-solid ${icon}"></i>`;
            document.getElementById('anruModalTitle').textContent = title;
            document.getElementById('anruModalMsg').textContent = message;
            document.getElementById('anruModalInputArea').style.display = 'none';

            const btns = document.getElementById('anruModalBtns');
            btns.innerHTML = `
                <button class="anru-modal-btn anru-modal-btn-confirm" id="anruAlertConfirm">${confirmText}</button>
            `;

            document.getElementById('anruAlertConfirm').onclick = function() {
                closeModal();
                if (typeof onConfirm === 'function') onConfirm();
            };

            openModal();
        },

        confirm: function(options) {
            const {
                title = "Are you sure?",
                message = "",
                icon = "fa-circle-question",
                badgeClass = "warn",
                confirmText = "Confirm",
                cancelText = "Cancel",
                isDanger = false,
                onConfirm = null,
                onCancel = null
            } = options;

            ensureModalDOM();
            document.getElementById('anruModalIcon').className = `anru-modal-icon-badge ${isDanger ? 'danger' : badgeClass}`;
            document.getElementById('anruModalIcon').innerHTML = `<i class="fa-solid ${icon}"></i>`;
            document.getElementById('anruModalTitle').textContent = title;
            document.getElementById('anruModalMsg').textContent = message;
            document.getElementById('anruModalInputArea').style.display = 'none';

            const confirmBtnClass = isDanger ? 'anru-modal-btn-danger' : 'anru-modal-btn-confirm';
            const btns = document.getElementById('anruModalBtns');
            btns.innerHTML = `
                <button class="anru-modal-btn anru-modal-btn-cancel" id="anruConfirmCancel">${cancelText}</button>
                <button class="anru-modal-btn ${confirmBtnClass}" id="anruConfirmOk">${confirmText}</button>
            `;

            document.getElementById('anruConfirmCancel').onclick = function() {
                closeModal();
                if (typeof onCancel === 'function') onCancel();
            };

            document.getElementById('anruConfirmOk').onclick = function() {
                closeModal();
                if (typeof onConfirm === 'function') onConfirm();
            };

            openModal();
        },

        prompt: function(options) {
            const {
                title = "Enter Value",
                message = "",
                icon = "fa-pen-to-square",
                badgeClass = "purple",
                placeholder = "",
                defaultValue = "",
                inputType = "number",
                chips = [],
                confirmText = "Set",
                cancelText = "Cancel",
                onConfirm = null,
                onCancel = null
            } = options;

            ensureModalDOM();
            document.getElementById('anruModalIcon').className = `anru-modal-icon-badge ${badgeClass}`;
            document.getElementById('anruModalIcon').innerHTML = `<i class="fa-solid ${icon}"></i>`;
            document.getElementById('anruModalTitle').textContent = title;
            document.getElementById('anruModalMsg').textContent = message;

            const inputArea = document.getElementById('anruModalInputArea');
            inputArea.style.display = 'block';

            let chipsHtml = '';
            if (chips && chips.length > 0) {
                chipsHtml = `<div class="anru-modal-chips-row">` +
                    chips.map(c => `<div class="anru-modal-chip" data-val="${c}">${c}m</div>`).join('') +
                    `</div>`;
            }

            inputArea.innerHTML = `
                <input class="anru-modal-input" id="anruModalInput" type="${inputType}" placeholder="${placeholder}" value="${defaultValue}">
                ${chipsHtml}
            `;

            const inputEl = document.getElementById('anruModalInput');
            inputArea.querySelectorAll('.anru-modal-chip').forEach(chip => {
                chip.onclick = function() {
                    inputArea.querySelectorAll('.anru-modal-chip').forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    inputEl.value = chip.getAttribute('data-val');
                };
            });

            const btns = document.getElementById('anruModalBtns');
            btns.innerHTML = `
                <button class="anru-modal-btn anru-modal-btn-cancel" id="anruPromptCancel">${cancelText}</button>
                <button class="anru-modal-btn anru-modal-btn-confirm" id="anruPromptOk">${confirmText}</button>
            `;

            document.getElementById('anruPromptCancel').onclick = function() {
                closeModal();
                if (typeof onCancel === 'function') onCancel();
            };

            document.getElementById('anruPromptOk').onclick = function() {
                const val = inputEl.value.trim();
                closeModal();
                if (typeof onConfirm === 'function') onConfirm(val);
            };

            openModal();
            setTimeout(() => { if (inputEl) inputEl.focus(); }, 150);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureModalDOM);
    } else {
        ensureModalDOM();
    }

})(window);
