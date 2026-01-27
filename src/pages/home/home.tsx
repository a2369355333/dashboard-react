import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PptxGenJS from "pptxgenjs";

import Loading from "../../components/loading";
import { useLoading } from "../../provider/loading-provider";

type ScreenshotInfo = {
  scoring: string[];
  ratio: string[];
  headcount: string[];
};

const Home: React.FC = () => {
  const {
    isLoading,
    setIsLoading,
    screenshotInfo,
    setScreenshotInfo,
  } = useLoading();

  const navigate = useNavigate();

  const navigateList: string[] = [
    "/scoring",
    "/ratio",
    "/headcount",
    "/",
  ];

  const generateReport = (): void => {
    if (
      screenshotInfo.scoring.length > 0 ||
      screenshotInfo.ratio.length > 0 ||
      screenshotInfo.headcount.length > 0
    ) {
      setScreenshotInfo({
        scoring: [],
        ratio: [],
        headcount: [],
      });
    }

    setIsLoading(true);

    navigate(navigateList[0], {
      state: {
        navigateList: navigateList.slice(1),
      },
      replace: true,
    });
  };

  const createPPT = (): void => {
    const pptx = new PptxGenJS();

    screenshotInfo.scoring.forEach((image: string, index: number) => {
      const slide = pptx.addSlide();
      const x = index === 0 ? 0 : 0.5;
      const y = index === 0 ? 0.25 : 0.8;
      const w = index === 0 ? 10 : 9;

      slide.addImage({
        data: image,
        x,
        y,
        w,
        h: 4,
      });
    });

    screenshotInfo.ratio.forEach((image: string) => {
      const slide = pptx.addSlide();
      slide.addImage({ data: image, x: 0, y: 1, w: 10, h: 4 });
    });

    screenshotInfo.headcount.forEach((image: string) => {
      const slide = pptx.addSlide();
      slide.addImage({ data: image, x: 0, y: 0, w: 10, h: 6 });
    });

    pptx.writeFile({ fileName: "SchoolReport.pptx" });

    setIsLoading(false);
  };

  useEffect(() => {
    if (
      isLoading &&
      (screenshotInfo.scoring.length > 0 ||
        screenshotInfo.ratio.length > 0 ||
        screenshotInfo.headcount.length > 0)
    ) {
      createPPT();
    }
  }, [isLoading, screenshotInfo]);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center p-8">
      {isLoading && <Loading />}

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          School Report Generator
        </h1>
        <p className="text-gray-600 text-lg">
          Select a report type or generate complete report with one click
        </p>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-2xl aspect-square">
        {/* Top Button - Scoring (Circular) */}
        <Link to="/scoring">
          <button className="group absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-56 h-56 bg-gradient-to-br from-rose-400 to-red-500 text-white rounded-full shadow-2xl hover:shadow-rose-500/50 hover:scale-110 transition-all duration-500 ease-out overflow-hidden">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              {/* Icon */}
              <svg className="w-20 h-20 mb-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-2xl font-bold">Scoring</span>
              <span className="text-sm opacity-90 mt-1">Performance Analysis</span>
            </div>
          </button>
        </Link>

        {/* Bottom Left Button - HeadCount (Circular) */}
        <Link to="/headcount">
          <button className="group absolute bottom-0 left-0 transform -translate-x-8 translate-y-8 w-56 h-56 bg-gradient-to-br from-emerald-400 to-green-500 text-white rounded-full shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 transition-all duration-500 ease-out overflow-hidden">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              {/* Icon */}
              <svg className="w-20 h-20 mb-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-2xl font-bold">HeadCount</span>
              <span className="text-sm opacity-90 mt-1">Student Statistics</span>
            </div>
          </button>
        </Link>

        {/* Bottom Right Button - Ratio (Circular) */}
        <Link to="/ratio">
          <button className="group absolute bottom-0 right-0 transform translate-x-8 translate-y-8 w-56 h-56 bg-gradient-to-br from-cyan-400 to-blue-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-500 ease-out overflow-hidden">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              {/* Icon */}
              <svg className="w-20 h-20 mb-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              <span className="text-2xl font-bold">Ratio</span>
              <span className="text-sm opacity-90 mt-1">Distribution Analysis</span>
            </div>
          </button>
        </Link>

        {/* Center Button - Generate Report (Rounded Rectangle) */}
        <button
          onClick={generateReport}
          className="group absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-10 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center gap-3">
            {/* Icon */}
            <svg className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold">Generate Report</span>
              <span className="text-xs opacity-90">Create Full Report</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Home;
