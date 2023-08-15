(function () {
  let api = {};

  const browserControl = chrome || browser;

  const sendMessage = (msg) => {
    const message = Object.assign(
      { player: 'pandora' },
      msg);
    browserControl.runtime.sendMessage(message);
  }

  const onInit = () => {
    const playbackControl = () => document.querySelector('.region-bottomBar');
    const playButton = () => playbackControl().querySelector('.PlayButton');
    // const pauseButton = playbackControl.querySelector('.PlayButton');
    const thumbDownButton = () => playbackControl().querySelector('.ThumbDownButton');
    const thumbUpButton =  () => playbackControl().querySelector('.ThumbUpButton');
    const skipButton = () => playbackControl().querySelector('.SkipButton');
    const keepListeningButton = () => document.querySelector('.StillListeningBody button');

    const click = (el) => {
      if (el) { 
        el.click(); 
      }
    };
    const isPlaying = () => keepListeningButton() == undefined && playButton().dataset.qa === 'play_button';
    const play = () => {
      console.log('play pushed!');
      const keepListening = keepListeningButton();
      console.log('keepListening', keepListening);
      if (keepListening) {
        click(keepListening);
        console.log('tried to click keep listening button');
      } else {
        click(playButton());
        console.log('tried to click play button');
      }
      sendMessage({ status: { playing: true } });
    };
    const pause = () => {
      click(playButton());
      console.log('tried to click pause button');
      sendMessage({ status: { playing: false } });

    };
    const thumbDown = () => click(thumbDownButton());
    const thumbUp = () => click(thumbUpButton());
    const skip = () => click(skipButton());

    api.isPlaying = isPlaying;
    api.play = play;
    api.pause = pause;
    api.thumbDown = thumbDown;
    api.thumbUp = thumbUp;
    api.skip = skip;

    setInterval(() => {
      if (keepListeningButton()) {
        keepListeningButton().click();
      }
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

  browserControl.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log('message received', request);
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
