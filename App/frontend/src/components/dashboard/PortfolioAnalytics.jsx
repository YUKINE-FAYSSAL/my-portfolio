import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

const PortfolioAnalytics = ({ theme, stats }) => {
  // Default empty data structure
  const defaultSkills = {
    labels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: [
        theme === 'dark' ? '#3b82f6' : '#93c5fd',
        theme === 'dark' ? '#a855f7' : '#d8b4fe',
        theme === 'dark' ? '#10b981' : '#6ee7b7',
        theme === 'dark' ? '#f59e0b' : '#fcd34d'
      ],
      borderColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
      borderWidth: 1
    }]
  };

  const defaultProjects = {
    labels: ['Web Apps', 'Mobile Apps', 'APIs', 'Designs', 'Others'],
    datasets: [{
      label: 'Projects',
      data: [0, 0, 0, 0, 0],
      backgroundColor: theme === 'dark' ? '#4f46e5' : '#818cf8',
      borderColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
      borderWidth: 1
    }]
  };

  // Skill levels data
  const skillLevelsData = stats.skills?.length ? {
    ...defaultSkills,
    datasets: [{
      ...defaultSkills.datasets[0],
      data: [
        stats.skills.filter(s => s.level === 'Beginner').length,
        stats.skills.filter(s => s.level === 'Intermediate').length,
        stats.skills.filter(s => s.level === 'Advanced').length,
        stats.skills.filter(s => s.level === 'Expert').length
      ]
    }]
  } : defaultSkills;

  // Projects by type data
  const projectsData = stats.projects?.length ? {
    ...defaultProjects,
    datasets: [{
      ...defaultProjects.datasets[0],
      data: [
        stats.projects.filter(p => p.type === 'web').length,
        stats.projects.filter(p => p.type === 'mobile').length,
        stats.projects.filter(p => p.type === 'api').length,
        stats.projects.filter(p => p.type === 'design').length,
        stats.projects.filter(p => !p.type || !['web', 'mobile', 'api', 'design'].includes(p.type)).length
      ]
    }]
  } : defaultProjects;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Skills Distribution</h3>
        <div className="h-64">
          <Pie 
            data={skillLevelsData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    color: theme === 'dark' ? '#e5e7eb' : '#374151'
                  }
                }
              }
            }}
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Projects by Type</h3>
        <div className="h-64">
          <Bar 
            data={projectsData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: theme === 'dark' ? '#e5e7eb' : '#374151'
                  },
                  grid: {
                    color: theme === 'dark' ? '#374151' : '#e5e7eb'
                  }
                },
                x: {
                  ticks: {
                    color: theme === 'dark' ? '#e5e7eb' : '#374151'
                  },
                  grid: {
                    color: theme === 'dark' ? '#374151' : '#e5e7eb'
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;