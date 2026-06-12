# ⚡ HRPulse Workspace

<div align="center">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="Vanilla CSS" />
  <img src="https://img.shields.io/badge/PapaParse-FF6B6B?style=for-the-badge" alt="PapaParse" />
</div>

<br />

**HRPulse Workspace** is a high-fidelity, interactive React portal designed for HR professionals to manage the employee lifecycle. The system is engineered to be lightweight, fast, and secure—loading operational data directly from physical CSV assets and dynamically deriving operational state (like availability) on-the-fly to guarantee perfect data integrity.

---

## 🗺️ Architectural Data Flow

The diagram below shows how the application ingests CSV data and propagates updates across pages and components:

```mermaid
graph TD
    %% Colors & Styles
    classDef file fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef hook fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#fff;
    classDef controller fill:#311042,stroke:#d946ef,stroke-width:2px,color:#fff;
    classDef component fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;

    A[public/employees.csv] :::file -->|Fetch & Parse| F[useCsvData.js Hook]:::hook
    B[public/leaveRequests.csv] :::file -->|Fetch & Parse| F
    C[public/salaryHistory.csv] :::file -->|Fetch & Parse| F
    D[public/roles.csv] :::file -->|Fetch & Parse| F
    E[public/tasks.csv] :::file -->|Fetch & Parse| F

    F -->|Promise.all Atomicity| G[App.jsx Central Controller]:::controller

    G -->|State & Mutators| H[Dashboard Page]:::component
    G -->|State & Mutators| I[Employees Directory]:::component
    G -->|State & Mutators| J[Leave Queue Page]:::component
    G -->|State & Mutators| K[Roles & Tasks Hub]:::component

    I -->|Set-based Cycle Tracker| L[Reporting Chain Tracker]:::component
    I -->|Tenure Calculation| M[Team Tenure Sorter]:::component
    I -->|Recursive Node Fallback| N[Org Chart Tree]:::component

    J -->|Strict FIFO + processedAt| O[Time-Off Requests Queue]:::component

    K -->|Round-Robin Auto Assign| P[HR Task Dispatcher]:::component
    K -->|Derived from active tasks| Q[HR Availability Board]:::component
    K -->|LIFO Stack pops| R[Salary History Undo]:::component
```

---

## ✨ Core Features

*   **📂 CSV-Driven Data Pipeline**: Fetches and parses 5 local CSV files asynchronously using `PapaParse` inside a custom hook, managing state atomically via `Promise.all`.
*   **🌳 Collapsible Org Chart Tree**: Recursively renders employee nodes based on `managerId`. If circular references occur, it gracefully renders warnings. If no roots are detected naturally, it falls back to the first employee as root.
*   **🔗 Reporting Chain Tracker**: Instantly builds the path of managers up to the CEO for any employee. Uses a `visited` Set to guarantee instant cycle detection.
*   **⚖️ LIFO Salary Rollback**: Tracks salary modifications chronologically, offering a global LIFO (Last-In-First-Out) stack Undo button to revert the latest change safely.
*   **⏱️ FIFO Leave Queue**: Enforces First-In-First-Out leave requests processing (only the front-of-queue item can be processed) and records the exact processing date (`processedAt`).
*   **📋 Round-Robin Task Assignor**: Assigns administrative tasks sequentially to available HR personnel, dynamically looking up employee names to keep data consistent.
*   **💎 Premium Aesthetics**: Styled with a dark-slate theme featuring responsive layouts, custom scrollable directory containers (no pagination), micro-animations, and status badges.

---

## 🚀 Getting Started

### Prerequisites

*   **Node.js** (v18 or higher recommended)
*   **npm** (or yarn)

### Installation

1.  Clone the repository and navigate to the project directory:
    ```bash
    git clone git@github.com:Samarth-ITM/HRpulse-Workspace.git
    cd HRpulse-Workspace
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

To start the Vite local development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Building for Production

To compile production assets into `/dist`:
```bash
npm run build
```
