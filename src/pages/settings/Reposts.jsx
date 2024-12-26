import React, { useEffect, useState } from "react";
import savedService from "../../services/savedService";
import useJobApi from "../../services/jobService";
import UserImageInput from "../../components/Input/UserImageInput";
import { useNavigate } from "react-router-dom";
import LikeButton from "../../components/Button/LikeButton";
import CommentButton from "../../components/Button/CommentButton";
import JobListItem from "../../components/jobComponent/JobListItem";
import companyDefaultImage from "../../assets/companyDefaultImage.png";
import Button from "../../components/Button/Button";
import ImageCarousel from "../../components/ImageCarousel";
import { useSelector } from "react-redux";
import reportService from "../../services/reportService";
import { deleteComment, deletePost } from "../../services/postService";

function Reports() {
    const currentUser = useSelector((state) => state.auth.user);
    const [reports, setReports] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchReports = async () => {
            try {
                const res = await reportService.getReports();
                console.log("res", res);
                setReports(groupReports(res));
            } catch (error) {
                console.error("Error fetching saved data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const groupReports = (reports) => {
        const grouped = {};
        reports.forEach((report) => {
            const key =
                report.reportType === "post"
                    ? report.reportedContent[0]
                    : `${report.reportedContent[0]}_${report.reportedContent[1]}`;
            if (!grouped[key]) {
                grouped[key] = { ...report, count: 1 };
            } else {
                grouped[key].count += 1;
            }
        });
        return Object.values(grouped);
    };

    async function handleAccept(report) {
        if (report.reportType == "post") {
            await deletePost(report.reportedContent[0]);
        } else {
            await deleteComment(report.reportedContent[1]);
        }
        await deleteAllReports(report);
    }

    async function handleCancel(report) {
        await deleteAllReports(report);
    }

    async function deleteAllReports(report) {
        const key =
            report.reportType === "post"
                ? report.reportedContent[0]
                : `${report.reportedContent[0]}_${report.reportedContent[1]}`;
        const reportsToDelete = reports.filter((r) => {
            const rKey =
                r.reportType === "post"
                    ? r.reportedContent[0]
                    : `${r.reportedContent[0]}_${r.reportedContent[1]}`;
            return rKey === key;
        });
        for (const r of reportsToDelete) {
            await reportService.deleteReport(r._id);
        }
        setReports(reports.filter((r) => !reportsToDelete.includes(r)));
    }

    return (
        <div>
            <div
                onClick={() => window.history.back()}
                className="fixed w-full h-full bg-black opacity-75 z-20 top-0 left-0"
            ></div>

            <div className="fixed w-full pb-14 sm:max-w-lg right-0 flex flex-col gap-5 h-full py-5 sm:py-8 bg-white top-0 z-30 overflow-y-auto">
                <div className=" ">
                    <div className="flex gap-4 mb-6 items-center -mt-0.5 px-4 sm:px-6">
                        <svg
                            onClick={() => {
                                window.history.back();
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6 cursor-pointer"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                            />
                        </svg>
                        <h2 className="text-2xl font-bold">Reports</h2>
                    </div>
                </div>
                <div className="flex flex-col gap-4 px-4 sm:px-6">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            onClick={() => {
                                console.log(report);
                                if (report.reportType == "post") {
                                    window.open("/post/" + report.reportedContent[0]);
                                } else {
                                    window.open(
                                        "/post/" +
                                            report.reportedContent[0] +
                                            "?commentId=" +
                                            report.reportedContent[1]
                                    );
                                }
                            }}
                            className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-gray-50"
                        >
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">
                                    {report.reportedBy.username}
                                </span>{" "}
                                reported{" "}
                                <span className="font-semibold">{report.reportType}</span> from{" "}
                                <span className="font-semibold">
                                    {report.reportedUser.username}
                                </span>{" "}
                                <span className="font-semibold">({report.count} times)</span>
                            </p>
                            <div className="flex gap-2 w-full mt-5">
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAccept(report);
                                    }}
                                    className="bg-gray-800 w-full text-white px-4 py-2 rounded-md"
                                >
                                    Accept
                                </Button>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancel(report);
                                    }}
                                    className="border border-red-500 text-red-500 w-full px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Reports;
