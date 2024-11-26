import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import data from "../../data/data.json";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loading from "../../components/loading";
import { useLoading } from "../../provider/loading-provider";
import { captureScoringImages, delay } from "../../service/capture";

const Scoring = () => {
  const scoringData = data.scoring;
  const rowHeight = 50;
  const { isLoading, screenshotInfo, setScreenshotInfo } = useLoading();
  const domRef = {personal: useRef(), raw: useRef()};
  const gridRef = useRef();
  const onGridReady = (params) => {gridRef.current = params.api;}
  const navigate = useNavigate();
  const location = useLocation();
  const navigateList = useMemo(
    () => location?.state?.navigateList || [],
    [location?.state]
  );

  const row1 = [  
    {
      name: scoringData[0].name,
      math: scoringData[0].math,
      english: scoringData[0].english,
    },
    {
      name: scoringData[1].name,
      math: scoringData[1].math,
      english: scoringData[1].english,
    },
    {
      name: "AVG_SCORE",
      math: (scoringData[0].math + scoringData[1].math) / 2,
      english: (scoringData[0].english + scoringData[1].english) / 2,
    },
  ];

  const row2 = [
    {
      name: scoringData[0].name,
      music: scoringData[0].music,
      sport: scoringData[0].sport,
    },
    {
      name: scoringData[1].name,
      music: scoringData[1].music,
      sport: scoringData[1].sport,
    },
    {
      name: "AVG_SCORE",
      music: (scoringData[0].music + scoringData[1].music) / 2,
      sport: (scoringData[0].sport + scoringData[1].sport) / 2,
    },
  ];

  const row3 = scoringData;

  const col1 = [
    { headerName: "\u200B", field: "name", flex: 1 },
    {
      headerName: "Math",
      field: "math",
      flex: 1,
      cellStyle: (params) =>
        params.data.name === "AVG_SCORE"
          ? { color: "red", backgroundColor: "lightblue" }
          : null,
    },
    {
      headerName: "English",
      field: "english",
      flex: 1,
      cellStyle: (params) =>
        params.data.name === "AVG_SCORE"
          ? { color: "red", backgroundColor: "lightblue" }
          : null,
    },
  ];
  const col2 = [
    { headerName: "\u200B", field: "name", flex: 1 },
    {
      headerName: "Music",
      field: "music",
      flex: 1,
      cellStyle: (params) =>
        params.data.name === "AVG_SCORE"
          ? { color: "red", backgroundColor: "lightblue" }
          : null,
    },
    {
      headerName: "Sport",
      field: "sport",
      flex: 1,
      cellStyle: (params) =>
        params.data.name === "AVG_SCORE"
          ? { color: "red", backgroundColor: "lightblue" }
          : null,
    },
  ];
  const col3 = [
    { headerName: "\u200B", field: "name", flex: 1 },
    { headerName: "Math", field: "math", flex: 1 },
    { headerName: "English", field: "english", flex: 1 },
    { headerName: "Music", field: "music", flex: 1 },
    { headerName: "Sport", field: "sport", flex: 1 },
  ];

  //process PPT images
  const handleReport = async() => {
    await delay(1000);
    const images = await captureScoringImages(gridRef, domRef.personal, domRef.raw);
    setScreenshotInfo((pre) => ({...pre, scoring: images}));
    navigate(navigateList[0], {
        state: {
            navigateList: navigateList.slice(1) 
        },
        replace: true,
    })
  }

  useEffect(() => {
    if (isLoading) {
        handleReport();
    }
  }, [isLoading]);
  

  return (
    <div>
      {isLoading && <Loading />}
      <div className="ag-theme-alpine relative w-full flex flex-col justify-center items-center">
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
        <div ref={domRef.personal} className="w-full flex flex-col justify-center items-center">
          <span className="text-3xl my-10">Final Test Scoring</span>
          <div className="flex space-x-5">
            <div className="w-[600px]">
              <AgGridReact
                domLayout="autoHeight"
                rowHeight={rowHeight}
                headerHeight={rowHeight}
                rowData={row1}
                columnDefs={col1}
              ></AgGridReact>
            </div>
            <div className="w-[600px]">
              <AgGridReact
                domLayout="autoHeight"
                rowHeight={rowHeight}
                headerHeight={rowHeight}
                rowData={row2}
                columnDefs={col2}
              ></AgGridReact>
            </div>
          </div>
        </div>
        <div ref={domRef.raw} className="w-[1220px] h-[450px] mt-10">
          <AgGridReact
            rowHeight={rowHeight}
            headerHeight={rowHeight}
            rowData={row3}
            columnDefs={col3}
            onGridReady={onGridReady}
          ></AgGridReact>
        </div>
      </div>
    </div>
  );
};

export default Scoring;
