$(document).ready(function () {
  chrome.storage.sync.get(["wordContexts"]).then((res) => {
    // console.log("res", res);
    if (res.wordContexts) {
      updateList(res.wordContexts);
      create_deleteItems(res.wordContexts);
    }
  });
});

chrome.storage.sync.onChanged.addListener((changes) => {
  const wordContexts = changes.wordContexts;
  if (!(wordContexts && wordContexts.newValue)) return;
  const wordContextParse = wordContexts;
  const newEntries = wordContextParse.newValue;
  // console.log("newEntreies", newEntries);
  addToList(newEntries[newEntries.length - 1]);
  add_deleteItem(newEntries);
});

function updateList(wordContexts) {
  const parent = document.getElementById("sidelist");
  if (wordContexts && wordContexts.length > 0) {
    wordContexts.forEach((word, index) => {
      const div_ = document.createElement("div");
      if (word.word) {
        div_.innerHTML = `
        <ul><li>url:<a href=${word.url}>${word.url.slice(
          0,
          20
        )}</a></li> <li>word(s):${word.word}</li>
        </ul>`;
      } else if (word.email) {
        div_.innerHTML = `
        <ul><li>url:<a href=${word.url}>${word.url.slice(
          0,
          20
        )}</a></li> <li>email:${word.email}</li>
        </ul>`;
      }

      div_.style =
        "d-flex flex-column justify-content-center align-items-center gap-1";
      div_.className = "child";
      parent.appendChild(div_);
    });
  } else {
    const getChildren = document.querySelectorAll("div.child");
    getChildren.forEach((ele, index) => {
      parent.removeChild(ele);
    });
  }
}

function addToList(word) {
  const parent = document.getElementById("sidelist");
  if (word) {
    const div_ = document.createElement("div");
    if (word.word) {
      div_.innerHTML = `<li>url:<a href=${word.url}>${word.url.slice(
        0,
        20
      )}</a></li> <li>word(s):${word.word}</li>`;
    } else if (word.email) {
      div_.innerHTML = `<li>url:<a href=${word.url}>${word.url.slice(
        0,
        20
      )}</a></li> <li>email:${word.email}</li>`;
    }
    div_.style =
      "d-flex flex-column justify-content-center align-items-center gap-1";
    div_.className = "child";
    parent.appendChild(div_);
  } else {
    const getChildren = document.querySelectorAll("div.child");
    getChildren.forEach((ele, index) => {
      parent.removeChild(ele);
    });
  }
}

function resetMemory() {
  const clearMemory = document.getElementById("clearMemory");
  clearMemory.addEventListener("click", (e) => {
    if (e) {
      chrome.storage.sync.remove("wordContexts");
      updateList();
    }
  });
}
resetMemory();

function create_deleteItems(wordContexts) {
  let wdContexts = wordContexts;
  const parent = document.getElementById("sidelist");
  const ul_items = document.querySelectorAll("div#sidelist >div");
  ul_items.forEach((ulItem, index) => {
    const input = document.createElement("input");
    input.type = "checkbox";
    const span = document.createElement("span");
    const label = document.createElement("label");
    label.innerHTML = "delete";
    span.style = "text-decoration:underline;text-underline-offset-5;";
    span.className = "form-group text-center text-primary text-underline";
    input.style = "ml-1";
    input.className = "form-control border shadow";
    input.style.width = "5px";
    span.appendChild(label);
    span.appendChild(input);
    ulItem.appendChild(span);
  });
  ul_items.forEach((ul, indx) => {
    const span = ul.querySelector("span");
    const input = span.querySelector("input");
    span.addEventListener("click", (e) => {
      if (e && input.checked) {
        parent.removeChild(ul);
        wdContexts.splice(indx, 1);
        chrome.storage.sync.set({ wordContexts: wdContexts });
      }
    });
  });
}
function add_deleteItem(wordContexts) {
  const wdContexts = wordContexts;
  const parent = document.getElementById("sidelist");
  const ul_items = document.querySelectorAll("div#sidelist >div");

  const input = document.createElement("input");
  input.type = "checkbox";
  const span = document.createElement("span");
  const label = document.createElement("label");
  label.innerHTML = "delete";
  span.style = "text-decoration:underline;text-underline-offset-5;";
  span.className = "form-group text-center text-primary text-underline";
  input.style = "ml-1";
  input.className = "form-control border shadow";
  input.style.width = "5px";
  span.appendChild(label);
  span.appendChild(input);
  ul_items[ul_items.length - 1].appendChild(span);

  if (wdContexts) {
    ul_items.forEach((ul, indx) => {
      const span = ul.querySelector("span");
      const input = span.querySelector("input");
      span.addEventListener("click", (e) => {
        if (e && input.checked && indx === ul_items.length - 1) {
          parent.removeChild(ul_items[ul_items.length - 1]);
          wdContexts.splice(indx, 1);
          chrome.storage.sync.set({ wordContexts: wdContexts });
        }
      });
    });
  }
}

