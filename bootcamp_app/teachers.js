const { Pool } = require('pg');
const cohortName = process.argv[2];

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'labber'
});

const queryString = `
SELECT teachers.name AS teacher, cohorts.name AS cohort, COUNT(*) AS total_assistances
FROM assistance_requests
JOIN teachers ON assistance_requests.teacher_id = teachers.id
JOIN students ON assistance_requests.student_id = students.id
JOIN cohorts ON students.cohort_id = cohorts.id
WHERE cohorts.name = $1
GROUP BY teachers.name, cohorts.name
ORDER BY teachers.name;
  `;

pool.query(queryString, [cohortName])
  .then(res => {
    if (res.rows.length > 0) {
      res.rows.forEach(teacher => {
        console.log(`${teacher.cohort}: ${teacher.teacher}`);
      });
    } else {
      console.log('No results found.');
    }
  })
  .catch(err => console.error('query error', err.stack));