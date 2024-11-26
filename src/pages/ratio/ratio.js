import { useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import data from "../../data/data.json";
import { Link } from "react-router-dom";
import { Button, MenuItem, Select, FormControl } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loading from "../../components/loading";
import { useLoading } from "../../provider/loading-provider";
import { domToCanvas, delay } from "../../service/capture";

const Ratio = () => {
  const ratioData = data.ratio;
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedChartData, setSelectedChartData] = useState(null);
  const { isLoading, screenshotInfo, setScreenshotInfo } = useLoading();
  const domRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const navigateList = useMemo(
    () => location?.state?.navigateList || [],
    [location?.state]
  );
  const chartData = ratioData.map((item) => ({
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
  }));

  useEffect(() => {
    setSelectedClass(ratioData[0].class);
  }, []);

  useEffect(() => {
    const currentChartData = chartData.find(
      (chartData) => chartData.class === selectedClass
    );
    setSelectedChartData(currentChartData || null);
  }, [selectedClass]);

  //process PPT images
  const captureRatioImages = async (domRef) => {
    const table = domRef.current;
    let images = [];

    for (let i = 0; i < chartData.length; i++) {
      setSelectedClass(ratioData[i].class);
      setSelectedChartData(chartData[i])
      await delay(500);
      const canvas = await domToCanvas(table);
      const image = canvas.toDataURL("image/png");
      images.push(image);
    }

    return images;
  };

  const handleReport = async () => {
    await delay(1000);
    const images = await captureRatioImages(domRef);

    setScreenshotInfo((pre) => ({...pre, ratio: images}));

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
              {chartData.map((chartData, idx) => (
                <MenuItem key={idx} value={chartData.class}>
                  Class {chartData.class}
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
