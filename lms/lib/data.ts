export type Role = "student" | "trainer" | "admin";

export type UserStatus =
  | "active"
  | "dropout"
  | "eliminated";

export type SubmissionStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface LoginCredential {
  role: Role;
  email: string;
  password: string;
  name: string;
}

export interface Student {
  id: number;
  name: string;
  rollNo: string;
  email: string;
  courseIds: string[];
  present: number;
  absent: number;
  status: UserStatus;
}

export interface Trainer {
  id: number;
  name: string;
  email: string;
  phone: string;
  courseIds: string[];
  status: UserStatus;
}

export interface Course {
  id: string;
  title: string;
  shortName: string;
  trainerId: number;
  schedule: string;
  room: string;
  batch: string;
  campus: string;
  city: string;
  description: string;
}

export interface CourseTopic {
  id: number;
  courseId: string;
  title: string;
  completed: boolean;
}

export interface AssignmentSubmission {
  studentId: number;
  submitted: boolean;
  submittedAt: string;
  checked: boolean;
  marks: number | null;
  reviewStatus?: SubmissionStatus;
  feedback?: string;
}

export interface Assignment {
  id: number;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt?: string;
  submissions: AssignmentSubmission[];
}

export interface AttendanceRecord {
  date: string;
  courseId: string;
  topic: string;
  status: "Present" | "Absent";
}

export interface DailyAttendance {
  id: number;
  date: string;
  courseId: string;
  topic: string;
  records: {
    studentId: number;
    status: "Present" | "Absent";
  }[];
}

export const credentials: LoginCredential[] = [
  {
    role: "student",
    email: "student@smit.com",
    password: "student123",
    name: "Muhammad Hamza",
  },
  {
    role: "trainer",
    email: "trainer@smit.com",
    password: "trainer123",
    name: "Ahmed Khan",
  },
  {
    role: "admin",
    email: "admin@smit.com",
    password: "admin123",
    name: "SMIT Admin",
  },
];

export const initialCourses: Course[] = [
  {
    id: "web",
    title: "Modern Web Application Development",
    shortName: "MWAD",
    trainerId: 1,
    schedule: "Mon, Wed, Fri · 01:00 PM - 03:00 PM",
    room: "Lab 01",
    batch: "Batch 20",
    campus: "Zaitoon Ashraf IT Park",
    city: "Karachi",
    description:
      "Modern frontend and web application development using HTML, CSS, JavaScript and modern development practices.",
  },
  {
    id: "mobile",
    title: "Mobile Application Development",
    shortName: "MAD",
    trainerId: 1,
    schedule: "Tue, Thu · 03:00 PM - 05:00 PM",
    room: "Lab 03",
    batch: "Batch 12",
    campus: "Bahadurabad Campus",
    city: "Karachi",
    description:
      "Build modern mobile applications with Flutter, Dart, navigation, state management and Firebase.",
  },
  {
    id: "python",
    title: "Python Programming",
    shortName: "PY",
    trainerId: 1,
    schedule: "Sat, Sun · 11:00 AM - 01:00 PM",
    room: "Lab 06",
    batch: "Batch 08",
    campus: "Zaitoon Ashraf IT Park",
    city: "Karachi",
    description:
      "Learn Python programming from fundamentals to functions, data structures and object-oriented programming.",
  },
  {
    id: "graphic",
    title: "Graphic Designing",
    shortName: "GD",
    trainerId: 1,
    schedule: "Tue, Thu · 06:00 PM - 08:00 PM",
    room: "Lab 02",
    batch: "Batch 15",
    campus: "Gulshan Campus",
    city: "Karachi",
    description:
      "Learn design fundamentals, typography, color theory, Photoshop, Illustrator and branding.",
  },
];

