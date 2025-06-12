import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  textMargin?: number;
  background?: string;
  lineColor?: string;
  format?: string;
  className?: string;
}

export function Barcode({
  value,
  width = 2,
  height = 60,
  displayValue = true,
  fontSize = 12,
  textMargin = 5,
  background = "#ffffff",
  lineColor = "#000000",
  format = "CODE128",
  className = "",
}: BarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format,
          width,
          height,
          displayValue,
          fontSize,
          textMargin,
          background,
          lineColor,
        });
      } catch (error) {
        console.error("Barcode generation failed:", error);
      }
    }
  }, [
    value,
    format,
    width,
    height,
    displayValue,
    fontSize,
    textMargin,
    background,
    lineColor,
  ]);

  if (!value) {
    return (
      <div className="text-center text-muted-foreground text-sm">
        لا يوجد باركود
      </div>
    );
  }

  return <svg ref={svgRef} className={className}></svg>;
}
