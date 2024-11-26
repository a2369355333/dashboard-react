import html2canvas from "html2canvas";

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const domToCanvas = async (dom) => {
  const canvas = await html2canvas(dom, {
    width: dom.clientWidth,
    height: dom.clientHeight,
    scale: 2,
    useCORS: true,
  });
  return canvas;
};

export const captureScoringImages = async (
  rawGridApiRef,
  personalDomRef,
  rawDomRef
) => {
  const rawTableRowsPerPage = 8;
  const rawGridApi = rawGridApiRef.current;
  const personalTableDom = personalDomRef.current;
  const rawTableDom = rawDomRef.current;
  const rawHeaderDom = rawTableDom.querySelector(".ag-header");
  const rawContentDom = rawTableDom.querySelector(".ag-body-viewport");
  const totalRawTableRowCount = rawGridApi.getDisplayedRowCount();
  const totalPagesCount = Math.ceil(totalRawTableRowCount / rawTableRowsPerPage) + 1;
  let images = [];
  let currentRow = 0;
  // personalTableDom.style.width = "1000px";
  // rawTableDom.style.width = "1000px";

  for (let i = 0; i < totalPagesCount; i++) {
    let combinedCanvas = document.createElement("canvas");
    let ctx = combinedCanvas.getContext("2d");

    if (i === 0) {
      await delay(100);
      const canvas = await domToCanvas(personalTableDom);
      const image = canvas.toDataURL("image/png");
      images.push(image);
    } else if (i === 1) {
      await delay(100);
      const canvas = await domToCanvas(rawTableDom);
      const image = canvas.toDataURL("image/png");
      images.push(image);

      if (totalRawTableRowCount > 8) {
        currentRow += rawTableRowsPerPage;
        rawGridApi.ensureIndexVisible(currentRow, "top");
        await delay(100);
      }
    } else if (i === totalPagesCount - 1) {
      const remainingRowsCount = totalRawTableRowCount - currentRow;
      const rawHeaderCanvas = await domToCanvas(rawHeaderDom);
      const rawContentCanvas = await domToCanvas(rawContentDom);
      const desiredHeight = rawContentCanvas.height * (remainingRowsCount / rawTableRowsPerPage);
      combinedCanvas.width = Math.max(rawHeaderCanvas.width, rawContentCanvas.width);
      combinedCanvas.height = rawHeaderCanvas.height + desiredHeight;

      ctx.drawImage(rawHeaderCanvas, 0, 0, rawHeaderCanvas.width, rawHeaderCanvas.height, 0, 0, rawHeaderCanvas.width, rawHeaderCanvas.height);
      ctx.drawImage(rawContentCanvas, 0, (rawContentCanvas.height - desiredHeight), rawContentCanvas.width, desiredHeight, 0, rawHeaderCanvas.height, rawContentCanvas.width, desiredHeight);
      const image = combinedCanvas.toDataURL("image/png");
      images.push(image);

    } else {
      await delay(100);
      const canvas = await domToCanvas(rawTableDom);
      const image = canvas.toDataURL("image/png");
      images.push(image);

      currentRow += rawTableRowsPerPage;
      rawGridApi.ensureIndexVisible(currentRow, "top");
      await delay(100);
    }
  }
  return images;
};
