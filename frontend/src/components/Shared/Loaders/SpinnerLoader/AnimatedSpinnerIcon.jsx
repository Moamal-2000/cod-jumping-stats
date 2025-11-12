const AnimatedSpinnerIcon = () => {
  return (
    <svg viewBox="0 0 100 100" data-loader>
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        strokeDasharray="251.2"
        strokeDashoffset="251.2"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dashoffset"
          values="251.2;0"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default AnimatedSpinnerIcon;
