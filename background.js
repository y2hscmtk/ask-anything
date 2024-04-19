chrome.runtime.onInstalled.addListener(function() {
    // API Key 등록 메뉴 항목 생성
    chrome.contextMenus.create({
        id: "api-key-register",
        title: "API Key 등록",
        contexts: ["all"]
    });
    // 선택한 텍스트 복사 메뉴 항목 생성
    chrome.contextMenus.create({
        id: "copyText",
        title: "Copy Selected Text",
        contexts: ["selection"]
    });
});

// 컨텍스트 메뉴 클릭 이벤트 리스너
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    console.log("Clicked on tab: ", tab.id); // 탭 ID 로깅
    if (info.menuItemId === "api-key-register") {
        // 옵션 페이지 열기
        chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
    } else if (info.menuItemId === "copyText" && info.selectionText) {
        if (!tab.id || tab.id < 0) {
            console.error("Invalid tab ID");
            return;
        }
        // content script 강제 삽입
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ['content.js']
        }, () => {
            if (chrome.runtime.lastError) {
                console.error("Script injection failed:", chrome.runtime.lastError);
            } else {
                // 스크립트 삽입 성공 후 메시지 전송
                chrome.tabs.sendMessage(tab.id, { text: info.selectionText }, function(response) {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message:", chrome.runtime.lastError.message);
                    } else {
                        console.log("Message sent successfully!");
                    }
                });
            }
        });
    }
});
