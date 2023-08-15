# pandora-control
Chrome extension to control Pandora via keyboard shortcuts.

# Development
Pick the manifest.xyz.json that matches your browser and rename it to manifest.json.

# Package for Firefox
1. `mv manifest.json manifest.json.bak`  
1. Bump the version number in manifest.ff.json
1. `cp manifest.ff.json manifest.json`
1. `zip pandora-control-ff.xpi img/* js/* icon.png LICENSE manifest.json`
1. `rm manifest.json`

# Package for Chrome
```sh
mv manifest.json manifest.json.bak
cp manifest.chrome.json manifest.json
zip pandora-control-chrome.zip img/* js/* icon.png LICENSE manifest.json
mv manifest.json.bak manifest.json
```

# Sign the addon for Firefox to load it as a non-temporary addon
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Distribution
Export the Mozilla API Keys to
  JWT Issuer: `WEB_EXT_API_KEY` and JWT Secret to `WEB_EXT_API_SECRET`.
Run `npm run sign:ff`

PlayPauseFirefox.scpt is an Apple Script that, when triggered, activates Firefox and sends it Command+F12. I've bound Command+Shift+Space to run that script and bound Command+F12 to Pause/Play in the Firefox addon.
