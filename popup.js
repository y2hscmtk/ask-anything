document.getElementById('questionInput').addEventListener('change', function() {
    const question = this.value;
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
                // 답변 생성 이후 복사 버튼 활성화
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
    // .then(() => {
    //     alert('응답이 클립보드에 복사되었습니다.');
    // })
    // .catch(err => {
    //     console.error('복사 실패:', err);
    //     alert('오류가 발생했습니다: ' + err.message);
    // });
});
