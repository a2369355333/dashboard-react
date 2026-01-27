import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef, GridReadyEvent } from "ag-grid-community";
import data from "../../data/data.json";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loading from "../../components/loading";
import { useLoading } from "../../provider/loading-provider";
import { captureScoringImages, delay } from "../../service/capture";

// ----- Type definitions -----
interface ScoringItem {
  name: string;
  math: number;
  english: number;
  music: number;
  sport: number;
}

interface Row1Type {
  name: string;
  math: number;
  english: number;
}

interface Row2Type {
  name: string;
  music: number;
  sport: number;
}

interface Row3Type extends ScoringItem { }

interface ScreenshotInfo {
  scoring: string[];
  ratio: string[];
  headcount: string[];
}


// -------------------

const Scoring: React.FC = () => {
  // ----- State & references -----
  const scoringData: ScoringItem[] = data.scoring;
  const rowHeight = 50;

  const { isLoading, screenshotInfo, setScreenshotInfo } = useLoading();

  // DOM references for screenshots
  const domRef = {
    personal: useRef<HTMLDivElement>(null),
    raw: useRef<HTMLDivElement>(null),
  };

  // Grid API reference
  const gridRef = useRef<any>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Navigation list passed from state
  const navigateList: string[] = useMemo(
    () => location?.state?.navigateList || [],
    [location?.state]
  );

  // ----- Grid Ready -----
  const onGridReady = (params: GridReadyEvent) => {
    gridRef.current = params.api;
  };

  // ----- Prepare row data -----
  const row1: Row1Type[] = [
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

  const row2: Row2Type[] = [
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

  const row3: Row3Type[] = scoringData;

  // ----- Prepare column definitions -----
  const col1: ColDef<Row1Type>[] = [
    { headerName: "\u200B", field: "name", flex: 1 },
    {
      headerName: "Math",
      field: "math",
      flex: 1,
      cellStyle: (params) =>
        params.data?.name === "AVG_SCORE"
          ? { color: "red", backgroundColor: "lightblue" }
          : undefined,
    },
    {
      headerName: "English",
      field: "english",
      flex: 1,
      cellStyle: (params) =>
        params.data?.name === "AVG_SCORE"
          ? { color: "red", backgroundColor: "lightblue" }
          : undefined,
    },
  ];

  const col2: ColDef<Row2Type>[] = [
    { headerName: "\u200B", field: "name", flex: 1 },
    {
      headerName: "Music",
      field: "music",
      flex: 1,
      cellStyle: (params) =>
        params.data?.name === "AVG_SCORE"
          ? { color: "red", backgroundColor: "lightblue" }
          : undefined,
    },
    {
      headerName: "Sport",
      field: "sport",
      flex: 1,
      cellStyle: (params) =>
        params.data?.name === "AVG_SCORE"
          ? { color: "red", backgroundColor: "lightblue" }
          : undefined,
    },
  ];

  const col3: ColDef<Row3Type>[] = [
    { headerName: "\u200B", field: "name", flex: 1 },
    { headerName: "Math", field: "math", flex: 1 },
    { headerName: "English", field: "english", flex: 1 },
    { headerName: "Music", field: "music", flex: 1 },
    { headerName: "Sport", field: "sport", flex: 1 },
  ];

  // ----- Capture screenshots -----
  const handleReport = async () => {
    await delay(1000);

    const images = await captureScoringImages(
      gridRef,
      domRef.personal,
      domRef.raw
    );

    setScreenshotInfo((prev: ScreenshotInfo) => ({
      ...prev,
      scoring: images,
    }));

    if (navigateList.length > 0) {
      navigate(navigateList[0], {
        state: { navigateList: navigateList.slice(1) },
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

  // ----- Render -----
  return (
    <div>
      {isLoading && <Loading />}
      <div className="ag-theme-alpine relative w-full flex flex-col justify-center items-center">
        {/* Back button */}
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

        {/* Personal score tables */}
        <div
          ref={domRef.personal}
          className="w-full flex flex-col justify-center items-center"
        >
          <span className="text-3xl my-10">Final Test Scoring</span>
          <div className="flex space-x-5">
            <div className="w-[600px]">
              <AgGridReact<Row1Type>
                domLayout="autoHeight"
                rowHeight={rowHeight}
                headerHeight={rowHeight}
                rowData={row1}
                columnDefs={col1}
              />
            </div>
            <div className="w-[600px]">
              <AgGridReact<Row2Type>
                domLayout="autoHeight"
                rowHeight={rowHeight}
                headerHeight={rowHeight}
                rowData={row2}
                columnDefs={col2}
              />
            </div>
          </div>
        </div>

        {/* Raw score table */}
        <div ref={domRef.raw} className="w-[1220px] h-[450px] mt-10">
          <AgGridReact<Row3Type>
            rowHeight={rowHeight}
            headerHeight={rowHeight}
            rowData={row3}
            columnDefs={col3}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </div>
  );
};

export default Scoring;
