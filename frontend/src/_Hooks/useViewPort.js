import { useState, useEffect } from "react";

const XS_BREAKPOINT = 768;
const SM_BREAKPOINT = 768;
const MD_BREAKPOINT = 980;
const LG_BREAKPOINT = 1300;
const XLG_BREAKPOINT = 1440;

const breakpoints = [
  {
    label: "xs",
    width: XS_BREAKPOINT,
  },
  {
    label: "sm",
    width: SM_BREAKPOINT,
  },
  {
    label: "md",
    width: MD_BREAKPOINT,
  },
  {
    label: "lg",
    width: LG_BREAKPOINT,
  },
  {
    label: "xlg",
    width: XLG_BREAKPOINT,
  },
];

const getViewport = (screenWidth) => {
  const viewport = breakpoints
    ?.slice(1)
    .reduce((c, bp) => (screenWidth >= bp.width ? bp : c), breakpoints[0]);
  return viewport;
};

const useViewport = (screenWidth, maxWidth) => {
  const [viewport, setViewport] = useState(getViewport(screenWidth));

  useEffect(() => {
    setViewport(getViewport(screenWidth));
  }, [screenWidth]);

  const isMobile = () => viewport.label === "xs";
  const isTablet = () => viewport.label === "sm";
  const isDesktop = () => viewport.label === "md";
  const isWide = () => viewport.label === "lg";
  const isUltraWide = () => viewport.label === "xlg";
  const isMinWidth = () => screenWidth <= maxWidth;

  return {
    viewport,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    isUltraWide,
    isMinWidth,
  };
};

export default useViewport;
