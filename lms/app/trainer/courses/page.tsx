"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import AuthGuard from "@/components/AuthGuard";
import DashboardShell from "@/components/DashboardShell";
import { useLms } from "@/components/LmsProvider";
import { initialCourses } from "@/lib/data";

export default function TrainerCoursesPage() {
  const {
    students,
    trainers,
    assignments,
    getAttendancePercentage,
  } = useLms();

  // IMPORTANT: trainerId in lib/data.ts is a number
  const trainerId = 1;

  const trainer = trainers.find((item) => item.id === trainerId);

  const trainerCourses = useMemo(() => {
    return initialCourses.filter((course) => course.trainerId === trainerId);
  }, []);

  const [selectedCourseId, setSelectedCourseId] = useState(
    trainerCourses[0]?.id ?? "",
  );

  const activeCourse =
    trainerCourses.find((course) => course.id === selectedCourseId) ??
    trainerCourses[0];

  const courseStudents = useMemo(() => {
    if (!activeCourse) return [];

    return students.filter(
      (student) =>
        student.courseIds.includes(activeCourse.id) &&
        student.status === "active",
    );
  }, [students, activeCourse]);

  const courseAssignments = useMemo(() => {
    if (!activeCourse) return [];

    return assignments.filter(
      (assignment) => assignment.courseId === activeCourse.id,
    );
  }, [assignments, activeCourse]);

  const activeStudents = courseStudents.length;

  const averageAttendance =
    courseStudents.length > 0
      ? Math.round(
          courseStudents.reduce(
            (total, student) =>
              total + getAttendancePercentage(student),
            0,
          ) / courseStudents.length,
        )
      : 0;

  const assignmentCount = courseAssignments.length;

  if (!activeCourse) {
    return (
      <AuthGuard role="trainer">
        <DashboardShell role="trainer" title="Courses">
          <div className="dashboard-content">
            <div className="page-heading">
              <div>
                <h1>Courses</h1>
                <p>No courses are assigned to this trainer.</p>
              </div>
            </div>

            <div className="empty-state lms-card">
              <div className="empty-state-icon">📚</div>
              <h3>No Courses Found</h3>
              <p>
                There are currently no courses assigned to{" "}
                {trainer?.name ?? "this trainer"}.
              </p>
            </div>
          </div>
        </DashboardShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard role="trainer">
      <DashboardShell role="trainer" title="Courses">
        <div className="dashboard-content">
          {/* PAGE HEADER */}
          <div className="page-heading">
            <div>
              <h1>My Courses</h1>
              <p>
                Manage your assigned courses, students, attendance and
                assignments.
              </p>
            </div>

            <div className="info-box">
              <span className="info-box-label">Trainer</span>
              <span className="info-box-value">
                {trainer?.name ?? "Ahmed Khan"}
              </span>
            </div>
          </div>

          {/* COURSE CARDS */}
          <div className="stats-grid">
            {trainerCourses.map((course) => {
              const courseStudentCount = students.filter(
                (student) =>
                  student.courseIds.includes(course.id) &&
                  student.status === "active",
              ).length;

              const courseAssignmentCount = assignments.filter(
                (assignment) => assignment.courseId === course.id,
              ).length;

              const isActive = course.id === activeCourse.id;

              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`dashboard-card lms-card-hover text-left ${
                    isActive ? "course-card-active" : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    border:
                      isActive
                        ? "1px solid rgba(56, 167, 255, 0.7)"
                        : undefined,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#38a7ff",
                          fontWeight: 700,
                          marginBottom: "6px",
                        }}
                      >
                        {course.shortName}
                      </div>

                      <h3
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "#f8fafc",
                        }}
                      >
                        {course.title}
                      </h3>
                    </div>

                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(56, 167, 255, 0.12)",
                        color: "#38a7ff",
                        fontSize: "20px",
                        flexShrink: 0,
                      }}
                    >
                      📚
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "20px",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div className="info-box-label">Students</div>
                      <div className="info-box-value">
                        {courseStudentCount}
                      </div>
                    </div>

                    <div>
                      <div className="info-box-label">Assignments</div>
                      <div className="info-box-value">
                        {courseAssignmentCount}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "18px",
                      color: "#9db5cf",
                      fontSize: "13px",
                    }}
                  >
                    {course.schedule}
                  </div>
                </button>
              );
            })}
          </div>

          {/* SELECTED COURSE */}
          <div className="lms-card" style={{ marginTop: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#38a7ff",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "7px",
                  }}
                >
                  {activeCourse.shortName}
                </div>

                <h2
                  style={{
                    margin: 0,
                    color: "#f8fafc",
                    fontSize: "24px",
                    fontWeight: 750,
                  }}
                >
                  {activeCourse.title}
                </h2>

                <p
                  style={{
                    marginTop: "9px",
                    marginBottom: 0,
                    color: "#9db5cf",
                    maxWidth: "760px",
                    lineHeight: 1.7,
                  }}
                >
                  {activeCourse.description}
                </p>
              </div>

              <Link
                href={`/trainer/courses/${activeCourse.id}`}
                className="primary-button"
              >
                Open Course
              </Link>
            </div>

            {/* COURSE INFO */}
            <div
              style={{
                marginTop: "28px",
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: "14px",
              }}
            >
              <div className="info-box">
                <span className="info-box-label">Schedule</span>
                <span className="info-box-value">
                  {activeCourse.schedule}
                </span>
              </div>

              <div className="info-box">
                <span className="info-box-label">Lab / Room</span>
                <span className="info-box-value">
                  {activeCourse.room}
                </span>
              </div>

              <div className="info-box">
                <span className="info-box-label">Batch</span>
                <span className="info-box-value">
                  {activeCourse.batch}
                </span>
              </div>

              <div className="info-box">
                <span className="info-box-label">Location</span>
                <span className="info-box-value">
                  {activeCourse.campus}, {activeCourse.city}
                </span>
              </div>
            </div>
          </div>

          {/* COURSE STATS */}
          <div className="stats-grid" style={{ marginTop: "24px" }}>
            <div className="stat-card">
              <div className="stat-icon">👨‍🎓</div>

              <div>
                <div className="stat-label">Active Students</div>
                <div className="stat-value">{activeStudents}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✓</div>

              <div>
                <div className="stat-label">Average Attendance</div>
                <div className="stat-value">{averageAttendance}%</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📝</div>

              <div>
                <div className="stat-label">Assignments</div>
                <div className="stat-value">{assignmentCount}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📍</div>

              <div>
                <div className="stat-label">Campus</div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#f8fafc",
                    marginTop: "5px",
                  }}
                >
                  {activeCourse.campus}
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="lms-card" style={{ marginTop: "24px" }}>
            <div className="section-header">
              <div>
                <h2 className="section-title">Course Management</h2>
                <p className="section-subtitle">
                  Quickly access the main management areas for this course.
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "14px",
                marginTop: "20px",
              }}
            >
              <Link
                href={`/trainer/attendance?course=${activeCourse.id}`}
                className="secondary-button"
                style={{
                  minHeight: "76px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "22px" }}>✓</span>
                <span>
                  <strong
                    style={{
                      display: "block",
                      color: "#f8fafc",
                      marginBottom: "3px",
                    }}
                  >
                    Attendance
                  </strong>
                  <small style={{ color: "#9db5cf" }}>
                    Mark and review attendance
                  </small>
                </span>
              </Link>

              <Link
                href={`/trainer/assignments?course=${activeCourse.id}`}
                className="secondary-button"
                style={{
                  minHeight: "76px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "22px" }}>📝</span>
                <span>
                  <strong
                    style={{
                      display: "block",
                      color: "#f8fafc",
                      marginBottom: "3px",
                    }}
                  >
                    Assignments
                  </strong>
                  <small style={{ color: "#9db5cf" }}>
                    Review student submissions
                  </small>
                </span>
              </Link>

              <Link
                href={`/trainer/progress?course=${activeCourse.id}`}
                className="secondary-button"
                style={{
                  minHeight: "76px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "22px" }}>📈</span>
                <span>
                  <strong
                    style={{
                      display: "block",
                      color: "#f8fafc",
                      marginBottom: "3px",
                    }}
                  >
                    Progress
                  </strong>
                  <small style={{ color: "#9db5cf" }}>
                    Track topic completion
                  </small>
                </span>
              </Link>
            </div>
          </div>

          {/* ENROLLED STUDENTS */}
          <div className="lms-card" style={{ marginTop: "24px" }}>
            <div className="section-header">
              <div>
                <h2 className="section-title">Enrolled Students</h2>
                <p className="section-subtitle">
                  Students currently active in {activeCourse.shortName}.
                </p>
              </div>
            </div>

            <div className="table-wrapper" style={{ marginTop: "18px" }}>
              <table className="lms-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll No.</th>
                    <th>Attendance</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {courseStudents.map((student) => {
                    const attendance = getAttendancePercentage(student);

                    return (
                      <tr key={student.id}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                display: "grid",
                                placeItems: "center",
                                background: "rgba(56, 167, 255, 0.12)",
                                color: "#38a7ff",
                                fontWeight: 700,
                              }}
                            >
                              {student.name.charAt(0)}
                            </div>

                            <div>
                              <div
                                style={{
                                  color: "#f8fafc",
                                  fontWeight: 650,
                                }}
                              >
                                {student.name}
                              </div>

                              <div
                                style={{
                                  color: "#7189a3",
                                  fontSize: "12px",
                                  marginTop: "2px",
                                }}
                              >
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>{student.rollNo}</td>

                        <td>
                          <strong
                            style={{
                              color:
                                attendance >= 75
                                  ? "#22c55e"
                                  : attendance >= 50
                                    ? "#f59e0b"
                                    : "#ef4444",
                            }}
                          >
                            {attendance}%
                          </strong>
                        </td>

                        <td>{student.present}</td>

                        <td>{student.absent}</td>

                        <td>
                          <span className="status-pill status-active">
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {courseStudents.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">👨‍🎓</div>
                <h3>No Active Students</h3>
                <p>
                  There are no active students enrolled in this course.
                </p>
              </div>
            )}
          </div>
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}