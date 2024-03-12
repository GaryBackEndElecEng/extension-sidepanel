const menuitem = {
  id: "define_",
  title: "Define",
  contexts: ["selection"],
};
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create(menuitem);
});

chrome.contextMenus.onClicked.addListener((select, tab) => {
  //if selected
  let url = "http://something";
  if (select.selectionText) {
    let entry = { url: "", word: "" };
    let wordContexts = [];
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (tabs[0].url) {
        url = tabs[0].url;
        // console.log("url", url);//works
      }
    });
    //SAVING WORD(S)
    chrome.storage.sync.get(["wordContexts"]).then((res) => {
      if (res && res.wordContexts) {
        // if exists
        wordContexts = res.wordContexts;
      } else {
        chrome.storage.sync.remove("wordContexts");
      }
      if (isEmail(select.selectionText)) {
        //store email
        const storeEmail = isEmail(select.selectionText);
        entry = { url: url, word: undefined, email: storeEmail };
      } else {
        entry = { url: url, word: select.selectionText, email: undefined };
      }
      wordContexts.push(entry);
      chrome.storage.sync.set({ wordContexts: wordContexts });
      let qty = wordContexts.length;
      chrome.action.setBadgeText({
        text: qty.toString(),
      });
      //execute Wiki
      openWiki(select.selectionText);
    });
  }
  //open side panel
  chrome.sidePanel.open({ tabId: tab.id });
});

function get_url() {
  let url = "";

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    url = tabs[0].url;
  });
  return url;
}
function openWiki(selected) {
  if (selected && selected.split(" ").length < 2 && !isEmail(selected)) {
    let wiki = "https://en.wikipedia.org/wiki/";
    let wikiUrl = wiki + fixedEncodeURI(selected);
    let popUpParam = {
      url: wikiUrl,
      type: "popup",
      top: 5,
      left: 5,
    };

    chrome.windows.create(popUpParam);
  }
}
function fixedEncodeURI(str) {
  return encodeURI(str).replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function isEmail(word) {
  let pattern = /[a-zA-Z]{3,}\w@[a-z0-9]{2,}\.[a-z]{2,3}/;
  const check = pattern.exec(word);
  if (check) return check[0];
}
chrome.runtime.onMessage.addListener((request, sender, sendRequest) => {
  if (request.query === "currentTime") {
    let req = new XMLHttpRequest();
    req.onLoad = () => {
      sendResponse({ currentTime: req.responseText });
    };
    req.open("GET", "http://www.timeapi.org/utc/now", true);
    req.send();
    return true;
  }
});
