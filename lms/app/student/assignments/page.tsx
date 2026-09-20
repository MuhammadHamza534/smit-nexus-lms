"use client";

import { useMemo, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import DashboardShell from "@/components/DashboardShell";
import { initialCourses } from "@/lib/data";
import type { Assignment } from "@/lib/data";
import { useLms } from "@/components/LmsProvider";

export default function StudentAssignmentsPage() {
  const {
    students,
    assignments,
    ready,
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

  const [selectedAssignmentId, setSelectedAssignmentId] =
    useState<number | null>(null);

  const courseAssignments = useMemo(() => {
    return assignments.filter(
      (assignment) =>
        assignment.courseId === selectedCourse &&
        assignment.submissions.some(
          (submission) =>
            submission.studentId === studentId
        )
    );
  }, [assignments, selectedCourse]);

  const selectedAssignment =
    courseAssignments.find(
      (assignment) =>
        assignment.id === selectedAssignmentId
    ) || null;

  const getSubmission = (
    assignment: Assignment
  ) => {
    return assignment.submissions.find(
      (submission) =>
        submission.studentId === studentId
    );
  };

  const submittedCount = courseAssignments.filter(
    (assignment) =>
      getSubmission(assignment)?.submitted
  ).length;

  const pendingCount =
    courseAssignments.length -
    submittedCount;

  const reviewedCount = courseAssignments.filter(
    (assignment) =>
      getSubmission(assignment)?.checked
  ).length;

  if (!ready) {
    return (
      <AuthGuard role="student">
        <DashboardShell
          role="student"
          title="Assignments"
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
              Loading Assignments...
            </h3>

            <p>
              Please wait while your assignment
              data is loading.
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
        title="Assignments"
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

            <h1>Assignments</h1>

            <p>
              View your assignments, submission
              status and trainer feedback.
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
            {/* Total */}
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
                  Total Assignments
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "25px",
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  {courseAssignments.length}
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  Current course
                </div>
              </div>
            </div>

            {/* Submitted */}
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
                  Submitted
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "25px",
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  {submittedCount}
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  Completed submissions
                </div>
              </div>
            </div>

            {/* Pending */}
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
                  Pending
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "25px",
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  {pendingCount}
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  Not submitted
                </div>
              </div>
            </div>

            {/* Reviewed */}
            <div className="stat-card">
              <div
                className="stat-icon"
                style={{
                  color: "#38a7ff",
                  background:
                    "rgba(56,167,255,0.11)",
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
                  Reviewed
                </div>

                <div
                  style={{
                    color: "#f8fafc",
                    fontSize: "25px",
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  {reviewedCount}
                </div>

                <div
                  style={{
                    color: "#6f96bc",
                    fontSize: "11px",
                    marginTop: "7px",
                  }}
                >
                  Checked by trainer
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
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                gap: "20px",
              }}
              className="assignment-filter"
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
                  Select a course to view
                  assignments
                </div>
              </div>

              <div
                style={{
                  width: "260px",
                }}
              >
                <select
                  value={selectedCourse}
                  onChange={(event) => {
                    setSelectedCourse(
                      event.target.value
                    );
                    setSelectedAssignmentId(
                      null
                    );
                  }}
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
              ASSIGNMENTS TABLE
          ========================================= */}

          <div
            className="table-wrapper"
            style={{
              marginBottom: "20px",
            }}
          >
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
                ▤
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
                  Assignment List
                </h2>

                <p
                  style={{
                    margin:
                      "5px 0 0",
                    color: "#7189a3",
                    fontSize: "11px",
                  }}
                >
                  Click an assignment to view
                  its details.
                </p>
              </div>
            </div>

            {courseAssignments.length > 0 ? (
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
                        Assignment
                      </th>

                      <th>
                        Due Date
                      </th>

                      <th>
                        Submission
                      </th>

                      <th>
                        Review
                      </th>

                      <th>
                        Marks
                      </th>

                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {courseAssignments.map(
                      (
                        assignment,
                        index
                      ) => {
                        const submission =
                          getSubmission(
                            assignment
                          );

                        const submitted =
                          submission?.submitted;

                        const reviewed =
                          submission?.checked;

                        return (
                          <tr
                            key={
                              assignment.id
                            }
                          >
                            <td
                              style={{
                                color:
                                  "#7189a3",
                                width: "60px",
                              }}
                            >
                              {index + 1}
                            </td>

                            <td
                              style={{
                                minWidth:
                                  "280px",
                              }}
                            >
                              <div
                                style={{
                                  color:
                                    "#dbeafe",
                                  fontSize:
                                    "14px",
                                  fontWeight:
                                    600,
                                }}
                              >
                                {
                                  assignment.title
                                }
                              </div>

                              <div
                                style={{
                                  color:
                                    "#607995",
                                  fontSize:
                                    "11px",
                                  marginTop:
                                    "5px",
                                }}
                              >
                                {assignment.description}
                              </div>
                            </td>

                            <td
                              style={{
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {
                                assignment.dueDate
                              }
                            </td>

                            <td>
                              {submitted ? (
                                <span className="attendance-present">
                                  <span>
                                    ●
                                  </span>
                                  Submitted
                                </span>
                              ) : (
                                <span className="attendance-absent">
                                  <span>
                                    ●
                                  </span>
                                  Pending
                                </span>
                              )}
                            </td>

                            <td>
                              {reviewed ? (
                                <span className="status-pill status-active">
                                  Reviewed
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
                                  Pending
                                </span>
                              )}
                            </td>

                            <td>
                              {submission
                                ?.marks !==
                              null &&
                              submission
                                ?.marks !==
                                undefined ? (
                                <span
                                  style={{
                                    color:
                                      "#dbeafe",
                                    fontWeight:
                                      700,
                                  }}
                                >
                                  {
                                    submission.marks
                                  }
                                </span>
                              ) : (
                                <span
                                  style={{
                                    color:
                                      "#607995",
                                  }}
                                >
                                  —
                                </span>
                              )}
                            </td>

                            <td>
                              <button
                                type="button"
                                className="secondary-button"
                                onClick={() =>
                                  setSelectedAssignmentId(
                                    assignment.id
                                  )
                                }
                                style={{
                                  padding:
                                    "8px 12px",
                                  fontSize:
                                    "11px",
                                }}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  ▤
                </div>

                <h3>
                  No Assignments Found
                </h3>

                <p>
                  There are no assignments for
                  this course.
                </p>
              </div>
            )}
          </div>

          {/* =========================================
              ASSIGNMENT DETAILS
          ========================================= */}

          {selectedAssignment && (
            <div
              className="lms-card"
              style={{
                padding: "26px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems:
                    "flex-start",
                  justifyContent:
                    "space-between",
                  gap: "20px",
                  paddingBottom: "20px",
                  borderBottom:
                    "1px solid rgba(100,160,220,0.12)",
                  marginBottom: "20px",
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
                      marginBottom: "7px",
                    }}
                  >
                    Assignment Details
                  </div>

                  <h2
                    style={{
                      margin: 0,
                      color: "#f8fafc",
                      fontSize: "22px",
                      fontWeight: 700,
                    }}
                  >
                    {
                      selectedAssignment.title
                    }
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
                    {
                      selectedAssignment.description
                    }
                  </p>
                </div>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setSelectedAssignmentId(
                      null
                    )
                  }
                >
                  Close
                </button>
              </div>

              {(() => {
                const submission =
                  getSubmission(
                    selectedAssignment
                  );

                return (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(3, minmax(0, 1fr))",
                      gap: "14px",
                    }}
                    className="assignment-detail-grid"
                  >
                    <div className="info-box">
                      <div className="info-box-label">
                        Due Date
                      </div>

                      <div className="info-box-value">
                        {
                          selectedAssignment.dueDate
                        }
                      </div>
                    </div>

                    <div className="info-box">
                      <div className="info-box-label">
                        Submission
                      </div>

                      <div
                        className="info-box-value"
                      >
                        {submission?.submitted
                          ? "Submitted"
                          : "Not Submitted"}
                      </div>
                    </div>

                    <div className="info-box">
                      <div className="info-box-label">
                        Submission Date
                      </div>

                      <div className="info-box-value">
                        {submission
                          ?.submittedAt ||
                          "—"}
                      </div>
                    </div>

                    <div className="info-box">
                      <div className="info-box-label">
                        Review Status
                      </div>

                      <div className="info-box-value">
                        {submission
                          ?.reviewStatus ||
                          "Pending"}
                      </div>
                    </div>

                    <div className="info-box">
                      <div className="info-box-label">
                        Marks
                      </div>

                      <div className="info-box-value">
                        {submission?.marks !==
                          null &&
                        submission?.marks !==
                          undefined
                          ? `${submission.marks}/100`
                          : "Not graded"}
                      </div>
                    </div>

                    <div className="info-box">
                      <div className="info-box-label">
                        Checked
                      </div>

                      <div className="info-box-value">
                        {submission?.checked
                          ? "Yes"
                          : "Not yet"}
                      </div>
                    </div>

                    {/* Feedback */}
                    {submission?.feedback && (
                      <div
                        style={{
                          gridColumn:
                            "1 / -1",
                          padding: "17px",
                          borderRadius:
                            "10px",
                          background:
                            "rgba(56,167,255,0.05)",
                          border:
                            "1px solid rgba(56,167,255,0.12)",
                        }}
                      >
                        <div
                          style={{
                            color:
                              "#38a7ff",
                            fontSize:
                              "11px",
                            fontWeight:
                              700,
                            textTransform:
                              "uppercase",
                            letterSpacing:
                              "0.6px",
                            marginBottom:
                              "7px",
                          }}
                        >
                          Trainer Feedback
                        </div>

                        <div
                          style={{
                            color:
                              "#b7d0ea",
                            fontSize:
                              "13px",
                            lineHeight:
                              1.6,
                          }}
                        >
                          {
                            submission.feedback
                          }
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <style jsx>{`
          @media (max-width: 800px) {
            .assignment-filter {
              flex-direction: column !important;
              align-items: stretch !important;
            }

            .assignment-filter > div:last-child {
              width: 100% !important;
            }

            .assignment-detail-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </DashboardShell>
    </AuthGuard>
  );
}