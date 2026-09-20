"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Assignment,
  AssignmentSubmission,
  CourseTopic,
  DailyAttendance,
  initialAssignments,
  initialDailyAttendance,
  initialStudents,
  initialTopics,
  initialTrainers,
  Student,
  Trainer,
  UserStatus,
  SubmissionStatus,
} from "@/lib/data";

interface CreateAssignmentInput {
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
}

interface LmsContextType {
  students: Student[];
  trainers: Trainer[];
  topics: CourseTopic[];
  assignments: Assignment[];
  dailyAttendance: DailyAttendance[];
  ready: boolean;

  updateStudentStatus: (
    id: number,
    status: UserStatus
  ) => void;

  updateTrainerStatus: (
    id: number,
    status: UserStatus
  ) => void;

  toggleTopic: (id: number) => void;

  getAttendancePercentage: (
    student: Student
  ) => number;

  getCourseProgress: (
    courseId: string
  ) => number;

  updateAttendance: (
    attendanceId: number,
    studentId: number,
    status: "Present" | "Absent"
  ) => void;

  createAssignment: (
    data: CreateAssignmentInput
  ) => void;

  deleteAssignment: (
    assignmentId: number
  ) => void;

  updateSubmissionReview: (
    assignmentId: number,
    studentId: number,
    status: SubmissionStatus,
    marks?: number | null,
    feedback?: string
  ) => void;

  /*
   * Compatibility function for existing
   * Trainer Assignments page.
   */
  updateSubmissionStatus: (
    assignmentId: number,
    studentId: number,
    status: SubmissionStatus
  ) => void;

  markSubmissionChecked: (
    assignmentId: number,
    studentId: number,
    marks: number
  ) => void;

  resetDemoData: () => void;
}

const LmsContext =
  createContext<LmsContextType | undefined>(
    undefined
  );

const STORAGE_KEY = "smit-lms-data";

