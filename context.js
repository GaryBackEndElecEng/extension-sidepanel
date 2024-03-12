chrome.runtime.onMessage.addListener((request, sender, res) => {
  if (request.task == "changeFontFamily") {
    const fontFamily = {
      fontId: request.fontFamily.fontId,
      genericFamily: request.fontFamily.genericFamily,
    };
    const getPara = document.querySelector("p");
    const insert = `${fontFamily.fontId} ${fontFamily.genericFamily}`;
    console.log("context recieved", insert);
    $("p").css("fontFamily", insert);
    $("p").css("color", "purple");
  }
});
