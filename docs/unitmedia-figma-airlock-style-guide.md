# UNITEMEDIA Figma Landing Guide

이 문서는 `https://www.airlockcompany.com/`의 무드를 참고하되, 유니트미디어 브랜드에 맞게 재구성한 랜딩 페이지 디자인 가이드다.

목표:
- 에이전시형 회사 소개 사이트
- 큰 헤드라인과 또렷한 사업영역 카드
- 밝은 크림 배경 + 블랙 타이포
- 고급스럽고 단단한 스튜디오 인상

## 1. 파일 시작

Figma Sites 또는 일반 Figma Design 파일에서 아래 두 프레임으로 시작한다.

- Desktop Frame: `1440 x 4200`
- Mobile Frame: `390 x 3600`

페이지 이름:
- `UNITEMEDIA Landing`

섹션 순서:
- Header
- Hero
- Intro Strip
- Why UNITEMEDIA
- Business
- Positioning
- Process
- Contact

## 2. 그리드

Desktop:
- Columns: `12`
- Margin: `64`
- Gutter: `24`

Mobile:
- Columns: `4`
- Margin: `20`
- Gutter: `12`

## 3. 컬러 스타일

- `BG / Base`: `#F3EDE2`
- `BG / Soft`: `#FFFAF4`
- `Text / Primary`: `#111111`
- `Text / Muted`: `#5E564C`
- `Text / Soft`: `#857A6A`
- `Accent / Gold`: `#D19B4F`
- `Accent / Gold Deep`: `#A06F2F`
- `Stroke / Light`: `rgba(17,17,17,0.08)`

배경 처리:
- 전체 배경은 `#F3EDE2`
- 좌상단에 아주 옅은 골드 그라디언트 원형 하나
- 너무 화려하게 하지 말고 거의 안 보일 정도로만 적용

## 4. 텍스트 스타일

추천 폰트:
- Display: `Cormorant Garamond` 또는 `Iowan Old Style`
- UI/Text: `Pretendard` 또는 `SUIT`

Text Styles:

- `Display / Hero`
  - Size: `96`
  - Weight: `700`
  - Line Height: `88`
  - Letter Spacing: `-4%`

- `Display / Section`
  - Size: `56`
  - Weight: `700`
  - Line Height: `54`
  - Letter Spacing: `-3%`

- `Heading / Card`
  - Size: `24`
  - Weight: `700`
  - Line Height: `30`

- `Body / Large`
  - Size: `18`
  - Weight: `400`
  - Line Height: `31`

- `Body / Default`
  - Size: `16`
  - Weight: `400`
  - Line Height: `28`

- `Label / Eyebrow`
  - Size: `11`
  - Weight: `700`
  - Line Height: `16`
  - Letter Spacing: `18%`
  - Uppercase

## 5. 공통 컴포넌트

### Header

크기:
- Width: `1312`
- Height: `72`
- X: `64`
- Y: `24`

스타일:
- Fill: `rgba(255,250,242,0.82)`
- Stroke: `rgba(17,17,17,0.08)`
- Radius: `22`
- Effect: `0 20 60 rgba(17,17,17,0.08)`
- Backdrop blur 느낌으로 표현

내부 구성:
- 좌측 로고 블록
- 중앙 메뉴 4개
- 우측 CTA 버튼

로고 마크:
- 44 x 44
- Radius: `14`
- Fill: `#111111`
- Text: `UM`

CTA 버튼:
- Height: `48`
- Padding: `18 / 18`
- Radius: `999`
- Fill: `#111111`
- Text: `#F7F1E5`

### Button Primary
- Height: `54`
- Radius: `999`
- Fill: `#111111`
- Text: `#F7F1E5`
- Horizontal padding: `22`

### Button Secondary
- Height: `54`
- Radius: `999`
- Fill: `transparent`
- Stroke: `rgba(17,17,17,0.24)`
- Text: `#111111`

### Info Card
- Fill: `rgba(255,251,245,0.78)`
- Stroke: `rgba(17,17,17,0.08)`
- Radius: `24`
- Shadow: `0 20 60 rgba(17,17,17,0.08)`
- Padding: `24` or `28`

### Dark Quote Card
- Fill: `#111111`
- Text: `#F7F1E5`
- Radius: `24`
- Padding: `28`

## 6. 섹션별 배치

### 6-1. Hero

프레임 높이:
- `760`

구성:
- 좌측 큰 카피
- 우측 리드 카드 + 3개 미니 카드

