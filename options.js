//USING A CLASS METHOD fontFamily=classFamily, fontStyle=classStyle,setFont=setFontClass for OPTIONS
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
  selItem = { fontFamily: null, fontStyle: null };
  constructor() {
    this.classFamily = document.getElementById("classFamily");
    this.classStyle = document.getElementById("classStyle");
    this.paras = document.querySelectorAll("p");
    this.lis = document.querySelectorAll("li");
    this.setFontClass = document.getElementById("setFontClass");
    this.options = document.querySelectorAll(".option");
    this.selectedFont = document.getElementById("selectedFont");
  }

  create_build_Options() {
    chrome.fontSettings.getFontList().then((fontList) => {
      let familyList = fontList.map((font) => font);
      this.buildOptions(familyList);
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
    this.selectFontFamily();
  }

  selectFontFamily() {
    this.selItem.fontFamily = this.classFamily.value;
    this.selItem.fontStyle = this.classStyle.value;
    this.setFontClass.addEventListener("click", (e) => {
      if (e) {
        this.selItem = {
          fontFamily: this.classFamily.value,
          fontStyle: this.classStyle.value,
        };
        this.paras.forEach((p) => {
          p.style.cssText = `font-family:${this.selItem.fontFamily}, ${this.selItem.fontStyle}`;
        });
        this.lis.forEach((li) => {
          li.style.cssText = `font-family:${this.selItem.fontFamily}, ${this.selItem.fontStyle}`;
        });
        this.selectedFont.class = "mx-auto d-flex flex-column gap-1";
        this.selectedFont.innerHTML = `
        <div>
        <span style="font-weight:bold;">
        font-family:
        </span>
        <span >
        ${this.selItem.fontFamily}
        </span>
        </div>
        <div>
        <span style="font-weight:bold;">
        style:
        </span>
        <span>
        ${this.selItem.fontStyle}
        </span>
        </div>`;
      }
    });
  }
}
const newClass = new FontClass();
newClass.create_build_Options();

//BIO SECTION----------//////
$(document).ready(function () {
  document
    .getElementById("summaryBio")
    .classList.remove("close", "close", "open", "open");
  document.getElementById("summaryBio").classList.add("close");
  $("#summaryBio").click((e) => {
    const para = document.querySelector("div#detailsID");
    const paraSpan = document.querySelector("div#detailsID span");
    const summary = document.getElementById("summaryBio");
    summary.style.cssText =
      "display:inline-flex; justify-content:flex-start;align-items:center";
    if (e) {
      if (e.currentTarget.className === "close") {
        //closed
        e.currentTarget.classList.remove("close");
        e.currentTarget.classList.add("open");
        //creating img
        const img = document.createElement("img");
        img.src = "./images/profile1_275.png";
        img.alt = "Gary Wallace";
        img.id = "profile";
        img.style.cssText =
          "float:left;shape-outside:circle();filter:drop-shadow(0 0 0.75rem grey);border-radius:50%;margin:1rem 1rem 2rem 0;position:relative;top:0;left:0;";
        para.style.position = "relative";
        para.insertBefore(img, para.childNodes[0]);
        para.style.display = "block";
        para.style.animation = "";
        para.style.animation = "openPara 1s ease-in-out";
        summary.style.cssText +=
          "min-width:500px;transition:all 1s ease-in-out;";

        while (summary.firstChild) {
          summary.removeChild(summary.lastChild);
        }
        summary.innerHTML = `close BIO <img src="./images/arrow-down.svg" style="color:white;font-size:20px;background:white;border-radius:50%;margin-inline:20px;" />`;

        // console.log("open", summary.className);
      } else if (e.currentTarget.className === "open") {
        //open
        //removing img on close
        para.childNodes.forEach((ele, index) => {
          if (ele.id === "profile") {
            para.removeChild(ele);
          }
        });

        e.currentTarget.classList.remove("open");
        e.currentTarget.classList.add("close");

        para.style.display = "none";
        summary.style.cssText +=
          "min-width:100px;transition:all 1s ease-in-out;";
        while (summary.firstChild) {
          summary.removeChild(summary.lastChild);
        }
        // summary.appendChild(img);
        summary.innerHTML = `see BIO <img src="./images/arrow-up.svg" style="color:white;font-size:20px;background:white;border-radius:50%;margin-inline:20px;" />`;
        // console.log("close", summary);
      }
    }
  });
});

//DISPLAY STORAGE

class DisplayStorage {
  constructor() {
    this.show_storage = document.getElementById("showStorage");
  }

  getStorage() {
    chrome.storage.sync.get(["wordContexts"]).then((res) => {
      if (res.wordContexts) {
        this.showStorage(res.wordContexts);
      }
    });
  }
  showStorage(wordContexts) {
    // console.log(wordContexts);
    if (wordContexts && wordContexts.length > 0) {
      wordContexts.forEach((word, index) => {
        const div_ = document.createElement("div");
        if (word.word) {
          div_.innerHTML = `
          <li><ol><li>url:<a href=${word.url}>${word.url.slice(
            0,
            20
          )}</a></li> <li>word(s):${word.word}</li>
          </ol></li>`;
        } else if (word.email) {
          div_.innerHTML = `
          <li><ol><li>url:<a href=${word.url}>${word.url.slice(
            0,
            20
          )}</a></li> <li>email:${word.email}</li>
          </ol></li>`;
        }

        div_.style =
          "d-flex flex-column justify-content-center align-items-center gap-1";
        div_.className = "child";
        this.show_storage.appendChild(div_);
      });
    }
  }
}

//TODO ////-----------------------/////

class TODOStore {
  constructor() {
    this._items = [];
    this.showHideForm = document.querySelector("button#showHideForm");
    this.showHideForm.setAttribute("isOpen", "false");
    this.formTask = document.getElementById("formTask");
    // this.formTask.setAttribute("isOpen", "false");
    this.task = document.getElementById("task");
    this.details = document.getElementById("details_");
    this.due = document.getElementById("due");
    this.complete = document.getElementById("complete");
    this.taskSubmit = document.getElementById("taskSubmit");
    this.submitter = document.querySelector("button[value=add]");
    this.showHideForm = document.querySelector("button#showHideForm");
    this.formWrapper = document.querySelector("div#formWrapper");
    this._item = {
      date: new Date().toString(),
      task: this.task.value,
      details: this.details.value,
      due: this.due.value,
      complete: false,
    };
  }

  //GETTING ITEMS FROM STORAGE
  getItems() {
    chrome.storage.sync.get(["todoItems"]).then((res) => {
      if (res.todoItems) {
        this.get_storage_items(res.todoItems);
      }
    });
  }
  //SETTING ITEMS FROM STORAGE
  get_storage_items(items) {
    if (items && items.length > 0) {
      this._items = items;
    }
  }
  get item() {
    return this._item;
  }

  //PROCEDURES-----------------------
  getTasks() {
    this.formTask.addEventListener("submit", (e) => {
      if (e) {
        e.preventDefault();
        // const newForm = new FormData(e.currentTarget, this.submitter);

        let item = {
          date: this.convertDate(new Date()),
          task: this.task.value,
          details: this.details.value,
          due: this.due.value,
          complete: false,
        };
        this.item = item;
      }
    });
    // .catch((err) => console.error(err.message));
  }
  set item(item) {
    if (this.check(item)) {
      //push
      this._items.push(item);
      this._item = {
        date: "",
        task: "",
        details: "",
        due: "",
        complete: false,
      };
      // console.log("storeItem", this._items);
      chrome.storage.sync.set({ todoItems: this._items });
    } else {
      alert(" not stored");
    }
  }
  openForm() {
    this.showHideForm.addEventListener("click", (e) => {
      if (e) {
        const isOpen = e.currentTarget.getAttribute("isOpen");
        if (isOpen === "true") {
          //open
          e.currentTarget.setAttribute("isOpen", "false");
          e.currentTarget.innerHTML = "show form";
          this.formWrapper.setAttribute("hidden", "true");
          this.formWrapper.style.animation = "";
          this.formWrapper.cssText =
            "height:50px;opacity:0;z-index:-1;animation:closeForm 1s ease-in-out;";
        } else {
          e.currentTarget.setAttribute("isOpen", "true");
          e.currentTarget.innerHTML = "hide form";
          this.formWrapper.removeAttribute("hidden");
          this.formWrapper.style.animation = "";
          this.formWrapper.cssText =
            "min-height:300px;opacity:1;z-index:0;animation:openForm 1s ease-in-out;";
        }
      }
    });
  }
  /// shared
  convertDate(date) {
    const day = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
    const convertday = day[date.getDay()];
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
  check(item) {
    const check = item.date && item.task && item.details ? true : false;
    return check;
  }
}

const get_storage = new DisplayStorage();
get_storage.getStorage();

const tasks = new TODOStore();
tasks.getTasks();
tasks.getItems();
tasks.openForm();

/////-----GETTING AND DISPLAYING ///////-------------///

class TODOGet {
  _items = [];
  _item = {
    date: "",
    task: "",
    details: "",
    due: "",
    complete: false,
  };
  constructor() {
    this.tasksWrapper = document.getElementById("tasksWrapper");
  }
  //GETTING ITEMS FROM STORAGE

  getOneTimeItems() {
    chrome.storage.sync.get(["todoItems"]).then((res) => {
      if (res.todoItems) {
        this.items = res.todoItems;
        this.renderTasks();
      }
    });
  }
  //DISPLAYING CHANGES
  getItems() {
    chrome.storage.sync.onChanged.addListener((changes) => {
      const todoItems = changes.todoItems.newValue;
      // console.log(changes);
      if (todoItems) {
        this.items = todoItems;
        this.renderTasks();
      }
    });
  }
  get items() {
    return this._items;
  }
  set items(items) {
    this._items = items;
  }
  // get items() {
  //   return this._items;
  // }
  renderTasks() {
    if (this._items && this._items.length > 0) {
      //cleaning pre-renders
      TODOGet.cleanup(this.tasksWrapper);
      this.tasksWrapper.style.cssText =
        "box-shadow:1px 1px 10px 2px darkgrey; border-radius:10px 10px 10px 10px; padding:0.5rem;";
      this._items.forEach((item, index) => {
        //CREATE COMPONENTS

        const showTask = document.createElement("div");
        const hr = document.createElement("hr");
        const detail = document.createElement("p");
        const task = document.createElement("h6");
        const complete = document.createElement("input");
        const due = document.createElement("span");
        const date_ = document.createElement("span");
        showTask.className = "showTask";
        task.innerHTML = item.task;
        task.style.cssText =
          "font-weight:bold;text-align:center;text-decoration:underline;text-underline-offset:0.5rem;margin-inline:auto;margin-block:1rem;font-size:20px;";
        task.className = "lean text-primary";
        showTask.style.display = "none";
        showTask.style.cssText =
          "position:relative;animation:none;width:100%;min-height:75px;padding-block:1rem;";
        detail.innerHTML = item.details;
        complete.value = item.complete ? true : false;
        complete.type = "checkbox";
        due.innerHTML = item.due;
        date_.innerHTML = item.date;
        due.style.cssText =
          "position:absolute;left:40%;top:0;color:red;display:block;opacity:1;text-decoration:underline;font-weight:600;";
        date_.style.cssText =
          "position:absolute;left:0%;top:0;color:blue;display:block;opacity:1;text-decoration:underline;";
        complete.style.cssText =
          "position:absolute;right:0;top:0;color:blue;border:blue;width:20px;height:20px;display:block;opacity:1";
        hr.style.cssText =
          "width:75%; height:3px;background:lightgrey;margin-block:0.5rem;margin-inline:auto;";
        due.classList.add("dueDate");
        due.classList.add("date");
        complete.classList.add("complete");
        showTask.appendChild(task);
        showTask.appendChild(detail);
        showTask.appendChild(complete);
        showTask.appendChild(date_);
        showTask.appendChild(due);
        showTask.appendChild(hr);
        showTask.style.display = "block";
        showTask.style.animation = "openPara 1s ease-in-out";
        showTask.style.display = "block";
        this.tasksWrapper.appendChild(showTask);
      });
      this.deleteTask();
    }
  }
  deleteTask() {
    const completes = document.querySelectorAll("input.complete");
    if (completes.length > 0) {
      completes.forEach((comp, index) => {
        comp.addEventListener("click", (e) => {
          if (e && e.currentTarget.checked === true) {
            console.log("clicked", e.currentTarget, e.currentTarget.checked);
            const reduced = this._items.filter(
              (item, index_) => index_ !== index
            );
            chrome.storage.sync.set({ todoItems: reduced });
          }
        });
      });
    }
  }
  // ULTILITIES
  static cleanup(parent) {
    while (parent.childNodes && parent.childNodes.length > 0) {
      parent.removeChild(parent.lastChild);
    }
  }
}
const showTasks = new TODOGet();
showTasks.getOneTimeItems();
showTasks.getItems();
