import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Chart from "react-apexcharts";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import data from "../../data/data.json";
import Loading from "../../components/loading";
import { useLoading } from "../../provider/loading-provider";
import { domToCanvas, delay } from "../../service/capture";

// Headcount data structure from JSON
interface HeadcountItem {
  year: string | number;
  count: number;
}

// ApexChart state type (safe & flexible)
interface ChartState {
  options: ApexCharts.ApexOptions;
  series: ApexAxisChartSeries;
}

const HeadCount: React.FC = () => {
  const { isLoading, screenshotInfo, setScreenshotInfo } = useLoading();

  // DOM reference for screenshot
  const domRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Navigation list from router state
  const navigateList: string[] = useMemo(
    () => (location.state as any)?.navigateList || [],
    [location.state]
  );

  // Chart state
  const [chartData, setChartData] = useState<ChartState>({
    options: {
      chart: {
        id: "headcount-chart",
        type: "line",
      },
      xaxis: {
        categories: [],
      },
      title: {
        text: "Annual Enrollment Trend",
        align: "left",
      },
      yaxis: [
        {
          title: {
            text: "Number of Students",
          },
        },
      ],
      stroke: {
        width: [0, 4],
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
    },
    series: [
      {
        name: "headcount-bar",
        type: "bar",
        data: [],
      },
      {
        name: "headcount-line",
        type: "line",
        data: [],
      },
    ],
  });

  // Initialize chart data
  useEffect(() => {
    const headcountData = data.headcount as HeadcountItem[];

    const years = headcountData.map((item) => item.year);
    const counts = headcountData.map((item) => item.count);

    setChartData((prev) => ({
      options: {
        ...prev.options,
        xaxis: {
          categories: years,
        },
      },
      series: [
        {
          name: "headcount-bar",
          type: "bar",
          data: counts,
        },
        {
          name: "headcount-line",
          type: "line",
          data: counts,
        },
      ],
    }));
  }, []);

  /* =====================
     Screenshot logic
  ===================== */

  const captureHeadcountImages = async (
    ref: React.RefObject<HTMLDivElement | null>
  ): Promise<string[]> => {
    if (!ref.current) return [];

    const images: string[] = [];

    await delay(100);

    const canvas = await domToCanvas(ref.current);
    const image = canvas.toDataURL("image/png");

    images.push(image);

    return images;
  };

  const handleReport = async (): Promise<void> => {
    await delay(1000);

    const images = await captureHeadcountImages(domRef);

    setScreenshotInfo((prev: any) => ({
      ...prev,
      headcount: images,
    }));

    navigate(navigateList[0], {
      state: {
        navigateList: navigateList.slice(1),
      },
      replace: true,
    });
  };

  useEffect(() => {
    if (isLoading) {
      handleReport();
    }
  }, [isLoading]);

  return (
    <div>
      {isLoading && <Loading />}

      <div className="relative w-full h-[100vh] flex justify-center items-center">
        <div className="absolute top-4 left-4">
          <Link to="/">
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
            >
              Back To Home
            </Button>
          </Link>
        </div>

        <div
          ref={domRef}
          className="w-full max-w-6xl bg-white bg-opacity-20 p-4 rounded-lg shadow-lg"
        >
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="line"
            width="100%"
            height="400"
          />
        </div>
      </div>
    </div>
  );
};

export default HeadCount;
