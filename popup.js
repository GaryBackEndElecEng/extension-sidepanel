$(document).ready(function () {
  chrome.storage.sync.get(["wordContexts"]).then((res) => {
    if (res) {
      let words = [];
      words = res.wordContexts;
      showContext(words);
      getThoughtOfTheDay();
    }
  });
  $(document).ready(function () {
    $("#openSidebar").click((e) => {
      if (e) {
        if (chrome.sidePanel) {
          chrome.tabs
            .query({ active: true, lastFocusedWindow: true })
            .then((tabs) => {
              chrome.sidePanel.open({ tabId: tabs[0].id });
              chrome.sidePanel.setOptions({
                tabId: tabs[0].id,
                path: "./sidepanel.html",
              });
              close();
            });
        } else {
          const url = chrome.runtime.getURL("sidepanel.html");
          window.open(url);
        }
      }
    });
  });

  function showContext(wordContexts) {
    const parent = document.getElementById("popuplist");
    if (wordContexts) {
      let listcount = wordContexts.length;
      let words = wordContexts.map((word, index) => {
        if (word.word) {
          return `${word.word.slice(0, 5)},,,`;
        } else if (word.email) {
          return `${word.email.slice(0, 5)},,,`;
        }
      });
      const li = document.createElement("li");
      const li2 = document.createElement("li");
      li.innerHTML = `number of word(s)/emails:${listcount}`;
      li2.innerHTML = words.map((word) => {
        return `<span>${word}</span>`;
      });
      li2.className =
        "d-flex align-items-center jusify-content-start mx-2 flex-wrap";
      li.className = "display-6 lean";
      parent.appendChild(li);
      parent.appendChild(li2);
    }
  }

  function getThoughtOfTheDay() {
    const submitThought = document.querySelector("button#submitThought");
    submitThought.addEventListener("click", (e) => {
      if (e) {
        e.preventDefault();
        getDayMonthSaying();
      }
    });
  }

  function getDayMonthSaying() {
    const day = document.querySelector("input#day");
    const month = document.querySelector("input#month");

    if (checkNum(day.value) && checkNum(month.value)) {
      const url = `https://numbersapi.p.rapidapi.com/${day.value}/${month.value}/date?fragment=true&json=true`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "512e19eb3cmsh0b9bf8c65edd50ep11ae4bjsn9a01883aacf8",
          "X-RapidAPI-Host": "numbersapi.p.rapidapi.com",
        },
      };

      fetch(url, options)
        .then((res) => {
          const convText = res.json();
          convText.then((ans) => {
            showResults(ans);
            console.log(ans, ans.text);
          });
        })
        .catch((err) => {
          let msg = err.message;
          setTimeout(() => {
            createWarning("DAY", msg);
            createWarning("MONTH", "something went wrong");
          }, 700);
          console.error(err.message);
        });
    } else {
      if (!checkNum(day)) {
        createWarning("DAY", "has to be a number");
      } else if (!checkNum(month)) {
        createWarning("MONTH", "has to be a number");
      }
    }
  }
  function checkNum(val) {
    if (!isNaN(parseInt(val)) && typeof Number(parseInt(val))) return true;
    return false;
  }

  function createWarning(ID = "DAY", message) {
    if (message) {
      const day = document.querySelector(`div#${ID}`);
      const child_ = document.createElement("small");
      child_.style.color = "red";
      child_.innerHTML = message;

      day.appendChild(child_);
    } else {
      day.removeChild(child_);
    }
  }
  function showResults(textJson) {
    if (textJson && textJson.text) {
      const thoughtResults = document.querySelector("div#thoughtResults");
      const p = document.createElement("p");
      const p2 = document.createElement("p");
      p.innerHTML = textJson.text;
      p.className = "lean display-6 m-1 mx-2 text-primary text-bold text-wrap";
      p.style.font = "bold";
      if (parseInt(textJson.year) > 0) {
        p2.innerHTML = `year: ${textJson.year} AC`;
      } else {
        let yrAD = textJson.year.split("-")[1];
        p2.innerHTML = `year: ${yrAD} BC`;
      }
      p2.className = "lean display-5 m-1 mx-2 text-secondary text-bold";
      p2.style.font = "bold";
      thoughtResults.appendChild(p2);
      thoughtResults.appendChild(p);
    }
  }
  $("button#optionPage").click((e) => {
    if (e) {
      if (chrome.runtime.openOptionPage) {
        chrome.runtime.openOptionPage();
      } else {
        const url = chrome.runtime.getURL("options.html");
        window.open(url);
      }
    }
  });
});

