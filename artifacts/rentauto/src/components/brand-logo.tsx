import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-content";

type BrandLogoProps = {
  className?: string;
  linkToHome?: boolean;
  layout?: "header" | "footer";
};

export function BrandLogo({
  className,
  linkToHome = true,
  layout = "header",
}: BrandLogoProps) {
  const content =
    layout === "footer" ? (
      <FooterLogo className={className} />
    ) : (
      <HeaderLogo className={className} />
    );

  if (!linkToHome) return content;

  return (
    <Link href="/" className="inline-flex shrink-0 transition-transform duration-300 hover:scale-[1.02]">
      {content}
    </Link>
  );
}

function HeaderLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src="/images/puffin-logo.png"
        alt={siteConfig.name}
        className="h-14 sm:h-16 md:h-20 w-auto object-contain block"
      />
      <div className="leading-tight text-primary hidden min-[400px]:block text-center">
        <div className="font-extrabold tracking-[0.18em] text-base sm:text-lg md:text-xl notranslate">
          PUFFIN
        </div>
        <div className="text-[9px] sm:text-[10px] tracking-[0.35em] mt-0.5 text-primary/70 notranslate">
          S.R.L
        </div>
      </div>
      <div className="hidden sm:block h-10 w-px bg-border/80" aria-hidden />
      <div className="font-extrabold tracking-[0.22em] text-xs sm:text-sm md:text-base text-accent uppercase notranslate">
        Rentacar
      </div>
    </div>
  );
}

function FooterLogo({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex flex-col items-start gap-2", className)}>
      <div className="rounded-lg bg-white p-2 shadow-sm">
        <img
          src="/images/puffin-logo.png"
          alt={siteConfig.name}
          className="h-20 md:h-24 w-auto object-contain block"
        />
      </div>
      <div className="leading-tight text-center">
        <div className="font-extrabold tracking-[0.18em] text-lg text-white notranslate">
          PUFFIN
        </div>
        <div className="text-[10px] tracking-[0.35em] text-white/70 notranslate">S.R.L</div>
        <div className="font-extrabold tracking-[0.22em] text-sm text-accent uppercase mt-1 notranslate">
          Rentacar
        </div>
      </div>
    </div>
  );
}
