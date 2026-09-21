"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import AuthGuard from "@/components/AuthGuard";
import DashboardShell from "@/components/DashboardShell";
import { useLms } from "@/components/LmsProvider";
import { initialCourses } from "@/lib/data";
import type { SubmissionStatus } from "@/lib/data";

export default function TrainerAssignmentsPage() {
  return (
    <AuthGuard role="trainer">
      <DashboardShell role="trainer" title="Assignments">
        <TrainerAssignmentsContent />
      </DashboardShell>
    </AuthGuard>
  );
}

function TrainerAssignmentsContent() {
  const searchParams = useSearchParams();
  const courseQuery = searchParams.get("course") || "";

  const {
    assignments,
    students,
    createAssignment,
    updateSubmissionReview,
    ready,
  } = useLms();

  const trainerId = 1;

  const trainerCourses = useMemo(
    () => initialCourses.filter((course) => course.trainerId === trainerId),
    [],
  );

  const [selectedCourseId, setSelectedCourseId] = useState(
    courseQuery || trainerCourses[0]?.id || "",
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    number | null
  >(null);

  const [reviewStudentId, setReviewStudentId] = useState<number | null>(null);

  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");

  const [reviewStatus, setReviewStatus] =
    useState<SubmissionStatus>("approved");

  const [message, setMessage] = useState("");

  const trainerAssignments = useMemo(() => {
    const courseIds = new Set(trainerCourses.map((course) => course.id));

    return assignments.filter((assignment) =>
      courseIds.has(assignment.courseId),
    );
  }, [assignments, trainerCourses]);

  const filteredAssignments = useMemo(() => {
    if (!selectedCourseId) return trainerAssignments;

    return trainerAssignments.filter(
      (assignment) => assignment.courseId === selectedCourseId,
    );
  }, [trainerAssignments, selectedCourseId]);

  const selectedAssignment = useMemo(
    () =>
      assignments.find(
        (assignment) => assignment.id === selectedAssignmentId,
      ) || null,
    [assignments, selectedAssignmentId],
  );

  const selectedCourse = useMemo(
    () =>
      trainerCourses.find(
        (course) => course.id === selectedAssignment?.courseId,
      ),
    [trainerCourses, selectedAssignment],
  );

  const reviewStudent = useMemo(
    () => students.find((student) => student.id === reviewStudentId) || null,
    [students, reviewStudentId],
  );

  const reviewSubmission = useMemo(() => {
    if (!selectedAssignment || !reviewStudentId) return null;

    return (
      selectedAssignment.submissions.find(
        (submission) => submission.studentId === reviewStudentId,
      ) || null
    );
  }, [selectedAssignment, reviewStudentId]);

  const courseStudents = useMemo(() => {
    if (!selectedAssignment) return [];

    return students.filter((student) =>
      student.courseIds.includes(selectedAssignment.courseId),
    );
  }, [students, selectedAssignment]);

  const handleCreateAssignment = (event: FormEvent) => {
    event.preventDefault();

    if (!selectedCourseId || !title.trim() || !dueDate) {
      setMessage("Please fill all required fields.");
      return;
    }

    createAssignment({
      courseId: selectedCourseId,
      title: title.trim(),
      description: description.trim(),
      dueDate,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
    setMessage("Assignment created successfully.");
  };

  const openSubmissionModal = (assignmentId: number) => {
    setSelectedAssignmentId(assignmentId);
    setReviewStudentId(null);
    setMarks("");
    setFeedback("");
  };

  const openReviewModal = (assignmentId: number, studentId: number) => {
    const assignment = assignments.find((item) => item.id === assignmentId);

    const submission = assignment?.submissions.find(
      (item) => item.studentId === studentId,
    );

    setSelectedAssignmentId(assignmentId);
    setReviewStudentId(studentId);
    setMarks(
      submission?.marks !== null && submission?.marks !== undefined
        ? String(submission.marks)
        : "",
    );
    setFeedback(submission?.feedback || "");
    setReviewStatus(
      submission?.reviewStatus === "rejected" ? "rejected" : "approved",
    );
  };

  const handleReview = () => {
    if (!selectedAssignmentId || !reviewStudentId) {
      return;
    }

    const numericMarks = marks.trim() === "" ? null : Number(marks);

    if (
      numericMarks !== null &&
      (Number.isNaN(numericMarks) || numericMarks < 0 || numericMarks > 100)
    ) {
      setMessage("Marks must be between 0 and 100.");
      return;
    }

    updateSubmissionReview(
      selectedAssignmentId,
      reviewStudentId,
      reviewStatus,
      numericMarks,
      feedback.trim(),
    );

    setMessage(
      reviewStatus === "approved"
        ? "Submission approved successfully."
        : "Submission rejected successfully.",
    );

    setReviewStudentId(null);
    setSelectedAssignmentId(null);
    setMarks("");
    setFeedback("");
  };

  if (!ready) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⏳</div>
        <h3>Loading assignments...</h3>
        <p>Please wait while LMS data is loaded.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="page-heading">
        <div>
          <h1>Assignments</h1>
          <p>Create assignments and review student submissions.</p>
        </div>
      </div>

      {message && (
        <div
          className="info-box"
          style={{
            marginBottom: 20,
            position: "relative",
          }}
        >
          <div className="info-box-label">System Message</div>

          <div className="info-box-value">{message}</div>

          <button
            className="secondary-button"
            onClick={() => setMessage("")}
            style={{
              position: "absolute",
              right: 16,
              top: 16,
            }}
          >
            Close
          </button>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>

          <div>
            <div className="stat-label">Total Assignments</div>

            <div className="stat-value">{trainerAssignments.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>

          <div>
            <div className="stat-label">Trainer Courses</div>

            <div className="stat-value">{trainerCourses.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>

          <div>
            <div className="stat-label">Students</div>

            <div className="stat-value">{students.length}</div>
          </div>
        </div>
      </div>

      <div className="lms-card" style={{ marginTop: 24 }}>
        <div className="lms-card-header">
          <div>
            <h2>Create Assignment</h2>
            <p>Create a new assignment for one of your courses.</p>
          </div>
        </div>

        <form
          onSubmit={handleCreateAssignment}
          style={{
            display: "grid",
            gap: 18,
            marginTop: 20,
          }}
        >
          <div className="form-grid">
            <div>
              <label className="form-label">Course</label>

              <select
                className="form-control lms-select"
                value={selectedCourseId}
                onChange={(event) => setSelectedCourseId(event.target.value)}
              >
                {trainerCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Due Date</label>

              <input
                className="form-control"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Assignment Title</label>

            <input
              className="form-control"
              type="text"
              placeholder="Enter assignment title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Description</label>

            <textarea
              className="form-control"
              rows={4}
              placeholder="Enter assignment instructions..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div>
            <button type="submit" className="primary-button">
              + Create Assignment
            </button>
          </div>
        </form>
      </div>

      <div className="lms-card" style={{ marginTop: 24 }}>
        <div className="lms-card-header">
          <div>
            <h2>Assignment List</h2>
            <p>Select an assignment to view its submissions.</p>
          </div>

          <div style={{ minWidth: 240 }}>
            <select
              className="form-control lms-select"
              value={selectedCourseId}
              onChange={(event) => setSelectedCourseId(event.target.value)}
            >
              <option value="">All Courses</option>

              {trainerCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.shortName} — {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredAssignments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>

            <h3>No assignments found</h3>

            <p>Create an assignment using the form above.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 14,
              marginTop: 20,
            }}
          >
            {filteredAssignments.map((assignment) => {
              const course = trainerCourses.find(
                (item) => item.id === assignment.courseId,
              );

              const submittedCount = assignment.submissions.filter(
                (submission) => submission.submitted,
              ).length;

              const checkedCount = assignment.submissions.filter(
                (submission) => submission.checked,
              ).length;

              return (
                <div
                  key={assignment.id}
                  className="dashboard-card"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => openSubmissionModal(assignment.id)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--text-muted)",
                          marginBottom: 6,
                        }}
                      >
                        {course?.shortName || "Course"}
                      </div>

                      <h3>{assignment.title}</h3>

                      <p
                        style={{
                          marginTop: 8,
                        }}
                      >
                        {assignment.description || "No description provided."}
                      </p>
                    </div>

                    <div
                      style={{
                        textAlign: "right",
                      }}
                    >
                      <div className="status-pill status-active">
                        Due {assignment.dueDate}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                      marginTop: 16,
                    }}
                  >
                    <span className="status-pill">
                      Submitted: {submittedCount}
                    </span>

                    <span className="status-pill">Checked: {checkedCount}</span>

                    <button
                      className="primary-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openSubmissionModal(assignment.id);
                      }}
                    >
                      View Submissions
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedAssignment && (
        <div className="modal-backdrop">
          <div
            className="modal-card"
            style={{
              maxWidth: 1000,
              width: "calc(100% - 32px)",
            }}
          >
            <div className="modal-header">
              <div>
                <h2>{selectedAssignment.title}</h2>

                <p>{selectedCourse?.title || "Course"}</p>
              </div>

              <button
                className="secondary-button"
                onClick={() => {
                  setSelectedAssignmentId(null);
                  setReviewStudentId(null);
                }}
              >
                Close
              </button>
            </div>

            <div
              style={{
                marginTop: 20,
                overflowX: "auto",
              }}
            >
              <table className="lms-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll No</th>
                    <th>Submission</th>
                    <th>Marks</th>
                    <th>Review</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {courseStudents.map((student) => {
                    const submission = selectedAssignment.submissions.find(
                      (item) => item.studentId === student.id,
                    );

                    return (
                      <tr key={student.id}>
                        <td>{student.name}</td>

                        <td>{student.rollNo}</td>

                        <td>
                          {submission?.submitted ? (
                            <span className="status-pill status-active">
                              Submitted
                            </span>
                          ) : (
                            <span className="status-pill status-dropout">
                              Pending
                            </span>
                          )}
                        </td>

                        <td>{submission?.marks ?? "—"}</td>

                        <td>
                          {submission?.reviewStatus === "approved" ? (
                            <span className="status-pill status-active">
                              Approved
                            </span>
                          ) : submission?.reviewStatus === "rejected" ? (
                            <span className="status-pill status-eliminated">
                              Rejected
                            </span>
                          ) : (
                            <span className="status-pill">Pending</span>
                          )}
                        </td>

                        <td>
                          <button
                            className="primary-button"
                            disabled={!submission?.submitted}
                            onClick={() =>
                              openReviewModal(selectedAssignment.id, student.id)
                            }
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {reviewStudent && reviewSubmission && selectedAssignment && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>Review Submission</h2>

                <p>
                  {reviewStudent.name} — {selectedAssignment.title}
                </p>
              </div>

              <button
                className="secondary-button"
                onClick={() => setReviewStudentId(null)}
              >
                Close
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gap: 18,
                marginTop: 20,
              }}
            >
              <div>
                <label className="form-label">Review Status</label>

                <select
                  className="form-control lms-select"
                  value={reviewStatus}
                  onChange={(event) =>
                    setReviewStatus(event.target.value as SubmissionStatus)
                  }
                >
                  <option value="approved">Approved</option>

                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="form-label">Marks</label>

                <input
                  className="form-control"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0 - 100"
                  value={marks}
                  onChange={(event) => setMarks(event.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Feedback</label>

                <textarea
                  className="form-control"
                  rows={5}
                  placeholder="Write feedback for the student..."
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className="secondary-button"
                  onClick={() => setReviewStudentId(null)}
                >
                  Cancel
                </button>

                <button className="primary-button" onClick={handleReview}>
                  Save Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
