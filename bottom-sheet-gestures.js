/* ==========================================================================
   📱 AnRu Focus Pro - iOS 18 Bottom Sheet Swipe-Down-To-Dismiss Controller
   Smooth gesture physics, drag handle tracking & background scroll lock
   ========================================================================== */

(function() {
  'use strict';

  function lockBodyScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  function unlockBodyScroll() {
    const hasOpenModal = document.querySelector('.modal-overlay.open, .anru-modal-overlay.active, .modal-overlay[style*="display: flex"]');
    if (!hasOpenModal) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }

  function closeModalElement(overlay) {
    if (!overlay) return;
    
    if (overlay.id === 'anruModalOverlay' && window.AnruModal) {
      window.AnruModal.close();
    } else {
      overlay.classList.remove('open');
      overlay.style.display = 'none';
      if (typeof closeModal === 'function' && overlay.id === 'modalOverlay') {
        closeModal();
      }
    }
    unlockBodyScroll();
  }

  function attachGesturesToSheet(box, overlay) {
    if (!box || box._swipeGestureInit) return;
    box._swipeGestureInit = true;

    // Ensure drag handle exists
    if (!box.querySelector('.ios-sheet-handle')) {
      const handle = document.createElement('div');
      handle.className = 'ios-sheet-handle';
      handle.style.cssText = 'width: 40px; height: 5px; background: rgba(255, 255, 255, 0.35); border-radius: 4px; margin: 0 auto 14px; cursor: grab; flex-shrink: 0;';
      box.insertBefore(handle, box.firstChild);
    }

    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let startScrollTop = 0;

    box.addEventListener('touchstart', function(e) {
      if (e.touches.length !== 1) return;
      startY = e.touches[0].clientY;
      currentY = startY;
      startScrollTop = box.scrollTop;
      isDragging = false;
    }, { passive: true });

    box.addEventListener('touchmove', function(e) {
      if (e.touches.length !== 1) return;
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      // When at the top of the sheet and dragging down
      if (box.scrollTop <= 0 && deltaY > 0) {
        isDragging = true;
        if (e.cancelable) e.preventDefault();
        box.style.transition = 'none';
        box.style.transform = 'translateY(' + deltaY + 'px)';
      }
    }, { passive: false });

    box.addEventListener('touchend', function(e) {
      if (!isDragging) return;
      const deltaY = currentY - startY;
      box.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';

      if (deltaY > 80) {
        // Swiped down enough: dismiss
        box.style.transform = 'translateY(100%)';
        setTimeout(function() {
          box.style.transform = '';
          box.style.transition = '';
          closeModalElement(overlay);
        }, 220);
      } else {
        // Snap back up
        box.style.transform = 'translateY(0)';
        setTimeout(function() {
          box.style.transform = '';
          box.style.transition = '';
        }, 260);
      }
      isDragging = false;
    }, { passive: true });

    // Tap on backdrop to dismiss
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeModalElement(overlay);
      }
    });
  }

  function scanAndInitSheets() {
    const overlays = document.querySelectorAll('.modal-overlay, .anru-modal-overlay');
    overlays.forEach(function(ov) {
      const box = ov.querySelector('.modal-box, .anru-modal-card');
      if (box) {
        attachGesturesToSheet(box, ov);
      }
    });

    // Check if any modal is currently open and lock background scroll
    const openModal = document.querySelector('.modal-overlay.open, .anru-modal-overlay.active');
    if (openModal) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  }

  // Observe DOM for modal openings
  const observer = new MutationObserver(function(mutations) {
    scanAndInitSheets();
  });

  document.addEventListener('DOMContentLoaded', function() {
    scanAndInitSheets();
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class', 'style'] });
  });

  window.initBottomSheetGestures = scanAndInitSheets;
})();
