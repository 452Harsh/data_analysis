export type Data = {
  work_year: string;
  job_title: string;
  salaries: number;
};
export type YearlySalaryData = {
  key: string;
  year: string;
  totalJobs: number;
  totalSalary: number;
  averageSalary: number;
};

export type JobTitleData = {
  key: string;
  jobTitle: string;
  jobCount: number;
};
