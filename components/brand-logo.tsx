import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  href?: string;
  showText?: boolean;
  textClassName?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: { w: 120, h: 34 },
  md: { w: 160, h: 44 },
  lg: { w: 210, h: 60 },
};

export function BrandLogo({
  className,
  href = "/",
  showText = false,
  textClassName,
  size = "md",
}: BrandLogoProps) {
  const dims = sizeMap[size];
  const content = (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/LOGO-HELENA-DORIS.png"
        alt="Helena Doris Laboratório de Análises Clínicas"
        width={dims.w}
        height={dims.h}
        priority
      />
      {showText ? (
        <span className={cn("font-semibold text-sm leading-tight", textClassName)}>
          Helena Doris<br />
          Laboratório de Análises Clínicas
        </span>
      ) : null}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
