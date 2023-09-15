const months = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const getDayMonthYear = ( dateString ) => {
  const date = new Date(dateString);
  return {
    day: date.getDate(),
    month: months[date.getMonth()],
    yearDay: `${ date.getFullYear() }, ${ days[ date.getDay() ]}`,
  };
};

export default getDayMonthYear;