$("#saveCsv").click((e) => {
  if (e) {
    e.preventDefault();
    downLoadFile();
  }
});

function downLoadFile() {
  const date = new Date().toString();
  let fileContext = "";
  const fileName = `${date}.csv`;
  window.URL = window.webkitURL || window.URL;
  chrome.storage.sync.get(["wordContexts"]).then((res) => {
    if (res) {
      let fileContext = res.wordContexts;
      //converting it to csv format
      fileContext = res.wordContexts.map((wordJson, index) => {
        if (!wordJson) return null;
        if (index === 0) {
          return `url,word(s),email\n`;
        }
        let CSV = `${wordJson.url},${wordJson.word}-${wordJson.email}\n`;
        return CSV;
      });
      let a = document.createElement("a");
      a.display = "none";
      a.target = "_blank";
      const blob = new Blob(fileContext, { type: "application/*" });
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
    }
  });
}
//NOT USED
function getTime(city) {
  let dateTime = {
    abbreviation: "",
    client_ip: "",
    datetime: "",
    day_of_week: 0,
    day_of_year: 0,
    timezone: "America/Toronto",
    utc_datetime: "",
    week_number: 0,
  };
  let req = new XMLHttpRequest();

  req.onLoad = () => {
    //done
    dateTime = req.response;
    showTime(req.response);
  };
  req.open("GET", `http://worldtimeapi.org/api/timezone/America/${city}`, true);
  req.send();

  return dateTime;
}

function showTime(dateTime) {
  const div = document.createElement("div");
  div.innerHTML = JSON.stringify(dateTime);
  document.getElementById("showTime").appendChild(div);
}

$(document).ready(function () {
  $("#openSidebar").click((e) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      chrome.sidePanel.open({ tabId: tabs[0].id });
    });
  });
});
class FontClass {
  fontStyles = [
    "standard",
    "sansserif",
    "serif",
    "fixed",
    "cursive",
    "fantasy",
    "math",
  ];
  targetArr = [
    "p",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "div",
    "img",
    "section",
    "article",
    "span",
    "small",
    "body",
  ];

