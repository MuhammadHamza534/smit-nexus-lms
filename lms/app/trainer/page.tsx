"use client";

import Link from "next/link";

import AuthGuard from "@/components/AuthGuard";
import DashboardShell from "@/components/DashboardShell";
import { initialCourses } from "@/lib/data";
import { useLms } from "@/components/LmsProvider";

export default function TrainerDashboardPage() {
  const {
    students,
    trainers,
    assignments,
    topics,
    ready,
  } = useLms();

  /*
   * Trainer ID in data.ts is a number.
   */
  const trainerId = 1;

  const trainer =
    trainers.find(
      (item) => item.id === trainerId
    ) || trainers[0];

  /*
   * Get courses assigned to this trainer.
   */
  const trainerCourses =
    initialCourses.filter(
      (course) =>
        course.trainerId === trainerId
    );

  const trainerCourseIds =
    trainerCourses.map(
      (course) => course.id
    );

  /*
   * Get all students enrolled in at least
   * one of the trainer's courses.
   */
  const trainerStudents =
    students.filter((student) =>
      student.courseIds.some((courseId) =>
        trainerCourseIds.includes(courseId)
      )
    );

  /*
   * Get trainer's assignments.
   */
  const trainerAssignments =
    assignments.filter((assignment) =>
      trainerCourseIds.includes(
        assignment.courseId
      )
    );

  /*
   * Pending assignment reviews.
   */
  const pendingSubmissions =
    trainerAssignments.reduce(
      (total, assignment) =>
        total +
        assignment.submissions.filter(
          (submission) =>
            submission.submitted &&
            !submission.checked
        ).length,
      0
    );

  /*
   * Total submitted assignments.
   */
  const totalSubmissions =
    trainerAssignments.reduce(
      (total, assignment) =>
        total +
        assignment.submissions.filter(
          (submission) =>
            submission.submitted
        ).length,
      0
    );

  /*
   * Course progress.
   */
  const completedTopics =
    topics.filter(
      (topic) =>
        trainerCourseIds.includes(
          topic.courseId
        ) && topic.completed
    ).length;

  const totalTopics =
    topics.filter((topic) =>
      trainerCourseIds.includes(
        topic.courseId
      )
    ).length;

  const overallProgress =
    totalTopics > 0
      ? Math.round(
          (completedTopics /
            totalTopics) *
            100
        )
      : 0;

  /*
   * Student status counts.
   */
  const activeStudents =
    trainerStudents.filter(
      (student) =>
        student.status === "active"
    ).length;

  const dropoutStudents =
    trainerStudents.filter(
      (student) =>
        student.status === "dropout"
    ).length;

  if (!ready) {
    return (
      <AuthGuard role="trainer">
        <DashboardShell
          role="trainer"
          title="Trainer Dashboard"
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
              Loading Dashboard...
            </h3>

            <p>
              Please wait while your trainer
              data is loading.
            </p>
          </div>
        </DashboardShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard role="trainer">
      <DashboardShell
        role="trainer"
        title="Trainer Dashboard"
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
              Trainer Portal
            </div>

            <h1>
              Welcome,{" "}
              {trainer?.name || "Trainer"}
            </h1>

            <p>
              Manage your courses, students,
              attendance, assignments and
              learning progress.
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
            {/* COURSES */}

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
                  My Courses
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "25px",
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  {trainerCourses.length}
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  Assigned courses
                </div>
              </div>
            </div>

            {/* STUDENTS */}

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  color: "#38a7ff",
                  background:
                    "rgba(56,167,255,0.11)",
                }}
              >
                ♙
              </div>

              <div>
                <div
                  style={{
                    color: "#8da5c1",
                    fontSize: "12px",
                    marginBottom: "7px",
                  }}
                >
                  Students
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "25px",
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  {trainerStudents.length}
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  {activeStudents} active
                </div>
              </div>
            </div>

            {/* ASSIGNMENTS */}

            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  color: "#22c55e",
                  background:
                    "rgba(34,197,94,0.12)",
                }}
              >
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
                  {trainerAssignments.length}
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  {totalSubmissions} submissions
                </div>
              </div>
            </div>

            {/* PENDING REVIEWS */}

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
                  Pending Reviews
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "25px",
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  {pendingSubmissions}
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  Need attention
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              QUICK ACTIONS
          ========================================= */}

          <div
            className="lms-card"
            style={{
              padding: "24px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                marginBottom: "18px",
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
                  marginBottom: "6px",
                }}
              >
                Quick Actions
              </div>

              <h2
                style={{
                  margin: 0,
                  color: "#f8fafc",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                Trainer Tools
              </h2>
            </div>

            <div className="quick-actions-grid">
              <Link
                href="/trainer/courses"
                className="quick-action-card"
              >
                <span className="quick-action-icon">
                  ◫
                </span>

                <span>
                  <strong>
                    Courses
                  </strong>

                  <small>
                    Manage courses
                  </small>
                </span>
              </Link>

              <Link
                href="/trainer/attendance"
                className="quick-action-card"
              >
                <span className="quick-action-icon">
                  ✓
                </span>

                <span>
                  <strong>
                    Attendance
                  </strong>

                  <small>
                    Mark attendance
                  </small>
                </span>
              </Link>

              <Link
                href="/trainer/assignments"
                className="quick-action-card"
              >
                <span className="quick-action-icon">
                  ▤
                </span>

                <span>
                  <strong>
                    Assignments
                  </strong>

                  <small>
                    Review submissions
                  </small>
                </span>
              </Link>

              <Link
                href="/trainer/progress"
                className="quick-action-card"
              >
                <span className="quick-action-icon">
                  ◔
                </span>

                <span>
                  <strong>
                    Progress
                  </strong>

                  <small>
                    Track learning
                  </small>
                </span>
              </Link>
            </div>
          </div>

          {/* =========================================
              COURSES + PROGRESS
          ========================================= */}

          <div className="trainer-dashboard-grid">
            {/* COURSES */}

            <div className="table-wrapper">
              <div
                style={{
                  padding: "20px 22px",
                  borderBottom:
                    "1px solid rgba(100,160,220,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  gap: "12px",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      color: "#f8fafc",
                      fontSize: "18px",
                      fontWeight: 700,
                    }}
                  >
                    My Courses
                  </h2>

                  <p
                    style={{
                      margin:
                        "5px 0 0",
                      color: "#7189a3",
                      fontSize: "11px",
                    }}
                  >
                    Courses assigned to you.
                  </p>
                </div>

                <Link
                  href="/trainer/courses"
                  className="secondary-button"
                  style={{
                    padding:
                      "8px 12px",
                    fontSize: "11px",
                  }}
                >
                  View All
                </Link>
              </div>

              <div
                style={{
                  overflowX: "auto",
                }}
              >
                <table className="lms-table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Batch</th>
                      <th>Schedule</th>
                      <th>Students</th>
                    </tr>
                  </thead>

                  <tbody>
                    {trainerCourses.map(
                      (course) => {
                        const courseStudents =
                          trainerStudents.filter(
                            (student) =>
                              student.courseIds.includes(
                                course.id
                              )
                          );

                        return (
                          <tr
                            key={
                              course.id
                            }
                          >
                            <td>
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
                                  course.shortName
                                }
                              </div>

                              <div
                                style={{
                                  color:
                                    "#607995",
                                  fontSize:
                                    "10px",
                                  marginTop:
                                    "4px",
                                }}
                              >
                                {
                                  course.title
                                }
                              </div>
                            </td>

                            <td>
                              {
                                course.batch
                              }
                            </td>

                            <td
                              style={{
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {
                                course.schedule
                              }
                            </td>

                            <td>
                              <span className="status-pill status-active">
                                {
                                  courseStudents.length
                                }
                              </span>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {trainerCourses.length ===
                0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    ◫
                  </div>

                  <h3>
                    No Courses Found
                  </h3>

                  <p>
                    No courses are currently
                    assigned to this trainer.
                  </p>
                </div>
              )}
            </div>

            {/* OVERALL PROGRESS */}

            <div
              className="lms-card"
              style={{
                padding: "24px",
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
                  marginBottom: "7px",
                }}
              >
                Course Progress
              </div>

              <h2
                style={{
                  margin: 0,
                  color: "#f8fafc",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                Overall Learning Progress
              </h2>

              <p
                style={{
                  color: "#7189a3",
                  fontSize: "11px",
                  lineHeight: 1.6,
                  margin:
                    "8px 0 24px",
                }}
              >
                Progress across all topics in
                your assigned courses.
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    background: `conic-gradient(#38a7ff ${overallProgress}%, rgba(56,167,255,0.08) ${overallProgress}% 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                  }}
                >
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      background:
                        "#09203f",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      flexDirection:
                        "column",
                    }}
                  >
                    <span
                      style={{
                        color:
                          "#f8fafc",
                        fontSize:
                          "28px",
                        lineHeight: 1,
                        fontWeight:
                          800,
                      }}
                    >
                      {overallProgress}%
                    </span>

                    <span
                      style={{
                        color:
                          "#7189a3",
                        fontSize:
                          "9px",
                        marginTop:
                          "6px",
                      }}
                    >
                      COMPLETE
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "10px",
                }}
              >
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
                    Total Topics
                  </div>

                  <div className="info-box-value">
                    {totalTopics}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              STUDENT OVERVIEW
          ========================================= */}

          <div className="table-wrapper">
            <div
              style={{
                padding: "20px 22px",
                borderBottom:
                  "1px solid rgba(100,160,220,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                gap: "12px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#f8fafc",
                    fontSize: "18px",
                    fontWeight: 700,
                  }}
                >
                  Student Overview
                </h2>

                <p
                  style={{
                    margin:
                      "5px 0 0",
                    color: "#7189a3",
                    fontSize: "11px",
                  }}
                >
                  Students enrolled in your
                  courses.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <span className="status-pill status-active">
                  {activeStudents} Active
                </span>

                {dropoutStudents > 0 && (
                  <span className="status-pill status-dropout">
                    {dropoutStudents} Dropout
                  </span>
                )}
              </div>
            </div>

            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table className="lms-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Courses</th>
                    <th>Attendance</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {trainerStudents
                    .slice(0, 8)
                    .map((student) => {
                      /*
                       * Student interface uses
                       * present and absent.
                       */
                      const present =
                        Number(
                          student.present
                        ) || 0;

                      const absent =
                        Number(
                          student.absent
                        ) || 0;

                      const total =
                        present + absent;

                      const attendance =
                        total > 0
                          ? Math.round(
                              (present /
                                total) *
                                100
                            )
                          : 0;

                      return (
                        <tr
                          key={
                            student.id
                          }
                        >
                          <td>
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
                                style={{
                                  width:
                                    "32px",
                                  height:
                                    "32px",
                                  borderRadius:
                                    "50%",
                                  background:
                                    "rgba(56,167,255,0.1)",
                                  border:
                                    "1px solid rgba(56,167,255,0.18)",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  color:
                                    "#38a7ff",
                                  fontSize:
                                    "11px",
                                  fontWeight:
                                    700,
                                }}
                              >
                                {student.name
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()}
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
                                    student.name
                                  }
                                </div>

                                <div
                                  style={{
                                    color:
                                      "#607995",
                                    fontSize:
                                      "10px",
                                    marginTop:
                                      "3px",
                                  }}
                                >
                                  {
                                    student.email
                                  }
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            {
                              student
                                .courseIds
                                .length
                            }
                          </td>

                          <td>
                            <div
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap: "9px",
                              }}
                            >
                              <div
                                className="progress-track"
                                style={{
                                  width:
                                    "80px",
                                  height:
                                    "6px",
                                }}
                              >
                                <div
                                  className={
                                    attendance >=
                                    75
                                      ? "progress-fill progress-fill-success"
                                      : "progress-fill"
                                  }
                                  style={{
                                    width: `${attendance}%`,
                                  }}
                                />
                              </div>

                              <span
                                style={{
                                  color:
                                    "#a9c0d9",
                                  fontSize:
                                    "11px",
                                }}
                              >
                                {attendance}%
                              </span>
                            </div>
                          </td>

                          <td>
                            <span
                              className={`status-pill ${
                                student.status ===
                                "active"
                                  ? "status-active"
                                  : student.status ===
                                    "dropout"
                                  ? "status-dropout"
                                  : "status-eliminated"
                              }`}
                            >
                              {
                                student.status
                              }
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {trainerStudents.length ===
              0 && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  ♙
                </div>

                <h3>
                  No Students Found
                </h3>

                <p>
                  No students are currently
                  enrolled in your courses.
                </p>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .quick-actions-grid {
            display: grid;
            grid-template-columns: repeat(
              4,
              minmax(0, 1fr)
            );
            gap: 12px;
          }

          .quick-action-card {
            min-height: 76px;
            padding: 14px;
            border-radius: 10px;
            border: 1px solid
              rgba(100, 160, 220, 0.13);
            background: rgba(
              7,
              26,
              50,
              0.65
            );
            display: flex;
            align-items: center;
            gap: 12px;
            color: #dbeafe;
            text-decoration: none;
            transition:
              border-color 0.2s ease,
              background 0.2s ease,
              transform 0.2s ease;
          }

          .quick-action-card:hover {
            border-color: rgba(
              56,
              167,
              255,
              0.35
            );
            background: rgba(
              56,
              167,
              255,
              0.06
            );
            transform: translateY(-1px);
          }

          .quick-action-icon {
            width: 38px;
            height: 38px;
            flex-shrink: 0;
            border-radius: 9px;
            background: rgba(
              56,
              167,
              255,
              0.1
            );
            color: #38a7ff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          }

          .quick-action-card span:last-child {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .quick-action-card strong {
            color: #e5effb;
            font-size: 12px;
            font-weight: 700;
          }

          .quick-action-card small {
            color: #667f9b;
            font-size: 9px;
          }

          .trainer-dashboard-grid {
            display: grid;
            grid-template-columns: 1.4fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }

          @media (max-width: 1050px) {
            .quick-actions-grid {
              grid-template-columns: repeat(
                2,
                minmax(0, 1fr)
              );
            }

            .trainer-dashboard-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 650px) {
            .quick-actions-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </DashboardShell>
    </AuthGuard>
  );
}