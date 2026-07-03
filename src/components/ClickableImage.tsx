"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
  priority?: boolean;
};

export default function ClickableImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className = "",
  imgClassName = "",
  imgStyle,
  priority,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Expand image: ${alt}`}
        className={`block cursor-zoom-in border-none bg-transparent p-0 ${fill ? "relative h-full w-full" : ""} ${className}`}
      >
        {fill ? (
          <Image src={src} alt={alt} fill sizes={sizes} className={imgClassName} style={imgStyle} priority={priority} />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={imgClassName}
            style={imgStyle}
            priority={priority}
          />
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/85 p-6"
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full border-2 border-gold bg-dark text-2xl leading-none text-gold"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          />
        </div>
      )}
    </>
  );
}
