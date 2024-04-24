document.getElementById('questionInput').addEventListener('change', function() {
    const question = this.value;
    chrome.storage.sync.get(['gptApiKey', 'promptText','selectedModel'], function(data) {
        const apiKey = data.gptApiKey;
        const promptText = data.promptText
        const selectedModel = data.selectedModel
        
        if (!apiKey) {
            alert('API Key가 등록되지 않았습니다. 옵션에서 키를 설정해주세요.');
            return;
        }

        // GPT API 사용
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: [
                {
                    "role": "system",
                    "content": promptText
                },
                {
                    "role": "user",
                    "content": question // 사용자 질문
                }
                ]
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('HTTP ERROR : ' + response.status);
            }
        })
        .then(data => {
            if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
                const responseText = data.choices[0].message.content;
                document.getElementById('response').innerText = responseText;
                document.getElementById('copyButton').style.display = 'block';
            } else {
                alert('답변을 받아오지 못했습니다.');
            }
        })
        .catch(error => {
            console.error('오류가 발생했습니다:', error);
            alert('오류가 발생했습니다: ' + error.message);
        });
    });
});

// 복사 버튼 클릭 이벤트 리스너
document.getElementById('copyButton').addEventListener('click', function() {
    const responseText = document.getElementById('response').innerText;
    navigator.clipboard.writeText(responseText)
});
