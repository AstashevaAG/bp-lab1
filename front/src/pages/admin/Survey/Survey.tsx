import React, { useEffect, useState } from "react";
import { instance } from "@/api/axios";
import styles from './Survey.module.scss';

interface QuestionRatings {
  [key: string]: number;
}

interface CategoryData {
  q1: QuestionRatings;
  q2: QuestionRatings;
  q3: QuestionRatings;
  q4: QuestionRatings;
}

interface SurveyData {
  gender: {
    M: CategoryData;
    F: CategoryData;
  };
  cabinType: {
    Business: CategoryData;
    First: CategoryData;
    Economy: CategoryData;
  };
  departure: {
    [key: string]: CategoryData;
  };
  arrival: {
    [key: string]: CategoryData;
  };
  ageGroup: {
    [key: string]: CategoryData;
  };
  total: CategoryData;
}

const SurveyProgressBar: React.FC<{ data: number[] }> = ({ data }) => {
  const colors = [
    '#006400', '#00FF00', '#90EE90', 'yellow', 'orange', 'red', '#808080'
  ];

  const total = data.reduce((sum, value) => sum + value, 0);

  return (
    <div className={styles.progressBar}>
      {data.map((value, index) => (
        <div
          key={index}
          className={styles.progressSegment}
          style={{
            width: `${(value / total) * 100}%`,
            backgroundColor: colors[index],
          }}
        />
      ))}
    </div>
  );
};

const Survey: React.FC = () => {
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [filters, setFilters] = useState({
    ageGroups: [] as string[],
    gender: '',
    month: '',
    year: '',
  });

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const params = new URLSearchParams();
        filters.ageGroups.forEach(age => params.append('ageGroups', age));
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.month) params.append('month', filters.month);
        if (filters.year) params.append('year', filters.year);

        const response = await instance.get<SurveyData>("/survey/detailed-stats", { params });
        setSurveyData(response.data);
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    };

    fetchSurveyData();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'ageGroups') {
      const newAgeGroups = filters.ageGroups.includes(value)
        ? filters.ageGroups.filter(age => age !== value)
        : [...filters.ageGroups, value];
      setFilters(prev => ({ ...prev, ageGroups: newAgeGroups }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const questions = [
    "Please rate our aircraft flown on AMONIC Airlines",
    "How would you rate our flight attendants",
    "How would you rate our inflight entertainment",
    "Please rate the ticket price for the trip you are taking",
  ];

  const ratings = [
    "Outstanding", "Very Good", "Good", "Adequate", "Needs Improvement", "Poor", "Don't know"
  ];

  const headers = [
    "Question", "Total", "Male", "Female", "18-24", "25-39", "40-59", "60+",
    "Economy", "Business", "First", "AUH", "BAH", "DOH", "RUH", "CAI"
  ];

  if (!surveyData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.surveyContainer}>
      <h1>Survey Results</h1>
      <div className={styles.filters}>
        <div>
          <label>Age Groups:</label>
          {['18-24', '25-39', '40-59', '60+'].map(age => (
            <label key={age}>
              <input
                type="checkbox"
                name="ageGroups"
                value={age}
                checked={filters.ageGroups.includes(age)}
                onChange={handleFilterChange}
              />
              {age}
            </label>
          ))}
        </div>
        <div>
          <label>Gender:</label>
          <select name="gender" value={filters.gender} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
        <div>
          <label>Month:</label>
          <input
            type="number"
            name="month"
            min="1"
            max="12"
            value={filters.month}
            onChange={handleFilterChange}
          />
        </div>
        <div>
          <label>Year:</label>
          <input
            type="number"
            name="year"
            min="2000"
            max="2099"
            value={filters.year}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      
      <div className={styles.grid}>
        {headers.map(header => (
          <div key={header} className={styles.headerCell}>{header}</div>
        ))}
        {questions.flatMap((question, qIndex) => [
          <React.Fragment key={`question-${qIndex}`}>
            <div className={styles.questionCell}>
              {question}
              <SurveyProgressBar data={ratings.map((_, rIndex) => {
                const qKey = `q${qIndex + 1}` as keyof CategoryData;
                const rKey = `${rIndex + 1}`;
                return surveyData.total?.[qKey]?.[rKey] || 0;
              })} />
            </div>

          </React.Fragment>,
          ...ratings.map((rating, rIndex) => {
            const qKey = `q${qIndex + 1}` as keyof CategoryData;
            const rKey = `${rIndex + 1}`;
            return (
              <React.Fragment key={`${qIndex}-${rIndex}`}>
                <div className={styles.ratingCell}>{rating}</div>
                <div className={styles.dataCell}>{surveyData.total?.[qKey]?.[rKey] || 0}</div>
                <div className={styles.dataCell}>{surveyData.gender?.M?.[qKey]?.[rKey] || 0}</div>
                <div className={styles.dataCell}>{surveyData.gender?.F?.[qKey]?.[rKey] || 0}</div>
                <div className={styles.dataCell}>{surveyData.ageGroup?.["18-24"]?.[qKey]?.[rKey] || 0}</div>
                <div className={styles.dataCell}>{surveyData.ageGroup?.["25-39"]?.[qKey]?.[rKey] || 0}</div>
                <div className={styles.dataCell}>{surveyData.ageGroup?.["40-59"]?.[qKey]?.[rKey] || 0}</div>
                <div className={styles.dataCell}>{surveyData.ageGroup?.["60+"]?.[qKey]?.[rKey] || 0}</div>
                <div className={styles.dataCell}>{surveyData.cabinType?.Economy?.[qKey]?.[rKey] || 0}</div>
                <div className={styles.dataCell}>{surveyData.cabinType?.Business?.[qKey]?.[rKey] || 0}</div>
                <div className={styles.dataCell}>{surveyData.cabinType?.First?.[qKey]?.[rKey] || 0}</div>
                <div className={styles.dataCell}>{surveyData.arrival?.AUH?.[qKey]?.[rKey] || 0}</div>
                <div className={styles.dataCell}>{surveyData.arrival?.BAH?.[qKey]?.[rKey] || 0}</div>
                <div className={styles.dataCell}>{surveyData.arrival?.DOH?.[qKey]?.[rKey] || 0}</div>
                <div className={styles.dataCell}>{surveyData.arrival?.RUH?.[qKey]?.[rKey] || 0}</div>
                <div className={styles.dataCell}>{surveyData.arrival?.CAI?.[qKey]?.[rKey] || 0}</div>
              </React.Fragment>
            );
          })
        ])}
      </div>
    </div>
  );
};

export default Survey;