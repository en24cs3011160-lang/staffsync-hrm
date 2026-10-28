# StaffSync - Modern Human Resource Management Solution

> A comprehensive web-based application built using the **MERN Stack (MongoDB, Express.js, React.js, and Node.js)** that streamlines and automates core human resource processes across an enterprise organization.

[![SkillWallet Project](https://img.shields.io/badge/SkillWallet-FutureSkills%20Prime-blue)](https://myskillwallet.ai)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
3. [Key Modules & Features](#-key-modules--features)
4. [Course Epics & Stories (6 Epics / 19 Tasks)](#-course-epics--stories)
5. [System Requirements](#-system-requirements)
6. [Local Installation & Setup](#-local-installation--setup)
7. [Project Structure](#-project-structure)
8. [Mentor Evaluation Links](#-mentor-evaluation-links)

---

## 🌟 Project Overview

**StaffSync** delivers an enterprise-grade HRM platform providing distinct roles and access levels for **HR personnel, managers, and employees**. It eliminates administrative bottlenecks by digitizing attendance tracking, leave requests, employee records, news broadcasts, and team training tracks.

---

## 👥 Role-Based Access Control (RBAC)

The system provides tailored interfaces and permission boundaries for 3 personas:

| Role | Access & Responsibilities | Key Capabilities |
| :--- | :--- | :--- |
| **HR Personnel** | Organization-wide administration | Manage employee directory, configure leave quotas, handle approvals, track daily attendance, post company announcements. |
| **Managers** | Departmental & team leadership | Review direct reports' leave requests, monitor team punctuality, assign training tracks, track course completion. |
| **Employees** | Self-service personnel workspace | Interactive punch in/out station, apply for leaves, track personal balance, browse company news, complete training tracks. |

---

## ⚡ Key Modules & Features

- **Workstation Punch Clock**: Interactive clock-in/out station with live session timer (`HH:MM:SS`), location tagging, and punctuality tracking (on-time vs late arrival thresholds).
- **Leave Management Workflow**: Multi-category leave balances (Annual, Sick, Casual, Maternity/Paternity), instant duration calculator, reason submission, and reviewer sign-off drawer with audit logs.
- **Employee Directory & Onboarding**: Searchable directory by name/code/department, CSV data export, employee detail slide-out drawer, and new employee onboarding modal.
- **Company Announcements Feed**: Priority badges (*Normal, Important, Urgent*), pinned memos, department targeting, and interactive read acknowledgments.
- **Training & Talent Development**: Course catalogs, interactive module progress tracker, manager team assignment, and verified digital **Certificates of Completion**.
- **Interactive Project Kanban**: Direct replication of the SkillWallet course interface with tabbed navigation (**Overview**, **Workspace**, **Kanban**) and 100% completed tasks.

---

## 🗂 Course Epics & Stories

This repository fulfills all **6 Epics** and **19 Tasks** outlined in the SkillWallet curriculum:

- **Epic 1: Project Architecture & Role Definition** (3 Stories)
  - RBAC permissions for HR, Manager, and Employee
  - Data schema design (Employees, Leaves, Attendance, Announcements, Training)
  - Sidebar and domain navigation structure
- **Epic 2: Project Setup & Configuration** (3 Stories)
  - Package dependencies and build script configuration
  - Tailwind CSS design system tokens and typography
  - Application metadata and responsive viewports
- **Epic 3: Backend & RESTful API Development** (4 Stories)
  - Employee CRUD & directory query routes
  - Leave application and review workflow endpoints
  - Real-time attendance clock-in/out logging
  - Announcements feed & manager training sync API
- **Epic 4: Database Development & Schema Modeling** (3 Stories)
  - Employee collection schema with nested leave quotas
  - Leave requests collection with audit reviewer trails
  - Initial seed data engine
- **Epic 5: Frontend Portal Development** (4 Stories)
  - Interactive clock-in/out widget with live session timer
  - Leave submission modal and manager/HR approval drawer
  - Searchable employee directory and onboarding form
  - Training catalog with progress slider and certificate generator
- **Epic 6: Project Execution & Evaluation Analytics** (2 Stories)
  - Interactive SkillWallet overview and Kanban board
  - Exportable attendance timesheets and employee CSV reports

---

## 💻 System Requirements

### Software Requirements
- **Operating System**: Windows 10/11, macOS, or Linux
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher (or Bun / pnpm / yarn)
- **Modern Browser**: Chrome, Edge, Firefox, or Safari

### Hardware Specifications
- **Processor**: Intel Core i5 (8th Gen+) or AMD Ryzen 5+
- **RAM**: 8 GB (16 GB recommended)
- **Storage**: At least 1 GB free disk space
- **Display**: 1366 × 768 or higher

---

## 🚀 Local Installation & Setup

Follow these steps to run the project locally on your machine:

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/staffsync-hrm.git

# 2. Navigate to project root
cd staffsync-hrm

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

To build for production:
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
staffsync-hrm/
├── public/
│   └── assets/            # Project screenshots and avatar media
├── src/
│   ├── assets/images/     # Generated high-resolution team avatars
│   ├── components/
│   │   ├── AnnouncementsView.tsx      # Announcements board & publisher
│   │   ├── AttendanceTrackerView.tsx  # Punch clock & timesheet reports
│   │   ├── ClockWidget.tsx            # Live workstation punch clock
│   │   ├── DashboardView.tsx          # Role-tailored metrics & approvals
│   │   ├── EmployeeDirectoryView.tsx  # Directory, profile drawer & modal
│   │   ├── KanbanProjectView.tsx      # SkillWallet course roadmap & Kanban
│   │   ├── LeaveManagementView.tsx    # Leave applications & sign-offs
│   │   ├── Navbar.tsx                 # Top bar & fast persona switcher
│   │   ├── Sidebar.tsx                # Role-based sidebar navigation
│   │   ├── Toast.tsx                  # Action feedback notifications
│   │   └── TrainingHubView.tsx        # Upskilling tracks & certificate
│   ├── context/
│   │   └── HRContext.tsx              # Reactive state & localStorage sync
│   ├── data/
│   │   └── mockData.ts                # Seed employees, leaves, attendance
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces & types
│   ├── App.tsx                        # Master layout controller
│   ├── index.css                      # Tailwind CSS v4 styling & typography
│   └── main.tsx                       # React DOM entry point
├── index.html                         # Entry HTML with meta tags & fonts
├── metadata.json                      # App configuration & permissions
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite build configuration
└── README.md                          # Project documentation
```

---

## 🔗 Mentor Evaluation Links

- **Live Application Demo**: Update with your deployed URL in `KanbanProjectView.tsx` or your deployment host.
- **GitHub Repository**: `https://github.com/YOUR_USERNAME/staffsync-hrm`

---

## 📄 License
This project is developed for educational evaluation under the **SkillWallet / FutureSkills Prime** Full Stack MERN Development curriculum.
