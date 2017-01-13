(function () {
  let api = {};

  const sendMessage = (msg) => {
    const message = Object.assign(
      { player: 'pandora' },
      msg);
    chrome.runtime.sendMessage(message);
  }

  const onInit = () => {
    const playbackControl = document.querySelector('#playbackControl');
    const playButton = playbackControl.querySelector('.playButton');
    const pauseButton = playbackControl.querySelector('.pauseButton');
    const thumbDownButton = playbackControl.querySelector('.thumbDownButton');
    const thumbUpButton = playbackControl.querySelector('.thumbUpButton');
    const skipButton = playbackControl.querySelector('.skipButton');

    const click = (el) => el.click();
    const isPlaying = () => playButton.style.display === 'none';
    const play = () => click(playButton);
    const pause = () => click(pauseButton);
    const thumbDown = () => click(thumbDownButton);
    const thumbUp = () => click(thumbUpButton);
    const skip = () => click(skipButton);

    api.isPlaying = isPlaying;
    api.play = play;
    api.pause = pause;
    api.thumbDown = thumbDown;
    api.thumbUp = thumbUp;
    api.skip = skip;

    playButton.addEventListener('click', (event) => {
      sendMessage({ status: { playing: true } });
    });
    pauseButton.addEventListener('click', (event) => {
      sendMessage({ status: { playing: false } });
    });

    setInterval(() => {
      sendMessage({ status: { playing: isPlaying() } });
    }, 5000);
  };

  let startupInterval = setInterval(() => {
    let playerBar = document.querySelector('#playerBar');
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