import { useState } from "react";
import { contactChips } from "../content";

export default function ContactSection() {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [selectedChip, setSelectedChip] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [note, setNote] = useState(
    "제작 범위를 선택한 뒤 프로젝트 설명을 적어주시면 메일 앱으로 바로 연결됩니다.",
  );

  const messagePrefix = selectedChip ? `${selectedChip} - ` : "";
  const messageValue = `${messagePrefix}${messageBody}`;

  const handleChipClick = (chip) => {
    setSelectedChip(chip);
  };

  const handleMessageChange = (event) => {
    const nextValue = event.target.value;

    if (selectedChip) {
      const prefix = `${selectedChip} - `;
      if (nextValue.startsWith(prefix)) {
        setMessageBody(nextValue.slice(prefix.length));
        return;
      }
    }

    setMessageBody(nextValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subjectBase = company || selectedChip || "프로젝트 문의";
    const bodyLines = [
      `회사명 또는 기관명: ${company || "-"}`,
      `연락처 이메일: ${email || "-"}`,
      `관심 있는 제작 범위: ${selectedChip || "-"}`,
      "",
      "프로젝트 설명:",
      messageValue || "-",
    ];

    const mailto = `mailto:unitemediakr@gmail.com?subject=${encodeURIComponent(
      `[UNITEMEDIA 문의] ${subjectBase}`,
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    window.location.href = mailto;
    setNote("메일 앱으로 연결 중입니다. 전송 전에 제목과 내용을 한 번 확인해주세요.");
  };

  return (
    <section className="contact-section">
      <div className="contact-panel contact-art">
        <div className="contact-badge">UNITEMEDIA</div>
        <h2>
          AI 영상 하나로 끝나지 않고
          <br />
          브랜드에 남는 경험까지 만듭니다
        </h2>
        <p>
          단발성 메인 필름, 시리즈형 숏폼, 행사 오프닝 패키지, 공공기관 홍보처럼 목적이 달라도
          같은 방식으로 정리해드릴 수 있습니다.
        </p>
        <div className="contact-footnote">기업 홍보 · 지자체 · 행사 · 숏폼 운영 문의 가능</div>
      </div>

      <form className="contact-panel contact-form" onSubmit={handleSubmit}>
        <label>
          <span>회사명 또는 기관명</span>
          <input
            type="text"
            name="company"
            placeholder="예: 유니트미디어 / OO시청"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
        </label>
        <label>
          <span>연락처 이메일</span>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          <span>관심 있는 제작 범위</span>
          <div className="chip-row">
            {contactChips.map((chip) => (
              <button
                key={chip}
                type="button"
                className={`chip-button ${selectedChip === chip ? "is-active" : ""}`}
                onClick={() => handleChipClick(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </label>
        <label>
          <span>프로젝트 설명</span>
          <textarea
            name="message"
            rows="6"
            placeholder="목표, 일정, 필요한 영상 종류를 간단히 적어주세요."
            value={messageValue}
            onChange={handleMessageChange}
          ></textarea>
        </label>
        <button className="button button-dark button-wide" type="submit">
          상담 요청 보내기
        </button>
        <p className="form-note">{note}</p>
      </form>
    </section>
  );
}
