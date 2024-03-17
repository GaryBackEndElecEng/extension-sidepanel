chrome.runtime.onMessage.addListener((request, sender, res) => {
  if (request.task == "changeFontFamily") {
    const fontFamily = {
      fontFamily: request.fontFamily.fontFamily,
      fontStyle: request.fontFamily.fontStyle,
      target: request.fontFamily.target,
      color: request.fontFamily.color,
      bg_color: request.fontFamily.bg_color,
      className: request.fontFamily.className,
    };
    console.log("fontFamily", fontFamily);
    const target = fontFamily.target;
    const insert = `${fontFamily.fontFamily}, ${fontFamily.fontStyle}`;
    // console.log("context recieved", insert);
    $(target).css("fontFamily", insert);
    $(target).css("color", fontFamily.color);
    $(target).css("background", fontFamily.bg_color);
    const classNameArr = JSON.parse(fontFamily.className);
    classNameArr.forEach((style) => {
      $(target).css(style);
    });
  }
});
