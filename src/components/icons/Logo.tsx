export default function Logo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 hover:scale-110"
    >
      {/* 简化的说话气泡 */}
      <path
        d="M4 10C4 6.68629 6.68629 4 10 4H18C21.3137 4 24 6.68629 24 10V16C24 19.3137 21.3137 22 18 22H16L14 25L12 22H10C6.68629 22 4 19.3137 4 16V10Z"
        className="text-blue-500"
        fill="currentColor"
      />
      {/* 简单的装饰点 */}
      <circle cx="11" cy="13" r="1.5" fill="white" />
      <circle cx="17" cy="13" r="1.5" fill="white" />
    </svg>
  );
} 