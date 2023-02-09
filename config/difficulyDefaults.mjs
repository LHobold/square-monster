export default {
  defaults: {
    easy: {
      numberOfSquares: 5,
      timeToKill: 5,
      minimunTimeToRespawn: 3,
      numberOfLifes: 20,
    },
    medium: {
      numberOfSquares: 7,
      timeToKill: 5,
      minimunTimeToRespawn: 3,
      numberOfLifes: 20,
    },
    hard: {
      numberOfSquares: 10,
      timeToKill: 2,
      minimunTimeToRespawn: 1,
      numberOfLifes: 20,
    },
    impossible: {
      numberOfSquares: 15,
      timeToKill: 2,
      minimunTimeToRespawn: 1,
      numberOfLifes: 10,
    },
  },
  squareWidths: {
    easy: 250,
    medium: 150,
    hard: 75,
    impossible: 30,
  },
  minSquares: {
    easy: 1,
    medium: 7,
    hard: 10,
    impossible: 15,
  },
  maxTimeToRespawn: {
    easy: 15,
    medium: 5,
    hard: 2,
    impossible: 1,
  },
  maxTimeToKill: {
    easy: 10,
    medium: 5,
    hard: 3,
    impossible: 2,
  },
};
