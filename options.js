// 사용자 GPT API Key 저장
document.getElementById('saveApiKey').addEventListener('click', function() {
    const apiKey = document.getElementById('apiKey').value;
    chrome.storage.sync.set({ 'gptApiKey': apiKey }, function() {
        alert('API Key가 저장되었습니다.');
    });
});

// 사용자 정의 프롬프트 저장
document.getElementById('savePromptText').addEventListener('click', function() {
    const promptText = document.getElementById('promptText').value;
    chrome.storage.sync.set({ 'promptText': promptText }, function() {
        alert('프롬프트가 설정되었습니다.');
    });
});

// 툴팁 유지 시간 설정
document.getElementById('saveTooltipDuration').addEventListener('click', function() {
    const tooltipDuration = document.getElementById('tooltipDuration').value;
    chrome.storage.sync.set({ 'tooltipDuration': tooltipDuration }, function() {
        alert('툴팁 시간이 적용되었습니다.');
    });
});

