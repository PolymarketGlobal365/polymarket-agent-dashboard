import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import CloudBackground from "./CloudBackground";
import { navItems } from "../content";

const MOBILE_BREAKPOINT = 980;
const DESKTOP_SHELL_WIDTH = 1120;
const MOBILE_SIDE_GAP = 8;

function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>Helping your message move with AI-crafted video.</p>
      <div className="footer-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/portfolio">Portfolio</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>
      <small>짤 2026 UNITEMEDIA. All rights reserved.</small>
    </footer>
  );
}

export default function Layout() {
  const location = useLocation();
  const shellRef = useRef(null);
  const [mobileScaleState, setMobileScaleState] = useState({
    active: false,
    scale: 1,
    stageHeight: null,
  });

  useEffect(() => {
    let frameId = 0;

    const applyMobileScale = () => {
      const layoutViewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth || window.innerWidth);
      const isMobile = layoutViewportWidth <= MOBILE_BREAKPOINT;

      document.documentElement.classList.toggle("mobile-scale-mode", isMobile);
      document.body.classList.toggle("mobile-scale-mode", isMobile);

      if (!isMobile) {
        setMobileScaleState({
          active: false,
          scale: 1,
          stageHeight: null,
        });
        return;
      }

      const scale = Math.min(1, (layoutViewportWidth - MOBILE_SIDE_GAP) / DESKTOP_SHELL_WIDTH);

      frameId = window.requestAnimationFrame(() => {
        const shellHeight = shellRef.current?.scrollHeight ?? 0;

        setMobileScaleState({
          active: true,
          scale,
          stageHeight: Math.ceil(shellHeight * scale),
        });
      });
    };

    applyMobileScale();
    window.addEventListener("resize", applyMobileScale);
    window.addEventListener("orientationchange", applyMobileScale);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", applyMobileScale);
      window.removeEventListener("orientationchange", applyMobileScale);
      document.documentElement.classList.remove("mobile-scale-mode");
      document.body.classList.remove("mobile-scale-mode");
    };
  }, [location.pathname]);

  const stageStyle = mobileScaleState.active
    ? {
        height: `${mobileScaleState.stageHeight ?? 0}px`,
        paddingInline: "4px",
      }
    : undefined;

  const shellStyle = mobileScaleState.active
    ? {
        position: "absolute",
        left: "50%",
        top: 0,
        margin: 0,
        width: `${DESKTOP_SHELL_WIDTH}px`,
        maxWidth: `${DESKTOP_SHELL_WIDTH}px`,
        transform: `translateX(-50%) scale(${mobileScaleState.scale})`,
        transformOrigin: "top center",
      }
    : undefined;

  return (
    <>
      <CloudBackground />
      <div
        className={`page-shell-scale-stage${mobileScaleState.active ? " is-mobile-scaled" : ""}`}
        style={stageStyle}
      >
        <main ref={shellRef} className="page-shell" style={shellStyle}>
          <nav className="mobile-site-nav">
            <NavLink className="mobile-brand-mark" to="/">
              UNITEMEDIA
            </NavLink>
            <NavLink className="mobile-nav-cta" to="/contact">
              프로젝트 문의하기
            </NavLink>
          </nav>
          <nav className="site-nav">
            <div className="nav-group nav-links">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to}>
                  {item.label}
                </NavLink>
              ))}
            </div>
            <NavLink className="brand-mark" to="/">
              UNITEMEDIA
            </NavLink>
            <NavLink className="nav-cta" to="/contact">
              프로젝트 문의
            </NavLink>
          </nav>

          <div key={location.pathname} className="page-transition">
            <Outlet />
          </div>

          <SiteFooter />
        </main>
      </div>
    </>
  );
}
