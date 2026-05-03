import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";

const root = path.resolve("output/slide_samples");
const folderRoot = path.join(root, "2026_06_SeoulAuction_예시");
const suffix = "_v2";

fs.mkdirSync(root, { recursive: true });

function styleHeader(row) {
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, name: "Malgun Gothic" };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF183B63" } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: "FFC9D3DD" } },
      left: { style: "thin", color: { argb: "FFC9D3DD" } },
      bottom: { style: "thin", color: { argb: "FFC9D3DD" } },
      right: { style: "thin", color: { argb: "FFC9D3DD" } }
    };
  });
}

function styleBody(ws) {
  ws.eachRow((row, idx) => {
    if (idx === 1) return;
    row.eachCell((cell) => {
      cell.font = { name: "Malgun Gothic", size: 10 };
      cell.alignment = { vertical: "top", horizontal: "left", wrapText: true };
      cell.border = {
        top: { style: "thin", color: { argb: "FFD8E1EA" } },
        left: { style: "thin", color: { argb: "FFD8E1EA" } },
        bottom: { style: "thin", color: { argb: "FFD8E1EA" } },
        right: { style: "thin", color: { argb: "FFD8E1EA" } }
      };
    });
  });
}

async function createComparisonWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Codex";
  wb.created = new Date();

  const expected = wb.addWorksheet("예정자료");
  expected.columns = [
    { header: "경매일", key: "auctionDate", width: 14 },
    { header: "경매사", key: "auctionHouse", width: 16 },
    { header: "옥션명", key: "saleName", width: 26 },
    { header: "LOT", key: "lot", width: 10 },
    { header: "작가명", key: "artist", width: 18 },
    { header: "작품명", key: "title", width: 28 },
    { header: "제작년도", key: "year", width: 12 },
    { header: "재료", key: "material", width: 24 },
    { header: "규격(cm)", key: "size", width: 18 },
    { header: "추정가(최저)", key: "estimateLow", width: 14 },
    { header: "추정가(최고)", key: "estimateHigh", width: 14 },
    { header: "이미지파일명", key: "image", width: 28 },
    { header: "비고", key: "note", width: 24 }
  ];
  styleHeader(expected.getRow(1));
  expected.addRows([
    ["2026-06-15", "서울옥션", "Seoul Auction Major Sale", "012", "김환기", "무제", "1971", "Oil on canvas", "45.5 x 53.0", "KRW 350,000,000", "KRW 500,000,000", "20260615_SeoulAuction_LOT012.jpg", "프리뷰 기준 수집"],
    ["2026-06-15", "서울옥션", "Seoul Auction Major Sale", "013", "박서보", "묘법 No.3", "1985", "Mixed media on canvas", "91.0 x 72.7", "KRW 120,000,000", "KRW 180,000,000", "20260615_SeoulAuction_LOT013.jpg", "프리뷰 기준 수집"],
    ["2026-06-15", "서울옥션", "Seoul Auction Major Sale", "014", "이우환", "Dialogue", "2014", "Oil and mineral pigment on canvas", "162.0 x 130.0", "KRW 200,000,000", "KRW 300,000,000", "20260615_SeoulAuction_LOT014.jpg", "프리뷰 기준 수집"]
  ]);
  styleBody(expected);
  expected.views = [{ state: "frozen", ySplit: 1 }];

  const result = wb.addWorksheet("결과자료");
  result.columns = [
    { header: "경매일", key: "auctionDate", width: 14 },
    { header: "경매사", key: "auctionHouse", width: 16 },
    { header: "옥션명", key: "saleName", width: 26 },
    { header: "LOT", key: "lot", width: 10 },
    { header: "작가명", key: "artist", width: 18 },
    { header: "작품명", key: "title", width: 28 },
    { header: "출품결과", key: "status", width: 12 },
    { header: "낙찰가", key: "hammer", width: 16 },
    { header: "변경사항", key: "change", width: 24 },
    { header: "최종반영일", key: "updatedAt", width: 16 }
  ];
  styleHeader(result.getRow(1));
  result.addRows([
    ["2026-06-15", "서울옥션", "Seoul Auction Major Sale", "012", "김환기", "무제", "낙찰", "KRW 468,000,000", "낙찰가 반영", "2026-06-16"],
    ["2026-06-15", "서울옥션", "Seoul Auction Major Sale", "013", "박서보", "묘법 No.3", "출품취소", "-", "출품취소 반영", "2026-06-15"],
    ["2026-06-15", "서울옥션", "Seoul Auction Major Sale", "015", "이우환", "Dialogue", "낙찰", "KRW 285,000,000", "LOT 014 → 015 변경", "2026-06-16"]
  ]);
  styleBody(result);
  result.views = [{ state: "frozen", ySplit: 1 }];

  const compare = wb.addWorksheet("변경비교");
  compare.columns = [
    { header: "구분", key: "type", width: 14 },
    { header: "경매사", key: "house", width: 16 },
    { header: "경매일", key: "date", width: 14 },
    { header: "LOT", key: "lot", width: 12 },
    { header: "작가명", key: "artist", width: 16 },
    { header: "항목", key: "field", width: 14 },
    { header: "예정자료", key: "before", width: 24 },
    { header: "결과자료", key: "after", width: 24 },
    { header: "반영설명", key: "desc", width: 28 }
  ];
  styleHeader(compare.getRow(1));
  compare.addRows([
    ["출품취소", "서울옥션", "2026-06-15", "013", "박서보", "출품결과", "출품예정", "출품취소", "프리뷰 기준 수집 후 결과자료에서 취소 확인"],
    ["LOT 변경", "서울옥션", "2026-06-15", "014", "이우환", "LOT", "014", "015", "결과 페이지에서 LOT 변경 확인 후 반영"],
    ["낙찰가 반영", "서울옥션", "2026-06-15", "012", "김환기", "낙찰가", "-", "KRW 468,000,000", "결과 공시 직후 낙찰가 반영"]
  ]);
  styleBody(compare);
  compare.views = [{ state: "frozen", ySplit: 1 }];

  const slide = wb.addWorksheet("슬라이드삽입용_요약");
  slide.columns = [
    { header: "항목", key: "item", width: 20 },
    { header: "설명", key: "desc", width: 72 }
  ];
  styleHeader(slide.getRow(1));
  slide.addRows([
    ["슬라이드 제목", "예정자료 vs 결과자료 비교"],
    ["핵심 메시지", "예정자료와 결과자료를 분리 관리하여 출품취소, LOT 변경, 낙찰가 반영 등 변경이력을 명확히 추적합니다."],
    ["강조 포인트 1", "프리뷰 단계에서 수집한 예정자료가 결과자료 비교의 기준점이 됩니다."],
    ["강조 포인트 2", "출품취소, LOT 변경, 낙찰가 반영 누락을 차이값 중심으로 검수합니다."],
    ["강조 포인트 3", "변경사항은 검수표 및 변경이력표에 동시에 반영하여 등록 전 정합성을 확보합니다."]
  ]);
  styleBody(slide);
  slide.views = [{ state: "frozen", ySplit: 1 }];

  const file = path.join(root, `2026_미술작품_예정_vs_결과_비교_샘플${suffix}.xlsx`);
  await wb.xlsx.writeFile(file);
  return file;
}