//----------- THIS IS FOR THE CURRENCY- CLASS--------//

class ConvertCurrency {
  constructor() {
    this.list = [];
    this.fromSelect = document.querySelector("select#fromSelect");
    this.toSelect = document.querySelector("select#toSelect");
    this.amount = document.querySelector("input#amount");
    this.monResults = document.querySelector("ul#monResults");
    this.submit_ = document.querySelector("button#btnMon");
    this.numberRes = parseFloat(0);
  }
  executeMain() {
    this.getList();
    // console.log(this.submit_); //works
    this.submit_.addEventListener("click", (e) => {
      if (e) {
        this.convert();
      }
    });

    //this goes last below
  }
  //THIS SETS this.list with LIST
  getList() {
    let list = [];
    const url = "https://currency-exchange.p.rapidapi.com/listquotes";
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "512e19eb3cmsh0b9bf8c65edd50ep11ae4bjsn9a01883aacf8",
        "X-RapidAPI-Host": "currency-exchange.p.rapidapi.com",
      },
    };

    fetch(url, options)
      .then((res) => {
        list = res.text().then((list) => {
          // console.log("LIST inside", list);//works
          this.list = JSON.parse(list);
          this.buildOptions(this.fromSelect, this.list);
          this.buildOptions(this.toSelect, this.list);
        });
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  convert() {
    const fromCurr = this.fromSelect.value;
    const toCurr = this.toSelect.value;
    const units = 1;

    const url = `https://currency-exchange.p.rapidapi.com/exchange?from=${fromCurr}&to=${toCurr}&q=${units}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "512e19eb3cmsh0b9bf8c65edd50ep11ae4bjsn9a01883aacf8",
        "X-RapidAPI-Host": "currency-exchange.p.rapidapi.com",
      },
    };
    fetch(url, options)
      .then((res) => {
        res.text().then((results) => {
          // console.log("inside got results", results); //works

          this.monRes = parseFloat(results);
          this.buildResult(
            this.monResults,
            "from",
            this.amount.value,
            this.monRes
          );
          this.buildResult(
            this.monResults,
            "to",
            this.amount.value,
            this.monRes
          );
        });
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  //NOTE: IF NO LIST THEN COULD NOT GET FROM ASYNC
  buildOptions(parent, list) {
    if (list.length > 0) {
      list.forEach((curr, index) => {
        const option = document.createElement("option");
        option.style = "text-center lean px-1";
        if (index === 0) {
          option.value = "select";
          option.innerHTML = "select";
          option.disabled;
        } else {
          option.value = curr;
          option.innerHTML = curr;
        }
        parent.appendChild(option);
      });
    }
  }
  //get amount and calculate units=1 from this.convert() type=from | to
  buildResult(parent, type, amount, monRes) {
    //CleanUp
    this.cleanUp(parent);
    //building:type== from | to |result
    const li = document.createElement("li");

    if (type === "from") {
      li.innerHTML = `from: $${amount} ${this.fromSelect.value}`;
      li.className = "lean";
    } else if (type === "to") {
      const convNum = parseFloat(amount * monRes);
      const conv_num = convNum.toFixed(2);
      li.innerHTML = `to: $${conv_num} ${this.toSelect.value}`;
      li.className = "lean font-weight-bold";
      li.style.fontWeight = "bold";
    }
    setTimeout(() => {
      parent.appendChild(li);
    }, 10);
  }
  cleanUp(parent) {
    let nodes = parent.childNodes;
    if (nodes.length > 2) {
      while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
      }
    }
  }
  //ultilities
  static isNum(integer) {
    if (
      !isNaN(integer) &&
      typeof integer === "number" &&
      parseInt(integer) !== NaN
    ) {
      return true;
    }
    return false;
  }
  static isFloat(num) {
    return (typeof num === "number" && num < 1) || num > 1;
  }
}
window.onload = async () => {
  // const start = new ConvertCurrency();
  // start.getList();
};
const start = new ConvertCurrency();
start.executeMain();
