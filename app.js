import difficulyDefaults from "./config/difficulyDefaults.mjs";
import difficultyDefaults from "./config/difficulyDefaults.mjs";

const app = Vue.createApp({
  data() {
    return {
      started: false,
      ended: false,
      isPaused: false,
      recentlyPaused: false,
      startDisabled: false,
      numberOfSquares: 5,
      timeToKill: 5,
      numberOfLifes: 20,
      lifesRemaining: 0,
      minimunTimeToRespawn: 0,
      squares: [],
      score: 0,
      difficulty: "medium",
    };
  },
  watch: {
    started(hasStarted) {
      if (hasStarted) {
        this.lifesRemaining = this.numberOfLifes;

        for (let i = 0; i < this.numberOfSquares; i++) {
          this.squares.push({
            hasMonster: false,
            spawning: false,
            timeRemaining: this.timeToKill,
            countdown: null,
          });
        }
      }
    },
    squares: {
      deep: true,
      handler(newSquares) {
        if (this.ended || !this.started || this.isPaused) {
          return;
        }

        if (this.lifesRemaining <= 0) {
          alertify.error("You lost");
          this.endGame();

          return;
        }

        for (const [i, s] of newSquares.entries()) {
          if (!s.hasMonster && !s.spawning) {
            this.spawnMonster(i);
          } else if (s.hasMonster && s.timeRemaining <= 0) {
            this.squares[i].hasMonster = false;
            this.squares[i].timeRemaining = this.timeToKill;
            this.lifesRemaining--;
          }
        }
      },
    },
    difficulty(difficulty) {
      this.numberOfSquares = difficultyDefaults.defaults[difficulty].numberOfSquares;
      this.timeToKill = difficultyDefaults.defaults[difficulty].timeToKill;
      this.minimunTimeToRespawn = difficultyDefaults.defaults[difficulty].minimunTimeToRespawn;
      this.numberOfLifes = difficultyDefaults.defaults[difficulty].numberOfLifes;
    },
  },
  computed: {
    starColor() {
      if (this.score > 200) {
        return "#1c7ed6";
      } else if (this.score > 100) {
        return "#51cf66";
      } else if (this.score > 50) {
        return "#fcc419";
      } else {
        return "#fff";
      }
    },
    pauseState() {
      if (this.isPaused) {
        return "Resume";
      } else {
        return "Pause";
      }
    },
    squareWidth() {
      return difficulyDefaults.squareWidths[this.difficulty];
    },
    minSquares() {
      return difficultyDefaults.minSquares[this.difficulty];
    },
    maxTimeToRespawn() {
      return difficultyDefaults.maxTimeToRespawn[this.difficulty];
    },
    maxTimeToKill() {
      return difficultyDefaults.maxTimeToKill[this.difficulty];
    },
  },
  methods: {
    start() {
      if (!this.numberOfSquares || !this.timeToKill) {
        alertify.error("You need to fill in the amount of squares and the time to kill");
        return;
      }

      this.startDisabled = true;

      let timer;
      let countdown = 2;

      timer = setInterval(() => {
        if (countdown <= 0) {
          clearInterval(timer);
          this.started = true;
          return;
        }

        alertify.success(`The game will start in ${countdown}s`);
        countdown--;
      }, 1000);
    },
    spawnMonster(index, unPaused = false) {
      this.squares[index].spawning = true;
      let spawnTime = Math.floor((Math.random() * 5 + this.minimunTimeToRespawn) * 1000);

      if (unPaused && this.squares[index].hasMonster) {
        spawnTime = 0;
      }

      this.squares[index].spawner = setTimeout(() => {
        this.squares[index].hasMonster = true;
        this.squares[index].spawning = false;
        this.squares[index].timeRemaining = unPaused ? this.squares[index].timeRemaining : this.timeToKill;
        clearInterval(this.squares[index].countdown);

        this.squares[index].countdown = setInterval(() => {
          this.squares[index].timeRemaining--;
        }, 1000);
      }, spawnTime);
    },
    killMonster(index) {
      if (this.isPaused) {
        return;
      }

      if (!this.squares[index].hasMonster) {
        this.lifesRemaining--;
        alertify.error("No monster");
      }

      this.score++;
      this.squares[index].hasMonster = false;
    },
    endGame() {
      this.ended = true;
      this.started = false;

      for (let i = 0; i < this.squares.length; i++) {
        clearInterval(this.squares[i].countdown);
        clearTimeout(this.squares[i].spawner);
      }
    },
    restart() {
      this.started = false;
      this.ended = false;
      this.startDisabled = false;
      this.score = 0;

      for (let i = 0; i < this.squares.length; i++) {
        clearInterval(this.squares[i].countdown);
        clearTimeout(this.squares[i].spawner);
      }

      this.squares = [];
    },
    togglePause() {
      for (let i = 0; i < this.squares.length; i++) {
        if (!this.isPaused) {
          clearInterval(this.squares[i].countdown);
          clearTimeout(this.squares[i].spawner);
        } else {
          this.spawnMonster(i, true);
        }
      }

      this.isPaused = !this.isPaused;
    },
    wrongClick(event) {
      if (this.isPaused) {
        return;
      }

      if (!event.target.classList.contains("square")) {
        this.lifesRemaining--;
      }
    },
  },
});

app.mount("#app");
