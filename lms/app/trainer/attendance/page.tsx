"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import AuthGuard from "@/components/AuthGuard";
import DashboardShell from "@/components/DashboardShell";
import { useLms } from "@/components/LmsProvider";
import { initialCourses } from "@/lib/data";

export default function TrainerAttendancePage() {
  const searchParams = useSearchParams();

  const {
    students,
    dailyAttendance,
    ready,
    updateAttendance,
    getAttendancePercentage,
  } = useLms();

  const trainerId = 1;

  const trainerCourses = useMemo(() => {
    return initialCourses.filter(
      (course) => course.trainerId === trainerId
    );
  }, []);

  const queryCourseId = searchParams.get("course");

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<number | null>(
    null
  );
  const [selectedMonth, setSelectedMonth] = useState("all");

  useEffect(() => {
    if (trainerCourses.length === 0) return;

    const queryCourseExists = trainerCourses.some(
      (course) => course.id === queryCourseId
    );

    if (queryCourseExists && queryCourseId) {
      setSelectedCourseId(queryCourseId);
      return;
    }

    if (!selectedCourseId) {
      setSelectedCourseId(trainerCourses[0].id);
    }
  }, [queryCourseId, selectedCourseId, trainerCourses]);

  const courseAttendance = useMemo(() => {
    return dailyAttendance
      .filter((item) => item.courseId === selectedCourseId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [dailyAttendance, selectedCourseId]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();

    courseAttendance.forEach((item) => {
      months.add(item.date.slice(0, 7));
    });

    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [courseAttendance]);

  const filteredAttendance = useMemo(() => {
    if (selectedMonth === "all") {
      return courseAttendance;
    }

    return courseAttendance.filter((item) =>
      item.date.startsWith(selectedMonth)
    );
  }, [courseAttendance, selectedMonth]);

  useEffect(() => {
    if (filteredAttendance.length === 0) {
      setSelectedAttendanceId(null);
      return;
    }

    const selectedStillExists = filteredAttendance.some(
      (item) => item.id === selectedAttendanceId
    );

    if (!selectedStillExists) {
      setSelectedAttendanceId(filteredAttendance[0].id);
    }
  }, [filteredAttendance, selectedAttendanceId]);

  const selectedAttendance = useMemo(() => {
    return (
      filteredAttendance.find(
        (item) => item.id === selectedAttendanceId
      ) ?? null
    );
  }, [filteredAttendance, selectedAttendanceId]);

  const selectedCourse = trainerCourses.find(
    (course) => course.id === selectedCourseId
  );

  const courseStudents = useMemo(() => {
    if (!selectedCourseId) return [];

    return students
      .filter(
        (student) =>
          student.courseIds.includes(selectedCourseId) &&
          student.status === "active"
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, selectedCourseId]);

  const getStudentStatus = (studentId: number) => {
    const record = selectedAttendance?.records.find(
      (record) => record.studentId === studentId
    );

    return record?.status ?? "Absent";
  };

  const presentCount = selectedAttendance
    ? selectedAttendance.records.filter(
        (record) => record.status === "Present"
      ).length
    : 0;

  const absentCount = selectedAttendance
    ? selectedAttendance.records.filter(
        (record) => record.status === "Absent"
      ).length
    : 0;

  const totalMarked = presentCount + absentCount;

  const attendancePercentage =
    totalMarked > 0
      ? Math.round((presentCount / totalMarked) * 100)
      : 0;

  const setStudentAttendance = (
    studentId: number,
    status: "Present" | "Absent"
  ) => {
    if (!selectedAttendance) return;

    updateAttendance(selectedAttendance.id, studentId, status);
  };

  const markAllPresent = () => {
    if (!selectedAttendance) return;

    courseStudents.forEach((student) => {
      updateAttendance(selectedAttendance.id, student.id, "Present");
    });
  };

  const markAllAbsent = () => {
    if (!selectedAttendance) return;

    courseStudents.forEach((student) => {
      updateAttendance(selectedAttendance.id, student.id, "Absent");
    });
  };

  const formatDate = (date: string) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-PK", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatMonth = (month: string) => {
    const [year, monthNumber] = month.split("-");

    return new Date(
      Number(year),
      Number(monthNumber) - 1,
      1
    ).toLocaleDateString("en-PK", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <AuthGuard role="trainer">
      <DashboardShell role="trainer" title="Attendance">
        <main className="dashboard-content">
          {/* PAGE HEADER */}
          <div
            className="page-heading"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1>Attendance Management</h1>
              <p>
                Mark and manage attendance for your enrolled students.
              </p>
            </div>

            {selectedCourse && (
              <div
                className="info-box"
                style={{
                  minWidth: 220,
                  marginTop: 4,
                }}
              >
                <div className="info-box-label">Current Course</div>
                <div className="info-box-value">
                  {selectedCourse.shortName}
                </div>
              </div>
            )}
          </div>

          {/* COURSE + MONTH FILTERS */}
          <section className="lms-card" style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(220px, 1.5fr) minmax(180px, 1fr)",
                gap: 16,
              }}
            >
              <div>
                <label
                  htmlFor="course"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 700,
                  }}
                >
                  Select Course
                </label>

                <select
                  id="course"
                  className="lms-select"
                  value={selectedCourseId}
                  onChange={(event) => {
                    setSelectedCourseId(event.target.value);
                    setSelectedAttendanceId(null);
                  }}
                >
                  {trainerCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} — {course.batch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="month"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 700,
                  }}
                >
                  Filter by Month
                </label>

                <select
                  id="month"
                  className="lms-select"
                  value={selectedMonth}
                  onChange={(event) => {
                    setSelectedMonth(event.target.value);
                    setSelectedAttendanceId(null);
                  }}
                >
                  <option value="all">All Months</option>

                  {availableMonths.map((month) => (
                    <option key={month} value={month}>
                      {formatMonth(month)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* LOADING */}
          {!ready && (
            <div className="empty-state">
              <div className="empty-state-icon">⏳</div>
              <h3>Loading attendance...</h3>
              <p>Please wait while the attendance data is loaded.</p>
            </div>
          )}

          {ready && (
            <>
              {/* STAT CARDS */}
              <section
                className="stats-grid"
                style={{
                  marginBottom: 20,
                }}
              >
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div>
                    <div className="info-box-label">Enrolled Students</div>
                    <div className="info-box-value">
                      {courseStudents.length}
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div>
                    <div className="info-box-label">Attendance Days</div>
                    <div className="info-box-value">
                      {filteredAttendance.length}
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">✓</div>
                  <div>
                    <div className="info-box-label">Present Today</div>
                    <div className="info-box-value">
                      {presentCount}
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">%</div>
                  <div>
                    <div className="info-box-label">Selected Day</div>
                    <div className="info-box-value">
                      {attendancePercentage}%
                    </div>
                  </div>
                </div>
              </section>

              {/* ATTENDANCE DAYS */}
              <section className="lms-card" style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0 }}>Attendance Sessions</h2>
                    <p
                      style={{
                        margin: "5px 0 0",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Select a session to manage student attendance.
                    </p>
                  </div>

                  <span className="status-pill status-active">
                    {filteredAttendance.length} Sessions
                  </span>
                </div>

                {filteredAttendance.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📅</div>
                    <h3>No attendance records</h3>
                    <p>
                      There are no attendance sessions for this course
                      and month.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      overflowX: "auto",
                      paddingBottom: 4,
                    }}
                  >
                    {filteredAttendance.map((attendance) => {
                      const sessionPresent = attendance.records.filter(
                        (record) => record.status === "Present"
                      ).length;

                      const sessionTotal = attendance.records.length;

                      const sessionPercentage =
                        sessionTotal > 0
                          ? Math.round(
                              (sessionPresent / sessionTotal) * 100
                            )
                          : 0;

                      const isSelected =
                        attendance.id === selectedAttendanceId;

                      return (
                        <button
                          key={attendance.id}
                          type="button"
                          onClick={() =>
                            setSelectedAttendanceId(attendance.id)
                          }
                          style={{
                            minWidth: 210,
                            textAlign: "left",
                            padding: 16,
                            borderRadius: 14,
                            border: isSelected
                              ? "1px solid var(--primary)"
                              : "1px solid rgba(148,163,184,0.16)",
                            background: isSelected
                              ? "rgba(56,167,255,0.10)"
                              : "var(--card-secondary)",
                            color: "inherit",
                            cursor: "pointer",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 10,
                              marginBottom: 10,
                            }}
                          >
                            <strong>
                              {formatDate(attendance.date)}
                            </strong>

                            <span
                              style={{
                                color:
                                  sessionPercentage >= 75
                                    ? "var(--success)"
                                    : sessionPercentage >= 50
                                    ? "var(--warning)"
                                    : "var(--danger)",
                                fontWeight: 800,
                              }}
                            >
                              {sessionPercentage}%
                            </span>
                          </div>

                          <div
                            style={{
                              color: "var(--text-secondary)",
                              fontSize: 13,
                            }}
                          >
                            {attendance.topic}
                          </div>

                          <div
                            style={{
                              marginTop: 10,
                              fontSize: 12,
                              color: "var(--muted)",
                            }}
                          >
                            {sessionPresent} present / {sessionTotal} marked
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* SELECTED ATTENDANCE */}
              {selectedAttendance && selectedCourse && (
                <section className="lms-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 20,
                      marginBottom: 20,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h2 style={{ margin: 0 }}>
                        {selectedCourse.title}
                      </h2>

                      <p
                        style={{
                          margin: "7px 0 0",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {formatDate(selectedAttendance.date)} •{" "}
                        {selectedAttendance.topic}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        className="primary-button"
                        onClick={markAllPresent}
                      >
                        ✓ Mark All Present
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={markAllAbsent}
                      >
                        Mark All Absent
                      </button>
                    </div>
                  </div>

                  {/* SUMMARY */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(3, minmax(0, 1fr))",
                      gap: 12,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      className="info-box"
                      style={{
                        borderLeft: "3px solid var(--success)",
                      }}
                    >
                      <div className="info-box-label">Present</div>
                      <div
                        className="info-box-value"
                        style={{ color: "var(--success)" }}
                      >
                        {presentCount}
                      </div>
                    </div>

                    <div
                      className="info-box"
                      style={{
                        borderLeft: "3px solid var(--danger)",
                      }}
                    >
                      <div className="info-box-label">Absent</div>
                      <div
                        className="info-box-value"
                        style={{ color: "var(--danger)" }}
                      >
                        {absentCount}
                      </div>
                    </div>

                    <div
                      className="info-box"
                      style={{
                        borderLeft: "3px solid var(--primary)",
                      }}
                    >
                      <div className="info-box-label">
                        Attendance Rate
                      </div>
                      <div
                        className="info-box-value"
                        style={{ color: "var(--primary)" }}
                      >
                        {attendancePercentage}%
                      </div>
                    </div>
                  </div>

                  {/* STUDENT TABLE */}
                  {courseStudents.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">👥</div>
                      <h3>No students enrolled</h3>
                      <p>
                        No active students are currently enrolled in this
                        course.
                      </p>
                    </div>
                  ) : (
                    <div className="table-wrapper">
                      <table className="lms-table">
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Roll No</th>
                            <th>Overall Attendance</th>
                            <th>Today</th>
                            <th style={{ textAlign: "right" }}>
                              Action
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {courseStudents.map((student) => {
                            const status = getStudentStatus(student.id);

                            const overallPercentage =
                              getAttendancePercentage(student.id);

                            return (
                              <tr key={student.id}>
                                <td>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 12,
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: "50%",
                                        display: "grid",
                                        placeItems: "center",
                                        background:
                                          "rgba(56,167,255,0.12)",
                                        color: "var(--primary)",
                                        fontWeight: 800,
                                        flexShrink: 0,
                                      }}
                                    >
                                      {student.name
                                        .split(" ")
                                        .map((word) => word[0])
                                        .slice(0, 2)
                                        .join("")
                                        .toUpperCase()}
                                    </div>

                                    <div>
                                      <strong>{student.name}</strong>
                                      <div
                                        style={{
                                          fontSize: 12,
                                          color: "var(--muted)",
                                          marginTop: 2,
                                        }}
                                      >
                                        {student.email}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td>{student.rollNo}</td>

                                <td>
                                  <div
                                    style={{
                                      minWidth: 130,
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent:
                                          "space-between",
                                        marginBottom: 6,
                                        fontSize: 12,
                                      }}
                                    >
                                      <span>
                                        {student.present}P /{" "}
                                        {student.absent}A
                                      </span>

                                      <strong>
                                        {overallPercentage}%
                                      </strong>
                                    </div>

                                    <div className="progress-track">
                                      <div
                                        className={
                                          overallPercentage >= 75
                                            ? "progress-fill progress-fill-success"
                                            : "progress-fill"
                                        }
                                        style={{
                                          width: `${Math.min(
                                            overallPercentage,
                                            100
                                          )}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                </td>

                                <td>
                                  <span
                                    className={`status-pill ${
                                      status === "Present"
                                        ? "status-active"
                                        : "status-eliminated"
                                    }`}
                                  >
                                    {status}
                                  </span>
                                </td>

                                <td>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      gap: 8,
                                    }}
                                  >
                                    <button
                                      type="button"
                                      className={
                                        status === "Present"
                                          ? "primary-button"
                                          : "secondary-button"
                                      }
                                      onClick={() =>
                                        setStudentAttendance(
                                          student.id,
                                          "Present"
                                        )
                                      }
                                      style={{
                                        padding: "8px 12px",
                                        fontSize: 12,
                                      }}
                                    >
                                      Present
                                    </button>

                                    <button
                                      type="button"
                                      className={
                                        status === "Absent"
                                          ? "secondary-button"
                                          : "primary-button"
                                      }
                                      onClick={() =>
                                        setStudentAttendance(
                                          student.id,
                                          "Absent"
                                        )
                                      }
                                      style={{
                                        padding: "8px 12px",
                                        fontSize: 12,
                                      }}
                                    >
                                      Absent
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )}

              {/* NO SELECTED SESSION */}
              {!selectedAttendance &&
                filteredAttendance.length === 0 && (
                  <section className="lms-card">
                    <div className="empty-state">
                      <div className="empty-state-icon">📋</div>
                      <h3>No attendance session selected</h3>
                      <p>
                        Select a course with attendance records to manage
                        student attendance.
                      </p>
                    </div>
                  </section>
                )}
            </>
          )}
        </main>
      </DashboardShell>
    </AuthGuard>
  );
}