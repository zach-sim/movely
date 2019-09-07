import tripData from './2013.json';

const startTime = 7.5 * 60 * 60; // 7:30 in seconds
const endTime = 9 * 60 * 60; // 9:00 in seconds

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
const repeat = x => f => { // repeat(5)(() => console.log('test'));
  if (x > 0) {
    f()
    repeat (x - 1) (f)
  }
}
const getRandomArrivalTime = () => getRandomIntInclusive(startTime, endTime);

const output = {}
Object.keys(tripData).map(type => {
  output[type] = [];

  tripData[type].forEach(row => {
    const maxDuration = row.timestamps[row.timestamps.length - 1];
    repeat(row.multiply)(() => {
      const arrivalTime = getRandomArrivalTime();
      const departureTime = arrivalTime - maxDuration;

      output[type].push({
        path: row.path,
        timestamps: row.timestamps.map(t => departureTime + t),
      });
    });
  });
});
export default output;
