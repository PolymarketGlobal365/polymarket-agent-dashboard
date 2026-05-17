import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { serviceSteps } from "../content";

export default function ServiceTabs() {
  const [activeKey, setActiveKey] = useState(serviceSteps[0].key);
  const activeStep = useMemo(
    () => serviceSteps.find((step) => step.key === activeKey) ?? serviceSteps[0],
    [activeKey],
  );

  return (
    <div className="services-layout">
      <div className="service-list" role="tablist" aria-label="유니트미디어 서비스 단계">
        {serviceSteps.map((step) => (
          <button
            key={step.key}
            className={`service-item ${step.key === activeKey ? "is-active" : ""}`}
            type="button"
            onMouseEnter={() => setActiveKey(step.key)}
            onFocus={() => setActiveKey(step.key)}
            onClick={() => setActiveKey(step.key)}
          >
            <span>{step.key}</span>
            <strong>{step.label}</strong>
          </button>
        ))}
      </div>

      <article className="service-preview">
        <div className={`service-preview-art ${activeStep.className}`}></div>
        <div className="service-preview-copy">
          <h3 dangerouslySetInnerHTML={{ __html: activeStep.title }}></h3>
          <p>{activeStep.description}</p>
          <Link to="/contact">프로젝트 상담 연결</Link>
        </div>
      </article>
    </div>
  );
}
