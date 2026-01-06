import Link from "next/link";
import { Zap } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      {/* Icon – unchanged */}
      <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform duration-300">
        <Zap className="w-4.5 h-4.5 fill-current" />
      </div>

      {/* Text – refined */}
      <span className="text-[16px] font-medium tracking-tight text-slate-900">
        bestmobileuae
        <span className="text-slate-400 font-normal">.com</span>
      </span>
    </Link>
  );
}
