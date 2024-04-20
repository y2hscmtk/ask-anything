// content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.text) {

        const tooltip = document.createElement('div');
        tooltip.style.position = 'fixed';
        tooltip.style.zIndex = '1000';
        tooltip.style.width = 'auto';
        tooltip.style.height = 'auto';
        tooltip.style.overflowY = 'auto'; // Y축 스크롤 가능
        tooltip.style.backgroundColor = 'white';
        tooltip.style.color = 'black';
        tooltip.style.border = '1px solid black';
        tooltip.style.borderRadius = '4px';
        tooltip.style.padding = '5px';
        tooltip.style.fontSize = 'small';
        tooltip.style.maxWidth = '200px';
        tooltip.style.boxShadow = '3px 3px 3px rgba(0,0,0,0.2)';
        // 크롬 확장 프로그램 저장소에서 사용자 API Key와 프롬프트, 툴팁 유지 시간 얻어오기
        chrome.storage.sync.get(['gptApiKey', 'promptText', 'tooltipDuration'], function(data) {
            const apiKey = data.gptApiKey;
            // 사용자가 입력한 프롬프트가 없다면 디폴트로 적용
            const promptText = data.promptText || "주어진 질문에 대해서 한줄로 답을 알려주세요. 객관식이라면 답의 번호를 알려주고, 주관식이라면 짧게 답변하세요.";
            // 사용자가 설정한 유지시간으로 적용, 없다면 디폴트로 3초
            const tooltipDuration = (parseInt(data.tooltipDuration) || 3) * 1000;

            // API 등록 안되어있다면 리턴
            if (!apiKey) {
                alert('API Key가 등록되지 않았습니다. 옵션을 눌러 설정해주세요.');
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
                        "content": promptText
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
                    console.log("응답 생성됨")
                    // 답변 생성 이후 툴팁에 복사
                    tooltip.innerText = responseText;
                    // 클립보드에 복사
                    navigator.clipboard.writeText(responseText).then(() => {
                        console.log('클립보드에 복사 성공!');
                    }).catch(err => {
                        console.error('클립보드에 복사 실패:', err);
                    });
                    // 클립보드 복사 이후 tooltipDuration초 뒤에 툴팁이 지워지도록
                    setTimeout(() => {
                        tooltip.remove();
                    }, tooltipDuration);
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

        

        // 응답 보내기
        sendResponse({status: "Text displayed"});
    }
    return true;  // keep the message channel open for asynchronous response
});
