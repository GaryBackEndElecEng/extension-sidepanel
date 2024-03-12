function sum(a, b) {
  return a + b;
}
const results = sum(4, 5);

chrome.extension.sendRequest(results);
