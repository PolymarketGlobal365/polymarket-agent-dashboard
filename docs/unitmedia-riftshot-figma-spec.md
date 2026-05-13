# UNITEMEDIA Figma Build Spec

이 문서는 [apps/unitmedia-site/index.html](C:/Users/jyjy6/Documents/New%20project/apps/unitmedia-site/index.html) 기준의 랜딩페이지를 Figma에서 다시 제작하기 위한 스펙이다. 목표는 현재 코드 버전을 바탕으로, [riftshot.com](https://www.riftshot.com/)과 유사한 화면 리듬, 타이포그래피, 섹션 흐름을 Figma에서 재현하는 것이다.

## 1. 파일 구조

- Page name: `UNITEMEDIA Landing`
- Frames
- `Desktop / 1440`
- `Mobile / 390`
- 참고 이미지 배치용 보조 프레임
- `Reference / Full Page`

## 2. 프레임 기본값

### Desktop

- Frame size: `1440 x 7600` 시작
- Layout grid: `12 columns`
- Margin: `24`
- Gutter: `24`
- Background: `#000000`

### Mobile

- Frame size: `390 x 7200` 시작
- Layout grid: `4 columns`
- Margin: `12`
- Gutter: `12`
- Background: `#000000`

## 3. 타이포그래피

Riftshot 계열에 맞춰 세리프 헤드라인 + 산세리프 본문 구조로 간다.

- Display font: `Playfair Display`
- UI font: `Inter`

### Text styles

- `Hero / Display`
- Font: `Playfair Display`
- Weight: `600`
- Size: `88`
- Line height: `90`
- Letter spacing: `-4%`

- `Hero / Display Italic`
- Font: `Playfair Display`
- Weight: `400`
- Style: `Italic`
- Size: `88`
- Line height: `90`
- Letter spacing: `-4%`

- `Section / Title`
- Font: `Inter`
- Weight: `700`
- Size: `32`
- Line height: `38`

- `Card / Title`
- Font: `Inter`
- Weight: `600`
- Size: `22`
- Line height: `28`

- `Body / Large`
- Font: `Inter`
- Weight: `400`
- Size: `17`
- Line height: `26`

- `Body / Default`
- Font: `Inter`
- Weight: `400`
- Size: `15`
- Line height: `24`

- `Label / Uppercase`
- Font: `Inter`
- Weight: `500`
- Size: `11`
- Line height: `16`
- Letter spacing: `8%`

## 4. 컬러 시스템

- `BG / Base`: `#000000`
- `Text / Primary`: `#FFFFFF`
- `Text / Muted`: `rgba(255,255,255,0.72)`
- `Text / Soft`: `rgba(255,255,255,0.46)`
- `Panel / Soft`: `rgba(255,255,255,0.06)`
- `Line / Soft`: `rgba(255,255,255,0.12)`
- `White / Solid`: `#FFFFFF`
- `Black / Solid`: `#000000`

## 5. 배경 처리

Riftshot처럼 완전 평면 검정보다, 흐릿한 유기형 블러가 깔린 블랙 배경으로 간다.

- Base fill: `#000000`
- Background blur shape A
- 위치: 좌상단
- 색: 흰색 22% 투명도
- Blur: `60`
- Rotation: `-14deg`

- Background blur shape B
- 위치: 우하단
- 색: 흰색 14% 투명도
- Blur: `60`

- Grid texture
- 150 x 150 반복
- 흰색 6% 선

## 6. 섹션 순서

1. Top navigation
2. Hero
3. Features split section
4. Expandable formats grid
5. Large showcase stack
6. White pricing section
7. CTA
8. Footer

## 7. 섹션별 제작 방법

### 7-1. Top navigation

- Width: `1152`
- Height: `48`
- 위치: top `16`
- 좌측: 브랜드 점 + `UNITEMEDIA`
- 중앙: `Features / Formats / Pricing`
- 우측: white pill CTA

#### 스타일

- Background 없음
- 텍스트는 흰색
- CTA
- Height: `42`
- Padding: `18 horizontal`
- Radius: `999`
- Fill: `#FFFFFF`
- Text: `#000000`

### 7-2. Hero

- 상단 여백: `132`
- 중앙 정렬
- 전체 폭: `760`

#### 제목

두 줄 구조:

- `Cultural stories`
- `with modern impact`

둘째 줄은 `Playfair Display Italic`

#### 본문

- Max width: `700`
- 중앙 정렬
- Color: muted white

#### CTA

- White pill button 하나

### 7-3. Hero demo card

- Width: `1152`
- Height: 약 `520`
- Radius: `22`
- Stroke: white `26%`
- Background:
- top highlight + dark panel

#### 내부 구조

- 왼쪽 메인 미리보기 그리드
- 오른쪽 세로 카드 3개
- toolbar dots 3개 상단

#### 좌측 그리드

- 3 columns / 2 rows
- gap `14`
- 왼쪽 큰 카드 하나가 2열 2행 차지
- 우측엔 정사각 카드 2개와 하단 카드 1개

#### 우측 세로 카드

- 3개
- height `144`
- Radius `18`
- Fill `rgba(255,255,255,0.04)`

### 7-4. Features split section

- Desktop 기준 2 columns
- Left: feature buttons 4개 세로 정렬
- Right: sticky preview card

#### Feature item

- Padding: `28`
- Radius: `24`
- 기본 opacity 낮음
- active item만 배경 `rgba(255,255,255,0.02)`

#### Preview card

- Height: `520`
- Radius: `24`
- 내부 2 column
- 왼쪽 큰 패널, 오른쪽 3단 스택

### 7-5. Expandable formats

- Section title 중앙 정렬
- 하단 8개 카드
- `4 x 2` grid on desktop
- 각 카드
- aspect ratio `1:1`
- fill `rgba(255,255,255,0.04)`
- 작은 레이아웃 도형은 흰색과 반투명 흰색 조합

레이블:

- Single
- Horizontal
- Vertical
- Grid
- Left
- Right
- Quincunx
- Bento

### 7-6. Large showcase stack

Riftshot의 "Made for Creators" 섹션처럼 큰 세로 카드 4개를 연속 배치한다.

- 카드 height: `80vh` 느낌
- Radius: `24`
- 어두운 그라디언트 + 약한 블러 광원
- 각 카드 우하단에 white info panel

카드 제목:

- 문화유산 프로젝트
- 브랜드 캠페인
- 제안형 랜딩페이지
- 숏폼 시리즈

### 7-7. White pricing section

- 배경: `#FFFFFF`
- 전체 폭 꽉 차게
- 내부 content width: `1152`
- 상단 제목 중앙 정렬
- 하단 2 cards

#### Pricing card

- Radius: `22`
- Border: black `8%`
- Shadow: 약하게
- CTA는 black pill

### 7-8. CTA section

- Dark background로 복귀
- 중앙 큰 카드
- Radius: `18`
- 중앙 정렬
- 흰색 radial glow

### 7-9. Footer

- Top border 1px
- 4 column link group
- 하단에 `UNITEMEDIA` 대형 워드마크
- 우측 아래 copyright

## 8. 컴포넌트로 분리할 것

- `Nav / Link`
- `Button / White Pill`
- `Button / Black Pill`
- `Feature Item / Default`
- `Feature Item / Active`
- `Format Card`
- `Info Panel / White`
- `Footer Link Group`

## 9. 오토레이아웃 권장

- 페이지 전체: vertical auto layout
- 섹션 간 gap: `88 ~ 120`
- Hero copy: vertical auto layout
- Feature list: vertical auto layout
- Pricing cards: horizontal auto layout
- Footer links: horizontal auto layout

## 10. 현재 코드 기준 카피

### Hero

- `Cultural stories`
- `with modern impact`

### Hero body

- `유니트미디어는 문화유산과 브랜드를 지금의 화면 언어로 다시 설계합니다. 전통의 맥락을 잃지 않으면서도 사람들이 멈춰 보게 되는 장면으로 바꿉니다.`

### CTA

- `프로젝트 시작하기`

## 11. 참고 산출물

현재 렌더 기준 레퍼런스 이미지:

- [unitmedia-site-riftshot-style.png](C:/Users/jyjy6/Documents/New%20project/output/unitmedia-site-riftshot-style.png)
- [riftshot-reference.png](C:/Users/jyjy6/Documents/New%20project/output/riftshot-reference.png)

## 12. 다음 단계

Figma 연결이 가능한 세션으로 전환되면 아래 순서로 바로 작업하면 된다.

1. `Desktop / 1440` 프레임 생성
2. 배경 블러와 그리드 텍스처 배치
3. Navigation 구성
4. Hero와 demo card 생성
5. Features split section 생성
6. Formats grid 생성
7. Large showcase stack 생성
8. White pricing section 생성
9. CTA와 footer 생성
10. Mobile 프레임으로 재배치