async function createQaWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Codex";
  const ws = wb.addWorksheet("검수표");
  ws.columns = [
    { header: "검수일", key: "checkedAt", width: 14 },
    { header: "경매일", key: "auctionDate", width: 14 },
    { header: "경매사", key: "auctionHouse", width: 16 },
    { header: "옥션명", key: "saleName", width: 24 },
    { header: "LOT", key: "lot", width: 10 },
    { header: "작가명", key: "artist", width: 16 },
    { header: "검수항목", key: "field", width: 16 },
    { header: "오류내용", key: "issue", width: 22 },
    { header: "수정 전", key: "before", width: 24 },
    { header: "수정 후", key: "after", width: 24 },
    { header: "검수자", key: "checker", width: 12 },
    { header: "비고", key: "note", width: 20 }
  ];
  styleHeader(ws.getRow(1));
  ws.addRows([
    ["2026-06-16", "2026-06-15", "서울옥션", "Seoul Auction Major Sale", "012", "김환기", "낙찰가", "결과 반영 누락", "-", "KRW 468,000,000", "서헌강", "공시자료 대조 후 수정"],
    ["2026-06-16", "2026-06-15", "서울옥션", "Seoul Auction Major Sale", "013", "박서보", "출품결과", "출품취소 미반영", "출품예정", "출품취소", "서헌강", "결과 페이지 확인"],
    ["2026-06-16", "2026-06-15", "서울옥션", "Seoul Auction Major Sale", "014", "이우환", "LOT", "LOT 변경 누락", "014", "015", "서헌강", "공개자료와 비교"]
  ]);
  styleBody(ws);
  ws.views = [{ state: "frozen", ySplit: 1 }];
  const file = path.join(root, `2026_미술작품_검수표_샘플${suffix}.xlsx`);
  await wb.xlsx.writeFile(file);
  return file;
}