좌측 컬럼:
- Width: 약 `620`
- 상단 eyebrow
- 3줄짜리 초대형 헤드라인
- 본문 2~3줄
- 버튼 2개

헤드라인 예시 줄바꿈:
- 문화유산을
- 지금 반응하는 콘텐츠
- 로 만듭니다

우측 컬럼:
- 상단 다크 카드 1개
- 하단 3열 미니 카드

우측 상단 카드:
- Width: `100%`
- Height: `156`
- Fill: `#111111`
- Radius: `24`

하단 미니 카드:
- 3 columns
- Gap: `16`
- Height: `140`

### 6-2. Intro Strip

위치:
- Hero 아래 `32`

구성:
- 3개 pill/card
- 각각 Height `56`
- Radius `18`
- 중앙정렬

문구 예시:
- 문화유산의 깊이
- 브랜드가 기억되는 화면
- AI와 제작 감각의 결합

### 6-3. Why UNITEMEDIA

섹션 제목:
- 좌측 정렬
- `왜 유니트미디어인가요?`

아래 카드:
- 4열
- Gap `16`
- Card height `188~210`

카드 구조:
- 작은 uppercase 키워드
- 짧은 제목
- 2~3줄 설명

키워드 예시:
- NEW
- STORY
- HYBRID
- QUALITY

### 6-4. Business

섹션 제목 아래:
- 2 x 2 카드 그리드
- Gap `18`

각 카드:
- Height `220`
- Radius `24`
- Padding `28`

구성:
- 서비스명
- 한 줄 요약
- bullet 3개

### 6-5. Positioning

좌측:
- 섹션 제목 + 설명
- 아래 checklist 카드

우측:
- 큰 인용문 다크 카드

비율:
- 좌측 `1.1fr`
- 우측 `0.9fr`

다크 인용문 카드 높이:
- `240~280`

### 6-6. Process

세로 스택형 카드 4개

각 카드:
- Height `108`
- Radius `22`
- 좌측 번호 배지
- 우측 단계 제목 + 설명

번호 배지:
- 52 x 52
- Radius `16`
- Fill `#111111`

### 6-7. Contact

2 columns

좌측:
- 큰 마지막 메시지
- 설명 본문

우측:
- 3개 정보 카드
- 맨 아래 검정 CTA 바

우측 패널:
- Fill `rgba(255,251,245,0.78)`
- Radius `24`
- Padding `24`

## 7. Figma 제작 순서

1. Desktop frame 생성
2. 12컬럼 그리드 적용
3. 전체 배경색 먼저 지정
4. Header 컴포넌트 제작
5. Hero 제작
6. Info Card 컴포넌트 생성
7. Why/Business/Process에 반복 적용
8. Mobile frame로 축약 배치

## 8. Auto Layout 추천값

섹션 컨테이너:
- Direction: Vertical
- Gap: `28`

카드 내부:
- Padding: `24` 또는 `28`
- Gap: `10~14`

페이지 전체:
- Direction: Vertical
- Gap: `76`

## 9. 절대 피해야 할 것

- 검정 배경만 그대로 베끼기
- 카드 배치를 1:1로 그대로 따라가기
- 문구 톤과 정보 구조까지 같은 방식으로 복사하기
- 이미지 없이도 화려한 효과만 많이 넣기

## 10. 유니트미디어용 차별화 포인트

에어락과 다르게 유니트미디어는 아래를 강조한다.

- 문화유산과 전통브랜드
- 스토리와 장소성
- SNS형 콘텐츠 확장성
- 제안용 랜딩과 소개형 페이지 연결

따라서 디자인은 비슷한 에이전시 무드를 참고하되, 문장 톤과 정보 구조는 더 차분하고 브랜드 소개 중심으로 가져간다.

## 11. 바로 작업할 때 제일 쉬운 방식

Figma 안에서 아래 순서만 따라도 된다.

1. `1440 x 4200` 프레임 생성
2. 배경색 `#F3EDE2`
3. 상단 72px 헤더 바 생성
4. 왼쪽 큰 헤드라인 텍스트 배치
5. 오른쪽 검정 카드 + 3개 미니 카드 생성
6. 아래 3개 pill 추가
7. Why 섹션 카드 4개
8. Business 섹션 카드 4개
9. Process 카드 4개
10. Contact 2컬럼 추가

이 문서를 보면서 만들면 현재 코드 시안과 거의 같은 구조로 Figma에서도 빠르게 재현할 수 있다.
