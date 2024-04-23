function setDefaultValue() { // 기본값 설정
    chrome.storage.sync.get('selectedModel', function(data) {
        if (data.selectedModel === undefined) { // 기본 모델 설정
            chrome.storage.sync.set({ 'selectedModel': 'GPT4' }, function() {
                console.log('Set Default Model : GPT4');
            });
        }
        if (data.promptText === undefined) { // 기본 프롬프트 설정
            chrome.storage.sync.set({ 'promptText': '문제에 대한 정답을 알려주세요.' }, function() {
                console.log("Set Default Prompt")
            });
        }
        if (data.tooltipDuration === undefined) { // 기본 툴 팁 유지 시간 설정
            chrome.storage.sync.set({ 'tooltipDuration': 3 }, function() {
                console.log('Set Default tooltipDuration');
            });
        }
        if (data.tooltipEnabled === undefined) { // 툴팁 활성화 여부 기본값 설정
            chrome.storage.sync.set({ 'tooltipEnabled': true }, function() {
                console.log('Set Default tooltipEnabled');
            });
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    setDefaultValue()

    // 사용자가 저장한 값이 있다면 로드해서 반영
    chrome.storage.sync.get(['gptApiKey', 'promptText', 'tooltipDuration', 'tooltipEnabled', 'selectedModel'], function(data) {
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
        if (data.selectedModel !== undefined) {
            document.querySelector(`input[type="radio"][name="model"][value="${data.selectedModel}"]`).checked = true;
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
        // 스토리지에 설정 정보 저장  
        chrome.storage.sync.set({ 'tooltipEnabled': tooltipEnabled }, function() {
            if (tooltipEnabled){
                alert('툴팁이 활성화 되었습니다.');    
            } else {
                alert('툴팁이 비활성화 되었습니다.');
            }
        });
    });

    // 라디오 버튼 이벤트 리스너 추가
    let modelRadios = document.querySelectorAll('input[type="radio"][name="model"]');
    modelRadios.forEach(function(radio) {
        radio.addEventListener('change', function() {
            if (this.checked) {
                chrome.storage.sync.set({ 'selectedModel': this.value }, function() {
                    alert('모델이 설정되었습니다 : ' + this.value);
                }.bind(this)); // context 유지를 위해
            }
        });
    });
});