async function createChangeLogWorkbook() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("변경이력표");
  ws.columns = [
    { header: "경매일", key: "auctionDate", width: 14 },
    { header: "대상", key: "target", width: 20 },
    { header: "변경항목", key: "field", width: 16 },
    { header: "기존값", key: "before", width: 24 },
    { header: "변경값", key: "after", width: 24 },
    { header: "반영일", key: "updatedAt", width: 14 },
    { header: "근거자료", key: "evidence", width: 28 },
    { header: "비고", key: "note", width: 22 }
  ];
  styleHeader(ws.getRow(1));
  ws.addRows([
    ["2026-03-10", "Sotheby's N.Y / 김환기", "낙찰가", "$45,000", "$43,500 (보정)", "2026-03-15", "결과 공시 재확인", "보정가 반영"],
    ["2026-03-12", "서울옥션 / 박서보", "출품여부", "출품예정", "출품취소", "2026-03-12", "공개자료 화면 캡처", "즉시 반영"],
    ["2026-03-14", "Phillips / 이우환", "LOT", "LOT 101", "LOT 103", "2026-03-14", "세일 결과 페이지", "LOT 변경"]
  ]);
  styleBody(ws);
  ws.views = [{ state: "frozen", ySplit: 1 }];
  const file = path.join(root, `2026_미술작품_변경이력표_샘플${suffix}.xlsx`);
  await wb.xlsx.writeFile(file);
  return file;
}

async function createMilestoneWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Codex";

  const ws = wb.addWorksheet("마일스톤운영기준");
  ws.columns = [
    { header: "경매사", key: "house", width: 18 },
    { header: "옥션명", key: "sale", width: 30 },
    { header: "프리뷰 시작일", key: "preview", width: 16 },
    { header: "경매일", key: "auction", width: 14 },
    { header: "결과 공시일", key: "notice", width: 16 },
    { header: "검수 완료일", key: "qa", width: 16 },
    { header: "제출 완료일", key: "submit", width: 16 },
    { header: "운영 메모", key: "memo", width: 32 }
  ];
  styleHeader(ws.getRow(1));
  ws.addRows([
    ["서울옥션", "Seoul Auction Major Sale", "2026-06-08", "2026-06-15", "2026-06-15", "2026-06-19", "2026-06-22", "프리뷰 기간 중 예정자료 생성, 결과 공시 당일 낙찰가 1차 반영"],
    ["케이옥션", "K Auction June Sale", "2026-06-11", "2026-06-18", "2026-06-18", "2026-06-23", "2026-06-25", "LOT 변경 및 출품취소 여부 정기 검수 포함"],
    ["Sotheby's", "Modern & Contemporary Evening Sale", "2026-06-05", "2026-06-13", "2026-06-13", "2026-06-18", "2026-06-20", "한국 작가 분류 및 플랫폼 교차검증 병행"],
    ["Christie's", "20/21 Century Sale", "2026-06-09", "2026-06-16", "2026-06-16", "2026-06-20", "2026-06-23", "결과 보정 여부 재확인 후 최종 제출"]
  ]);
  styleBody(ws);
  ws.views = [{ state: "frozen", ySplit: 1 }];

  const guide = wb.addWorksheet("슬라이드삽입용_요약");
  guide.columns = [
    { header: "항목", key: "item", width: 20 },
    { header: "설명", key: "desc", width: 72 }
  ];
  styleHeader(guide.getRow(1));
  guide.addRows([
    ["슬라이드 제목", "추진일정 및 마일스톤 운영 기준"],
    ["핵심 메시지", "월별 일정표만이 아니라 프리뷰 시작일, 경매일, 결과 공시일, 검수 완료일, 제출 완료일의 5개 마일스톤을 기준으로 경매별 일정을 관리합니다."],
    ["강조 포인트 1", "경매별 진척 상태를 주간 단위로 점검하여 일정 지연과 자료 누락을 방지합니다."],
    ["강조 포인트 2", "국내외 경매 일정이 중첩되는 경우 수집·검수 기능을 분산 운영하여 마감 리스크를 최소화합니다."],
    ["강조 포인트 3", "검수 완료일과 제출 완료일을 분리 관리하여 등록 전 데이터 정합성을 확보합니다."]
  ]);
  styleBody(guide);
  guide.views = [{ state: "frozen", ySplit: 1 }];

  const file = path.join(root, `2026_미술작품_마일스톤운영기준_샘플${suffix}.xlsx`);
  await wb.xlsx.writeFile(file);
  return file;
}

function createFolderStructure() {
  fs.mkdirSync(folderRoot, { recursive: true });
  for (const sub of ["excel", "images", "capture", "qa"]) {
    fs.mkdirSync(path.join(folderRoot, sub), { recursive: true });
  }
  fs.writeFileSync(path.join(folderRoot, "excel", "20260615_SeoulAuction_result.xlsx.txt"), "예정·결과 자료 예시 파일 위치", "utf8");
  fs.writeFileSync(path.join(folderRoot, "images", "20260615_SeoulAuction_LOT012.jpg.txt"), "작품 이미지 예시 파일 위치", "utf8");
  fs.writeFileSync(path.join(folderRoot, "capture", "20260615_SeoulAuction_result_page01.png.txt"), "경매사 홈페이지 공개자료 캡처 예시 위치", "utf8");
  fs.writeFileSync(path.join(folderRoot, "qa", "20260615_SeoulAuction_qa_checklist.xlsx.txt"), "검수표 예시 파일 위치", "utf8");
}

