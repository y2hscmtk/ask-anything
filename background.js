chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "copyText",
        title: "Ask!",
        contexts: ["selection"]
    });
});

let injectedTabs = {};

chrome.tabs.onRemoved.addListener(function(tabId) {
    delete injectedTabs[tabId]; // 탭이 닫힐 때 추적 상태에서 제거
});


// 컨텍스트 메뉴 클릭 이벤트 리스너
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    console.log("selected!")
    if (info.menuItemId === "copyText" && info.selectionText) {
        console.log("Ask! Clicked")
        if (tab.id && !injectedTabs[tab.id]) {
            console.log("script injected!")
            // content.js가 아직 삽입되지 않았다면 삽입 => 중복 삽입으로 인한 중복 호출 방지
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                files: ['content.js']
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Script injection failed:", chrome.runtime.lastError);
                } else {
                    console.log("Script injected successfully!");
                    injectedTabs[tab.id] = true;  // 탭에 스크립트가 삽입되었음을 표시
                    sendMessageToContentScript(tab, info);
                }
            });
        } else {
            console.log("script currently injected")
            sendMessageToContentScript(tab, info); // 이미 삽입되었다면 바로 메시지를 보냄
        }
    }
});


function sendMessageToContentScript(tab, info) {
    console.log("called sendMessageToContentScript")
    chrome.tabs.sendMessage(tab.id, { text: info.selectionText }, function(response) {
        if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError.message);
        } else {
            console.log("Message sent successfully!");
        }
    });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log("chrome.tabs.onUpdated Called")
    // 탭의 URL이 변경되었거나 페이지가 새로고침된 경우
    if (changeInfo.url || changeInfo.status === "complete") {
        injectedTabs[tabId] = false // 비활성화
    }
});
