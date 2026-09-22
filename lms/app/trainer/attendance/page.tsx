"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import AuthGuard from "@/components/AuthGuard";
import DashboardShell from "@/components/DashboardShell";
import { useLms } from "@/components/LmsProvider";
import { initialCourses } from "@/lib/data";

function TrainerAttendanceContent() {
  const searchParams = useSearchParams();

  const {
    students,
    trainers,
    dailyAttendance,
    updateAttendance,
    getAttendancePercentage,
  } = useLms();

  const trainerId = 1;
  const trainer = trainers.find((item) => item.id === trainerId);

  const trainerCourses = useMemo(() => {
    return initialCourses.filter((course) => course.trainerId === trainerId);
  }, []);

  const queryCourseId = searchParams.get("course");

  const [selectedCourseId, setSelectedCourseId] = useState(() => {
    const queryCourseExists = trainerCourses.some(
      (course) => course.id === queryCourseId,
    );

    if (queryCourseExists && queryCourseId) {
      return queryCourseId;
    }

    return trainerCourses[0]?.id ?? "";
  });

  const [selectedAttendanceId, setSelectedAttendanceId] = useState<
    number | null
  >(null);

  const [selectedMonth, setSelectedMonth] = useState("all");

  const selectedCourse = useMemo(() => {
    return trainerCourses.find((course) => course.id === selectedCourseId);
  }, [trainerCourses, selectedCourseId]);

  const courseStudents = useMemo(() => {
    if (!selectedCourseId) return [];

    return students.filter(
      (student) =>
        student.courseIds.includes(selectedCourseId) &&
        student.status === "active",
    );
  }, [students, selectedCourseId]);

  const courseAttendance = useMemo(() => {
    return dailyAttendance
      .filter((item) => item.courseId === selectedCourseId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [dailyAttendance, selectedCourseId]);

  const filteredAttendance = useMemo(() => {
    if (selectedMonth === "all") {
      return courseAttendance;
    }

    return courseAttendance.filter((item) => {
      return item.date.startsWith(selectedMonth);
    });
  }, [courseAttendance, selectedMonth]);

  const selectedAttendance = useMemo(() => {
    if (filteredAttendance.length === 0) {
      return null;
    }

    const selected = filteredAttendance.find(
      (item) => item.id === selectedAttendanceId,
    );

    return selected ?? filteredAttendance[0];
  }, [filteredAttendance, selectedAttendanceId]);

  const attendanceStats = useMemo(() => {
    if (!selectedAttendance) {
      return {
        present: 0,
        absent: 0,
        total: 0,
        percentage: 0,
      };
    }

    const present = selectedAttendance.records.filter(
      (record) => record.status === "Present",
    ).length;

    const absent = selectedAttendance.records.filter(
      (record) => record.status === "Absent",
    ).length;

    const total = present + absent;

    return {
      present,
      absent,
      total,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  }, [selectedAttendance]);

  const availableMonths = useMemo(() => {
    const months = Array.from(
      new Set(courseAttendance.map((item) => item.date.slice(0, 7))),
    );

    return months.sort((a, b) => b.localeCompare(a));
  }, [courseAttendance]);

  const studentAttendanceMap = useMemo(() => {
    if (!selectedAttendance) {
      return new Map<number, "Present" | "Absent">();
    }

    return new Map(
      selectedAttendance.records.map((record) => [
        record.studentId,
        record.status,
      ]),
    );
  }, [selectedAttendance]);

  const handleStatusChange = (
    studentId: number,
    status: "Present" | "Absent",
  ) => {
    if (!selectedAttendance) return;

    updateAttendance(selectedAttendance.id, studentId, status);
  };

  const handleSelectAttendance = (id: number) => {
    setSelectedAttendanceId(id);
  };

  return (
    <AuthGuard role="trainer">
      <DashboardShell role="trainer" title="Attendance Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[#8e9bb0]">
                Trainer Portal
              </p>

              <h1 className="mt-1 text-2xl font-bold text-white">
                Attendance Management
              </h1>

              <p className="mt-1 text-sm text-[#8e9bb0]">
                Manage daily attendance for your courses and students.
              </p>
            </div>

            <div className="rounded-xl border border-[#26344a] bg-[#111a2a] px-4 py-3">
              <p className="text-xs text-[#8e9bb0]">Trainer</p>

              <p className="mt-1 font-semibold text-white">
                {trainer?.name ?? "Ahmed Khan"}
              </p>
            </div>
          </div>

          {/* Course Selection */}
          <div className="rounded-2xl border border-[#26344a] bg-[#111a2a] p-5">
            <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#c8d2e0]">
                  Select Course
                </label>

                <select
                  value={selectedCourseId}
                  onChange={(event) => {
                    setSelectedCourseId(event.target.value);
                    setSelectedAttendanceId(null);
                  }}
                  className="w-full rounded-xl border border-[#34445d] bg-[#0b1220] px-4 py-3 text-sm text-white outline-none transition focus:border-[#5f7cff]"
                >
                  {trainerCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} — {course.batch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#c8d2e0]">
                  Month
                </label>

                <select
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className="w-full rounded-xl border border-[#34445d] bg-[#0b1220] px-4 py-3 text-sm text-white outline-none transition focus:border-[#5f7cff]"
                >
                  <option value="all">All Months</option>

                  {availableMonths.map((month) => (
                    <option key={month} value={month}>
                      {new Date(`${month}-01`).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedCourse && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-[#26344a] bg-[#0b1220] p-4">
                  <p className="text-xs text-[#8e9bb0]">Course</p>

                  <p className="mt-1 font-semibold text-white">
                    {selectedCourse.shortName}
                  </p>
                </div>

                <div className="rounded-xl border border-[#26344a] bg-[#0b1220] p-4">
                  <p className="text-xs text-[#8e9bb0]">Batch</p>

                  <p className="mt-1 font-semibold text-white">
                    {selectedCourse.batch}
                  </p>
                </div>

                <div className="rounded-xl border border-[#26344a] bg-[#0b1220] p-4">
                  <p className="text-xs text-[#8e9bb0]">Schedule</p>

                  <p className="mt-1 font-semibold text-white">
                    {selectedCourse.schedule}
                  </p>
                </div>

                <div className="rounded-xl border border-[#26344a] bg-[#0b1220] p-4">
                  <p className="text-xs text-[#8e9bb0]">Students</p>

                  <p className="mt-1 font-semibold text-white">
                    {courseStudents.length}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
            {/* Attendance Sessions */}
            <div className="rounded-2xl border border-[#26344a] bg-[#111a2a] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white">
                    Attendance Sessions
                  </h2>

                  <p className="mt-1 text-xs text-[#8e9bb0]">
                    Select a session to manage records.
                  </p>
                </div>

                <span className="rounded-full bg-[#1b2940] px-3 py-1 text-xs font-semibold text-[#b9c8ff]">
                  {filteredAttendance.length}
                </span>
              </div>

              {filteredAttendance.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#34445d] p-6 text-center">
                  <p className="text-sm text-[#8e9bb0]">
                    No attendance records found.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAttendance.map((attendance) => {
                    const present = attendance.records.filter(
                      (record) => record.status === "Present",
                    ).length;

                    const absent = attendance.records.filter(
                      (record) => record.status === "Absent",
                    ).length;

                    const isSelected = selectedAttendance?.id === attendance.id;

                    return (
                      <button
                        key={attendance.id}
                        type="button"
                        onClick={() => handleSelectAttendance(attendance.id)}
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          isSelected
                            ? "border-[#5f7cff] bg-[#17233a]"
                            : "border-[#26344a] bg-[#0b1220] hover:border-[#40516c]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-white">
                              {new Date(
                                `${attendance.date}T00:00:00`,
                              ).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>

                            <p className="mt-1 text-xs text-[#8e9bb0]">
                              {attendance.topic}
                            </p>
                          </div>

                          <span className="text-xs font-semibold text-[#aebcff]">
                            {present + absent > 0
                              ? Math.round((present / (present + absent)) * 100)
                              : 0}
                            %
                          </span>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <span className="rounded-full bg-[#123526] px-2.5 py-1 text-[11px] font-medium text-[#72e0a5]">
                            {present} Present
                          </span>

                          <span className="rounded-full bg-[#3b2028] px-2.5 py-1 text-[11px] font-medium text-[#ff9cae]">
                            {absent} Absent
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Attendance Editor */}
            <div className="rounded-2xl border border-[#26344a] bg-[#111a2a] p-5">
              {!selectedAttendance ? (
                <div className="grid min-h-[420px] place-items-center text-center">
                  <div>
                    <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#1b2940] text-[#8fa6ff]">
                      ✓
                    </div>

                    <h2 className="font-semibold text-white">
                      No Attendance Selected
                    </h2>

                    <p className="mt-2 max-w-sm text-sm text-[#8e9bb0]">
                      Select an attendance session from the left panel.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Session Header */}
                  <div className="flex flex-col gap-4 border-b border-[#26344a] pb-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-[#8e9bb0]">
                        Attendance Session
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-white">
                        {selectedAttendance.topic}
                      </h2>

                      <p className="mt-1 text-sm text-[#8e9bb0]">
                        {new Date(
                          `${selectedAttendance.date}T00:00:00`,
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-[#26344a] bg-[#0b1220] px-4 py-3 text-center">
                        <p className="text-lg font-bold text-white">
                          {attendanceStats.total}
                        </p>

                        <p className="text-[10px] text-[#8e9bb0]">Total</p>
                      </div>

                      <div className="rounded-xl border border-[#26344a] bg-[#0b1220] px-4 py-3 text-center">
                        <p className="text-lg font-bold text-[#72e0a5]">
                          {attendanceStats.present}
                        </p>

                        <p className="text-[10px] text-[#8e9bb0]">Present</p>
                      </div>

                      <div className="rounded-xl border border-[#26344a] bg-[#0b1220] px-4 py-3 text-center">
                        <p className="text-lg font-bold text-[#ff9cae]">
                          {attendanceStats.absent}
                        </p>

                        <p className="text-[10px] text-[#8e9bb0]">Absent</p>
                      </div>
                    </div>
                  </div>

                  {/* Student List */}
                  <div className="mt-5 overflow-hidden rounded-xl border border-[#26344a]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[720px]">
                        <thead>
                          <tr className="border-b border-[#26344a] bg-[#0b1220]">
                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8e9bb0]">
                              Student
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8e9bb0]">
                              Roll No
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#8e9bb0]">
                              Overall
                            </th>

                            <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-[#8e9bb0]">
                              Attendance
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {courseStudents.map((student) => {
                            const status =
                              studentAttendanceMap.get(student.id) ?? "Absent";

                            const percentage = getAttendancePercentage(student);

                            return (
                              <tr
                                key={student.id}
                                className="border-b border-[#26344a] last:border-b-0"
                              >
                                <td className="px-5 py-4">
                                  <div>
                                    <p className="font-medium text-white">
                                      {student.name}
                                    </p>

                                    <p className="mt-1 text-xs text-[#8e9bb0]">
                                      {student.email}
                                    </p>
                                  </div>
                                </td>

                                <td className="px-5 py-4 text-sm text-[#c8d2e0]">
                                  {student.rollNo}
                                </td>

                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="h-2 w-24 overflow-hidden rounded-full bg-[#26344a]">
                                      <div
                                        className="h-full rounded-full bg-[#5f7cff]"
                                        style={{
                                          width: `${Math.min(
                                            percentage,
                                            100,
                                          )}%`,
                                        }}
                                      />
                                    </div>

                                    <span className="text-xs font-semibold text-white">
                                      {percentage}%
                                    </span>
                                  </div>
                                </td>

                                <td className="px-5 py-4">
                                  <div className="flex justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleStatusChange(
                                          student.id,
                                          "Present",
                                        )
                                      }
                                      className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                                        status === "Present"
                                          ? "bg-[#174b34] text-[#72e0a5]"
                                          : "bg-[#172233] text-[#8e9bb0] hover:bg-[#203049]"
                                      }`}
                                    >
                                      Present
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleStatusChange(student.id, "Absent")
                                      }
                                      className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                                        status === "Absent"
                                          ? "bg-[#54232e] text-[#ff9cae]"
                                          : "bg-[#172233] text-[#8e9bb0] hover:bg-[#203049]"
                                      }`}
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

                    {courseStudents.length === 0 && (
                      <div className="p-8 text-center">
                        <p className="text-sm text-[#8e9bb0]">
                          No active students enrolled in this course.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}

export default function TrainerAttendancePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen grid place-items-center bg-[#080f1c] text-[#8e9bb0]">
          Loading attendance...
        </div>
      }
    >
      <TrainerAttendanceContent />
    </Suspense>
  );
}
