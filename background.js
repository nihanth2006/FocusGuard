// Store the study mode state
let studyMode = {
  isActive: false,
  studyTabId: null,
  studyTabTitle: null,
  currentTabId: null
};

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  if (request.action === 'startStudy') {
    studyMode.isActive = true;
    studyMode.studyTabId = request.studyTabId;
    studyMode.studyTabTitle = request.studyTabTitle;
    studyMode.currentTabId = request.studyTabId;
    
    console.log('Study Mode Started:', {
      studyTabId: studyMode.studyTabId,
      studyTabTitle: studyMode.studyTabTitle
    });
    
    sendResponse({ success: true });
  }
  
  if (request.action === 'stopStudy') {
    const previousStudyTabId = studyMode.studyTabId;
    studyMode.isActive = false;
    studyMode.studyTabId = null;
    studyMode.studyTabTitle = null;
    
    // Remove blur from all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(
          tab.id,
          { action: 'stopStudy' },
          () => {
            // Ignore errors for tabs that can't receive messages
            chrome.runtime.lastError;
          }
        );
      });
    });
    
    console.log('Study Mode Stopped');
    sendResponse({ success: true });
  }
  
  if (request.action === 'getStatus') {
    sendResponse({
      isStudyMode: studyMode.isActive,
      studyTabId: studyMode.studyTabId,
      studyTabTitle: studyMode.studyTabTitle
    });
  }
});

// Listen for tab activation to detect when user switches tabs
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (!studyMode.isActive) {
    return; // Study mode is off, do nothing
  }

  const switchedTabId = activeInfo.tabId;
  studyMode.currentTabId = switchedTabId;

  // If user switches to a different tab (not the study tab)
  if (switchedTabId !== studyMode.studyTabId) {
    console.log('Distraction detected! Switched to tab:', switchedTabId);
    
    // Show blur and warning on the switched-to tab
    chrome.tabs.sendMessage(
      switchedTabId,
      { action: 'showDistraction' },
      () => {
        // Ignore errors for tabs that can't receive messages
        chrome.runtime.lastError;
      }
    );
  } else {
    console.log('Returned to study tab:', switchedTabId);
    
    // Remove blur when returning to study tab
    chrome.tabs.sendMessage(
      switchedTabId,
      { action: 'removeDistraction' },
      () => {
        // Ignore errors
        chrome.runtime.lastError;
      }
    );
  }
});

// Listen for new tab creation
chrome.tabs.onCreated.addListener((tab) => {
  if (!studyMode.isActive) {
    return; // Study mode is off, do nothing
  }

  // If a new tab is created and it's not the study tab
  if (tab.id !== studyMode.studyTabId) {
    console.log('Distraction detected! New tab created:', tab.id);
    
    // Show blur and warning on the new tab once it's loaded
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        chrome.tabs.sendMessage(
          tabId,
          { action: 'showDistraction' },
          () => {
            // Ignore errors
            chrome.runtime.lastError;
          }
        );
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  }
});

// Handle navigation within study tab (user navigates to new page in study tab)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (studyMode.isActive && tabId === studyMode.studyTabId && changeInfo.status === 'loading') {
    // Update title when study tab navigates
    studyMode.studyTabTitle = tab.title;
  }
  
  // Handle navigation in non-study tabs
  if (studyMode.isActive && tabId !== studyMode.studyTabId && changeInfo.url) {
    console.log('Distraction detected! Navigation in tab:', tabId, 'to:', changeInfo.url);
    
    // Show blur and warning on the navigated tab
    chrome.tabs.sendMessage(
      tabId,
      { action: 'showDistraction' },
      () => {
        // Ignore errors
        chrome.runtime.lastError;
      }
    );
  }
});