export const initialStudents: Student[] = [
  {
    id: 1,
    name: "Muhammad Hamza",
    rollNo: "SMIT-001",
    email: "hamza@student.com",
    courseIds: ["web"],
    present: 104,
    absent: 7,
    status: "active",
  },
  {
    id: 2,
    name: "Ali Raza",
    rollNo: "SMIT-002",
    email: "ali@student.com",
    courseIds: ["web", "python"],
    present: 99,
    absent: 12,
    status: "active",
  },
  {
    id: 3,
    name: "Ayesha Khan",
    rollNo: "SMIT-003",
    email: "ayesha@student.com",
    courseIds: ["web"],
    present: 108,
    absent: 3,
    status: "active",
  },
  {
    id: 4,
    name: "Usman Ahmed",
    rollNo: "SMIT-004",
    email: "usman@student.com",
    courseIds: ["mobile"],
    present: 68,
    absent: 22,
    status: "active",
  },
  {
    id: 5,
    name: "Fatima Noor",
    rollNo: "SMIT-005",
    email: "fatima@student.com",
    courseIds: ["mobile", "graphic"],
    present: 82,
    absent: 8,
    status: "active",
  },
  {
    id: 6,
    name: "Bilal Hassan",
    rollNo: "SMIT-006",
    email: "bilal@student.com",
    courseIds: ["python"],
    present: 48,
    absent: 22,
    status: "active",
  },
  {
    id: 7,
    name: "Zainab Ali",
    rollNo: "SMIT-007",
    email: "zainab@student.com",
    courseIds: ["graphic"],
    present: 76,
    absent: 4,
    status: "active",
  },
  {
    id: 8,
    name: "Daniyal Shah",
    rollNo: "SMIT-008",
    email: "daniyal@student.com",
    courseIds: ["web", "mobile"],
    present: 90,
    absent: 21,
    status: "active",
  },
  {
    id: 9,
    name: "Hira Imran",
    rollNo: "SMIT-009",
    email: "hira@student.com",
    courseIds: ["web"],
    present: 85,
    absent: 10,
    status: "active",
  },
  {
    id: 10,
    name: "Saad Ahmed",
    rollNo: "SMIT-010",
    email: "saad@student.com",
    courseIds: ["python", "graphic"],
    present: 58,
    absent: 15,
    status: "active",
  },
];

export const initialTrainers: Trainer[] = [
  {
    id: 1,
    name: "Ahmed Khan",
    email: "ahmed@smit.com",
    phone: "0300-1111111",
    courseIds: [
      "web",
      "mobile",
      "python",
      "graphic",
    ],
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Ahmed",
    email: "sarah@smit.com",
    phone: "0300-2222222",
    courseIds: ["python"],
    status: "active",
  },
  {
    id: 3,
    name: "Hassan Raza",
    email: "hassan@smit.com",
    phone: "0300-3333333",
    courseIds: ["graphic"],
    status: "active",
  },
];

export const initialTopics: CourseTopic[] = [
  { id: 1, courseId: "web", title: "HTML Fundamentals", completed: true },
  { id: 2, courseId: "web", title: "Semantic HTML", completed: true },
  { id: 3, courseId: "web", title: "Forms and Tables", completed: true },
  { id: 4, courseId: "web", title: "CSS Fundamentals", completed: true },
  { id: 5, courseId: "web", title: "Flexbox", completed: true },
  { id: 6, courseId: "web", title: "CSS Grid", completed: true },
  { id: 7, courseId: "web", title: "Responsive Design", completed: true },
  { id: 8, courseId: "web", title: "JavaScript Basics", completed: true },
  { id: 9, courseId: "web", title: "Functions & Scope", completed: false },
  { id: 10, courseId: "web", title: "Arrays & Objects", completed: false },
  { id: 11, courseId: "web", title: "DOM Manipulation", completed: false },

  { id: 12, courseId: "mobile", title: "Dart Fundamentals", completed: true },
  { id: 13, courseId: "mobile", title: "Flutter Setup", completed: true },
  { id: 14, courseId: "mobile", title: "Flutter Widgets", completed: true },
  { id: 15, courseId: "mobile", title: "Layouts", completed: true },
  { id: 16, courseId: "mobile", title: "Navigation", completed: false },
  { id: 17, courseId: "mobile", title: "State Management", completed: false },
  { id: 18, courseId: "mobile", title: "Firebase", completed: false },

  { id: 19, courseId: "python", title: "Python Syntax", completed: true },
  { id: 20, courseId: "python", title: "Variables", completed: true },
  { id: 21, courseId: "python", title: "Conditions", completed: true },
  { id: 22, courseId: "python", title: "Loops", completed: false },
  { id: 23, courseId: "python", title: "Functions", completed: false },
  { id: 24, courseId: "python", title: "OOP", completed: false },

  { id: 25, courseId: "graphic", title: "Design Fundamentals", completed: true },
  { id: 26, courseId: "graphic", title: "Color Theory", completed: true },
  { id: 27, courseId: "graphic", title: "Typography", completed: true },
  { id: 28, courseId: "graphic", title: "Photoshop", completed: true },
  { id: 29, courseId: "graphic", title: "Illustrator", completed: false },
  { id: 30, courseId: "graphic", title: "Brand Identity", completed: false },
];

