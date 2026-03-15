import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[60vh] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to your Dashboard</h2>
      <p className="text-gray-500 text-center max-w-md">
        This is a placeholder dashboard. In upcoming days, we will integrate dynamic visualizations and resume uploading capabilities here.
      </p>
    </div>
  );
};

export default Dashboard;