  classNames = [
    {
      key: "remove",
      value: [
        { boxShadow: "" },
        { boxShadow: "" },
        { borderRadius: "" },
        { margin: "auto" },
        { padding: "auto" },
        { border: "" },
      ],
      key: "shadow",
      value: [
        { boxShadow: "1px 1px 12 3px rgb(1, 153, 176)" },
        { boxShadow: "-1px -1px 12 3px rgb(1, 183, 176)" },
        { borderRadius: "10px 10px 10px 10px" },
        { margin: "0.25rem" },
        { padding: "0.5rem" },
      ],
    },
    {
      key: "border",
      value: [
        { border: "1px solid grey" },
        { borderRadius: "10px 10px 10px 10px" },
        { margin: "0.25rem" },
        { padding: "0.5rem" },
      ],
    },
    {
      key: "avatar",
      value: [
        { border: "1px solid grey" },
        { borderRadius: "50%" },
        { padding: "0.5rem" },
        { filter: "0 0 0.75rem crimson" },
      ],
    },
  ];
  colors = [
    "black",
    "darkgrey",
    "lightgrey",
    "blue",
    "red",
    "green",
    "orange",
    "violet",
    "white",
  ];
  bg_colors = [
    "white",
    "darkgrey",
    "black",
    "slategray",
    "darkblue",
    "lightred",
    "darkred",
    "darkgreen",
    "orange",
    "darkorange",
    "violet",
    "darkviolet",
  ];
  phrase =
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum deleniti labore perferendis dolores. Suscipit corporis, magni excepturi, voluptates delectus quasi optio perspiciatis eveniet veritatis quae minus magnam fuga ducimus soluta fugiat impedit illo hic molestias aperiam debitis dolore aliquid vitae quibusdam. Exercitationem tempora deleniti possimus quos natus cupiditate, dolores aliquid.";
  isShowing = false;

  constructor() {
    this.classFamily = document.getElementById("classFamily");
    this.classStyle = document.getElementById("classStyle");
    this.divs = document.querySelectorAll("div");
    this.setFont = document.getElementById("setFont");
    this.options = document.querySelectorAll(".option");
    this.targetEle = document.querySelector("select#target");
    this.targetClassName = document.querySelector("select#className");
    this.targetColor = document.querySelector("select#color");
    this.targetBgColor = document.querySelector("select#bg_color");
    this.sampleFont = document.getElementById("sampleFont");
    this.checkSampleFont = document.getElementById("checkSampleFont");
    this.selItem = {
      fontStyle: this.classStyle.value,
      fontFamily: this.classFamily.value,
      target: this.targetEle.value,
      color: this.targetColor.value,
      bg_color: this.targetBgColor.value,
      className: this.targetClassName.value,
    };
  }

  create_build_Options() {
    chrome.fontSettings.getFontList().then((fontFamily) => {
      let familyList = fontFamily.map((font) => font);
      this.buildOptions(familyList);
      this.buildTarget();
      this.selectFontFamily();
      this.sendTarget();
      this.sample_font();
    });
  }

  buildOptions(familyList) {
    if (familyList.length > 0) {
      familyList.forEach((font, index) => {
        const option_fam = document.createElement("option");
        option_fam.type = "text";
        option_fam.value = font.fontId;
        option_fam.innerHTML = font.fontId;
        option_fam.className = "text-sm lean fontItem text-center";
        this.classFamily.appendChild(option_fam);
      });
    }
    if (this.fontStyles && this.fontStyles.length) {
      this.fontStyles.forEach((style, index) => {
        const option_style = document.createElement("option");
        option_style.type = "text";
        option_style.value = style;
        option_style.innerHTML = style;
        option_style.className = "text-sm lean fontItem text-center";
        this.classStyle.appendChild(option_style);
      });
    }
  }

