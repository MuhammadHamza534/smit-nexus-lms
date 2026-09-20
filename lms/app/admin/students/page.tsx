"use client";

import { useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import DashboardShell from "@/components/DashboardShell";
import { useLms } from "@/components/LmsProvider";

import {
  initialCourses,
  UserStatus,
} from "@/lib/data";

export default function AdminStudentsPage() {
  const {
    students,
    updateStudentStatus,
    getAttendancePercentage,
    ready,
  } = useLms();

  const [courseFilter, setCourseFilter] =
    useState("all");

  const [search, setSearch] = useState("");

  const filteredStudents = students.filter(
    (student) => {
      const matchesCourse =
        courseFilter === "all" ||
        student.courseIds.includes(courseFilter);

      const searchValue = search.toLowerCase();

      const matchesSearch =
        student.name
          .toLowerCase()
          .includes(searchValue) ||
        student.rollNo
          .toLowerCase()
          .includes(searchValue) ||
        student.email
          .toLowerCase()
          .includes(searchValue);

      return matchesCourse && matchesSearch;
    }
  );

  return (
    <AuthGuard role="admin">
      <DashboardShell
        role="admin"
        title="Student Management"
      >
        <div className="max-w-[1500px] mx-auto">
          <div>
            <h1 className="page-title">
              Student Management
            </h1>

            <p className="page-subtitle">
              Review enrolled students and manage account
              status.
            </p>
          </div>

          {!ready ? (
            <p className="mt-7 text-[#718099]">
              Loading students...
            </p>
          ) : (
            <>
              <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-7">
                <AdminStat
                  title="Total Students"
                  value={students.length}
                />

                <AdminStat
                  title="Active"
                  value={
                    students.filter(
                      (student) =>
                        student.status === "active"
                    ).length
                  }
                />

                <AdminStat
                  title="Dropout"
                  value={
                    students.filter(
                      (student) =>
                        student.status === "dropout"
                    ).length
                  }
                />

                <AdminStat
                  title="Eliminated"
                  value={
                    students.filter(
                      (student) =>
                        student.status === "eliminated"
                    ).length
                  }
                />
              </section>

              <section className="lms-card p-4 mt-6">
                <div className="grid lg:grid-cols-[1fr_320px] gap-3">
                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search by name, email or roll number..."
                    className="form-control"
                  />

                  <select
                    value={courseFilter}
                    onChange={(event) =>
                      setCourseFilter(
                        event.target.value
                      )
                    }
                    className="form-control"
                  >
                    <option value="all">
                      All Courses
                    </option>

                    {initialCourses.map((course) => (
                      <option
                        key={course.id}
                        value={course.id}
                      >
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              <div className="table-wrapper mt-5">
                <table className="lms-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Roll No.</th>
                      <th>Courses</th>
                      <th>Attendance</th>
                      <th>Status</th>
                      <th>Manage</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStudents.map(
                      (student) => (
                        <tr key={student.id}>
                          <td>
                            <p className="font-medium">
                              {student.name}
                            </p>

                            <p className="text-xs text-[#64738a] mt-1">
                              {student.email}
                            </p>
                          </td>

                          <td>{student.rollNo}</td>

                          <td>
                            <div className="flex flex-wrap gap-1.5">
                              {student.courseIds.map(
                                (courseId) => {
                                  const course =
                                    initialCourses.find(
                                      (item) =>
                                        item.id ===
                                        courseId
                                    );

                                  return (
                                    <span
                                      key={courseId}
                                      className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs"
                                    >
                                      {
                                        course?.shortName
                                      }
                                    </span>
                                  );
                                }
                              )}
                            </div>
                          </td>

                          <td>
                            {getAttendancePercentage(
                              student
                            )}
                            %
                          </td>

                          <td>
                            <span
                              className={`status-pill status-${student.status}`}
                            >
                              {student.status}
                            </span>
                          </td>

                          <td>
                            <select
                              value={
                                student.status
                              }
                              onChange={(event) =>
                                updateStudentStatus(
                                  student.id,
                                  event.target
                                    .value as UserStatus
                                )
                              }
                              className="bg-[#0d1626] border border-[#293854] rounded-lg px-3 py-2 text-sm outline-none"
                            >
                              <option value="active">
                                Active
                              </option>

                              <option value="dropout">
                                Dropout
                              </option>

                              <option value="eliminated">
                                Eliminated
                              </option>
                            </select>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}

function AdminStat({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="stat-card">
      <p className="text-sm text-[#8290a5]">
        {title}
      </p>

      <p className="text-3xl font-semibold mt-3">
        {value}
      </p>
    </div>
  );
}