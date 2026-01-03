"use client";

export default function UAEFlag({ className = "w-5 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 480"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* UAE Flag - Green, White, Black stripes with Red vertical bar */}
      <rect width="640" height="160" fill="#00732f" />
      <rect y="160" width="640" height="160" fill="#fff" />
      <rect y="320" width="640" height="160" fill="#000" />
      <rect width="160" height="480" fill="#ff0000" />
    </svg>
  );
}

export function UAEFlagInline({ className = "w-4 h-3 inline-block" }) {
  return <UAEFlag className={className} />;
}