export const initialAssignments: Assignment[] = [
  {
    id: 1,
    courseId: "web",
    title: "HTML Portfolio Website",
    description:
      "Create a semantic multi-section personal portfolio website.",
    dueDate: "20 Sep 2026",
    createdAt: "10 Sep 2026",
    submissions: [
      {
        studentId: 1,
        submitted: true,
        submittedAt: "18 Sep 2026",
        checked: true,
        marks: 92,
        reviewStatus: "approved",
        feedback: "Good semantic structure and clean implementation.",
      },
      {
        studentId: 2,
        submitted: true,
        submittedAt: "19 Sep 2026",
        checked: false,
        marks: null,
        reviewStatus: "pending",
      },
      {
        studentId: 3,
        submitted: true,
        submittedAt: "17 Sep 2026",
        checked: true,
        marks: 88,
        reviewStatus: "approved",
        feedback: "Well structured portfolio.",
      },
      {
        studentId: 8,
        submitted: false,
        submittedAt: "-",
        checked: false,
        marks: null,
        reviewStatus: "pending",
      },
      {
        studentId: 9,
        submitted: true,
        submittedAt: "19 Sep 2026",
        checked: false,
        marks: null,
        reviewStatus: "pending",
      },
    ],
  },
  {
    id: 2,
    courseId: "web",
    title: "Responsive Landing Page",
    description:
      "Build a responsive landing page using CSS Flexbox and Grid.",
    dueDate: "26 Sep 2026",
    createdAt: "16 Sep 2026",
    submissions: [
      {
        studentId: 1,
        submitted: true,
        submittedAt: "24 Sep 2026",
        checked: false,
        marks: null,
        reviewStatus: "pending",
      },
      {
        studentId: 2,
        submitted: false,
        submittedAt: "-",
        checked: false,
        marks: null,
        reviewStatus: "pending",
      },
      {
        studentId: 3,
        submitted: true,
        submittedAt: "25 Sep 2026",
        checked: false,
        marks: null,
        reviewStatus: "pending",
      },
    ],
  },
  {
    id: 3,
    courseId: "mobile",
    title: "Flutter Login UI",
    description:
      "Create a responsive Flutter authentication screen.",
    dueDate: "28 Sep 2026",
    createdAt: "18 Sep 2026",
    submissions: [
      {
        studentId: 4,
        submitted: true,
        submittedAt: "27 Sep 2026",
        checked: true,
        marks: 85,
        reviewStatus: "approved",
        feedback: "Nice UI implementation.",
      },
      {
        studentId: 5,
        submitted: true,
        submittedAt: "26 Sep 2026",
        checked: false,
        marks: null,
        reviewStatus: "pending",
      },
    ],
  },
  {
    id: 4,
    courseId: "python",
    title: "Student Management CLI",
    description:
      "Create a command line student management program.",
    dueDate: "03 Oct 2026",
    createdAt: "20 Sep 2026",
    submissions: [
      {
        studentId: 2,
        submitted: true,
        submittedAt: "01 Oct 2026",
        checked: false,
        marks: null,
        reviewStatus: "pending",
      },
      {
        studentId: 6,
        submitted: false,
        submittedAt: "-",
        checked: false,
        marks: null,
        reviewStatus: "pending",
      },
      {
        studentId: 10,
        submitted: true,
        submittedAt: "02 Oct 2026",
        checked: true,
        marks: 90,
        reviewStatus: "approved",
        feedback: "Excellent work.",
      },
    ],
  },
  {
    id: 5,
    courseId: "graphic",
    title: "Brand Identity Design",
    description:
      "Create logo, color palette and typography for a brand.",
    dueDate: "07 Oct 2026",
    createdAt: "22 Sep 2026",
    submissions: [
      {
        studentId: 5,
        submitted: true,
        submittedAt: "05 Oct 2026",
        checked: false,
        marks: null,
        reviewStatus: "pending",
      },
      {
        studentId: 7,
        submitted: true,
        submittedAt: "06 Oct 2026",
        checked: false,
        marks: null,
        reviewStatus: "pending",
      },
      {
        studentId: 10,
        submitted: false,
        submittedAt: "-",
        checked: false,
        marks: null,
        reviewStatus: "pending",
      },
    ],
  },
];

