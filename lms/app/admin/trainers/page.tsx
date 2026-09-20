"use client";

import AuthGuard from "@/components/AuthGuard";
import DashboardShell from "@/components/DashboardShell";
import { useLms } from "@/components/LmsProvider";

import {
  initialCourses,
  UserStatus,
} from "@/lib/data";

export default function AdminTrainersPage() {
  const {
    trainers,
    updateTrainerStatus,
    ready,
  } = useLms();

  return (
    <AuthGuard role="admin">
      <DashboardShell
        role="admin"
        title="Trainer Management"
      >
        <div className="max-w-[1500px] mx-auto">
          <div>
            <h1 className="page-title">
              Trainer Management
            </h1>

            <p className="page-subtitle">
              Manage trainers and assigned courses.
            </p>
          </div>

          {!ready ? (
            <p className="mt-7 text-[#718099]">
              Loading trainers...
            </p>
          ) : (
            <>
              <section className="grid sm:grid-cols-3 gap-4 mt-7">
                <div className="stat-card">
                  <p className="text-sm text-[#8290a5]">
                    Total Trainers
                  </p>

                  <p className="text-3xl font-semibold mt-3">
                    {trainers.length}
                  </p>
                </div>

                <div className="stat-card">
                  <p className="text-sm text-[#8290a5]">
                    Active Trainers
                  </p>

                  <p className="text-3xl font-semibold mt-3">
                    {
                      trainers.filter(
                        (trainer) =>
                          trainer.status === "active"
                      ).length
                    }
                  </p>
                </div>

                <div className="stat-card">
                  <p className="text-sm text-[#8290a5]">
                    Courses
                  </p>

                  <p className="text-3xl font-semibold mt-3">
                    {initialCourses.length}
                  </p>
                </div>
              </section>

              <div className="table-wrapper mt-6">
                <table className="lms-table">
                  <thead>
                    <tr>
                      <th>Trainer</th>
                      <th>Phone</th>
                      <th>Assigned Courses</th>
                      <th>Status</th>
                      <th>Manage</th>
                    </tr>
                  </thead>

                  <tbody>
                    {trainers.map((trainer) => (
                      <tr key={trainer.id}>
                        <td>
                          <p className="font-medium">
                            {trainer.name}
                          </p>

                          <p className="text-xs text-[#64738a] mt-1">
                            {trainer.email}
                          </p>
                        </td>

                        <td>{trainer.phone}</td>

                        <td>
                          <div className="flex flex-wrap gap-1.5">
                            {trainer.courseIds.map(
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
                          <span
                            className={`status-pill status-${trainer.status}`}
                          >
                            {trainer.status}
                          </span>
                        </td>

                        <td>
                          <select
                            value={
                              trainer.status
                            }
                            onChange={(event) =>
                              updateTrainerStatus(
                                trainer.id,
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
                              Inactive
                            </option>

                            <option value="eliminated">
                              Eliminated
                            </option>
                          </select>
                        </td>
                      </tr>
                    ))}
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