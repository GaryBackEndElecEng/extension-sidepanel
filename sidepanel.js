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
  const genericFamilys = [
    "standard",
    "sansserif",
    "serif",
    "fixed",
    "cursive",
    "fantasy",
    "math",
  ];
  const scripts_ = [
    "Afak",

    "Arab",

    "Armi",

    "Armn",

    "Avst",

    "Bali",

    "Bamu",

    "Bass",

    "Batk",

    "Beng",

    "Blis",

    "Bopo",

    "Brah",

    "Brai",

    "Bugi",

    "Buhd",

    "Cakm",

    "Cans",

    "Cari",

    "Cham",

    "Cher",

    "Cirt",

    "Copt",

    "Cprt",

    "Cyrl",

    "Cyrs",

    "Deva",

    "Dsrt",

    "Dupl",

    "Egyd",

    "Egyh",

    "Egyp",

    "Elba",

    "Ethi",

    "Geor",

    "Geok",

    "Glag",

    "Goth",

    "Gran",

    "Grek",

    "Gujr",

    "Guru",

    "Hang",

    "Hani",

    "Hano",

    "Hans",

    "Hant",

    "Hebr",

    "Hluw",

    "Hmng",

    "Hung",

    "Inds",

    "Ital",

    "Java",

    "Jpan",

    "Jurc",

    "Kali",

    "Khar",

    "Khmr",

    "Khoj",

    "Knda",

    "Kpel",

    "Kthi",

    "Lana",

    "Laoo",

    "Latf",

    "Latg",

    "Latn",

    "Lepc",

    "Limb",

    "Lina",

    "Linb",

    "Lisu",

    "Loma",

    "Lyci",

    "Lydi",

    "Mand",

    "Mani",

    "Maya",

    "Mend",

    "Merc",

    "Mero",

    "Mlym",

    "Moon",

    "Mong",

    "Mroo",

    "Mtei",

    "Mymr",

    "Narb",

    "Nbat",

    "Nkgb",

    "Nkoo",

    "Nshu",

    "Ogam",

    "Olck",

    "Orkh",

    "Orya",

    "Osma",

    "Palm",

    "Perm",

    "Phag",

    "Phli",

    "Phlp",

    "Phlv",

    "Phnx",

    "Plrd",

    "Prti",

    "Rjng",

    "Roro",

    "Runr",

    "Samr",

    "Sara",

    "Sarb",

    "Saur",

    "Sgnw",

    "Shaw",

    "Shrd",

    "Sind",

    "Sinh",

    "Sora",

    "Sund",

    "Sylo",

    "Syrc",

    "Syre",

    "Syrj",

    "Syrn",

    "Tagb",

    "Takr",

    "Tale",

    "Talu",

    "Taml",

    "Tang",

    "Tavt",

    "Telu",

    "Teng",

    "Tfng",

    "Tglg",

    "Thaa",

    "Thai",

    "Tibt",

    "Tirh",

    "Ugar",

    "Vaii",

    "Visp",

    "Wara",

    "Wole",

    "Xpeo",

    "Xsux",

    "Yiii",

    "Zmth",

    "Zsym",

    "Zyyy",
  ];
  colors = [
    "darkgrey",
    "lightgrey",
    "blue",
    "red",
    "green",
    "orange",
    "violet",
    "white",
    "black",
  ];
  bg_colors = [
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
    "white",
  ];
  const targetArr = [
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "div",
    "section",
    "article",
    "span",
    "small",
    "body",
  ];
  const classNames = [
    {
      key: "shadow",
      value: [
        { "box-shadow": "1px 1px 12 3px rgb(1, 153, 176)" },
        { "box-shadow": "-1px -1px 12 3px rgb(1, 183, 176)" },
        { "border-radius": "10px 10px 10px 10px" },
        { margin: "0.25rem" },
        { padding: "0.5rem" },
      ],
    },
    {
      key: "border",
      value: [
        { border: "1px solid grey" },
        { "border-radius": "10px 10px 10px 10px" },
        { margin: "0.25rem" },
        { padding: "0.5rem" },
      ],
    },
  ];

  $("#openSidebar").click((e) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      chrome.sidePanel.open({ tabId: tabs[0].id });
    });
  });
  selectFont();

  function selectFont() {
    //target element
    if (targetArr.length > 0) {
      targetArr.forEach((targ, index) => {
        const target = document.createElement("option");
        target.type = "text";
        target.value = targ;
        target.innerHTML = targ;
        target.className = "text-sm lean fontItem text-center border";
        $("select#target").append(target);
      });
    }
    if (classNames.length > 0) {
      classNames.forEach((class_, index) => {
        const classOption = document.createElement("option");
        classOption.type = "text";
        classOption.value = JSON.stringify(class_.value);
        classOption.innerHTML = class_.key;
        classOption.className = "text-sm lean fontItem text-center border";
        $("select#className").append(classOption);
      });
    }
    if (colors.length > 0) {
      colors.forEach((color, index) => {
        const colorOption = document.createElement("option");
        colorOption.type = "text";
        colorOption.value = color;
        colorOption.innerHTML = color;
        colorOption.className = "text-sm lean fontItem text-center border";
        $("select#color").append(colorOption);
      });
    }
    if (bg_colors.length > 0) {
      bg_colors.forEach((bgcolor, index) => {
        const bg_colorOption = document.createElement("option");
        bg_colorOption.type = "text";
        bg_colorOption.value = bgcolor;
        bg_colorOption.innerHTML = bgcolor;
        bg_colorOption.className = "text-sm lean fontItem text-center border";
        $("select#bg_color").append(bg_colorOption);
      });
    }
    chrome.fontSettings.getFontList().then((fontList) => {
      //gen options for select#fontList ( font Family)
      if (fontList.length > 0) {
        fontList.forEach((font, index) => {
          const option_fam = document.createElement("option");
          option_fam.type = "text";
          option_fam.value = font.fontId;
          option_fam.innerHTML = font.fontId;
          option_fam.className = "text-sm lean fontItem text-center";
          $("#fontList").append(option_fam);
        });
        $("#fontList").type = "text";
        //genericFamilys, above list for GenericFamily ( font Style) for chrome.fontSettings.getFont()
        genericFamilys.forEach((generic, index) => {
          const styleOption = document.createElement("option");
          styleOption.value = generic;
          styleOption.innerHTML = generic;
          styleOption.className = "text-sm lean fontItem text-center";
          $("#fontFamily").append(styleOption);
        });
        //Script for languages
        scripts_.forEach((scr, index) => {
          const langOption = document.createElement("option");
          langOption.value = scr;
          langOption.innerHTML = scr;
          langOption.className = "text-sm lean fontItem text-center";
          $("#scripts").append(langOption);
        });
        get_target_font();
      }
    });
  }
  function get_target_font() {
    let selItem = {
      genericFamily: "standard",
      script: "Arab",
      fontId: "Century",
      target: "body",
      color: "black",
      bg_color: "white",
      className: "",
    };
    $("select#className").on("change paste", (e) => {
      //getting selection
      const class_ = $("select#className").val();
      selItem.className = class_;
    });
    $("select#color").on("change paste", (e) => {
      //getting selection
      const col = $("select#color").val();
      selItem.color = col;
    });
    $("select#bg_color").on("change paste", (e) => {
      //getting selection
      const bg_col = $("select#bg_color").val();
      selItem.bg_color = bg_col;
    });
    $("#target").on("change paste", (e) => {
      //getting selection
      const targ = $("#target").val();
      selItem.target = targ;
    });
    $("#fontList").on("change paste", (e) => {
      //getting selection
      const selVal = $("#fontList").val();
      selItem.fontId = selVal;
    });
    $("#fontFamily").on("change paste", (e) => {
      //getting selection
      const selVal = $("#fontFamily").val();
      selItem.genericFamily = selVal;
    });
    $("#scripts").on("change paste", (e) => {
      //getting
      const selVal = $("#scripts").val();
      if (selVal) {
        selItem.script = selVal;
      } else {
        selItem.script = "Arab";
      }
    });
    $("#fontList").on("change paste", (e) => {
      //getting fontId
      selItem.fontId = $("#fontList").val();
    });

    $("#fontSelected").text(JSON.stringify(selItem));
    $("button#setFont").click((e) => {
      const check = set_get_font(selItem);
      if (check) {
        // selItem = {
        //   genericFamily: "standard",
        //   script: "Arab",
        //   fontId: "Century",
        //   target: "body",
        //   color: "black",
        //   bg_color: "white",
        //   className: "",
        // };
      }
    });
  }

  function set_get_font(selItem) {
    let changed = false;
    let selItem_font = {
      genericFamily: selItem.genericFamily,
      script: selItem.script,
      fontId: selItem.fontId,
    };
    const check =
      selItem.genericFamily && selItem.script && selItem.fontId ? true : false;

    if (check) {
      $("#fontSelected").text(JSON.stringify(selItem_font));
      chrome.fontSettings.setFont(selItem_font).then((res) => {});
      const getItem = {
        genericFamily: selItem.genericFamily,
        script: selItem.script,
      };
      chrome.fontSettings.getFont(getItem).then((res) => {
        chrome.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
              task: "changeFontFamily",
              fontFamily: {
                fontId: selItem.fontId,
                genericFamily: selItem.genericFamily,
                target: selItem.target,
                color: selItem.color,
                bg_color: selItem.bg_color,
                className: selItem.className,
              },
            });
          });
        // console.log("getFont", res);
      });
      changed = true;
      return check;
    } else if (!changed) {
      alert("select at lease the font family, please");
    }
  }
});
