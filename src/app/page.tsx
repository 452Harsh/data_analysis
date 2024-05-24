'use client'
import React, { useEffect, useState } from 'react';
import { Data, JobTitleData, YearlySalaryData } from '../../types';
import { Table, TableColumnsType, ConfigProvider } from 'antd';
import { LineChart } from '@mui/x-charts/LineChart';

const Page = () => {
  const [data, setData] = useState<Data[]>([]);
  const [yearlySalaryData, setYearlySalaryData] = useState<YearlySalaryData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [jobTitleData, setJobTitleData] = useState<JobTitleData[]>([]);


  const fetchData = async () => {
    try {
      const res = await fetch('api/data');
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    const formattedData: YearlySalaryData[] = data.reduce((acc, curr) => {
      if (curr.work_year === 'work_year') {
        return acc;
      }
      const existingEntryIndex = acc.findIndex(entry => entry.year === curr.work_year);
      if (existingEntryIndex !== -1) {
        const existingEntry = acc[existingEntryIndex];
        existingEntry.totalJobs += 1;
        existingEntry.totalSalary += curr.salaries;
        existingEntry.averageSalary = existingEntry.totalSalary / existingEntry.totalJobs;
      } else {
        const newEntry: YearlySalaryData = {
          key: curr.work_year,
          year: curr.work_year,
          totalJobs: 1,
          totalSalary: curr.salaries,
          averageSalary: curr.salaries
        }
        acc.push(newEntry);
      }
      return acc;
    }, [] as YearlySalaryData[]);
    const sortedData = formattedData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    setYearlySalaryData(sortedData);
  }, [data]);

  const handleRowClick = (year: string) => {
    setSelectedYear(year);
    const filterData = data.filter(item => item.work_year === year);
    const jobTitleCounts = filterData.reduce((acc, curr) => {
      const existingEntry = acc.find(entry => entry.jobTitle === curr.job_title);
      if (existingEntry) {
        existingEntry.jobCount += 1;
      } else {
        acc.push({
          key: curr.job_title,
          jobTitle: curr.job_title,
          jobCount: 1
        });
      }
      return acc;
    }, [] as JobTitleData[])
    setJobTitleData(jobTitleCounts);
  }

  const columns: TableColumnsType<YearlySalaryData> = [
    {
      title: 'Year',
      dataIndex: 'year',
      sorter: (a, b) => parseInt(a.year) - parseInt(b.year),
    },
    {
      title: 'Number of total Jobs',
      dataIndex: 'totalJobs',
      sorter: (a, b) => a.totalJobs - b.totalJobs
    },
    {
      title: 'Average Salary',
      dataIndex: 'averageSalary',
      sorter: (a, b) => a.averageSalary - b.averageSalary,
      render: (value: number) => value.toFixed(0)
    }
  ];

  const jobTitleColumns: TableColumnsType = [
    {
      title: 'Job Title',
      dataIndex: 'jobTitle'
    },
    {
      title: 'Number of Jobs',
      dataIndex: 'jobCount',
      sorter: (a, b) => a.jobCount - b.jobCount,
    },
  ];

  const year = yearlySalaryData.map(item => parseInt(item.year));
  const job = yearlySalaryData.map(item => item.totalJobs);

  return (
    <div className='bg-gray-50'>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              fontFamily: 'Arial',
              borderColor: 'black',
            }
          },
        }}
      >
        <div className="container mx-auto p-8 ">
          <div className=''>
            <Table
              columns={columns}
              dataSource={yearlySalaryData}
              onRow={(record) => ({ onClick: () => handleRowClick(record.year) })}
              pagination={{ position: ['none', 'none'] }}
              title={() => <p className='text-center text-lg font-bold'>Number of total job per year</p>}
              bordered
              className="mb-8"
            />
          </div>
          {selectedYear && (
            <div className="mb-8">

              <Table
                columns={jobTitleColumns}
                dataSource={jobTitleData}
                title={() => <p className='text-center text-lg font-bold'>Job Titles in {selectedYear}</p>}
                bordered />
            </div>
          )}
          <div className="mb-8 \">
            <h2 className="text-xl font-semibold mb-4 text-center">Number of Jobs from 2020 to 2024</h2>
            <div className="border border-gray-300 rounded-md p-4 justify-center flex items-center">
              <LineChart
                xAxis={[{
                  data: year,
                }]}
                series={[{ data: job }]}
                width={400}
                height={400}
              />
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
}

export default Page;
