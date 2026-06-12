export const employeesCsv = `id,name,department,managerId,role,salary,joinDate
1,John,Engineering,5,Developer,80000,2020-01-15
2,Sarah,HR,6,HR Executive,60000,2021-02-10
3,David,Engineering,5,Developer,85000,2019-08-12
4,Alice,Management,,CEO,150000,2015-05-10
5,Marcus,Engineering,4,Engineering Manager,110000,2017-03-22
6,Olivia,HR,4,HR Manager,95000,2018-06-15
7,Diana,Finance,4,Finance Manager,100000,2016-11-01
8,Emily,Engineering,5,QA Engineer,70000,2021-09-01
9,Michael,Engineering,5,Devops Specialist,90000,2018-04-12
10,Sophia,HR,6,Recruiter,58000,2022-01-10
11,Liam,Finance,7,Accountant,65000,2020-07-15
12,Noah,Finance,7,Financial Analyst,72000,2019-11-20
13,Emma,Marketing,4,Marketing Specialist,62000,2021-03-14
14,Lucas,Marketing,13,Content Writer,50000,2022-05-05
15,Ava,Marketing,13,Graphic Designer,55000,2022-06-10
16,William,Engineering,1,Junior Developer,55000,2023-01-15
17,James,Engineering,1,Junior Developer,57000,2023-02-20
18,Benjamin,Engineering,3,Junior Developer,56000,2023-04-10
19,Isabella,HR,2,HR Coordinator,52000,2022-08-12
20,Mia,Finance,11,Junior Accountant,48000,2023-09-01
21,Charlotte,Engineering,5,Technical Lead,105000,2018-01-10
22,Henry,Engineering,21,Senior Developer,95000,2019-05-18
23,Alexander,Engineering,21,Senior Developer,98000,2019-10-22
24,Sebastian,Engineering,22,Intern,30000,2024-01-08
25,Zoe,Marketing,13,Social Media Manager,53000,2022-10-01
26,Daniel,Engineering,23,Intern,30000,2024-03-11
27,Evelyn,HR,6,HR Specialist,67000,2020-04-05
28,Harper,Operations,4,Operations Lead,85000,2017-09-15
29,Logan,Operations,28,Operations Assistant,52000,2021-11-10
30,Gabriel,Operations,28,Logistics Coordinator,58000,2020-10-01`;

export const leaveRequestsCsv = `id,employeeId,type,status,submittedAt
1,3,Vacation,Pending,2025-01-05
2,1,Sick,Approved,2025-01-06
3,16,Personal,Pending,2025-01-07
4,2,Maternity,Pending,2025-01-08
5,12,Vacation,Approved,2025-01-09
6,24,Sick,Pending,2025-01-10`;

export const salaryHistoryCsv = `id,employeeId,oldSalary,newSalary,date
1,3,80000,85000,2025-01-10
2,1,75000,80000,2024-12-15
3,9,85000,90000,2024-11-20
4,21,100000,105000,2025-01-02`;

export const rolesCsv = `role,permissions
HR,editEmployees,assignTasks,manageLeaves
Manager,approveLeave,viewReportingChain
Employee,viewProfile,requestLeave`;
