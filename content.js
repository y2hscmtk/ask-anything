// content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.text) {

        const tooltip = document.createElement('div');
        tooltip.style.position = 'fixed';
        tooltip.style.zIndex = '1000';
        tooltip.style.width = 'auto';
        tooltip.style.height = 'auto';
        tooltip.style.backgroundColor = 'white';
        tooltip.style.color = 'black';
        tooltip.style.border = '1px solid black';
        tooltip.style.borderRadius = '4px';
        tooltip.style.padding = '5px';
        tooltip.style.fontSize = 'small';
        tooltip.style.maxWidth = '200px';
        tooltip.style.boxShadow = '3px 3px 3px rgba(0,0,0,0.2)';
        //tooltip.innerText = request.text;
        // gpt 응답 얻어오기
        chrome.storage.sync.get('gptApiKey', function(data) {
            const apiKey = data.gptApiKey;
            if (!apiKey) {
                alert('API Key가 등록되지 않았습니다. 우클릭을 눌러 설정해주세요.');
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
                    model: "gpt-4",
                    messages: [
                    {
                        "role": "system",
                        "content": "주어진 질문에 대해서 한줄로 답을 알려주세요. 객관식이라면 답의 번호를 알려주고, 주관식이라면 짧게 답변하세요."
                    },
                    {
                        "role": "user",
                        "content": request.text // 사용자 질문
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
                    // 답변 생성 이후 툴팁에 복사
                    tooltip.innerText = responseText;
                    // 클립보드에 복사 추가
                } else {
                    //alert('답변을 받아오지 못했습니다.');
                    console.error('답변을 받아오지 못했습니다.', error);
                }
            })
            .catch(error => {
                console.error('오류가 발생했습니다:', error);
                //alert('오류가 발생했습니다: ' + error.message);
            });
        });

        const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
        tooltip.style.top = (rect.top + window.scrollY - tooltip.offsetHeight - 5) + 'px';
        tooltip.style.left = (rect.left + window.scrollX) + 'px';
        document.body.appendChild(tooltip);

        setTimeout(() => {
            tooltip.remove();
        }, 3000);

        // 응답 보내기
        sendResponse({status: "Text displayed"});
    }
    return true;  // keep the message channel open for asynchronous response
});
