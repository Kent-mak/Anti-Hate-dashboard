// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .then(() => console.log('Side panel behavior set to open on action click.'))
  .catch((error) => console.error('Error setting side panel behavior:', error));

// Listen for tab updates and enable the side panel for updated tabs
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  try {
    if (!tab.url) return;

    const url = new URL(tab.url);
    console.log(`Tab updated: ${url.href}`);

    await chrome.sidePanel.setOptions({
      tabId,
      path: 'sidepanel.html',
      enabled: true
    });

    console.log(`Side panel enabled for tab: ${tabId}`);
  } catch (error) {
    console.error('Error enabling side panel for tab:', error);
  }
});


