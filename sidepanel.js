chrome.storage.sync.get(["wordContexts"]).then((res) => {
  // console.log("res", res);
  if (res.wordContexts) {
    updateList(res.wordContexts);
  }
});

chrome.storage.sync.onChanged.addListener((changes) => {
  const wordContexts = changes.wordContexts;
  if (!(wordContexts && wordContexts.newValue)) return;
  const wordContextParse = wordContexts;
  const newEntries = wordContextParse.newValue;
  // console.log("newEntreies", newEntries);
  addToList(newEntries[newEntries.length - 1]);
});

function updateList(wordContexts) {
  const parent = document.getElementById("sidelist");
  if (wordContexts && wordContexts.length > 0) {
    wordContexts.forEach((word, index) => {
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
  $("#openSidebar").click((e) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      chrome.sidePanel.open({ tabId: tabs[0].id });
    });
  });
  selectFont();

  function selectFont() {
    chrome.fontSettings.getFontList().then((fontList) => {
      //gen options for select#fontList
      if (fontList.length > 0) {
        fontList.forEach((font, index) => {
          const option = document.createElement("option");
          option.type = "text";
          option.value = font.fontId;
          option.innerHTML = font.fontId;
          option.className = "text-sm lean fontItem text-center";
          $("#fontList").append(option);
        });
        $("#fontList").type = "text";
        //genericFamilys, above list for GenericFamily for chrome.fontSettings.getFont()
        genericFamilys.forEach((generic, index) => {
          const genOption = document.createElement("option");
          genOption.value = generic;
          genOption.innerHTML = generic;
          genOption.className = "text-sm lean fontItem text-center";
          $("#fontFamily").append(genOption);
        });
        scripts_.forEach((scr, index) => {
          const genOption = document.createElement("option");
          genOption.value = scr;
          genOption.innerHTML = scr;
          genOption.className = "text-sm lean fontItem text-center";
          $("#scripts").append(genOption);
        });
        getFont();
      }
    });
  }
  function getFont() {
    let selItem = { genericFamily: null, script: null, fontId: null };
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
      selItem.script = selVal;
    });
    $("#fontList").on("change paste", (e) => {
      //getting fontId
      selItem.fontId = $("#fontList").val();
    });

    $("#fontSelected").text(JSON.stringify(selItem));
    $("button#setFont").click((e) => {
      const check = set_get_font(selItem);
      if (check) {
        selItem = {
          genericFamily: null,
          script: null,
          fontId: null,
        };
      }
    });
  }

  function set_get_font(selItem) {
    let changed = false;
    const check =
      selItem.genericFamily && selItem.script && selItem.fontId ? true : false;

    if (check) {
      $("#fontSelected").text(JSON.stringify(selItem));
      chrome.fontSettings.setFont(selItem).then((res) => {});
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
              },
            });
          });
        // console.log("getFont", res);
      });
      changed = true;
      return check;
    } else if (!changed) {
      alert("select all three fonts, please");
    }
  }
});
