import Image from 'next/image';

export default function Logo({ className = "h-9 w-auto", dark = false }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/mys-logo.png"
        alt="Mirror Your Site Logo"
        width={38}
        height={38}
        className="rounded-lg object-contain"
        priority
      />
      <div className="flex flex-col">
        <span className={`font-bold tracking-tight text-lg leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
          Mirror Your Site
        </span>
        <span className={`text-[10px] tracking-wider uppercase font-semibold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          Simulated Perspectives
        </span>
      </div>
    </div>
  );
}