import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts"; 
import data from "../../data/data.json";
import { Button, MenuItem, Select, FormControl } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loading from "../../components/loading";
import { useLoading } from "../../provider/loading-provider";
import { domToCanvas, delay } from "../../service/capture";

// ----- Type definitions -----
interface RatioItem {
  class: string;
  Taiwanese: number;
  Korean: number;
  Japanese: number;
  American: number;
}

interface ChartData {
  class: string;
  options: ApexOptions;
  series: number[];
}

interface ScreenshotInfo {
  scoring: string[];
  ratio: string[];
  headcount: string[];
}

// -------------------

const Ratio: React.FC = () => {
  const ratioData: RatioItem[] = data.ratio;
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedChartData, setSelectedChartData] = useState<ChartData | null>(null);
  const { isLoading, setIsLoading, screenshotInfo, setScreenshotInfo } = useLoading();
  const domRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the navigation list from the location state
  const navigateList: string[] = useMemo(
    () => location?.state?.navigateList || [],
    [location?.state]
  );

  // Map ratio data to chart data for ApexCharts
  const chartData: ChartData[] = useMemo(() => 
    ratioData.map((item) => ({
      class: item.class,
      options: {
        chart: {
          type: "pie",
        },
        labels: ["Taiwanese", "Korean", "Japanese", "American"],
        title: {
          text: `Class ${item.class}`,
          align: "left",
        },
      },
      series: [item.Taiwanese, item.Korean, item.Japanese, item.American],
    })), [ratioData]
  );

  // Initialize the selected class to the first class in data
  useEffect(() => {
    if (ratioData.length > 0 && !selectedClass) {
      setSelectedClass(ratioData[0].class);
    }
  }, [ratioData, selectedClass]);

  // Update the selected chart when selectedClass changes
  useEffect(() => {
    const currentChartData = chartData.find(
      (data) => data.class === selectedClass
    );
    if (currentChartData) {
      setSelectedChartData(currentChartData);
    }
  }, [selectedClass, chartData]);

  // Capture screenshots for each class chart
  const captureRatioImages = async (domRef: React.RefObject<HTMLDivElement | null>) => {
    if (!domRef.current) return [];
    const table = domRef.current;
    const images: string[] = [];

    for (let i = 0; i < chartData.length; i++) {
      setSelectedClass(ratioData[i].class);
      setSelectedChartData(chartData[i]);
      await delay(500);
      const canvas = await domToCanvas(table);
      const image = canvas.toDataURL("image/png");
      images.push(image);
    }

    return images;
  };

  // Handle report generation
  const handleReport = async () => {
    await delay(1000);
    const images = await captureRatioImages(domRef);

    setScreenshotInfo((prev: ScreenshotInfo) => ({ ...prev, ratio: images }));

    if (navigateList.length > 0) {
      navigate(navigateList[0], {
        state: {
          navigateList: navigateList.slice(1),
        },
        replace: true,
      });
    }
  };

  // Trigger report generation when loading
  useEffect(() => {
    if (isLoading) {
      handleReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <div>
      {isLoading && <Loading />}
      <div className="relative w-full h-[100vh] flex flex-col items-center py-10 overflow-hidden">
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
        <div className="mb-5">
          <span className="text-3xl">Nationality Ratio</span>
        </div>
        <div className="w-[500px] mb-5">
          <FormControl variant="outlined" className="w-full">
            <Select
              labelId="class-select-label"
              id="class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              sx={{
                backgroundColor: "white",
              }}
            >
              {chartData.map((data, idx) => (
                <MenuItem key={idx} value={data.class}>
                  Class {data.class}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {selectedChartData && (
          <div ref={domRef} className="w-full flex justify-center ml-24">
            <Chart
              options={selectedChartData.options}
              series={selectedChartData.series}
              type="pie"
              width="800"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Ratio;
