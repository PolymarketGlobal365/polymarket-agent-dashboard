## Polymarket Forecast Dashboard

사진처럼 어두운 트레이딩 데스크 감성의 폴리마켓 승률 예측 대시보드를 생성하는 기능입니다.

### 무엇을 하나요

- 라이브 Polymarket 보상형 마켓 시그널을 불러옵니다.
- 승률이 높은 후보를 어두운 터미널 스타일 UI로 정리합니다.
- 사용자가 직접 선택한 AI 에이전트 이름, 모델명, 전략 설명을 화면에 반영합니다.
- 결과물을 HTML 파일로 저장하므로 다운로드 후 바로 열 수 있습니다.

### 기본 실행

```bash
npm run build
npm run forecast:dashboard
```

생성 파일:

- `output/polymarket-forecast-dashboard.html`
- `output/polymarket-forecast-snapshot.json`

### 내 AI 에이전트 설정 파일 만들기

```bash
node dist/polymarket-forecast-dashboard.js --write-template --config-file output/my-agent.json
```

이후 `output/my-agent.json`을 수정한 뒤:

```bash
node dist/polymarket-forecast-dashboard.js --config-file output/my-agent.json
```

### 설정 예시

```json
{
  "title": "Moon Desk",
  "subtitle": "Polymarket signal board",
  "accent": "green",
  "agent": {
    "agentName": "Moon Dev Agent",
    "provider": "OpenAI",
    "model": "gpt-5.4",
    "strategy": "보상률과 호가 균형이 함께 좋은 마켓만 빠르게 추리는 단기 전략",
    "riskStyle": "balanced",
    "voiceNote": "냉정한 야간 데스크 톤"
  }
}
```

### 다음 확장 포인트

- 실제 LLM API 키를 연결해 카드별 자연어 코멘트 자동 생성
- 사용자별 마켓 필터와 리스크 한도 반영
- Electron 또는 웹앱 포장으로 완전한 배포형 프로그램화
