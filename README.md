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

    A[public/employees.csv]
    B[public/leaveRequests.csv]
    C[public/salaryHistory.csv]
    D[public/roles.csv]
    E[public/tasks.csv]
    F[useCsvData.js Hook]
    G[App.jsx Central Controller]
    H[Dashboard Page]
    I[Employees Directory]
    J[Leave Queue Page]
    K[Roles & Tasks Hub]
    L[Reporting Chain Tracker]
    M[Team Tenure Sorter]
    N[Org Chart Tree]
    O[Time-Off Requests Queue]
    P[HR Task Dispatcher]
    Q[HR Availability Board]
    R[Salary History Undo]

    class A,B,C,D,E file;
    class F hook;
    class G controller;
    class H,I,J,K,L,M,N,O,P,Q,R component;

    A -->|Fetch & Parse| F
    B -->|Fetch & Parse| F
    C -->|Fetch & Parse| F
    D -->|Fetch & Parse| F
    E -->|Fetch & Parse| F

    F -->|Promise.all Atomicity| G

    G -->|State & Mutators| H
    G -->|State & Mutators| I
    G -->|State & Mutators| J
    G -->|State & Mutators| K

    I -->|Set-based Cycle Tracker| L
    I -->|Tenure Calculation| M
    I -->|Recursive Node Fallback| N

    J -->|Strict FIFO + processedAt| O

    K -->|Round-Robin Auto Assign| P
    K -->|Derived from active tasks| Q
    K -->|LIFO Stack pops| R
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
