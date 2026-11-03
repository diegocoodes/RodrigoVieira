"use client";

/**
 * Adapted from Animated Tabs by educalvolpz, 21st.dev demo 24930.
 * https://21st.dev/@educalvolpz/components/animated-tabs
 * Retains the shared Motion indicator, controlled state and keyboard behavior.
 * Adds vertical navigation, associated panels and local editorial styling.
 */
import { motion, useReducedMotion } from "motion/react";
import {
  type ReactNode,
  type KeyboardEvent,
  useCallback,
  useId,
  useState,
} from "react";

type Tab = { id: string; label: string; icon?: ReactNode };
type AnimatedTabsProps = {
  tabs: Tab[];
  idPrefix: string;
  activeTab?: string;
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
  ariaLabel: string;
  orientation?: "horizontal" | "vertical";
};

const SPRING = { bounce: 0.05, duration: 0.28, type: "spring" as const };

export function AnimatedTabs({
  tabs,
  idPrefix,
  activeTab: controlledActiveTab,
  defaultTab,
  onChange,
  className = "",
  ariaLabel,
  orientation = "vertical",
}: AnimatedTabsProps) {
  const shouldReduceMotion = useReducedMotion();
  const generatedId = useId();
  const layoutId = `animated-tabs-${generatedId}`;
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab ?? tabs[0]?.id ?? "",
  );
  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;
  const handleTabChange = useCallback(
    (tabId: string) => {
      if (!isControlled) setInternalActiveTab(tabId);
      onChange?.(tabId);
    },
    [isControlled, onChange],
  );
  const handleKeyDown = useCallback(
    (event: KeyboardEvent, currentIndex: number) => {
      let nextIndex = currentIndex;
      if (
        event.key === "ArrowRight" ||
        (orientation === "vertical" && event.key === "ArrowDown")
      )
        nextIndex = (currentIndex + 1) % tabs.length;
      else if (
        event.key === "ArrowLeft" ||
        (orientation === "vertical" && event.key === "ArrowUp")
      )
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      const nextTab = tabs[nextIndex];
      if (nextTab) {
        handleTabChange(nextTab.id);
        document.getElementById(`${idPrefix}-tab-${nextTab.id}`)?.focus();
      }
    },
    [tabs, handleTabChange, idPrefix, orientation],
  );

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      className={`animated-tabs-21st ${className}`}
    >
      {tabs.map((tab, index) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.id}`}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => handleTabChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {active && (
              <motion.span
                aria-hidden="true"
                className="animated-tabs-indicator"
                layout
                layoutId={layoutId}
                style={{ originY: "0px" }}
                transition={shouldReduceMotion ? { duration: 0 } : SPRING}
              />
            )}
            {tab.icon && <span className="tab-index">{tab.icon}</span>}
            <span className="animated-tab-label">{tab.label}</span>
            <span className="animated-tab-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        );
      })}
    </div>
  );
}
