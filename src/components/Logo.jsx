// Logotipo inspirado en Cube Project: "academia" en degradado + "TRACKER" espaciado
export default function Logo({ size = 'lg' }) {
  const big = size === 'lg'
  return (
    <div className={`flex items-center ${big ? 'flex-col gap-4' : 'gap-2.5'}`}>
      <img src="/icon.svg" alt="" className={big ? 'w-24 h-24' : 'w-8 h-8'} />
      <div className={`leading-none ${big ? 'text-center' : ''}`}>
        <div
          className={`font-black tracking-tight bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent ${
            big ? 'text-4xl' : 'text-lg'
          }`}
        >
          academia
        </div>
        <div className={`font-bold text-white ${big ? 'text-sm tracking-[0.55em] mt-1.5 pl-[0.55em]' : 'text-[9px] tracking-[0.4em] mt-0.5'}`}>
          TRACKER
        </div>
      </div>
    </div>
  )
}
