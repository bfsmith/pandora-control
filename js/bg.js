const players = {
  pandora: {
    player: "pandora",
    urlMatch: "*://*.pandora.com/*",
    url: "https://www.pandora.com/",
    tabId: undefined,
  }
};

const browserControl = chrome || browser;

const getTabId = (player) => {
  if (player === undefined) {
    return Promise.reject("Unknown player");
  }
  if (player.tabId !== undefined) {
    return Promise.resolve(player.tabId);
  }
  return new Promise((resolve, reject) => {
    browserControl.tabs.query({ url: player.urlMatch }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        player.tabId = undefined;
      } else {
        player.tabId = tabs[0].id;
      }
      resolve(player.tabId);
    });
  });
}

const sendMessage = (player, action) => {
  return getTabId(players[player])
    .then((id) => {
      if (id !== undefined) {
        return new Promise((resolve) => {
          browserControl.tabs.sendMessage(id, { player: player, action: action }, function (response) {
            resolve(response);
          });
        });
      } else {
        throw new Error("Pandora tab not open");
      }
    });
}
const changeIcon = (status) => {
  if (status.playing !== undefined) {
    if (status.playing) {
      browserControl.browserAction.setIcon({ path: "img/pause.png" });
    } else {
      browserControl.browserAction.setIcon({ path: "img/play.png" });
    }
  } else {
    browserControl.browserAction.setIcon({ path: "img/icon.png" });
  }
}
const startOrPlayPause = (player) => {
  browserControl.tabs.query({ url: player.urlMatch }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      chrome.tabs.create({ url: player.url, active: false, pinned: true }, (tab) => {
        player.tabId = tab.id;
      });
    } else {
      sendMessage(player.player, 'playpause').catch(console.log.bind(console));
    }
  });
}

browserControl.browserAction.onClicked.addListener(() => {
  startOrPlayPause(players.pandora);
});

browserControl.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.status) {
    changeIcon(request.status);
  }
});

browserControl.tabs.onRemoved.addListener((tabId) => {
  const player = Object.keys(players)
    .map(k => players[k])
    .find(p => p.tabId == tabId);
  if (player) {
    changeIcon({});
  }
});

browserControl.commands.onCommand.addListener(command => {
  let [player, action] = command.split('-');
  sendMessage(player, action).catch(console.log.bind(console));
});