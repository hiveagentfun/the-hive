"use client";

export default function GradientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.035] animate-orb-drift-1"
        style={{ background: "radial-gradient(circle, #f5a623, transparent 70%)", top: "10%", left: "-5%" }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.025] animate-orb-drift-2"
        style={{ background: "radial-gradient(circle, #c77d0a, transparent 70%)", top: "50%", right: "-8%" }}
      />
      <div
        className="absolute w-[350px] h-[350px] rounded-full blur-[120px] opacity-[0.03] animate-orb-drift-3"
        style={{ background: "radial-gradient(circle, #ffd98e, transparent 70%)", bottom: "10%", left: "30%" }}
      />
    </div>
  );
}
