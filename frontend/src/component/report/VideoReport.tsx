import React, { useEffect, useState } from "react";
import Searching from "../../extra/Searching";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import { useSelector } from "react-redux";
import { deleteReport, getReport, solvedReport } from "../../store/reportSlice";
import dayjs from "dayjs";
import Button from "../../extra/Button";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import TrueArrow from "../../assets/icons/TrueArrow.svg";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { warning } from "../../util/Alert";
import { RootStore, useAppDispatch } from "@/store/store";
import Image from "next/image";
import { baseURL } from "@/util/config";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import noImage from "../../assets/images/noImage.png";

const VideoReport = (props) => {
  const startDate = props?.startDate;
  const endDate = props?.endDate;

  const { videoReport, totalVideoReport } = useSelector(
    (state: RootStore) => state.report
  );
  const dispatch = useAppDispatch();

  
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(20);
  const [type, setType] = useState<any>("All");
  const [search, setSearch] = useState<string>();
  useClearSessionStorageOnPopState("multiButton");

  useEffect(() => {
    let payload: any = {
      start: page,
      limit: size,
      status: type,
      startDate: startDate,
      endDate: endDate,
      type: 1,
    };
    dispatch(getReport(payload));
  }, [page, size, , type, startDate, endDate]);

  useEffect(() => {
    setData(videoReport);
  }, [videoReport]);

  const postReportTable = [
    {
      Header: "NO",
      body: "no",
      Cell: ({ index }: { index: number }) => (
        <span className="  text-nowrap">{(page - 1) * size + index + 1}</span>
      ),
    },
    {
      Header: "Video Image",
      body: "image",
      Cell: ({ row, index }: { row: any; index: number }) => (
        <img
          src={ row?.videoImage}
          width="48px"
          height="48px"
          style={{ objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.src = noImage.src;
          }}
        />
      ),
    },

    {
      Header: "Video id",
      body: "uniqueVideoId",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">{row?.uniqueVideoId}</span>
      ),
    },

    {
      Header: "User",
      body: "userName",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">{row?.userName}</span>
      ),
    },
    {
      Header: "Video report reason",
      body: "reportType",
      Cell: ({ row }: { row: any }) => (
        <>{<span className="text-capitalize">{row?.reportReason}</span>}</>
      ),
    },
    {
      Header: "Status",
      body: "status",
      Cell: ({ row }: { row: any }) => (
        <>
          {row?.status === 1 && (
            <span className="text-capitalize badge badge-primary p-2">
              Pending
            </span>
          )}
          {row?.status === 2 && (
            <span className="text-capitalize badge badge-success p-2">
              Solved
            </span>
          )}
        </>
      ),
    },
    {
      Header: "Video reported",
      body: "createdAt",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">
          {row?.createdAt ? dayjs(row?.createdAt).format("DD MMMM YYYY") : ""}
        </span>
      ),
    },
    {
      Header: "Action",
      body: "action",
      Cell: ({ row }: { row: any }) => (
        <div className="action-button">
          {row.status === 2 ? (
            ""
          ) : (
            <Button
              btnIcon={
                <IconCheck className="text-secondary"/>
              }
              onClick={() => handleSolved(row?._id)}
            />
          )}
          <Button
            btnIcon={
               <IconTrash  className="text-secondary" />
            }
            onClick={() => handleDeleteReport(row)}
          />
        </div>
      ),
    },
  ];

  const selectType = (type: any) => {
    setType(type);
  };

  const handleFilterData = (filteredData: any) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value: number) => {
    setPage(1);
    setSize(value);
  };

  const handleSolved = (id: any) => {
    
    const payload: any = {
      reportId: id,
      reportType: 1,
    };
    dispatch(solvedReport(payload));
  };

  const handleDeleteReport = (row: any) => {

    const data = warning();
    data
      .then((logouts: any) => {
        if (logouts) {
          const payload: any = {
            reportId: row?._id,
            reportType: 1,
          };
          dispatch(deleteReport(payload));
        }
      })
      .catch((err: any) => console.log(err));
  };

  return (
    <>
      <div className=" p-0">
        <div className="user-table ">
          <div className="user-table-top">
            <div className="w-100">
              <h5
                style={{
                  fontWeight: "500",
                  fontSize: "18px",
                  marginBottom: "5px",
                  marginTop: "5px",
                  markerStart: "10px",
                }}
              >
                Video Report
              </h5>
            </div>
            <div className="d-flex gap-2 justify-content-end w-100">
              <div className="w-25">
                <select
                  name=""
                  id=""
                  className="form-select "
                  value={type}
                  onChange={(e) => selectType(e.target.value === "All" ? "All" : parseInt(e.target.value))}
                >
                  <option value="All"> All</option>
                  <option value={1}> Pending</option>
                  <option value={2}> Solved</option>
                </select>
              </div>
            <div>
              <Searching
                placeholder={"Search here"}
                data={videoReport}
                type={"client"}
                setData={setData}
                onFilterData={handleFilterData}
                searchValue={search}
                actionShow={false}
              />
            </div>
            </div>
          </div>
          <div className="">
            <Table
              data={data}
              mapData={postReportTable}
              serverPerPage={size}
              serverPage={page}
              type={"server"}
            />
            <div className="">
              <Pagination
                type={"server"}
                activePage={page}
                rowsPerPage={size}
                userTotal={totalVideoReport}
                setPage={setPage}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoReport;
