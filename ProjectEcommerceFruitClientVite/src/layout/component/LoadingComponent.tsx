import React from "react";

export default function LoadingComponent() {
  const spinnerStyle:any = {
    width: '65px',
    height: '65px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'rotator 1.4s linear infinite',
  };

  const pathStyle:any = {
    fill: 'none',
    strokeWidth: '6',
    strokeLinecap: 'round',
    strokeDasharray: '187',
    strokeDashoffset: '0',
    transformOrigin: 'center',
    animation: 'dash 1.4s ease-in-out infinite, colors 5.6s ease-in-out infinite',
  };

  const keyframes:any = `
    @keyframes rotator {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(270deg); }
    }
    
    @keyframes colors {
      0% { stroke: #4285F4; }
      25% { stroke: #DE3E35; }
      50% { stroke: #F7C223; }
      75% { stroke: #1B9A59; }
      100% { stroke: #4285F4; }
    }
    
    @keyframes dash {
      0% { stroke-dashoffset: 187; }
      50% { stroke-dashoffset: 46.75; transform: rotate(135deg); }
      100% { stroke-dashoffset: 187; transform: rotate(450deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <svg
        style={spinnerStyle}
        width="65px"
        height="65px"
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          style={pathStyle}
          cx={33}
          cy={33}
          r={30}
        />
      </svg>
    </>
  );
}
