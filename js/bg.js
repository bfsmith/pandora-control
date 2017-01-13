chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({ url: '*://*.pandora.com/*' }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      chrome.tabs.create({url: 'https://www.pandora.com/', active: false, pinned: true}, (tab) => {
        console.log("Opened tab", tab);
      });
    }
  });
});

chrome.commands.onCommand.addListener(command => {
  let [player, action] = command.split('-');
    // chrome.runtime.sendMessage({ player: player, action: action }, function (response) { console.log(response); });
  chrome.tabs.query({}, (tabs => {
  // chrome.tabs.query({ url: '*://*.pandora.com/*' }, (tabs => {
    tabs.forEach((tab) =>
      chrome.tabs.sendMessage(tab.id, { player: player, action: action }, function (response) {
        console.log(response);
      })
    );
  }));
});