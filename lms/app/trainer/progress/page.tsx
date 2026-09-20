"use client";

import { useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import DashboardShell from "@/components/DashboardShell";
import { useLms } from "@/components/LmsProvider";
import { initialCourses } from "@/lib/data";

export default function TrainerProgressPage() {
  const {
    topics,
    toggleTopic,
    getCourseProgress,
    ready,
  } = useLms();

  const [courseId, setCourseId] = useState("web");

  const course = initialCourses.find(
    (item) => item.id === courseId
  )!;

  const courseTopics = topics.filter(
    (topic) => topic.courseId === courseId
  );

  const completedTopics = courseTopics.filter(
    (topic) => topic.completed
  ).length;

  const progress = getCourseProgress(courseId);

  return (
    <AuthGuard role="trainer">
      <DashboardShell
        role="trainer"
        title="Course Progress"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <h1 className="page-title">
                Course Progress
              </h1>

              <p className="page-subtitle">
                Track syllabus completion and mark delivered
                topics.
              </p>
            </div>

            <select
              value={courseId}
              onChange={(event) =>
                setCourseId(event.target.value)
              }
              className="form-control md:w-[340px]"
            >
              {initialCourses.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          {!ready ? (
            <div className="mt-7 text-[#718099]">
              Loading progress...
            </div>
          ) : (
            <>
              <section className="lms-card p-6 mt-7">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[#64738a]">
                      Selected Course
                    </p>

                    <h2 className="text-xl font-semibold mt-2">
                      {course.title}
                    </h2>

                    <p className="text-sm text-[#718099] mt-1">
                      {course.batch} · {course.schedule}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-3xl font-semibold text-blue-400">
                      {progress}%
                    </p>

                    <p className="text-xs text-[#64738a] mt-1">
                      {completedTopics}/{courseTopics.length} topics
                    </p>
                  </div>
                </div>

                <div className="h-2 bg-[#0a1220] rounded-full overflow-hidden mt-6">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </section>

              <section className="mt-7">
                <h2 className="text-lg font-semibold">
                  Course Topics
                </h2>

                <div className="lms-card mt-4 overflow-hidden">
                  {courseTopics.map((topic, index) => (
                    <div
                      key={topic.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 ${
                        index !==
                        courseTopics.length - 1
                          ? "border-b border-[#202d44]"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold ${
                            topic.completed
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-[#162136] text-[#718099] border border-[#273650]"
                          }`}
                        >
                          {topic.completed
                            ? "✓"
                            : index + 1}
                        </div>

                        <div>
                          <p className="font-medium">
                            {topic.title}
                          </p>

                          <p className="text-xs text-[#66758c] mt-1">
                            {topic.completed
                              ? "Topic completed"
                              : "Pending delivery"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          toggleTopic(topic.id)
                        }
                        className={
                          topic.completed
                            ? "secondary-button text-xs"
                            : "primary-button text-xs"
                        }
                      >
                        {topic.completed
                          ? "Mark Incomplete"
                          : "Mark Complete"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}