const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const statusText = document.getElementById('status-text');
const toggleSwitch = document.getElementById('toggleSwitch');

// Check current study mode status when popup opens
chrome.runtime.sendMessage(
  { action: 'getStatus' },
  (response) => {
    if (response && response.isStudyMode) {
      startBtn.disabled = true;
      stopBtn.disabled = false;
      statusText.textContent = 'ON';
      toggleSwitch.checked = true;
    } else {
      startBtn.disabled = false;
      stopBtn.disabled = true;
      statusText.textContent = 'OFF';
      toggleSwitch.checked = false;
    }
  }
);

// Handle Start Study button
startBtn.onclick = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const studyTab = tabs[0];
    
    // Send message to background service worker
    chrome.runtime.sendMessage(
      {
        action: 'startStudy',
        studyTabId: studyTab.id,
        studyTabTitle: studyTab.title
      },
      (response) => {
        if (response && response.success) {
          startBtn.disabled = true;
          stopBtn.disabled = false;
          statusText.textContent = 'ON';
          toggleSwitch.checked = true;
        }
      }
    );
  });
};

// Handle Stop Study button
stopBtn.onclick = function () {
  chrome.runtime.sendMessage(
    { action: 'stopStudy' },
    (response) => {
      if (response && response.success) {
        startBtn.disabled = false;
        stopBtn.disabled = true;
        statusText.textContent = 'OFF';
        toggleSwitch.checked = false;
      }
    }
  );
};

// Handle toggle switch
toggleSwitch.onchange = function () {
  if (this.checked) {
    // Turn on study mode
    startBtn.click();
  } else {
    // Turn off study mode
    stopBtn.click();
  }
};