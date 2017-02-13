(function () {
  let api = {};

  const sendMessage = (msg) => {
    const message = Object.assign(
      { player: 'pandora' },
      msg);
    chrome.runtime.sendMessage(message);
  }

  const onInit = () => {
    const playbackControl = document.querySelector('.region-bottomBar');
    // const playButton = playbackControl.querySelector('.PlayButton');
    // const pauseButton = playbackControl.querySelector('.PlayButton');
    const thumbDownButton = playbackControl.querySelector('.ThumbDownButton');
    const thumbUpButton = playbackControl.querySelector('.ThumbUpButton');
    const skipButton = playbackControl.querySelector('.SkipButton');

    const click = (el) => el.click();
    const isPlaying = () => playbackControl.querySelector('.PlayButton').dataset.qa === 'play_button';
    const play = () => {
      click(playbackControl.querySelector('.PlayButton'));
      sendMessage({ status: { playing: true } });
    };
    const pause = () => {
      click(playbackControl.querySelector('.PlayButton'));
      sendMessage({ status: { playing: false } });

    };
    const thumbDown = () => click(thumbDownButton);
    const thumbUp = () => click(thumbUpButton);
    const skip = () => click(skipButton);

    api.isPlaying = isPlaying;
    api.play = play;
    api.pause = pause;
    api.thumbDown = thumbDown;
    api.thumbUp = thumbUp;
    api.skip = skip;

    setInterval(() => {
      sendMessage({ status: { playing: isPlaying() } });
    }, 5000);
  };

  let startupInterval = setInterval(() => {
    let playerBar = document.querySelector('.region-bottomBar');
    if (playerBar) {
      clearInterval(startupInterval);
      onInit();
      window.ext = api;
    }
  }, 200);

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.player === 'pandora') {
        switch (request.action) {
          case 'playpause': api.isPlaying() ? api.pause() : api.play();
            break;
          case 'thumbDown': api.thumbDown();
            break;
          case 'thumbUp': api.thumbUp();
            break;
          case 'skip': api.skip();
            break;
          case 'play': api.play();
            break;
          case 'pause': api.pause();
            break;
          case 'status':
            sendResponse({ status: { playing: api.isPlaying() } });
        }
      }
    });
})();