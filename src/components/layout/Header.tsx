"use client";

import { useEffect, useRef, useState } from "react";
import { navigation } from "@/config/site";
import { CTA } from "@/components/ui/CTA";
import { Icon } from "@/components/ui/Icon";

export function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Rodrigo Vieira, início">
      <span className="brand-monogram" aria-hidden="true">
        RV<span>.</span>
      </span>
      <span className="brand-name">
        RODRIGO VIEIRA<small>MENTORIA EM GESTÃO DE LOCAÇÃO</small>
      </span>
    </a>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    function outside(e: PointerEvent) {
      if (!header.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header ref={header} className="site-header">
      <div className="container header-inner">
        <Brand />
        <div className="header-facts">
          <a href="#acompanhamento">
            <Icon name="recurring" />
            <span>6 meses de acompanhamento</span>
          </a>
          <a href="#imersao">
            <Icon name="structure" />
            <span>3 dias na Gestcon</span>
          </a>
        </div>
        <nav
          id="main-navigation"
          aria-label="Navegação principal"
          className={`main-nav${open ? " is-open" : ""}`}
          onBlur={(e) => {
            if (
              !e.currentTarget.contains(e.relatedTarget) &&
              e.relatedTarget !== toggle.current
            )
              setOpen(false);
          }}
        >
          {navigation.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <CTA className="nav-mobile-cta">Quero participar</CTA>
        </nav>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