export const attendanceHistory: AttendanceRecord[] = [
  {
    date: "15 Sep 2026",
    courseId: "web",
    topic: "JavaScript Functions",
    status: "Present",
  },
  {
    date: "13 Sep 2026",
    courseId: "web",
    topic: "Array Methods",
    status: "Present",
  },
  {
    date: "11 Sep 2026",
    courseId: "web",
    topic: "JavaScript Arrays",
    status: "Absent",
  },
  {
    date: "08 Sep 2026",
    courseId: "web",
    topic: "JavaScript Objects",
    status: "Present",
  },
  {
    date: "06 Sep 2026",
    courseId: "web",
    topic: "Loops",
    status: "Present",
  },
  {
    date: "04 Sep 2026",
    courseId: "web",
    topic: "DOM Basics",
    status: "Present",
  },
];

export const initialDailyAttendance: DailyAttendance[] = [
  {
    id: 1,
    date: "2026-09-15",
    courseId: "web",
    topic: "JavaScript Functions",
    records: [
      { studentId: 1, status: "Present" },
      { studentId: 2, status: "Present" },
      { studentId: 3, status: "Present" },
      { studentId: 8, status: "Absent" },
      { studentId: 9, status: "Present" },
    ],
  },
  {
    id: 2,
    date: "2026-09-13",
    courseId: "web",
    topic: "Array Methods",
    records: [
      { studentId: 1, status: "Present" },
      { studentId: 2, status: "Present" },
      { studentId: 3, status: "Present" },
      { studentId: 8, status: "Present" },
      { studentId: 9, status: "Present" },
    ],
  },
  {
    id: 3,
    date: "2026-09-11",
    courseId: "web",
    topic: "JavaScript Arrays",
    records: [
      { studentId: 1, status: "Present" },
      { studentId: 2, status: "Absent" },
      { studentId: 3, status: "Present" },
      { studentId: 8, status: "Absent" },
      { studentId: 9, status: "Present" },
    ],
  },
  {
    id: 4,
    date: "2026-09-09",
    courseId: "mobile",
    topic: "Flutter Widgets",
    records: [
      { studentId: 4, status: "Present" },
      { studentId: 5, status: "Present" },
      { studentId: 8, status: "Absent" },
    ],
  },
  {
    id: 5,
    date: "2026-09-07",
    courseId: "mobile",
    topic: "Layouts",
    records: [
      { studentId: 4, status: "Absent" },
      { studentId: 5, status: "Present" },
      { studentId: 8, status: "Present" },
    ],
  },
  {
    id: 6,
    date: "2026-09-06",
    courseId: "python",
    topic: "Loops",
    records: [
      { studentId: 2, status: "Present" },
      { studentId: 6, status: "Absent" },
      { studentId: 10, status: "Present" },
    ],
  },
  {
    id: 7,
    date: "2026-09-04",
    courseId: "graphic",
    topic: "Photoshop",
    records: [
      { studentId: 5, status: "Present" },
      { studentId: 7, status: "Present" },
      { studentId: 10, status: "Absent" },
    ],
  },
];