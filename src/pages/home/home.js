import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Loading from "../../components/loading";
import { useLoading } from "../../provider/loading-provider";
import PptxGenJS from "pptxgenjs";

const Home = () => {
  const { isLoading, setIsLoading, screenshotInfo, setScreenshotInfo } =
    useLoading();
  const navigate = useNavigate();
  const navigateList = ["/scoring", "/ratio", "/headcount", "/"];

  const generateReport = () => {
    if (
      screenshotInfo.scoring ||
      screenshotInfo.ratio ||
      screenshotInfo.headcount
    ) {
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
    if (
      ((screenshotInfo.scoring && screenshotInfo.scoring.length > 0) ||
        (screenshotInfo.ratio && screenshotInfo.ratio.length > 0) ||
        (screenshotInfo.headcount && screenshotInfo.headcount.length > 0)) && isLoading
    ) {
      createPPT();
    }
  }, [isLoading]);

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      {isLoading && <Loading />}
      <div className="relative w-[28vw] h-[28vw]">
        <Link to="/scoring">
          <button className="flex items-center justify-center w-[16vw] h-[16vw] absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-300 text-white text-2xl rounded-full shadow-xl hover:bg-red-500 hover:shadow-2xl transition duration-500">
            <span className="text-[2vw]">Scoring</span>
          </button>
        </Link>
        <Link to="/headcount">
          <button className="flex items-center justify-center w-[16vw] h-[16vw] absolute bottom-0 left-0 transform -translate-x-1/2 bg-green-300 text-white text-2xl rounded-full shadow-xl hover:bg-green-500 hover:shadow-2xl transition duration-500">
            <span className="text-[2vw]">HeadCount</span>
          </button>
        </Link>
        <Link to="/ratio">
          <button className="flex items-center justify-center w-[16vw] h-[16vw] absolute bottom-0 right-0 transform translate-x-1/2 bg-blue-300 text-white text-2xl rounded-full shadow-xl hover:bg-blue-500 hover:shadow-2xl transition duration-500">
            <span className="text-[2vw]">Ratio</span>
          </button>
        </Link>
        <button
          className="flex items-center justify-center w-[10vw] h-[3vw] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-2xl rounded-lg shadow-xl hover:bg-blue-600"
          onClick={generateReport}
        >
          <span className="text-[1vw]">Generate Report</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