function createGuide() {
  const md = `# 발표자료 삽입용 샘플 가이드

## A. 국내 경매사 자료 수집 예시 슬라이드
- 추천 화면: 서울옥션 또는 케이옥션 프리뷰 페이지
- 화면 위 표시 박스: 작가명 / 작품명 / LOT / 추정가 / 이미지
- 슬라이드 문구:
  - 프리뷰 단계에서 출품 예정 작품의 핵심 항목을 선수집하여 예정자료를 생성합니다.
  - 작가명, 작품명, LOT, 추정가, 이미지 정보를 구조화하여 결과자료와 비교 가능한 기준자료로 활용합니다.

## B. 해외 경매사 자료 수집 예시 슬라이드
- 추천 화면: Sotheby's 또는 Christie's 세일 페이지
- 보조 화면: Artprice 또는 MutualArt 검색 결과
- 슬라이드 문구:
  - 해외 세일 전체를 확인한 뒤 한국 작가를 분류하는 방식을 기본안으로 적용합니다.
  - 플랫폼 검색 결과를 교차 검증 수단으로 활용하여 누락 가능성을 최소화합니다.

## C. 예정자료 vs 결과자료 비교 예시
- 사용 파일: 2026_미술작품_예정_vs_결과_비교_샘플.xlsx
- 강조 항목: 출품취소 / LOT 변경 / 낙찰가 반영
- 슬라이드 문구:
  - 예정자료와 결과자료를 분리 관리하여 변경이력을 명확히 확인합니다.
  - 차이값 중심 검수를 통해 출품취소, LOT 변경, 낙찰가 반영 누락을 방지합니다.

## D. 검수표 샘플
- 사용 파일: 2026_미술작품_검수표_샘플.xlsx
- 컬럼 예시: 검수일 / 경매일 / 경매사 / 항목 / 오류내용 / 수정 전 / 수정 후 / 검수자
- 슬라이드 문구:
  - 검수표를 통해 오류 유형과 수정 이력을 문서화합니다.
  - 수집자료와 공시자료를 비교한 근거를 남겨 추적 가능성을 확보합니다.

## E. 변경이력표 샘플
- 사용 파일: 2026_미술작품_변경이력표_샘플.xlsx
- 대표 예시: Sotheby's / 낙찰가 변경 / 기존값 / 변경값 / 반영일
- 슬라이드 문구:
  - 출품취소, LOT 변경, 낙찰가 보정은 변경이력표로 상시 관리합니다.
  - 최초 수집이 아니라 최종 반영 완료까지 책임지는 체계를 적용합니다.

## F. 파일 구조 예시
- 폴더 위치: 2026_06_SeoulAuction_예시
- 하위 구조:
  - /excel/
  - /images/
  - /capture/
  - /qa/
- 슬라이드 문구:
  - 경매별 자료, 이미지, 공개자료, 검수표를 동일 구조로 패키징하여 등록 친화형으로 관리합니다.
  - 데이터 파일과 이미지 파일은 동일 식별값 기준으로 연결합니다.
`;
  fs.writeFileSync(path.join(root, "발표자료_삽입용_샘플_가이드.md"), md, "utf8");
}

const created = [];
created.push(await createComparisonWorkbook());
created.push(await createQaWorkbook());
created.push(await createChangeLogWorkbook());
created.push(await createMilestoneWorkbook());
createFolderStructure();
createGuide();

const readme = `생성 파일

1. 2026_미술작품_예정_vs_결과_비교_샘플_v2.xlsx
2. 2026_미술작품_검수표_샘플_v2.xlsx
3. 2026_미술작품_변경이력표_샘플_v2.xlsx
4. 2026_미술작품_마일스톤운영기준_샘플_v2.xlsx
5. 2026_06_SeoulAuction_예시/ 폴더 구조
6. 발표자료_삽입용_샘플_가이드.md

활용 추천
- 예정자료 vs 결과자료 비교 슬라이드
- 검수표 샘플 슬라이드
- 변경이력표 슬라이드
- 마일스톤 운영 기준 슬라이드
- 파일 구조 예시 슬라이드
`;
fs.writeFileSync(path.join(root, "README.txt"), readme, "utf8");

for (const file of created) console.log(file);
console.log(path.join(root, "발표자료_삽입용_샘플_가이드.md"));
