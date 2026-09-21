"use client";

import { useMemo, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import DashboardShell from "@/components/DashboardShell";
import { initialCourses } from "@/lib/data";
import { useLms } from "@/components/LmsProvider";

export default function StudentProgressPage() {
  const {
    students,
    topics,
    ready,
    getCourseProgress,
  } = useLms();

  const studentId = 1;

  const student = students.find(
    (item) => item.id === studentId
  );

  const studentCourses = useMemo(() => {
    if (!student) return [];

    return initialCourses.filter((course) =>
      student.courseIds.includes(course.id)
    );
  }, [student]);

  const [selectedCourse, setSelectedCourse] =
    useState("web");

  const activeCourse =
    studentCourses.find(
      (course) => course.id === selectedCourse
    ) || studentCourses[0];

  const courseTopics = useMemo(() => {
    if (!activeCourse) return [];

    return topics.filter(
      (topic) =>
        topic.courseId === activeCourse.id
    );
  }, [topics, activeCourse]);

  const completedTopics =
    courseTopics.filter(
      (topic) => topic.completed
    ).length;

  const remainingTopics =
    courseTopics.length - completedTopics;

  const progress =
    courseTopics.length > 0
      ? Math.round(
          (completedTopics /
            courseTopics.length) *
            100
        )
      : 0;

  const overallProgress = useMemo(() => {
    if (!studentCourses.length) return 0;

    const values = studentCourses.map(
      (course) =>
        getCourseProgress(
          course.id
        )
    );

    if (!values.length) return 0;

    return Math.round(
      values.reduce(
        (total, value) => total + value,
        0
      ) / values.length
    );
  }, [
    studentCourses,
    getCourseProgress,
  ]);

  if (!ready) {
    return (
      <AuthGuard role="student">
        <DashboardShell
          role="student"
          title="Progress"
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

            <h3>
              Loading Progress...
            </h3>

            <p>
              Please wait while your course
              progress is loading.
            </p>
          </div>
        </DashboardShell>
      </AuthGuard>
    );
  }

  if (!activeCourse) {
    return (
      <AuthGuard role="student">
        <DashboardShell
          role="student"
          title="Progress"
        >
          <div className="dashboard-content">
            <div className="page-heading">
              <h1>Course Progress</h1>
              <p>
                Track your learning progress
                across enrolled courses.
              </p>
            </div>

            <div className="empty-state">
              <div className="empty-state-icon">
                ◫
              </div>

              <h3>
                No Courses Available
              </h3>

              <p>
                You are not currently enrolled
                in any courses.
              </p>
            </div>
          </div>
        </DashboardShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard role="student">
      <DashboardShell
        role="student"
        title="Progress"
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

            <h1>Course Progress</h1>

            <p>
              Track your learning progress,
              completed topics and remaining
              course content.
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
            {/* Overall */}
            <div className="stat-card">
              <div className="stat-icon">
                ◔
              </div>

              <div>
                <div
                  style={{
                    color: "#8da5c1",
                    fontSize: "12px",
                    marginBottom: "7px",
                  }}
                >
                  Overall Progress
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "25px",
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  {overallProgress}%
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  Across all courses
                </div>
              </div>
            </div>

            {/* Current Course */}
            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  color: "#38a7ff",
                  background:
                    "rgba(56,167,255,0.11)",
                }}
              >
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
                  Current Course
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "18px",
                    lineHeight: 1.2,
                    fontWeight: 700,
                  }}
                >
                  {activeCourse.shortName}
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  {activeCourse.title}
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  color: "#22c55e",
                  background:
                    "rgba(34,197,94,0.12)",
                }}
              >
                ✓
              </div>

              <div>
                <div
                  style={{
                    color: "#8da5c1",
                    fontSize: "12px",
                    marginBottom: "7px",
                  }}
                >
                  Completed Topics
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "25px",
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  {completedTopics}
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  Topics completed
                </div>
              </div>
            </div>

            {/* Remaining */}
            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  color: "#f59e0b",
                  background:
                    "rgba(245,158,11,0.12)",
                }}
              >
                !
              </div>

              <div>
                <div
                  style={{
                    color: "#8da5c1",
                    fontSize: "12px",
                    marginBottom: "7px",
                  }}
                >
                  Remaining
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "25px",
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  {remainingTopics}
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  Topics left
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              COURSE SELECTOR
          ========================================= */}

          <div
            className="lms-card"
            style={{
              padding: "20px",
              marginBottom: "18px",
            }}
          >
            <div
              className="progress-filter"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                gap: "20px",
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
                    marginBottom: "6px",
                  }}
                >
                  Course
                </div>

                <div
                  style={{
                    color: "#e6eef8",
                    fontSize: "15px",
                    fontWeight: 600,
                  }}
                >
                  Select a course
                </div>
              </div>

              <div
                style={{
                  width: "300px",
                }}
              >
                <select
                  value={activeCourse.id}
                  onChange={(event) =>
                    setSelectedCourse(
                      event.target.value
                    )
                  }
                  className="lms-select"
                >
                  {studentCourses.map(
                    (course) => (
                      <option
                        key={course.id}
                        value={course.id}
                      >
                        {course.shortName} —{" "}
                        {course.title}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* =========================================
              MAIN PROGRESS CARD
          ========================================= */}

          <div
            className="lms-card"
            style={{
              padding: "26px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent:
                  "space-between",
                gap: "20px",
                marginBottom: "24px",
              }}
              className="progress-heading"
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
                    marginBottom: "7px",
                  }}
                >
                  Learning Progress
                </div>

                <h2
                  style={{
                    margin: 0,
                    color: "#f8fafc",
                    fontSize: "21px",
                    fontWeight: 700,
                  }}
                >
                  {activeCourse.title}
                </h2>

                <p
                  style={{
                    margin:
                      "7px 0 0",
                    color: "#7189a3",
                    fontSize: "12px",
                  }}
                >
                  {activeCourse.campus} ·{" "}
                  {activeCourse.schedule}
                </p>
              </div>

              <div
                style={{
                  minWidth: "90px",
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    color: "#38a7ff",
                    fontSize: "30px",
                    lineHeight: 1,
                    fontWeight: 800,
                  }}
                >
                  {progress}%
                </div>

                <div
                  style={{
                    color: "#7189a3",
                    fontSize: "10px",
                    marginTop: "6px",
                  }}
                >
                  Complete
                </div>
              </div>
            </div>

            {/* Progress bar */}

            <div
              style={{
                marginBottom: "25px",
              }}
            >
              <div
                className="progress-track"
                style={{
                  height: "10px",
                }}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginTop: "8px",
                  color: "#607995",
                  fontSize: "10px",
                }}
              >
                <span>
                  {completedTopics} completed
                </span>

                <span>
                  {courseTopics.length} total
                </span>
              </div>
            </div>

            {/* Mini stats */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, minmax(0, 1fr))",
                gap: "12px",
              }}
              className="progress-mini-grid"
            >
              <div className="info-box">
                <div className="info-box-label">
                  Total Topics
                </div>

                <div className="info-box-value">
                  {courseTopics.length}
                </div>
              </div>

              <div className="info-box">
                <div className="info-box-label">
                  Completed
                </div>

                <div className="info-box-value">
                  {completedTopics}
                </div>
              </div>

              <div className="info-box">
                <div className="info-box-label">
                  Remaining
                </div>

                <div className="info-box-value">
                  {remainingTopics}
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              TOPICS LIST
          ========================================= */}

          <div className="table-wrapper">
            <div
              style={{
                padding: "20px 22px",
                borderBottom:
                  "1px solid rgba(100,160,220,0.12)",
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
                ☷
              </span>

              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#f8fafc",
                    fontSize: "18px",
                    fontWeight: 700,
                  }}
                >
                  Course Topics
                </h2>

                <p
                  style={{
                    margin:
                      "5px 0 0",
                    color: "#7189a3",
                    fontSize: "11px",
                  }}
                >
                  Your completed and remaining
                  learning topics.
                </p>
              </div>
            </div>

            {courseTopics.length > 0 ? (
              <div
                style={{
                  overflowX: "auto",
                }}
              >
                <table className="lms-table">
                  <thead>
                    <tr>
                      <th>#</th>

                      <th>
                        Topic
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Progress
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {courseTopics.map(
                      (topic, index) => (
                        <tr
                          key={topic.id}
                        >
                          <td
                            style={{
                              width:
                                "70px",
                              color:
                                "#7189a3",
                            }}
                          >
                            {index + 1}
                          </td>

                          <td>
                            <div
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: "12px",
                              }}
                            >
                              <div
                                style={{
                                  width:
                                    "30px",
                                  height:
                                    "30px",
                                  borderRadius:
                                    "8px",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  background:
                                    topic.completed
                                      ? "rgba(34,197,94,0.12)"
                                      : "rgba(56,167,255,0.08)",
                                  color:
                                    topic.completed
                                      ? "#22c55e"
                                      : "#38a7ff",
                                  fontSize:
                                    "12px",
                                  fontWeight:
                                    700,
                                }}
                              >
                                {topic.completed
                                  ? "✓"
                                  : index + 1}
                              </div>

                              <div>
                                <div
                                  style={{
                                    color:
                                      "#dbeafe",
                                    fontSize:
                                      "13px",
                                    fontWeight:
                                      600,
                                  }}
                                >
                                  {
                                    topic.title
                                  }
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            {topic.completed ? (
                              <span className="attendance-present">
                                <span>
                                  ●
                                </span>
                                Completed
                              </span>
                            ) : (
                              <span
                                className="status-pill"
                                style={{
                                  color:
                                    "#fbbf24",
                                  background:
                                    "rgba(245,158,11,0.12)",
                                  border:
                                    "1px solid rgba(245,158,11,0.22)",
                                }}
                              >
                                In Progress
                              </span>
                            )}
                          </td>

                          <td
                            style={{
                              minWidth:
                                "180px",
                            }}
                          >
                            <div
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: "10px",
                              }}
                            >
                              <div
                                className="progress-track"
                                style={{
                                  height:
                                    "6px",
                                  flex:
                                    1,
                                }}
                              >
                                <div
                                  className={
                                    topic.completed
                                      ? "progress-fill progress-fill-success"
                                      : "progress-fill"
                                  }
                                  style={{
                                    width:
                                      topic.completed
                                        ? "100%"
                                        : "0%",
                                  }}
                                />
                              </div>

                              <span
                                style={{
                                  color:
                                    topic.completed
                                      ? "#22c55e"
                                      : "#7189a3",
                                  fontSize:
                                    "10px",
                                  fontWeight:
                                    600,
                                  minWidth:
                                    "32px",
                                }}
                              >
                                {topic.completed
                                  ? "100%"
                                  : "0%"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  ☷
                </div>

                <h3>
                  No Topics Available
                </h3>

                <p>
                  No course topics have been
                  added yet.
                </p>
              </div>
            )}
          </div>

          {/* =========================================
              INFORMATION BOX
          ========================================= */}

          <div
            className="info-box"
            style={{
              marginTop: "20px",
              padding: "18px 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  color: "#38a7ff",
                  fontSize: "18px",
                }}
              >
                i
              </span>

              <div>
                <div
                  style={{
                    color: "#dbeafe",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                  }}
                >
                  Progress Information
                </div>

                <div
                  style={{
                    color: "#7189a3",
                    fontSize: "11px",
                    lineHeight: 1.6,
                  }}
                >
                  Course progress is updated
                  according to the topics completed
                  by your trainer.
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 800px) {
            .progress-filter {
              flex-direction: column !important;
              align-items: stretch !important;
            }

            .progress-filter > div:last-child {
              width: 100% !important;
            }

            .progress-mini-grid {
              grid-template-columns: 1fr !important;
            }

            .progress-heading {
              flex-direction: column !important;
            }
          }
        `}</style>
      </DashboardShell>
    </AuthGuard>
  );
}