import html2canvas from "html2canvas";

// Delay helper
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/* =====================
   DOM → Canvas
===================== */

export const domToCanvas = async (
  dom: HTMLElement
): Promise<HTMLCanvasElement> => {
  const canvas = await html2canvas(dom, {
    width: dom.clientWidth,
    height: dom.clientHeight,
    scale: 2,
    useCORS: true,
  });

  return canvas;
};

/* =====================
   Capture scoring images
===================== */

// Minimal AG Grid API typing (only what you actually use)
interface AgGridApi {
  getDisplayedRowCount(): number;
  ensureIndexVisible(index: number, position?: "top" | "middle" | "bottom"): void;
}

// Ref typing
type GridApiRef = React.RefObject<AgGridApi | null>;
type DomRef = React.RefObject<HTMLDivElement | null>;

export const captureScoringImages = async (
  rawGridApiRef: GridApiRef,
  personalDomRef: DomRef,
  rawDomRef: DomRef
): Promise<string[]> => {
  const rawTableRowsPerPage = 8;

  const rawGridApi = rawGridApiRef.current;
  const personalTableDom = personalDomRef.current;
  const rawTableDom = rawDomRef.current;

  if (!rawGridApi || !personalTableDom || !rawTableDom) {
    return [];
  }

  const rawHeaderDom = rawTableDom.querySelector(
    ".ag-header"
  ) as HTMLDivElement | null;

  const rawContentDom = rawTableDom.querySelector(
    ".ag-body-viewport"
  ) as HTMLDivElement | null;

  if (!rawHeaderDom || !rawContentDom) {
    return [];
  }

  const totalRawTableRowCount = rawGridApi.getDisplayedRowCount();
  const totalPagesCount =
    Math.ceil(totalRawTableRowCount / rawTableRowsPerPage) + 1;

  const images: string[] = [];
  let currentRow = 0;

  for (let i = 0; i < totalPagesCount; i++) {
    const combinedCanvas = document.createElement("canvas");
    const ctx = combinedCanvas.getContext("2d");

    if (!ctx) continue;

    // Page 1: personal table
    if (i === 0) {
      await delay(100);
      const canvas = await domToCanvas(personalTableDom);
      images.push(canvas.toDataURL("image/png"));
      continue;
    }

    // Page 2: first raw table
    if (i === 1) {
      await delay(100);
      const canvas = await domToCanvas(rawTableDom);
      images.push(canvas.toDataURL("image/png"));

      if (totalRawTableRowCount > rawTableRowsPerPage) {
        currentRow += rawTableRowsPerPage;
        rawGridApi.ensureIndexVisible(currentRow, "top");
        await delay(100);
      }
      continue;
    }

    // Last page (partial rows)
    if (i === totalPagesCount - 1) {
      const remainingRowsCount = totalRawTableRowCount - currentRow;

      const rawHeaderCanvas = await domToCanvas(rawHeaderDom);
      const rawContentCanvas = await domToCanvas(rawContentDom);

      const desiredHeight =
        rawContentCanvas.height *
        (remainingRowsCount / rawTableRowsPerPage);

      combinedCanvas.width = Math.max(
        rawHeaderCanvas.width,
        rawContentCanvas.width
      );

      combinedCanvas.height =
        rawHeaderCanvas.height + desiredHeight;

      ctx.drawImage(
        rawHeaderCanvas,
        0,
        0,
        rawHeaderCanvas.width,
        rawHeaderCanvas.height
      );

      ctx.drawImage(
        rawContentCanvas,
        0,
        rawContentCanvas.height - desiredHeight,
        rawContentCanvas.width,
        desiredHeight,
        0,
        rawHeaderCanvas.height,
        rawContentCanvas.width,
        desiredHeight
      );

      images.push(combinedCanvas.toDataURL("image/png"));
      continue;
    }

    // Middle pages
    await delay(100);
    const canvas = await domToCanvas(rawTableDom);
    images.push(canvas.toDataURL("image/png"));

    currentRow += rawTableRowsPerPage;
    rawGridApi.ensureIndexVisible(currentRow, "top");
    await delay(100);
  }

  return images;
};
