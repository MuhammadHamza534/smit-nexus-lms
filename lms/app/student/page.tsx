"use client";

import { useMemo } from "react";
import AuthGuard from "@/components/AuthGuard";
import DashboardShell from "@/components/DashboardShell";
import { initialCourses } from "@/lib/data";
import { useLms } from "@/components/LmsProvider";

export default function StudentDashboardPage() {
  const {
    students,
    assignments,
    getAttendancePercentage,
    getCourseProgress,
    ready,
  } = useLms();

  const student = students.find(
    (item) => item.id === 1
  );

  const studentCourses = useMemo(() => {
    if (!student) return [];

    return initialCourses.filter((course) =>
      student.courseIds.includes(course.id)
    );
  }, [student]);

  const activeCourse =
    studentCourses.find(
      (course) => course.id === "web"
    ) || studentCourses[0];

  const attendance = student
    ? getAttendancePercentage(student)
    : 0;

  const courseProgress = activeCourse
    ? getCourseProgress(activeCourse.id)
    : 0;

  const studentAssignments = assignments.filter(
    (assignment) =>
      student?.courseIds.includes(
        assignment.courseId
      )
  );

  const pendingAssignments =
    studentAssignments.filter((assignment) => {
      const submission =
        assignment.submissions.find(
          (item) =>
            item.studentId === student?.id
        );

      return !submission?.submitted;
    }).length;

  const totalClasses =
    (student?.present || 0) +
    (student?.absent || 0);

  if (!ready) {
    return (
      <AuthGuard role="student">
        <DashboardShell
          role="student"
          title="Student Dashboard"
        >
          <div
            className="empty-state"
            style={{
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div className="empty-state-icon">
              ◌
            </div>

            <h3>Loading Dashboard...</h3>

            <p>
              Please wait while your LMS data
              is loading.
            </p>
          </div>
        </DashboardShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard role="student">
      <DashboardShell
        role="student"
        title="Student Dashboard"
      >
        <div className="dashboard-content">
          {/* =========================================
              PAGE HEADER
          ========================================= */}

          <div className="page-heading">
            <div
              style={{
                color: "#38a7ff",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "7px",
              }}
            >
              Student Portal
            </div>

            <h1>
              Welcome back,{" "}
              {student?.name || "Student"}
            </h1>

            <p>
              Here is your academic overview and
              current learning progress.
            </p>
          </div>

          {/* =========================================
              STAT CARDS
          ========================================= */}

          <div
            className="stats-grid"
            style={{
              marginBottom: "28px",
            }}
          >
            {/* Attendance */}
            <div className="stat-card">
              <div
                className="stat-icon"
              >
                %
              </div>

              <div>
                <div
                  style={{
                    color: "#8da5c1",
                    fontSize: "12px",
                    marginBottom: "7px",
                  }}
                >
                  Overall Attendance
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "25px",
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  {attendance}%
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  {student?.present || 0} present ·{" "}
                  {student?.absent || 0} absent
                </div>
              </div>
            </div>

            {/* Course Progress */}
            <div className="stat-card">
              <div className="stat-icon">
                ◫
              </div>

              <div>
                <div
                  style={{
                    color: "#8da5c1",
                    fontSize: "12px",
                    marginBottom: "7px",
                  }}
                >
                  Course Progress
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "25px",
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  {courseProgress}%
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  {activeCourse?.shortName ||
                    "Course"}
                </div>
              </div>
            </div>

            {/* Assignments */}
            <div className="stat-card">
              <div className="stat-icon">
                ▤
              </div>

              <div>
                <div
                  style={{
                    color: "#8da5c1",
                    fontSize: "12px",
                    marginBottom: "7px",
                  }}
                >
                  Assignments
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "25px",
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  {studentAssignments.length}
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  {pendingAssignments} pending
                </div>
              </div>
            </div>

            {/* Enrollment */}
            <div className="stat-card">
              <div className="stat-icon">
                ▦
              </div>

              <div>
                <div
                  style={{
                    color: "#8da5c1",
                    fontSize: "12px",
                    marginBottom: "7px",
                  }}
                >
                  Enrolled Courses
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "25px",
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  {studentCourses.length}
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  Active enrollment
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              ACTIVE COURSE + ATTENDANCE
          ========================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1.45fr) minmax(300px, 0.75fr)",
              gap: "20px",
              marginBottom: "20px",
            }}
            className="student-dashboard-grid"
          >
            {/* Active Course */}
            <div
              className="lms-card"
              style={{
                padding: "26px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent:
                    "space-between",
                  gap: "15px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#38a7ff",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform:
                        "uppercase",
                      letterSpacing: "0.8px",
                      marginBottom: "8px",
                    }}
                  >
                    Active Course
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      color: "#f8fafc",
                      fontSize: "21px",
                      fontWeight: 700,
                    }}
                  >
                    {activeCourse?.title ||
                      "No Course"}
                  </h2>

                  <p
                    style={{
                      margin:
                        "8px 0 0",
                      color: "#7189a3",
                      fontSize: "13px",
                      lineHeight: 1.6,
                    }}
                  >
                    {activeCourse?.description ||
                      "No course information available."}
                  </p>
                </div>

                <span
                  className="status-pill status-active"
                >
                  Active
                </span>
              </div>

              {/* Course Information */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "12px",
                  marginBottom: "25px",
                }}
              >
                <div className="info-box">
                  <div className="info-box-label">
                    Batch
                  </div>

                  <div className="info-box-value">
                    {activeCourse?.batch ||
                      "-"}
                  </div>
                </div>

                <div className="info-box">
                  <div className="info-box-label">
                    Schedule
                  </div>

                  <div className="info-box-value">
                    {activeCourse?.schedule ||
                      "-"}
                  </div>
                </div>

                <div className="info-box">
                  <div className="info-box-label">
                    Campus
                  </div>

                  <div className="info-box-value">
                    {activeCourse?.campus ||
                      "-"}
                  </div>
                </div>

                <div className="info-box">
                  <div className="info-box-label">
                    Room
                  </div>

                  <div className="info-box-value">
                    {activeCourse?.room ||
                      "-"}
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    marginBottom: "9px",
                  }}
                >
                  <span
                    style={{
                      color: "#9db5cf",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Course Progress
                  </span>

                  <span
                    style={{
                      color: "#38a7ff",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {courseProgress}%
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${courseProgress}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Attendance */}
            <div
              className="lms-card"
              style={{
                padding: "26px",
              }}
            >
              <div
                style={{
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    color: "#38a7ff",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform:
                      "uppercase",
                    letterSpacing: "0.8px",
                    marginBottom: "8px",
                  }}
                >
                  Attendance
                </div>

                <h2
                  style={{
                    margin: 0,
                    color: "#f8fafc",
                    fontSize: "21px",
                    fontWeight: 700,
                  }}
                >
                  Academic Attendance
                </h2>
              </div>

              {/* Percentage */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "82px",
                    height: "82px",
                    minWidth: "82px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    background:
                      "conic-gradient(#38a7ff 0deg, #38a7ff " +
                      `${attendance * 3.6}deg,` +
                      "rgba(255,255,255,0.07) " +
                      `${attendance * 3.6}deg,` +
                      "rgba(255,255,255,0.07) 360deg)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position:
                        "absolute",
                      inset: "7px",
                      borderRadius:
                        "50%",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      background:
                        "#09203f",
                    }}
                  >
                    <span
                      style={{
                        color: "#f8fafc",
                        fontSize: "18px",
                        fontWeight: 700,
                      }}
                    >
                      {attendance}%
                    </span>
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      color: "#dbeafe",
                      fontSize: "14px",
                      fontWeight: 600,
                      marginBottom: "6px",
                    }}
                  >
                    {attendance >= 75
                      ? "Good attendance"
                      : "Attendance needs attention"}
                  </div>

                  <div
                    style={{
                      color: "#7189a3",
                      fontSize: "12px",
                      lineHeight: 1.6,
                    }}
                  >
                    Keep attending your
                    classes regularly.
                  </div>
                </div>
              </div>

              {/* Attendance Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "12px",
                }}
              >
                <div className="info-box">
                  <div
                    style={{
                      color: "#22c55e",
                      fontSize: "11px",
                      marginBottom: "5px",
                    }}
                  >
                    PRESENT
                  </div>

                  <div
                    style={{
                      color: "#f8fafc",
                      fontSize: "22px",
                      fontWeight: 700,
                    }}
                  >
                    {student?.present || 0}
                  </div>
                </div>

                <div className="info-box">
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "11px",
                      marginBottom: "5px",
                    }}
                  >
                    ABSENT
                  </div>

                  <div
                    style={{
                      color: "#f8fafc",
                      fontSize: "22px",
                      fontWeight: 700,
                    }}
                  >
                    {student?.absent || 0}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "13px",
                  color: "#607995",
                  fontSize: "11px",
                }}
              >
                Total classes:{" "}
                {totalClasses}
              </div>
            </div>
          </div>

          {/* =========================================
              ENROLLED COURSES
          ========================================= */}

          <div
            className="lms-card"
            style={{
              padding: "26px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                gap: "15px",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#f8fafc",
                    fontSize: "19px",
                    fontWeight: 700,
                  }}
                >
                  My Courses
                </h2>

                <p
                  style={{
                    margin:
                      "6px 0 0",
                    color: "#7189a3",
                    fontSize: "12px",
                  }}
                >
                  Your currently enrolled
                  courses.
                </p>
              </div>

              <span
                style={{
                  color: "#38a7ff",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {studentCourses.length}{" "}
                courses
              </span>
            </div>

            {studentCourses.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "14px",
                }}
              >
                {studentCourses.map(
                  (course) => {
                    const progress =
                      getCourseProgress(
                        course.id
                      );

                    return (
                      <div
                        key={course.id}
                        className="lms-card lms-card-hover"
                        style={{
                          padding: "18px",
                          background:
                            "rgba(7,26,50,0.72)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems:
                              "flex-start",
                            justifyContent:
                              "space-between",
                            gap: "12px",
                            marginBottom:
                              "15px",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                color:
                                  "#38a7ff",
                                fontSize:
                                  "10px",
                                fontWeight:
                                  700,
                                marginBottom:
                                  "5px",
                                letterSpacing:
                                  "0.5px",
                              }}
                            >
                              {course.shortName}
                            </div>

                            <h3
                              style={{
                                margin: 0,
                                color:
                                  "#e6eef8",
                                fontSize:
                                  "14px",
                                fontWeight:
                                  600,
                                lineHeight:
                                  1.4,
                              }}
                            >
                              {course.title}
                            </h3>
                          </div>

                          <span
                            className="status-pill status-active"
                          >
                            Active
                          </span>
                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            marginBottom:
                              "8px",
                          }}
                        >
                          <span
                            style={{
                              color:
                                "#7189a3",
                              fontSize:
                                "11px",
                            }}
                          >
                            Progress
                          </span>

                          <span
                            style={{
                              color:
                                "#38a7ff",
                              fontSize:
                                "11px",
                              fontWeight:
                                700,
                            }}
                          >
                            {progress}%
                          </span>
                        </div>

                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>

                        <div
                          style={{
                            marginTop:
                              "13px",
                            color:
                              "#607995",
                            fontSize:
                              "11px",
                          }}
                        >
                          {course.batch} ·{" "}
                          {course.room}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  ▦
                </div>

                <h3>
                  No Courses Found
                </h3>

                <p>
                  You are not enrolled in any
                  course yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Responsive Dashboard Grid */}
        <style jsx>{`
          @media (max-width: 1000px) {
            .student-dashboard-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 650px) {
            .student-dashboard-grid
              > div {
              padding: 20px !important;
            }

            .student-dashboard-grid
              > div
              > div:nth-child(2) {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </DashboardShell>
    </AuthGuard>
  );
}