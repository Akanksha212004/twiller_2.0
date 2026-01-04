// import React from "react";

// interface XLogoProps {
//   className?: string;
// }

// export default function XLogo({ className = "" }: XLogoProps) {
//   return (
//     <svg
//       className={className}
//       viewBox="0 0 1200 1227"
//       xmlns="http://www.w3.org/2000/svg"
//       fill="currentColor"
//       aria-hidden="true"
//       role="img"
//       preserveAspectRatio="xMidYMid meet"
//     >
//       {/* Refined X silhouette */}
//       <path d="M714.163 519.284L1160.89 0H1024.86L673.92 410.433L402.729 0H0L468.311 
//         681.365L0 1227H136.032L510.75 781.884L801.035 1227H1200L714.163 
//         519.284ZM568.591 723.725L518.988 652.26L188.624 90.797H345.699L627.423 
//         506.387L677.029 577.852L1024.97 1136.2H867.896L568.591 723.725Z" />
//     </svg>
//   );
// }


import React from "react";

interface XLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl"; // ✅ size prop add
}

const sizeMap: Record<NonNullable<XLogoProps["size"]>, string> = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
  xl: "h-14 w-14",
};

export default function XLogo({ className = "", size = "md" }: XLogoProps) {
  return (
    <svg
      className={`${sizeMap[size]} ${className}`}
      viewBox="0 0 1200 1227"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
      role="img"
      preserveAspectRatio="xMidYMid meet"
    >
      <path d="M714.163 519.284L1160.89 0H1024.86L673.92 410.433L402.729 0H0L468.311 
        681.365L0 1227H136.032L510.75 781.884L801.035 1227H1200L714.163 
        519.284ZM568.591 723.725L518.988 652.26L188.624 90.797H345.699L627.423 
        506.387L677.029 577.852L1024.97 1136.2H867.896L568.591 723.725Z" />
    </svg>
  );
}