export function LmsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [students, setStudents] =
    useState<Student[]>(initialStudents);

  const [trainers, setTrainers] =
    useState<Trainer[]>(initialTrainers);

  const [topics, setTopics] =
    useState<CourseTopic[]>(initialTopics);

  const [assignments, setAssignments] =
    useState<Assignment[]>(initialAssignments);

  const [dailyAttendance, setDailyAttendance] =
    useState<DailyAttendance[]>(
      initialDailyAttendance
    );

  const [ready, setReady] = useState(false);

  /*
   * LOAD DATA FROM LOCAL STORAGE
   */
  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const data = JSON.parse(stored);

        if (Array.isArray(data.students)) {
          setStudents(data.students);
        }

        if (Array.isArray(data.trainers)) {
          setTrainers(data.trainers);
        }

        if (Array.isArray(data.topics)) {
          setTopics(data.topics);
        }

        if (Array.isArray(data.assignments)) {
          setAssignments(data.assignments);
        }

        if (
          Array.isArray(data.dailyAttendance)
        ) {
          setDailyAttendance(
            data.dailyAttendance
          );
        }
      }
    } catch (error) {
      console.error(
        "Unable to load LMS demo data:",
        error
      );
    } finally {
      setReady(true);
    }
  }, []);

  /*
   * SAVE DATA TO LOCAL STORAGE
   */
  useEffect(() => {
    if (!ready) return;

    const data = {
      students,
      trainers,
      topics,
      assignments,
      dailyAttendance,
    };

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error(
        "Unable to save LMS demo data:",
        error
      );
    }
  }, [
    students,
    trainers,
    topics,
    assignments,
    dailyAttendance,
    ready,
  ]);

  /*
   * UPDATE STUDENT STATUS
   */
  function updateStudentStatus(
    id: number,
    status: UserStatus
  ) {
    setStudents((current) =>
      current.map((student) =>
        student.id === id
          ? {
              ...student,
              status,
            }
          : student
      )
    );
  }

  /*
   * UPDATE TRAINER STATUS
   */
  function updateTrainerStatus(
    id: number,
    status: UserStatus
  ) {
    setTrainers((current) =>
      current.map((trainer) =>
        trainer.id === id
          ? {
              ...trainer,
              status,
            }
          : trainer
      )
    );
  }

  /*
   * TOGGLE COURSE TOPIC
   */
  function toggleTopic(id: number) {
    setTopics((current) =>
      current.map((topic) =>
        topic.id === id
          ? {
              ...topic,
              completed: !topic.completed,
            }
          : topic
      )
    );
  }

  /*
   * ATTENDANCE PERCENTAGE
   */
  function getAttendancePercentage(
    student: Student
  ) {
    const present =
      Number(student.present) || 0;

    const absent =
      Number(student.absent) || 0;

    const total = present + absent;

    if (total <= 0) {
      return 0;
    }

    return Math.round(
      (present / total) * 100
    );
  }

  /*
   * COURSE PROGRESS
   */
  function getCourseProgress(
    courseId: string
  ) {
    const courseTopics = topics.filter(
      (topic) =>
        topic.courseId === courseId
    );

    if (courseTopics.length === 0) {
      return 0;
    }

    const completed =
      courseTopics.filter(
        (topic) => topic.completed
      ).length;

    return Math.round(
      (completed /
        courseTopics.length) *
        100
    );
  }

  /*
   * UPDATE DAILY ATTENDANCE
   *
   * Trainer can mark a student Present
   * or Absent for a particular class/day.
   *
   * This also keeps the student's aggregate
   * present/absent counters synchronized.
   */
  function updateAttendance(
    attendanceId: number,
    studentId: number,
    status: "Present" | "Absent"
  ) {
    let previousStatus:
      | "Present"
      | "Absent"
      | null = null;

    setDailyAttendance((current) =>
      current.map((attendance) => {
        if (
          attendance.id !== attendanceId
        ) {
          return attendance;
        }

        const existingRecord =
          attendance.records.find(
            (record) =>
              record.studentId === studentId
          );

        if (existingRecord) {
          previousStatus =
            existingRecord.status;

          return {
            ...attendance,
            records:
              attendance.records.map(
                (record) =>
                  record.studentId ===
                  studentId
                    ? {
                        ...record,
                        status,
                      }
                    : record
              ),
          };
        }

        return {
          ...attendance,
          records: [
            ...attendance.records,
            {
              studentId,
              status,
            },
          ],
        };
      })
    );

    /*
     * Update aggregate counters only when
     * the attendance value actually changes.
     */
    if (
      previousStatus &&
      previousStatus !== status
    ) {
      setStudents((current) =>
        current.map((student) => {
          if (student.id !== studentId) {
            return student;
          }

          let present =
            Number(student.present) || 0;

          let absent =
            Number(student.absent) || 0;

          if (previousStatus === "Present") {
            present = Math.max(0, present - 1);
          } else {
            absent = Math.max(0, absent - 1);
          }

          if (status === "Present") {
            present += 1;
          } else {
            absent += 1;
          }

          return {
            ...student,
            present,
            absent,
          };
        })
      );
    }

    /*
     * If this is a new attendance record,
     * add one class to the appropriate counter.
     */
    if (!previousStatus) {
      setStudents((current) =>
        current.map((student) => {
          if (student.id !== studentId) {
            return student;
          }

          if (status === "Present") {
            return {
              ...student,
              present:
                (Number(student.present) || 0) +
                1,
            };
          }

          return {
            ...student,
            absent:
              (Number(student.absent) || 0) +
              1,
          };
        })
      );
    }
  }

  /*
   * CREATE NEW ASSIGNMENT
   *
   * Automatically creates a submission
   * record for every student enrolled
   * in the selected course.
   */
  function createAssignment(
    data: CreateAssignmentInput
  ) {
    const courseStudents =
      students.filter((student) =>
        student.courseIds.includes(
          data.courseId
        )
      );

    const newSubmissions: AssignmentSubmission[] =
      courseStudents.map((student) => ({
        studentId: student.id,
        submitted: false,
        submittedAt: "-",
        checked: false,
        marks: null,
        reviewStatus: "pending",
      }));

    const newId =
      assignments.length > 0
        ? Math.max(
            ...assignments.map(
              (assignment) =>
                assignment.id
            )
          ) + 1
        : 1;

    const newAssignment: Assignment = {
      id: newId,
      courseId: data.courseId,
      title: data.title,
      description:
        data.description,
      dueDate: data.dueDate,
      createdAt:
        new Date().toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ),
      submissions:
        newSubmissions,
    };

    setAssignments((current) => [
      newAssignment,
      ...current,
    ]);
  }

  /*
   * DELETE ASSIGNMENT
   */
  function deleteAssignment(
    assignmentId: number
  ) {
    setAssignments((current) =>
      current.filter(
        (assignment) =>
          assignment.id !== assignmentId
      )
    );
  }

  /*
   * APPROVE / REJECT SUBMISSION
   */
  function updateSubmissionReview(
    assignmentId: number,
    studentId: number,
    status: SubmissionStatus,
    marks: number | null = null,
    feedback = ""
  ) {
    setAssignments((current) =>
      current.map((assignment) => {
        if (
          assignment.id !==
          assignmentId
        ) {
          return assignment;
        }

        return {
          ...assignment,
          submissions:
            assignment.submissions.map(
              (submission) =>
                submission.studentId ===
                studentId
                  ? {
                      ...submission,
                      checked: true,
                      marks,
                      reviewStatus:
                        status,
                      feedback,
                    }
                  : submission
            ),
        };
      })
    );
  }

  /*
   * COMPATIBILITY FUNCTION
   *
   * Existing Trainer Assignments pages
   * can call updateSubmissionStatus()
   * for simple Approved / Rejected actions.
   */
  function updateSubmissionStatus(
    assignmentId: number,
    studentId: number,
    status: SubmissionStatus
  ) {
    updateSubmissionReview(
      assignmentId,
      studentId,
      status
    );
  }

  /*
   * OLD COMPATIBILITY FUNCTION
   *
   * Existing pages that use
   * markSubmissionChecked will continue
   * working.
   */
  function markSubmissionChecked(
    assignmentId: number,
    studentId: number,
    marks: number
  ) {
    updateSubmissionReview(
      assignmentId,
      studentId,
      "approved",
      marks,
      ""
    );
  }

  /*
   * RESET ALL DEMO DATA
   */
  function resetDemoData() {
    setStudents(initialStudents);
    setTrainers(initialTrainers);
    setTopics(initialTopics);
    setAssignments(initialAssignments);
    setDailyAttendance(
      initialDailyAttendance
    );

    localStorage.removeItem(
      STORAGE_KEY
    );
  }

  const value = useMemo(
    () => ({
      students,
      trainers,
      topics,
      assignments,
      dailyAttendance,
      ready,

      updateStudentStatus,
      updateTrainerStatus,
      toggleTopic,

      getAttendancePercentage,
      getCourseProgress,

      updateAttendance,

      createAssignment,
      deleteAssignment,

      updateSubmissionReview,
      updateSubmissionStatus,
      markSubmissionChecked,

      resetDemoData,
    }),
    [
      students,
      trainers,
      topics,
      assignments,
      dailyAttendance,
      ready,
    ]
  );

  return (
    <LmsContext.Provider value={value}>
      {children}
    </LmsContext.Provider>
  );
}

export function useLms() {
  const context =
    useContext(LmsContext);

  if (!context) {
    throw new Error(
      "useLms must be used inside LmsProvider"
    );
  }

  return context;
}