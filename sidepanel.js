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
  updateList(newEntries);
  create_deleteItems(newEntries);
});

function updateList(wordContexts) {
  const parent = document.getElementById("sidelist");
  parent.style.cssText = "";
  cleanUp(parent);
  if (wordContexts && wordContexts.length > 0) {
    const adjustHeight = `${wordContexts.length * 26 + 100}px`;
    parent.style.cssText = `overflow-y:scroll;height:${adjustHeight};`;
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
    cleanUp(parent);
  }
}

function cleanUp(parent) {
  const getChildren = document.querySelectorAll("div.child");
  if (getChildren && getChildren.length > 0) {
    getChildren.forEach((ele, index) => {
      parent.removeChild(ele);
    });
  }
}
function addToList(word) {
  const parent = document.getElementById("sidelist");
  const adjustHeight = `${wordContexts.length * 26 + 100}px`;
  parent.style.cssText = `overflow-y:scroll;height:${adjustHeight};`;
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

class FileDownload {
  _items = [];
  _item = {
    url: "",
    word: "",
    email: "",
  };
  fileName = "";

  constructor() {
    this.saveCsv = document.querySelector("button#saveCsv");
    this.downloadContainer = document.querySelector("div#downloadContainer");
  }
  get items() {
    return this._items;
  }
  set items(items) {
    this._items = items;
  }

  onClickDownload() {
    this.saveCsv.addEventListener("click", (e) => {
      if (e) {
        const date = new Date().toString();
        const fileName = `${date}.csv`;
        chrome.storage.sync.get(["wordContexts"]).then((res) => {
          if (res) {
            this.items = res.wordContexts;
            this.showPopup(this.items);
          }
        });
      }
    });
  }
  showPopup(items) {
    if (items.length > 0) {
      const button = document.createElement("button");
      const H6 = document.createElement("h6");
      H6.className = "lean display-6 my-3";
      H6.innerHTML = "your list";
      const container = document.createElement("div");
      this.downloadContainer.style.cssText =
        "position:relative;top:30%;width:100%;height:auto;z-index:0;";
      container.style.cssText =
        "position:absolute;top:110%;left:0;background:black;color:white;height:450px;max-width:350px;padding:1rem;border-radius:inherit;z-index:100;box-shadow:1px 1px 12px 2px lightred;";
      container.className =
        "d-flex flex-column justify-content-center align-items-center gap-1";
      button.id = "btnDownLoad";
      button.style.cssText = "border-radius:inherit;margin-block:2rem;";
      button.className =
        "btn btn-success btn-sm rounded shadow my-2 text-center d-flex align-items-center gap-1 mx-auto";
      button.innerHTML = `<span>d.load</span><img src="./images/arrow-down.svg" alt="arrow"  />`;
      const ul = document.createElement("ul");
      ul.className = "mx-auto p-1";
      ul.style.cssText =
        "background:white;color:black;padding:1;height:300px;overflow-y:scroll;max-width:100%;overflow-x:hidden;";
      if (items && items.length > 0) {
        items.forEach((item, index) => {
          let modWord = this.shortenWord(item.word);
          let modUrl = this.shortenUrl(item.url);
          const li = document.createElement("li");
          li.style.cssText =
            "max-width:100%;display:flex;flex-wrap:wrap;padding-inline:1rem;";
          li.innerHTML = `<span style="color:blue;">${index + 1}.) 
          </span><span style="font-weight:bold;">url: </span> 
          <span>${modUrl},,,</span>
          <span style="font-weight:bold;"> word: </span> 
          <span>${modWord},,,</span>
          <span style="font-weight:bold;"> ${
            item.email ? "email:" : ""
          } </span> 
          ${item.email ? `<span>${item.email.slice(0, 10)},,,</span>` : ""}
          `;

          li.className = "d-flex flex-wrap gap-1 text-wrap max-w-100";
          ul.appendChild(li);
        });
      }

      container.appendChild(H6);
      container.appendChild(ul);
      this.addInputFileName(container);
      container.appendChild(button);
      this.downloadContainer.appendChild(container);
      this.activateDownload();
    }
  }

  addInputFileName(parent) {
    const group = document.createElement("div");
    const input = document.createElement("input");
    const label = document.createElement("label");
    input.className = "form-control";
    input.name = "fileName";
    input.value = "";
    input.className = "rounded text-center form-control";
    input.style.cssText = "box-shadow:1px 1px 12px 2px white;";
    input.placeholder = "file name";
    group.className = "group-control mx-auto text-center my-2";
    group.style.cssText = "color:white;";
    label.style.cssText =
      "text-decoration:underline;text-underline-offset:0.5rem;color:white;font-weight:bold;";
    label.innerHTML = "enter file name";
    group.appendChild(label);
    group.appendChild(input);
    parent.appendChild(group);
    input.addEventListener("change", (e) => {
      if (e) {
        this.fileName = e.currentTarget.value;
      }
    });
  }
  activateDownload() {
    const btnDownLoad = document.querySelector("button#btnDownLoad");
    btnDownLoad.addEventListener("click", (e) => {
      if (e) {
        // console.log("get items", this.items, "fileName", this.fileName);
        this.cleanUp(this.downloadContainer);
        this.downloadContainer.style.cssText = "";
        const storeDict = { fileName: this.fileName, items: this.items };
        const createData = storeDict.items.map((item, index) => {
          //rows=massItem
          const massItem = {
            url: item.url,
            word: item.word,
            email: item.email ? item.email : "not submitted",
          };
          let mass = "";
          let mass2 = "";
          let mass3 = "";
          if (index === 0) {
            for (const [key, value] of Object.entries(massItem)) {
              mass2 += `${key},`;
            }
            for (const [key, value] of Object.entries(massItem)) {
              mass += `${value},`;
            }
            return `${mass2.trim()}\n${mass.trim()}\n`;
          } else {
            for (const [key, value] of Object.entries(massItem)) {
              if (value && value.trim() !== "") {
                mass += `${value.trim().toString()},`;
              }
            }

            return `${mass.trim()}\n`;
          }
        });
        const total = storeDict.items.length;
        const mass3 = `total entries:,${total}\n`;
        const createDataAdd = createData.join(",") + mass3;
        const transfer = `data:text/csv;filename=${storeDict.fileName};charset=utf-8,${createDataAdd}`;
        // console.log(createData);
        this.doDownload(transfer, storeDict.fileName);
      }
    });
  }
  doDownload(file, fileName) {
    if (file) {
      const encodedUri = encodeURI(file);
      const a = document.createElement("a");
      a.href = encodedUri;
      a.hidden = true;
      a.download = `${fileName}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // window.open(encodedUri, fileName);
    }
  }
  cleanUp(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.lastChild);
    }
  }
  shortenWord(word) {
    console.log(word);
    let wordCheck =
      word && word.split(" ") && word.split(" ").length > 10 ? true : false;
    if (wordCheck) {
      let num = 10;
      return word.slice(0, num);
    }
    return word;
  }
  shortenUrl(url) {
    let check1 = /(https:\/\/)[a-zA-Z0-9]{2,}\.[a-zA-Z]{2,}/g;
    let urlCheck = url.split("") && url.split(" ").length > 10 ? true : false;
    if (check1.test(url)) {
      if (urlCheck) {
        let num =
          Math.round(url.split("") / 2) > 16
            ? Math.round(url.split("") / 3)
            : 16;
        return url.slice(10, num);
      } else {
        return url;
      }
    } else {
      return " is not a clean https://";
    }
  }
}
const start = new FileDownload();
start.onClickDownload();

class TODOForm {
  _items = [];
  _item = {
    date: "",
    task: "",
    details: "",
    due: "",
    complete: false,
  };
  constructor() {
    this.todoContainer = document.querySelector("div#todoContainer");
  }
  buttonAction() {
    const button = document.createElement("button");
    button.id = "addTask";
    button.className = "btn btn-warning btn-small text-center my-2 mx-auto";
    button.innerHTML = "add task";
    this.todoContainer.appendChild(button);
    button.addEventListener("click", (e) => {
      if (e) {
        this.createForm();
      }
    });
  }
  createForm() {
    this.todoContainer.style.cssText = "";
    const button = document.createElement("button");
    button.id = "taskBtn";
    button.className = "btn btn-info btn-small text-center my-2 mx-auto";
    button.innerHTML = "add";
    this.groupControl(this.todoContainer, "task");
    this.groupControl(this.todoContainer, "details");
    this.groupControl(this.todoContainer, "due");
    this.todoContainer.appendChild(button);
    button.addEventListener("click", (e) => {
      if (e) {
        chrome.storage.sync.get(["todoItems"]).then((res) => {
          if (res) {
            this._items = res.todoItems;
            this._item.date = this.dateConvert(new Date());
            this._items.push(this._item);
            console.log(this._item);
            this.items = this._items;
            chrome.storage.sync.set({ todoItems: this._items });
            this.cleanUp(this.todoContainer);
            this.todoContainer.style.cssText = "";
          }
        });
      }
    });
  }
  groupControl(parent, itemName) {
    const group = document.createElement("div");
    group.className =
      "group-control d-flex flex-column justify-content-center align-items-center gap-2 mx-auto";
    const label = document.createElement("label");
    label.style.cssText =
      "color:black;text-decoration:underline; text-underline-offset:0.5rem;margin-block:1rem;font-size::20px;";
    label.className = "lean text-primary";
    label.innerHTML = itemName;
    let input = document.createElement("input");
    input.className = "form-control mx-auto";
    if (itemName === "details") {
      input = document.createElement("textarea");
      input.rows = "6";
      input.cols = "28";
    }
    input.name = itemName;
    if (itemName === "due") {
      input.type = "date";
    } else if (itemName !== "details") {
      input.type = "text";
    }
    input.value = "";
    input.placeholder = itemName;
    input.style.csstext = "margin-inline:auto;text-align:center;";
    group.appendChild(label);
    group.appendChild(input);
    parent.appendChild(group);
    input.addEventListener("change", (e) => {
      this._item = {
        ...this._item,
        [e.currentTarget.name]: e.currentTarget.value,
        complete: false,
      };
      console.log(this._item);
    });
  }
  // share
  cleanUp(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.lastChild);
    }

    this.buttonAction();
  }
  dateConvert(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
}
const startForm = new TODOForm();
startForm.buttonAction();

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
  document.getElementById("").appendChild(div);
}
