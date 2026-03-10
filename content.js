// Create and inject blur overlay and warning message
function createBlurOverlay() {
  if (document.getElementById('focusguard-blur-overlay')) {
    return; // Already exists
  }

  // Speak the distraction message
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance("You are distracted");
    speechSynthesis.speak(utterance);
  }

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.id = 'focusguard-blur-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  `;

  // Create warning message
  const message = document.createElement('div');
  message.style.cssText = `
    background-color: #ff6b6b;
    color: white;
    padding: 30px 40px;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    animation: slideIn 0.4s ease-out;
  `;
  message.innerHTML = `
    <div style="font-size: 40px; margin-bottom: 10px;">⚠️</div>
    <div>You are distracted!</div>
    <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">Return to your study tab to continue</div>
  `;

  overlay.appendChild(message);
  document.documentElement.appendChild(overlay);

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateY(-30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

function removeBlurOverlay() {
  const overlay = document.getElementById('focusguard-blur-overlay');
  if (overlay) {
    overlay.remove();
  }
}

// Listen for messages from background service worker
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'showDistraction') {
    createBlurOverlay();
    sendResponse({ received: true });
  }

  if (request.action === 'removeDistraction') {
    removeBlurOverlay();
    sendResponse({ received: true });
  }

  if (request.action === 'stopStudy') {
    removeBlurOverlay();
    sendResponse({ received: true });
  }
});