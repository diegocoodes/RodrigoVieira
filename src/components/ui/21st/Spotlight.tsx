/**
 * Adapted from Spotlight by manuarora700, retrieved through 21st.dev (demo 989).
 * https://21st.dev/@manuarora700/components/spotlight
 * Original SVG retained; local CSS, explicit filter IDs and decorative semantics.
 */
export function Spotlight({
  id,
  className = "",
  fill = "#e4c88c",
}: {
  id: string;
  className?: string;
  fill?: string;
}) {
  const filterId = `${id}-spotlight-filter`;
  return (
    <svg
      className={`spotlight-21st ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g filter={`url(#${filterId})`}>
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id={filterId}
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          />
        </filter>
      </defs>
    </svg>
  );
}
