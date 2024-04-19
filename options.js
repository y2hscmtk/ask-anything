document.getElementById('saveKey').addEventListener('click', function() {
    const apiKey = document.getElementById('apiKey').value;
    chrome.storage.sync.set({ 'gptApiKey': apiKey }, function() {
        alert('API Key가 저장되었습니다.');
    });
});
