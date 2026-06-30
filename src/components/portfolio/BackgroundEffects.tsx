export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep base */}
      <div className="absolute inset-0 bg-[#080808]" />

      {/* Very subtle ambient warm glow top-left */}
      <div
        className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, rgba(120,120,200,1) 0%, transparent 70%)',
        }}
      />

      {/* Very subtle ambient glow bottom-right */}
      <div
        className="absolute -bottom-60 -right-60 w-[800px] h-[800px] rounded-full opacity-[0.035]"
        style={{
          background: 'radial-gradient(circle, rgba(100,120,200,1) 0%, transparent 70%)',
        }}
      />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}
