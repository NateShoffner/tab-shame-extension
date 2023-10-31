var port = null;

connect();

chrome.action.onClicked.addListener(async () => {
  const tabs = await chrome.tabs
    .query({ windowType: "normal" })
    .then((t) => t.length);
  const windows = await chrome.windows.getAll().then((w) => w.length);

  /*
  let message = `You have ${tabs} tab${tabs > 1 ? "s" : ""} open`;

  if (windows > 1) message += ` across ${windows} windows`;

  chrome.notifications.create({
    type: "basic",
    title: "Tabs count",
    message,
    iconUrl: "/icons/icons8-add-tab-96.png",
  });*/

  var chromeVersion = /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1];

  var data = {
    browser: getBrowser(),
    version: chromeVersion,
    tabs: tabs,
    windows: windows,
  };

  if (port == null) connect();

  sendNativeMessage(data);
});

function connect() {
  var hostName = "com.nateshoffner.tab_shame";
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
}

function onNativeMessage(message) {
  console.log(message);
}

function onDisconnected() {
  port = null;
}

function sendNativeMessage(message) {
  port.postMessage(message);
}

function getBrowser() {
  var browser = "unknown";
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    if (isChromium()) {
        browser = "Chromium";
    } else {
            browser = "Chrome";
        }
  } else if (navigator.userAgent.indexOf("Firefox") != -1) {
    browser = "Firefox";
  } else if (navigator.userAgent.indexOf("Edge") != -1) {
    browser = "Edge";
  } else if (navigator.userAgent.indexOf("Opera") != -1) {
    browser = "Opera";
  }
  return browser;
}

function isChromium() {
        try {
          const userBrand = navigator.userAgentData.brands[0].brand;
      
          if (userBrand === 'Google Chrome') {
            return false;
            // User is 100% using Google Chrome
          } else {
            return true;
            // User is maybe using an older
            // version of Google Chrome released in 2021 without support for the 
            //userAgentData or they're using a Chromium browser
          }
        } catch (error) {
          // Since the navigator.userAgentData.brands doesn't exist
          // We need to handle the error. If it doesn't exist, the user is not using 
          //Google Chrome or once again is using an older version of Google Chrome
          return false;
        }
      
  }