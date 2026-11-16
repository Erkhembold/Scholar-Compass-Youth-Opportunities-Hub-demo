// IELTS Academic Writing practice prompts — original prompts and data, not
// reproduced from any real IELTS paper.
//
// type "task2": opinion/discussion essay (250+ words, 40 min).
// type "task1": describe data (150+ words, 20 min). In the real exam Task 1
// shows a chart/graph/table; here the data is given as a table so the AI
// evaluator can check every number the student reports (see dataTable).
// Task ids are stored with every saved assessment — never rename them.

export const WRITING_TASKS = [
  // ---- Task 2 ----
  {
    id: "writing-task-1",
    title: "Technology and Face-to-Face Communication",
    kind: "Opinion",
    prompt:
      "Some people believe that modern technology has made face-to-face communication between people less important than before. To what extent do you agree or disagree?",
    minWords: 250,
    type: "task2",
    suggestedMinutes: 40,
  },
  {
    id: "writing-task-2",
    title: "Studying Abroad",
    kind: "Discussion",
    prompt:
      "Some students choose to study entirely in their home country, while others choose to study abroad. Discuss both approaches and give your own opinion.",
    minWords: 250,
    type: "task2",
    suggestedMinutes: 40,
  },
  {
    id: "writing-task-3",
    title: "Traffic Congestion in Cities",
    kind: "Problem/Solution",
    prompt:
      "Traffic congestion is an increasing problem in many major cities around the world. What are the causes of this problem, and what measures could be taken to solve it?",
    minWords: 250,
    type: "task2",
    suggestedMinutes: 40,
  },
  {
    id: "writing-task-4",
    title: "Social Media and Young People",
    kind: "Advantages/Disadvantages",
    prompt:
      "Social media platforms have become a central part of daily life for many young people. Do the advantages of this outweigh the disadvantages?",
    minWords: 250,
    type: "task2",
    suggestedMinutes: 40,
  },
  {
    id: "writing-task-5",
    title: "Standardised Testing in Education",
    kind: "Opinion",
    prompt:
      "Some people think that standardised exams are the fairest way to assess a student's ability, while others believe they only measure how well a student can memorise information. Discuss both views and give your own opinion.",
    minWords: 250,
    type: "task2",
    suggestedMinutes: 40,
  },

  // ---- Task 1 (data description) ----
  {
    id: "writing-task1-libraries",
    type: "task1",
    title: "Weekly Visits to Three Libraries",
    kind: "Table",
    prompt:
      "The table shows the average number of weekly visits (in thousands) to three public libraries in one city in four different years. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    dataTable: {
      caption: "Average weekly visits to public libraries (thousands)",
      columns: ["Year", "Central", "Riverside", "Hillcrest"],
      rows: [
        ["2015", "12.4", "8.1", "5.2"],
        ["2018", "11.0", "9.6", "6.8"],
        ["2021", "7.5", "10.9", "9.4"],
        ["2024", "6.2", "12.3", "11.7"],
      ],
    },
    minWords: 150,
    suggestedMinutes: 20,
  },
  {
    id: "writing-task1-internet",
    type: "task1",
    title: "Household Internet Access by Region",
    kind: "Table",
    prompt:
      "The table shows the percentage of households with internet access in four regions of one country in 2010 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    dataTable: {
      caption: "Households with internet access (%)",
      columns: ["Region", "2010", "2020"],
      rows: [
        ["North", "42", "88"],
        ["South", "55", "93"],
        ["East", "31", "79"],
        ["West", "63", "96"],
      ],
    },
    minWords: 150,
    suggestedMinutes: 20,
  },
  {
    id: "writing-task1-budget",
    type: "task1",
    title: "How Students Spend Their Monthly Budget",
    kind: "Table",
    prompt:
      "The table shows how a typical university student spent their monthly budget in 2010 and in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    dataTable: {
      caption: "Share of monthly student budget (%)",
      columns: ["Category", "2010", "2023"],
      rows: [
        ["Housing", "35", "41"],
        ["Food", "25", "22"],
        ["Transport", "12", "9"],
        ["Study materials", "10", "6"],
        ["Entertainment", "8", "12"],
        ["Other", "10", "10"],
      ],
    },
    minWords: 150,
    suggestedMinutes: 20,
  },
  {
    id: "writing-task1-teen-hours",
    type: "task1",
    title: "Teenagers' Daily Activities in Three Countries",
    kind: "Table",
    prompt:
      "The table shows the average number of hours per day that teenagers in three countries spend on selected activities. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    dataTable: {
      caption: "Average hours per day, teenagers aged 15–17 (selected activities only)",
      columns: ["Activity", "Country A", "Country B", "Country C"],
      rows: [
        ["Sleeping", "8.1", "8.6", "7.4"],
        ["School and homework", "7.2", "5.9", "8.8"],
        ["Screen leisure", "2.9", "3.8", "2.3"],
        ["Sport and exercise", "0.8", "1.2", "0.5"],
        ["Socialising", "1.6", "2.0", "1.1"],
      ],
    },
    minWords: 150,
    suggestedMinutes: 20,
  },
];

export function taskDataToText(task) {
  const t = task.dataTable;
  if (!t) return null;
  return [t.caption, t.columns.join(" | "), ...t.rows.map((r) => r.join(" | "))].join("\n");
}

export const TASK_TYPE_LABEL = { task1: "Task 1", task2: "Task 2" };
