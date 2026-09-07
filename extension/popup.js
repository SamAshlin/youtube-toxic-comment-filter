document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle");

    chrome.storage.local.get(["filter"], function (result) {
        let isOn = result.filter ?? true;
        toggleBtn.innerText = isOn ? "ON" : "OFF";
    });

    toggleBtn.onclick = function () {
        chrome.storage.local.get(["filter"], function (result) {
            let isOn = !(result.filter ?? true);
            chrome.storage.local.set({ filter: isOn });
            toggleBtn.innerText = isOn ? "ON" : "OFF";
        });
    };
});