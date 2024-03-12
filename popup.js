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
