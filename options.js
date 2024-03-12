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
        const testP = document.createElement("p");
        testP.innerHTML =
          "This is a test to see if it effects the font without bootstrap influence.";
        testP.id = "tryThis";
        $("div#testFont").append(testP);
        const pEle = document.querySelector("p#tryThis");
        const checkP = getComputedStyle(pEle).fontFamily;
        $("p#tryThis").text(testP.innerHTML + " " + checkP);
      }
    });
  }

  function set_get_font(selItem) {
    console.log(selItem);
    let changed = false;
    const check =
      selItem.genericFamily && selItem.script && selItem.fontId ? true : false;

    if (check) {
      $("#fontSelected").text(JSON.stringify(selItem));
      chrome.fontSettings.setFont(selItem).then((res) => {
        console.log("done");
      });
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
        console.log("getFont", res);
      });
      changed = true;
      return check;
    } else if (!changed) {
      alert("select all three fonts, please");
    }
  }
});
