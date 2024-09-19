// components/JobCard.js
import React from 'react';

const JobCard = ({ job }) => {
  return (
    <div style={styles.card}>
      <h3>Skills you need</h3>
      <ul>
        {job.skills.map(skill => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
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