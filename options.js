document.addEventListener('DOMContentLoaded', function() {

    // 사용자가 저장한 값이 있다면 로드해서 반영
    chrome.storage.sync.get(['gptApiKey', 'promptText', 'tooltipDuration', 'tooltipEnabled'], function(data) {
        if (data.gptApiKey !== undefined) {
            document.getElementById('apiKey').value = data.gptApiKey;
        }
        if (data.promptText !== undefined) {
            document.getElementById('promptText').value = data.promptText;
        }
        if (data.tooltipDuration !== undefined) {
            document.getElementById('tooltipDuration').value = data.tooltipDuration;
        }
        if (data.tooltipEnabled !== undefined) {
            document.getElementById('tooltipEnabled').checked = data.tooltipEnabled;
        }
    });

    document.getElementById('saveApiKey').addEventListener('click', function() {
        // 사용자 GPT API Key 저장
        const apiKey = document.getElementById('apiKey').value;
        if (apiKey.trim() === '') {
            alert('API Key를 입력해주세요.');
            return;
        }
        chrome.storage.sync.set({ 'gptApiKey': apiKey }, function() {
            alert('API Key가 저장되었습니다.');
        });
    });

    document.getElementById('savePromptText').addEventListener('click', function() {
        // 사용자 정의 프롬프트 저장
        const promptText = document.getElementById('promptText').value;
        if (promptText.trim() === '') {
            alert('프롬프트를 작성해주세요.');
            return;
        }
        chrome.storage.sync.set({ 'promptText': promptText }, function() {
            alert('프롬프트가 설정되었습니다.');
        });
    });

    document.getElementById('saveTooltipDuration').addEventListener('click', function() {
        // 툴팁 유지 시간 설정
        const tooltipDuration = document.getElementById('tooltipDuration').value;
        if (tooltipDuration.trim() === '') {
            alert('툴팁 시간을 작성해주세요.');
            return;
        }
        chrome.storage.sync.set({ 'tooltipDuration': tooltipDuration }, function() {
            alert('툴팁 시간이 적용되었습니다.');
        });
    });

    // 툴팁 활성화 상태 저장 이벤트 리스너
    document.getElementById('tooltipEnabled').addEventListener('change', function() {
        const tooltipEnabled = document.getElementById('tooltipEnabled').checked;
        console.log("")
        // 스토리지에 설정 정보 저장  
        chrome.storage.sync.set({ 'tooltipEnabled': tooltipEnabled }, function() {
            if (tooltipEnabled){
                alert('툴팁이 활성화 되었습니다.');    
            } else {
                alert('툴팁이 비활성화 되었습니다.');
            }
        });
    });
});


