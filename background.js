chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "api-key-register",
        title: "API Key 등록", // 메뉴에 보일 텍스트
        contexts: ["all"] // 모든 컨텍스트에서 사용 가능하도록 설정
    });
});

// 메뉴 항목이 클릭되면 실행될 함수를 정의
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "api-key-register") {
        // 옵션 페이지를 새 탭에서 열기
        chrome.tabs.create({ 'url': chrome.runtime.getURL("options.html") });
    }
});
