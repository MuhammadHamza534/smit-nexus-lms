"use client";

import { useMemo, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import DashboardShell from "@/components/DashboardShell";
import {
  attendanceHistory,
  initialStudents,
} from "@/lib/data";

const months = [
  { value: "01", label: "January 2026" },
  { value: "02", label: "February 2026" },
  { value: "03", label: "March 2026" },
  { value: "04", label: "April 2026" },
  { value: "05", label: "May 2026" },
  { value: "06", label: "June 2026" },
  { value: "07", label: "July 2026" },
  { value: "08", label: "August 2026" },
  { value: "09", label: "September 2026" },
  { value: "10", label: "October 2026" },
  { value: "11", label: "November 2026" },
  { value: "12", label: "December 2026" },
];

export default function StudentAttendancePage() {
  const studentId = 1;

  const student = initialStudents.find(
    (item) => item.id === studentId
  );

  const [selectedMonth, setSelectedMonth] = useState("09");

  const [monthOpen, setMonthOpen] = useState(false);

  const selectedMonthName =
    months.find((month) => month.value === selectedMonth)
      ?.label || "September 2026";

  /*
   * Filter attendance according to selected month.
   */
  const monthRecords = useMemo(() => {
    return attendanceHistory
      .filter((record) => {
        const date = new Date(record.date);

        const month = String(
          date.getMonth() + 1
        ).padStart(2, "0");

        return month === selectedMonth;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return dateA - dateB;
      });
  }, [selectedMonth]);

  /*
   * Selected month statistics.
   */
  const presentCount = monthRecords.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = monthRecords.filter(
    (record) => record.status === "Absent"
  ).length;

  const totalClasses = presentCount + absentCount;

  const monthlyPercentage =
    totalClasses > 0
      ? Math.round(
          (presentCount / totalClasses) * 100
        )
      : 0;

  /*
   * Overall statistics from student data.
   */
  const totalAttendance =
    (student?.present || 0) +
    (student?.absent || 0);

  const overallPercentage =
    totalAttendance > 0
      ? Math.round(
          ((student?.present || 0) /
            totalAttendance) *
            100
        )
      : 0;

  return (
    <AuthGuard role="student">
      <DashboardShell
        role="student"
        title="Attendance"
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {/* PAGE HEADER */}
          <div
            style={{
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#38a7ff",
                marginBottom: "7px",
                letterSpacing: "0.2px",
              }}
            >
              Student Portal
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "32px",
                lineHeight: 1.2,
                fontWeight: 700,
                color: "#f8fafc",
              }}
            >
              Attendance
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: "15px",
                color: "#8da5c1",
              }}
            >
              View your attendance by selecting any
              month.
            </p>
          </div>

          {/* STAT CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "18px",
              marginBottom: "28px",
            }}
          >
            {/* Overall */}
            <div style={statCardStyle}>
              <div
                style={{
                  ...iconCircleStyle,
                  background:
                    "rgba(30, 136, 229, 0.14)",
                  color: "#38a7ff",
                }}
              >
                %
              </div>

              <div>
                <div style={statLabelStyle}>
                  Overall Attendance
                </div>

                <div style={statValueStyle}>
                  {overallPercentage}%
                </div>

                <div style={statSmallTextStyle}>
                  {student?.present || 0} present ·{" "}
                  {student?.absent || 0} absent
                </div>
              </div>
            </div>

            {/* Present */}
            <div style={statCardStyle}>
              <div
                style={{
                  ...iconCircleStyle,
                  background:
                    "rgba(34, 197, 94, 0.13)",
                  color: "#22c55e",
                }}
              >
                ✓
              </div>

              <div>
                <div style={statLabelStyle}>
                  Present This Month
                </div>

                <div style={statValueStyle}>
                  {presentCount}
                </div>

                <div style={statSmallTextStyle}>
                  Out of {totalClasses} classes
                </div>
              </div>
            </div>

            {/* Absent */}
            <div style={statCardStyle}>
              <div
                style={{
                  ...iconCircleStyle,
                  background:
                    "rgba(239, 68, 68, 0.13)",
                  color: "#ef4444",
                }}
              >
                ×
              </div>

              <div>
                <div style={statLabelStyle}>
                  Absent This Month
                </div>

                <div style={statValueStyle}>
                  {absentCount}
                </div>

                <div style={statSmallTextStyle}>
                  Out of {totalClasses} classes
                </div>
              </div>
            </div>

            {/* Monthly */}
            <div style={statCardStyle}>
              <div
                style={{
                  ...iconCircleStyle,
                  background:
                    "rgba(30, 136, 229, 0.14)",
                  color: "#38a7ff",
                }}
              >
                ◫
              </div>

              <div>
                <div style={statLabelStyle}>
                  Monthly Attendance
                </div>

                <div style={statValueStyle}>
                  {monthlyPercentage}%
                </div>

                <div style={statSmallTextStyle}>
                  {selectedMonthName}
                </div>
              </div>
            </div>
          </div>

          {/* ATTENDANCE OVERVIEW */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(9, 32, 63, 0.96), rgba(7, 25, 49, 0.96))",
              border: "1px solid rgba(64, 150, 255, 0.16)",
              borderRadius: "14px",
              padding: "25px 28px",
              marginBottom: "20px",
              boxShadow:
                "0 10px 30px rgba(0, 0, 0, 0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "20px",
                marginBottom: "16px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#f8fafc",
                    fontSize: "21px",
                    fontWeight: 700,
                  }}
                >
                  Attendance Overview
                </h2>

                <p
                  style={{
                    margin: "10px 0 0",
                    color: "#8da5c1",
                    fontSize: "14px",
                  }}
                >
                  {overallPercentage >= 75
                    ? "Your attendance is good. Keep it up!"
                    : "Your attendance needs improvement."}
                </p>
              </div>

              <strong
                style={{
                  fontSize: "30px",
                  color:
                    overallPercentage >= 75
                      ? "#22c55e"
                      : "#ef4444",
                  lineHeight: 1,
                }}
              >
                {overallPercentage}%
              </strong>
            </div>

            {/* Progress */}
            <div
              style={{
                width: "100%",
                height: "9px",
                borderRadius: "20px",
                background:
                  "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${overallPercentage}%`,
                  height: "100%",
                  borderRadius: "20px",
                  background:
                    overallPercentage >= 75
                      ? "#22c55e"
                      : "#ef4444",
                  transition:
                    "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* MONTH DROPDOWN */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "14px",
              position: "relative",
              zIndex: 20,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "220px",
              }}
            >
              {/* Dropdown Button */}
              <button
                type="button"
                onClick={() =>
                  setMonthOpen(!monthOpen)
                }
                style={{
                  width: "100%",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  padding: "0 15px",
                  borderRadius: "9px",
                  border:
                    "1px solid rgba(100, 160, 220, 0.20)",
                  background: "#071a32",
                  color: "#f1f5f9",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                  }}
                >
                  <span
                    style={{
                      color: "#38a7ff",
                      fontSize: "17px",
                    }}
                  >
                    ▣
                  </span>

                  {selectedMonthName}
                </span>

                <span
                  style={{
                    color: "#8da5c1",
                    fontSize: "13px",
                    transform: monthOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition:
                      "transform 0.2s ease",
                  }}
                >
                  ▼
                </span>
              </button>

              {/* Dropdown Menu */}
              {monthOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "54px",
                    right: 0,
                    width: "100%",
                    maxHeight: "360px",
                    overflowY: "auto",
                    padding: "6px",
                    borderRadius: "10px",
                    border:
                      "1px solid rgba(70, 150, 230, 0.28)",
                    background: "#071a32",
                    boxShadow:
                      "0 18px 40px rgba(0,0,0,0.45)",
                  }}
                >
                  {months.map((month) => {
                    const isSelected =
                      month.value ===
                      selectedMonth;

                    return (
                      <button
                        key={month.value}
                        type="button"
                        onClick={() => {
                          setSelectedMonth(
                            month.value
                          );
                          setMonthOpen(false);
                        }}
                        style={{
                          width: "100%",
                          border: "none",
                          borderRadius: "7px",
                          padding:
                            "11px 12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "space-between",
                          background: isSelected
                            ? "rgba(30, 111, 220, 0.55)"
                            : "transparent",
                          color: isSelected
                            ? "#ffffff"
                            : "#b8c9dc",
                          fontSize: "13px",
                          fontWeight:
                            isSelected
                              ? 600
                              : 400,
                          cursor: "pointer",
                          textAlign: "left",
                          marginBottom: "2px",
                        }}
                        onMouseEnter={(event) => {
                          if (!isSelected) {
                            event.currentTarget.style.background =
                              "rgba(255,255,255,0.06)";
                          }
                        }}
                        onMouseLeave={(event) => {
                          if (!isSelected) {
                            event.currentTarget.style.background =
                              "transparent";
                          }
                        }}
                      >
                        <span>
                          {month.label}
                        </span>

                        {isSelected && (
                          <span
                            style={{
                              color: "#55b7ff",
                              fontSize: "15px",
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ATTENDANCE TABLE */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(9, 32, 63, 0.96), rgba(7, 25, 49, 0.96))",
              border: "1px solid rgba(64, 150, 255, 0.16)",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow:
                "0 10px 30px rgba(0, 0, 0, 0.18)",
            }}
          >
            {/* Table Header */}
            <div
              style={{
                padding: "20px 22px",
                borderBottom:
                  "1px solid rgba(100, 160, 220, 0.13)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  color: "#38a7ff",
                  fontSize: "18px",
                }}
              >
                ▣
              </span>

              <h2
                style={{
                  margin: 0,
                  color: "#f8fafc",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                Attendance Records
              </h2>
            </div>

            {/* Table */}
            {monthRecords.length > 0 ? (
              <div
                style={{
                  width: "100%",
                  overflowX: "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                    minWidth: "650px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background:
                          "rgba(22, 75, 130, 0.25)",
                      }}
                    >
                      <th style={thStyle}>
                        #
                      </th>

                      <th
                        style={{
                          ...thStyle,
                          textAlign: "left",
                        }}
                      >
                        Date
                      </th>

                      <th
                        style={{
                          ...thStyle,
                          textAlign: "left",
                        }}
                      >
                        Topic
                      </th>

                      <th
                        style={{
                          ...thStyle,
                          textAlign: "left",
                        }}
                      >
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {monthRecords.map(
                      (record, index) => {
                        const date =
                          new Date(
                            record.date
                          );

                        const formattedDate =
                          date.toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          );

                        const weekday =
                          date.toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                            }
                          );

                        const isPresent =
                          record.status ===
                          "Present";

                        return (
                          <tr
                            key={`${record.date}-${index}`}
                            style={{
                              borderTop:
                                "1px solid rgba(100, 160, 220, 0.12)",
                            }}
                          >
                            {/* Number */}
                            <td
                              style={{
                                ...tdStyle,
                                width: "70px",
                                color: "#dce8f5",
                              }}
                            >
                              {index + 1}
                            </td>

                            {/* Date */}
                            <td
                              style={{
                                ...tdStyle,
                                minWidth: "250px",
                              }}
                            >
                              <div
                                style={{
                                  color: "#dbeafe",
                                  fontSize:
                                    "14px",
                                  fontWeight: 500,
                                }}
                              >
                                {formattedDate}
                              </div>

                              <div
                                style={{
                                  color:
                                    "#6f96bc",
                                  fontSize:
                                    "12px",
                                  marginTop:
                                    "4px",
                                }}
                              >
                                {weekday}
                              </div>
                            </td>

                            {/* Topic */}
                            <td
                              style={{
                                ...tdStyle,
                                color: "#b7d0ea",
                                fontSize:
                                  "14px",
                                minWidth: "280px",
                              }}
                            >
                              {record.topic}
                            </td>

                            {/* Status */}
                            <td
                              style={{
                                ...tdStyle,
                                width: "180px",
                              }}
                            >
                              <span
                                style={{
                                  display:
                                    "inline-flex",
                                  alignItems:
                                    "center",
                                  gap: "7px",
                                  padding:
                                    "7px 13px",
                                  borderRadius:
                                    "999px",
                                  fontSize:
                                    "12px",
                                  fontWeight: 600,
                                  background:
                                    isPresent
                                      ? "rgba(34, 197, 94, 0.13)"
                                      : "rgba(239, 68, 68, 0.14)",
                                  color:
                                    isPresent
                                      ? "#22c55e"
                                      : "#ef4444",
                                  border: isPresent
                                    ? "1px solid rgba(34, 197, 94, 0.22)"
                                    : "1px solid rgba(239, 68, 68, 0.24)",
                                }}
                              >
                                <span
                                  style={{
                                    width:
                                      "7px",
                                    height:
                                      "7px",
                                    borderRadius:
                                      "50%",
                                    background:
                                      isPresent
                                        ? "#22c55e"
                                        : "#ef4444",
                                  }}
                                />

                                {record.status}
                              </span>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* No Records */
              <div
                style={{
                  padding: "55px 20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    margin: "0 auto 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "rgba(56, 167, 255, 0.10)",
                    color: "#38a7ff",
                    fontSize: "22px",
                  }}
                >
                  ▣
                </div>

                <h3
                  style={{
                    margin: "0 0 7px",
                    color: "#e2e8f0",
                    fontSize: "16px",
                  }}
                >
                  No Attendance Records
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#7189a3",
                    fontSize: "13px",
                  }}
                >
                  No attendance data is available
                  for {selectedMonthName}.
                </p>
              </div>
            )}
          </div>
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}

/* ============================= */
/* STYLES                        */
/* ============================= */

const statCardStyle = {
  minHeight: "120px",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  borderRadius: "14px",
  background:
    "linear-gradient(135deg, rgba(20, 46, 78, 0.95), rgba(9, 30, 55, 0.95))",
  border:
    "1px solid rgba(75, 150, 225, 0.15)",
  boxShadow:
    "0 8px 25px rgba(0, 0, 0, 0.15)",
};

const iconCircleStyle = {
  width: "48px",
  height: "48px",
  minWidth: "48px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  fontWeight: 700,
};

const statLabelStyle = {
  color: "#8da5c1",
  fontSize: "12px",
  marginBottom: "7px",
};

const statValueStyle = {
  color: "#f8fafc",
  fontSize: "25px",
  lineHeight: 1,
  fontWeight: 700,
};

const statSmallTextStyle = {
  color: "#6f96bc",
  fontSize: "11px",
  marginTop: "7px",
};

const thStyle = {
  padding: "14px 22px",
  color: "#9db9d5",
  fontSize: "12px",
  fontWeight: 600,
  textAlign: "center" as const,
  whiteSpace: "nowrap" as const,
};

const tdStyle = {
  padding: "14px 22px",
  color: "#b7d0ea",
  fontSize: "14px",
  verticalAlign: "middle" as const,
};