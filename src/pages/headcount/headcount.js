import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Chart from "react-apexcharts";
import data from "../../data/data.json";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loading from "../../components/loading";
import { useLoading } from "../../provider/loading-provider";
import { domToCanvas, delay } from "../../service/capture";

const HeadCount = () => {
  const { isLoading, screenshotInfo, setScreenshotInfo } = useLoading();
  const domRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const navigateList = useMemo(
    () => location?.state?.navigateList || [],
    [location?.state]
  );

  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "headcount-chart",
        type: "line",
      },
      xaxis: {
        categories: [],
      },
      title: {
        text: "年度招生人數變化",
        align: "left",
      },
      yaxis: [
        {
          title: {
            text: "人數",
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

  useEffect(() => {
    const headcountData = data.headcount;
    const years = headcountData.map((item) => item.year);
    const counts = headcountData.map((item) => item.count);

    setChartData({
      options: {
        ...chartData.options,
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
    });
  }, []);

  //process PPT images
  const captureHeadcountImages = async (domRef) => {
    const table = domRef.current;
    let images = []
    await delay(100);
    const canvas = await domToCanvas(table);
    const image = canvas.toDataURL("image/png");
    images.push(image)
    return images;
  };

  const handleReport = async () => {
    await delay(1000);
    const images = await captureHeadcountImages(domRef);
    setScreenshotInfo((pre) => ({...pre, headcount: images}));
    
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
