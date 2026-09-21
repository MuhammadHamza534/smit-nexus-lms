"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import AuthGuard from "@/components/AuthGuard";
import DashboardShell from "@/components/DashboardShell";
import { useLms } from "@/components/LmsProvider";
import { initialCourses } from "@/lib/data";

export default function TrainerCourseDetailPage() {
  const params = useParams();

  const {
    students,
    topics,
    ready,
    getAttendancePercentage,
  } = useLms();

  const courseId = String(params.courseId);

  const course = useMemo(() => {
    return initialCourses.find(
      (item) => String(item.id) === courseId
    );
  }, [courseId]);

  const courseStudents = useMemo(() => {
    if (!course) return [];

    return students.filter((student) =>
      student.courseIds.includes(course.id)
    );
  }, [course, students]);

  const courseTopics = useMemo(() => {
    if (!course) return [];

    return topics.filter(
      (topic) => topic.courseId === course.id
    );
  }, [course, topics]);

  const completedTopics = courseTopics.filter(
    (topic) => topic.completed
  ).length;

  const totalTopics = courseTopics.length;

  const courseProgress =
    totalTopics > 0
      ? Math.round(
          (completedTopics / totalTopics) * 100
        )
      : 0;

  const averageAttendance =
    courseStudents.length > 0
      ? Math.round(
          courseStudents.reduce(
            (total, student) =>
              total +
              getAttendancePercentage(
                student
              ),
            0
          ) / courseStudents.length
        )
      : 0;

  if (!ready) {
    return (
      <AuthGuard role="trainer">
        <DashboardShell
          role="trainer"
          title="Course Details"
        >
          <main className="dashboard-content">
            <div className="empty-state">
              <div className="empty-state-icon">
                ⏳
              </div>

              <h3>Loading course...</h3>

              <p>
                Please wait while course data is loading.
              </p>
            </div>
          </main>
        </DashboardShell>
      </AuthGuard>
    );
  }

  if (!course) {
    return (
      <AuthGuard role="trainer">
        <DashboardShell
          role="trainer"
          title="Course Not Found"
        >
          <main className="dashboard-content">
            <div className="page-heading">
              <div>
                <span className="page-kicker">
                  TRAINER PORTAL
                </span>

                <h1>Course Not Found</h1>

                <p>
                  The requested course does not exist.
                </p>
              </div>
            </div>

            <div className="lms-card empty-state">
              <div className="empty-state-icon">
                📚
              </div>

              <h3>No course found</h3>

              <p>
                Course ID{" "}
                <strong>{courseId}</strong> was not
                found.
              </p>

              <Link
                href="/trainer/courses"
                className="primary-button"
              >
                ← Back to Courses
              </Link>
            </div>
          </main>
        </DashboardShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard role="trainer">
      <DashboardShell
        role="trainer"
        title={course.title}
      >
        <main className="dashboard-content">

          {/* PAGE HEADER */}

          <div className="page-heading course-detail-heading">
            <div>
              <span className="page-kicker">
                TRAINER PORTAL / COURSES
              </span>

              <h1>{course.title}</h1>

              <p>
                Manage course information, students,
                attendance and learning progress.
              </p>
            </div>

            <Link
              href="/trainer/courses"
              className="secondary-button"
            >
              ← All Courses
            </Link>
          </div>

          {/* COURSE HERO */}

          <section className="lms-card course-hero">
            <div className="course-hero-left">

              <div className="course-code">
                {course.shortName}
              </div>

              <div>
                <h2>{course.title}</h2>

                <p>
                  {course.description}
                </p>
              </div>
            </div>

            <div className="course-hero-progress">

              <div className="course-progress-circle">
                <span>
                  {courseProgress}%
                </span>
              </div>

              <div>
                <span className="info-box-label">
                  COURSE PROGRESS
                </span>

                <strong>
                  {completedTopics} / {totalTopics}{" "}
                  Topics
                </strong>
              </div>
            </div>
          </section>

          {/* STAT CARDS */}

          <section className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon blue">
                👥
              </div>

              <div>
                <span className="stat-label">
                  ENROLLED STUDENTS
                </span>

                <strong className="stat-value">
                  {courseStudents.length}
                </strong>

                <span className="stat-description">
                  Students in this course
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                ✓
              </div>

              <div>
                <span className="stat-label">
                  AVG. ATTENDANCE
                </span>

                <strong className="stat-value">
                  {averageAttendance}%
                </strong>

                <span className="stat-description">
                  Course attendance
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">
                📚
              </div>

              <div>
                <span className="stat-label">
                  TOTAL TOPICS
                </span>

                <strong className="stat-value">
                  {totalTopics}
                </strong>

                <span className="stat-description">
                  {completedTopics} completed
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                📅
              </div>

              <div>
                <span className="stat-label">
                  SCHEDULE
                </span>

                <strong className="stat-value stat-value-small">
                  {course.schedule}
                </strong>

                <span className="stat-description">
                  {course.room} · {course.campus}
                </span>
              </div>
            </div>

          </section>

          {/* COURSE INFORMATION + QUICK ACTIONS */}

          <section className="course-info-grid">

            <div className="lms-card">

              <div className="card-header">
                <div>
                  <span className="section-kicker">
                    COURSE INFORMATION
                  </span>

                  <h2>Course Details</h2>
                </div>
              </div>

              <div className="info-grid">

                <div className="info-box">
                  <span className="info-box-label">
                    COURSE CODE
                  </span>

                  <strong className="info-box-value">
                    {course.shortName}
                  </strong>
                </div>

                <div className="info-box">
                  <span className="info-box-label">
                    BATCH
                  </span>

                  <strong className="info-box-value">
                    {course.batch}
                  </strong>
                </div>

                <div className="info-box">
                  <span className="info-box-label">
                    SCHEDULE
                  </span>

                  <strong className="info-box-value">
                    {course.schedule}
                  </strong>
                </div>

                <div className="info-box">
                  <span className="info-box-label">
                    ROOM
                  </span>

                  <strong className="info-box-value">
                    {course.room}
                  </strong>
                </div>

                <div className="info-box">
                  <span className="info-box-label">
                    CAMPUS
                  </span>

                  <strong className="info-box-value">
                    {course.campus}
                  </strong>
                </div>

                <div className="info-box">
                  <span className="info-box-label">
                    CITY
                  </span>

                  <strong className="info-box-value">
                    {course.city}
                  </strong>
                </div>

              </div>
            </div>

            {/* QUICK ACTIONS */}

            <div className="lms-card">

              <div className="card-header">
                <div>
                  <span className="section-kicker">
                    QUICK ACTIONS
                  </span>

                  <h2>Manage Course</h2>
                </div>
              </div>

              <div className="action-list">

                <Link
                  href={`/trainer/attendance?course=${course.id}`}
                  className="action-item"
                >
                  <span className="action-icon">
                    ✓
                  </span>

                  <span>
                    <strong>
                      Manage Attendance
                    </strong>

                    <small>
                      Mark student attendance
                    </small>
                  </span>

                  <span className="action-arrow">
                    →
                  </span>
                </Link>

                <Link
                  href={`/trainer/assignments?course=${course.id}`}
                  className="action-item"
                >
                  <span className="action-icon">
                    📝
                  </span>

                  <span>
                    <strong>
                      Manage Assignments
                    </strong>

                    <small>
                      Create and review assignments
                    </small>
                  </span>

                  <span className="action-arrow">
                    →
                  </span>
                </Link>

                <Link
                  href={`/trainer/progress?course=${course.id}`}
                  className="action-item"
                >
                  <span className="action-icon">
                    📊
                  </span>

                  <span>
                    <strong>
                      Course Progress
                    </strong>

                    <small>
                      Track topic completion
                    </small>
                  </span>

                  <span className="action-arrow">
                    →
                  </span>
                </Link>

              </div>
            </div>

          </section>

          {/* STUDENTS */}

          <section className="lms-card">

            <div className="card-header">
              <div>
                <span className="section-kicker">
                  ENROLLMENT
                </span>

                <h2>Enrolled Students</h2>
              </div>

              <span className="status-pill status-active">
                {courseStudents.length} Students
              </span>
            </div>

            {courseStudents.length === 0 ? (
              <div className="empty-state compact">

                <div className="empty-state-icon">
                  👥
                </div>

                <h3>No students enrolled</h3>

                <p>
                  There are currently no students
                  enrolled in this course.
                </p>

              </div>
            ) : (
              <div className="table-wrapper">

                <table className="lms-table">

                  <thead>
                    <tr>
                      <th>STUDENT</th>
                      <th>ATTENDANCE</th>
                      <th>PRESENT</th>
                      <th>ABSENT</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>

                  <tbody>

                    {courseStudents.map(
                      (student) => {

                        const attendance =
                          getAttendancePercentage(
                            student
                          );

                        return (
                          <tr key={student.id}>

                            <td>
                              <div className="student-cell">

                                <div className="student-avatar">
                                  {student.name
                                    .split(" ")
                                    .map(
                                      (part) =>
                                        part[0]
                                    )
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()}
                                </div>

                                <div>
                                  <strong>
                                    {student.name}
                                  </strong>

                                  <span>
                                    {student.rollNo}
                                  </span>
                                </div>

                              </div>
                            </td>

                            <td>

                              <div className="table-progress">

                                <div className="progress-track">

                                  <div
                                    className="progress-fill"
                                    style={{
                                      width: `${attendance}%`,
                                    }}
                                  />

                                </div>

                                <span>
                                  {attendance}%
                                </span>

                              </div>

                            </td>

                            <td>
                              <span className="attendance-present">
                                {student.present}
                              </span>
                            </td>

                            <td>
                              <span className="attendance-absent">
                                {student.absent}
                              </span>
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
                                {student.status}
                              </span>
                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>
                </table>

              </div>
            )}

          </section>

          {/* TOPICS */}

          <section className="lms-card">

            <div className="card-header">

              <div>
                <span className="section-kicker">
                  CURRICULUM
                </span>

                <h2>Course Topics</h2>
              </div>

              <span className="status-pill status-active">
                {courseProgress}% Complete
              </span>

            </div>

            {courseTopics.length === 0 ? (
              <div className="empty-state compact">

                <div className="empty-state-icon">
                  📚
                </div>

                <h3>No topics available</h3>

                <p>
                  No curriculum topics have been
                  added to this course.
                </p>

              </div>
            ) : (
              <div className="topic-list">

                {courseTopics.map(
                  (topic, index) => (
                    <div
                      className="topic-row"
                      key={topic.id}
                    >

                      <div className="topic-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="topic-content">

                        <strong>
                          {topic.title}
                        </strong>

                        <div className="topic-progress">

                          <div className="progress-track">

                            <div
                              className={`progress-fill ${
                                topic.completed
                                  ? "progress-fill-success"
                                  : ""
                              }`}
                              style={{
                                width: topic.completed
                                  ? "100%"
                                  : "0%",
                              }}
                            />

                          </div>

                        </div>

                      </div>

                      <div className="topic-status">

                        {topic.completed ? (
                          <span className="status-pill status-active">
                            ✓ Completed
                          </span>
                        ) : (
                          <span className="status-pill status-dropout">
                            Pending
                          </span>
                        )}

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </section>

        </main>
      </DashboardShell>
    </AuthGuard>
  );
}

/* --------------------------------
   PAGE SPECIFIC CSS
--------------------------------- */

const pageStyles = `
.course-detail-heading {
  align-items: center;
}

.page-kicker,
.section-kicker {
  display: block;
  color: #38a7ff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  margin-bottom: 7px;
}

.course-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: 28px;
  margin-bottom: 22px;
}

.course-hero-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.course-code {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(
    135deg,
    #1265a8,
    #1d9bf0
  );
  color: #ffffff;
  font-weight: 900;
  font-size: 15px;
  letter-spacing: .5px;
  box-shadow:
    0 12px 30px
    rgba(56, 167, 255, .18);
}

.course-hero h2 {
  margin: 0 0 7px;
  font-size: 24px;
  color: #f8fafc;
}

.course-hero p {
  margin: 0;
  color: #9db5cf;
  line-height: 1.6;
}

.course-hero-progress {
  display: flex;
  align-items: center;
  gap: 15px;
  min-width: 190px;
}

.course-progress-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 5px solid
    rgba(56, 167, 255, .2);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #071a32;
}

.course-progress-circle span {
  color: #38a7ff;
  font-weight: 900;
  font-size: 16px;
}

.course-hero-progress strong {
  display: block;
  margin-top: 5px;
  color: #f8fafc;
  font-size: 14px;
}

.stat-value-small {
  font-size: 14px !important;
  line-height: 1.4;
}

.course-info-grid {
  display: grid;
  grid-template-columns:
    1.5fr 1fr;
  gap: 20px;
  margin: 22px 0;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 22px;
}

.card-header h2 {
  margin: 0;
  color: #f8fafc;
  font-size: 19px;
}

.info-grid {
  display: grid;
  grid-template-columns:
    repeat(2, 1fr);
  gap: 12px;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px;
  border: 1px solid #17304d;
  border-radius: 12px;
  text-decoration: none;
  background: #071a32;
  transition: .2s ease;
}

.action-item:hover {
  border-color: #247fc0;
  background: #0a2443;
  transform: translateY(-1px);
}

.action-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d3154;
  color: #38a7ff;
  flex-shrink: 0;
}

.action-item span:nth-child(2) {
  flex: 1;
}

.action-item strong {
  display: block;
  color: #f8fafc;
  font-size: 13px;
}

.action-item small {
  display: block;
  color: #7189a3;
  margin-top: 3px;
}

.action-arrow {
  color: #38a7ff;
  font-size: 18px;
}

.student-cell {
  display: flex;
  align-items: center;
  gap: 11px;
}

.student-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #0d3154;
  color: #8dd0ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.student-cell strong,
.student-cell span {
  display: block;
}

.student-cell strong {
  color: #f8fafc;
  font-size: 13px;
}

.student-cell span {
  color: #7189a3;
  font-size: 11px;
  margin-top: 3px;
}

.table-progress {
  min-width: 130px;
  display: flex;
  align-items: center;
  gap: 9px;
}

.table-progress .progress-track {
  flex: 1;
}

.table-progress > span {
  color: #9db5cf;
  font-size: 12px;
  min-width: 32px;
}

.topic-list {
  display: flex;
  flex-direction: column;
}

.topic-row {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 14px 0;
  border-bottom: 1px solid #132a43;
}

.topic-row:last-child {
  border-bottom: none;
}

.topic-number {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #071a32;
  border: 1px solid #17304d;
  color: #7189a3;
  font-size: 12px;
  font-weight: 800;
}

.topic-content {
  flex: 1;
  min-width: 0;
}

.topic-content strong {
  display: block;
  color: #f8fafc;
  font-size: 13px;
  margin-bottom: 9px;
}

.topic-progress {
  max-width: 400px;
}

.topic-status {
  min-width: 105px;
  text-align: right;
}

.empty-state.compact {
  padding: 30px 15px;
}

@media (max-width: 900px) {
  .course-info-grid {
    grid-template-columns: 1fr;
  }

  .course-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .course-hero-progress {
    width: 100%;
  }
}

@media (max-width: 650px) {
  .course-hero {
    padding: 20px;
  }

  .course-hero-left {
    align-items: flex-start;
    flex-direction: column;
  }

  .course-code {
    width: 58px;
    height: 58px;
    border-radius: 14px;
  }

  .course-hero h2 {
    font-size: 19px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .topic-row {
    align-items: flex-start;
  }

  .topic-status {
    min-width: auto;
  }
}
`;

if (typeof document !== "undefined") {
  const styleId =
    "trainer-course-detail-page-styles";

  if (!document.getElementById(styleId)) {
    const style =
      document.createElement("style");

    style.id = styleId;
    style.innerHTML = pageStyles;

    document.head.appendChild(style);
  }
}