  selectFontFamily() {
    this.selItem.fontFamily = this.classFamily.value;
    this.selItem.fontStyle = this.classStyle.value;
    this.setFont.addEventListener("click", (e) => {
      if (e) {
        this.selItem = {
          fontFamily: this.classFamily.value,
          fontStyle: this.classStyle.value,
        };
        this.divs.forEach((div) => {
          const check = div.querySelector("aside") ? true : false;

          if (!check) {
            div.style.fontFamily = `${this.selItem.fontFamily}, ${this.selItem.fontStyle}`;
          } else {
            div.querySelector("aside").style.fontFamily = "Century, cursive";
          }
        });
      }
    });
  }
  buildTarget() {
    //Target element
    if (this.targetArr.length > 0) {
      this.targetArr.forEach((targ, index) => {
        const target = document.createElement("option");
        target.type = "text";
        target.value = targ;
        target.innerHTML = targ;
        target.className = "text-sm lean fontItem text-center border";
        this.targetEle.appendChild(target);
      });
    }
    if (this.classNames.length > 0) {
      this.classNames.forEach((class_, index) => {
        const classOption = document.createElement("option");
        classOption.type = "text";
        classOption.value = JSON.stringify(class_.value);
        classOption.innerHTML = class_.key;
        classOption.className = "text-sm lean fontItem text-center border";
        this.targetClassName.appendChild(classOption);
      });
    }
    if (this.colors.length > 0) {
      this.colors.forEach((color, index) => {
        const colorOption = document.createElement("option");
        colorOption.type = "text";
        colorOption.value = color;
        colorOption.innerHTML = color;
        colorOption.className = "text-sm lean fontItem text-center border";
        this.targetColor.appendChild(colorOption);
      });
    }
    if (this.bg_colors.length > 0) {
      this.bg_colors.forEach((bgcolor, index) => {
        const bg_colorOption = document.createElement("option");
        bg_colorOption.type = "text";
        bg_colorOption.value = bgcolor;
        bg_colorOption.innerHTML = bgcolor;
        bg_colorOption.className = "text-sm lean fontItem text-center border";
        this.targetBgColor.appendChild(bg_colorOption);
      });
    }
  }
  sendTarget() {
    this.selItem = {
      fontStyle: this.classStyle.value,
      fontFamily: this.classFamily.value,
      target: this.targetEle.value,
      color: this.targetColor.value,
      bg_color: this.targetBgColor.value,
      className: this.targetClassName.value,
    };
    this.setFont.addEventListener("click", (e) => {
      if (e) {
        chrome.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
              task: "changeFontFamily",
              fontFamily: {
                fontFamily: this.classFamily.value,
                fontStyle: this.classStyle.value,
                target: this.targetEle.value,
                color: this.targetColor.value,
                bg_color: this.targetBgColor.value,
                className: this.targetClassName.value,
              },
            });
          });
      }
    });
  }
  sample_font() {
    this.sampleFont.style.display = "none";
    this.checkSampleFont.addEventListener("click", (e) => {
      if (e) {
        this.isShowing = true;
        this.selItem = {
          fontStyle: this.classStyle.value,
          fontFamily: this.classFamily.value,
          target: this.targetEle.value,
          color: this.targetColor.value,
          bg_color: this.targetBgColor.value,
          className: this.targetClassName.value,
        };
        console.log(this.selItem);
        this.addPara(this.sampleFont);
      } else {
        this.isShowing = false;
        while (this.sampleFont.firstChild) {
          this.sampleFont.removeChild(this.sampleFont.lastChild);
        }
        this.sampleFont.style.display = "none";
      }
    });
  }
  addPara(element) {
    //erasing all children

    while (element.firstChild) {
      element.removeChild(element.lastChild);
    }
    //Creating Para
    const childP = document.createElement("p");
    childP.innerHTML = this.phrase;
    childP.id = "childP";
    childP.style.cssText = this.generateCssText(this.selItem);
    console.log(childP.style);
    element.appendChild(childP);
    //creating Event to close childP
    element.style.cursor = "pointer";
    element.classList.add("sampleFont");
    element.style.display = "block";
    element.addEventListener("click", (e) => {
      if (e) {
        while (element.firstChild) {
          element.removeChild(element.lastChild);
        }
        element.style.display = "none";
        element.classList.remove("sampleFont");
      }
    });
  }
  generateCssText(selItem) {
    let cssText = "";
    JSON.parse(selItem.className).forEach((style) => {
      let key = Object.keys(style)[0];
      let value = Object.values(style)[0];
      cssText += `${key}:${value};`;
    });
    cssText += `font-family:${selItem.fontFamily}, ${selItem.fontStyle};color:${selItem.color};background:${selItem.bg_color}`;
    return cssText;
  }
}
const newClass = new FontClass();
newClass.create_build_Options();
