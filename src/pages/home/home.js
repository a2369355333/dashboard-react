import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import Loading from "../../components/loading";
import { useLoading } from "../../provider/loading-provider";
import PptxGenJS from "pptxgenjs";

const Home = () => {
  const { isLoading, setIsLoading, screenshotInfo, setScreenshotInfo } = useLoading();
  const navigate = useNavigate();
  const navigateList = ["/scoring", "/ratio", "/headcount", "/"];

  const generateReport = () => {
    if (screenshotInfo.scoring || screenshotInfo.ratio || screenshotInfo.headcount) {
      setScreenshotInfo({ scoring: [], ratio: [], headcount: [] });
    }
    setIsLoading(true);
    navigate(navigateList[0], {
      state: {
        navigateList: navigateList.slice(1),
      },
      replace: true,
    });
  };

  const createPPT = () => {
    const pptx = new PptxGenJS();
    screenshotInfo.scoring.forEach((image, index) => {
      const slide = pptx.addSlide();
      const x = index === 0 ? 0 : 0.5;
      const y = index === 0 ? 0.25 : 0.8;
      const w = index === 0 ? 10 : 9;
    
      slide.addImage({ data: image, x: x, y: y, w: w, h: 4 });
    });
    screenshotInfo.ratio.forEach((image) => {
      const slide = pptx.addSlide();
      slide.addImage({ data: image, x: 0, y: 1, w: 10, h: 4 });
    });
    screenshotInfo.headcount.forEach((image) => {
      const slide = pptx.addSlide();
      slide.addImage({ data: image, x: 0, y: 0, w: 10, h: 6 });
    });

    pptx.writeFile({ fileName: "SchoolReport.pptx" });
    setIsLoading(false);
  };

  useEffect(() => {
    if (((screenshotInfo.scoring && screenshotInfo.scoring.length > 0) || (screenshotInfo.ratio && screenshotInfo.ratio.length > 0) || (screenshotInfo.headcount && screenshotInfo.headcount.length > 0)) && isLoading) {
          createPPT();
    }
  }, [isLoading]);

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      {isLoading && <Loading />}
      <div className="relative w-[28vw] h-[28vw]">
        <Link to="/scoring">
          <button className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-300 text-white text-2xl rounded-full shadow-xl hover:bg-red-500 hover:shadow-2xl transition duration-500">
            Scoring
          </button>
        </Link>
        <Link to="/headcount">
          <button className="absolute bottom-0 left-0 transform -translate-x-1/2 w-64 h-64 bg-green-300 text-white text-2xl rounded-full shadow-xl hover:bg-green-500 hover:shadow-2xl transition duration-500">
            HeadCount
          </button>
        </Link>
        <Link to="/ratio">
          <button className="absolute bottom-0 right-0 transform translate-x-1/2 w-64 h-64 bg-blue-300 text-white text-2xl rounded-full shadow-xl hover:bg-blue-500 hover:shadow-2xl transition duration-500">
            Ratio
          </button>
        </Link>
        <Button
          variant="contained"
          color="primary"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[180px] h-[50px] rounded-lg shadow-lg"
          onClick={generateReport}
        >
          Generate Report
        </Button>
      </div>
    </div>
  );
};

export default Home;
