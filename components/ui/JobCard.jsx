// components/JobCard.js
import React from 'react';

const JobCard = ({ job }) => {
  return (
    <div style={styles.card}>
      <h2>{job.title}</h2>
      <p><strong>Company:</strong> {job.company_name}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Posted At:</strong> {job.posted_at}</p>
      <p><strong>Schedule Type:</strong> {job.schedule_type}</p>
      <p><strong>Paid Time Off:</strong> {job.paid_time_off ? 'Yes' : 'No'}</p>
      <p>{job.description}</p>
      <a href={job.link} target="_blank" rel="noopener noreferrer">Apply Here</a>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default JobCard;