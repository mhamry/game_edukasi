const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var canvasW = canvas.width;
var canvasH = canvas.height;

const drawStar = (cx, cy, spikes, outerRadius, innerRadius, fillColor, strokeColor) => {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.lineWidth = 3;
  ctx.strokeStyle = strokeColor;
  ctx.fill();
  // ctx.stroke();
};

// Fungsi untuk menghasilkan warna acak
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Menggambar banyak bintang dengan loop
let stars = [];
for (let i = 0; i < 100; i++) {
  // Posisi acak
  let x = Math.random() * canvasW;
  let y = Math.random() * canvasH;

  // kecepatan animasi
  let speedX = (Math.random() - 0.5) * 2;
  let speedY = (Math.random() - 0.5) * 2;

  // Ukuran acak
  let innerRadius = Math.random() * 4 + 2;
  let outerRadius = innerRadius + Math.random() * 10;

  // Warna acak
  let fillColor = getRandomColor();
  let strokeColor = getRandomColor();

  // Menyimpan data bintang
  stars.push({ x, y, innerRadius, outerRadius, speedX, speedY, fillColor, strokeColor });
}

// Fungsi untuk animasi
function animate() {
  ctx.clearRect(0, 0, canvasW, canvasH);

  stars.forEach((star) => {
    drawStar(star.x, star.y, 5, star.outerRadius, star.innerRadius, star.fillColor, star.strokeColor);

    star.x += star.speedX;
    star.y += star.speedY;

    if (star.x > canvasW || star.x < 0) {
      star.speedX = -star.speedX;
    }
    if (star.y > canvasH || star.y < 0) {
      star.speedY = -star.speedY;
    }
  });

  requestAnimationFrame(animate);
}

animate();

//batas

const soundBenar = document.querySelector(".sound-benar");
const soundSalah = document.querySelector(".sound-salah");
const congratulation = document.querySelector(".congratulation");
const backsound = document.querySelector(".backsound");
const scoreContainer = document.querySelector(".score-container");

let userScore = 0;
function updateScore(points) {
  userScore += points;

  const scoreElement = document.querySelector(".user-score");
  scoreElement.textContent = userScore;
}

function checkFinalScore() {
  if (userScore >= 1850) {
    setTimeout(function () {
      window.location.href = "end.html";
    }, 2000);
  } else {
    window.location.href = "gagal.html";
  }
}

document.querySelectorAll(".game").forEach(function (game, index, games) {
  const jawaban = game.querySelector(".jawaban");
  const choices = game.querySelectorAll(".choice");
  const text = game.querySelector(".text");
  const image = game.querySelector(".image");
  const alertSalah = game.querySelector(".alert-salah");
  const alertBetul = game.querySelector(".alert-betul");
  const pesanAlertSalah = game.dataset.alert;

  if (index !== 0) {
    game.style.transform = "translateX(-400%)";
  }

  const showNextGame = () => {
    // saveGame(index + 1); // Simpan level terakhir yang dicapai
    setTimeout(function () {
      if (index + 1 < games.length) {
        games[index + 1].style.transform = "translateX(0)";
      } else {
        checkFinalScore();
      }
    }, 2000);
  };

  const hideCurrentGame = () => {
    setTimeout(function () {
      game.style.transform = "translateX(400%)";
    }, 2000);
    setTimeout(function () {
      game.style.display = "none";
    }, 2500);
  };

  choices.forEach(function (choice) {
    soundBenar.pause();
    soundSalah.pause();
    backsound.pause();

    choice.addEventListener("click", function () {
      if (jawaban.textContent === choice.textContent) {
        text.style.transform = "translateY(-100px)";
        image.style.transform = "translateY(100px)";
        alertBetul.style.display = "block";
        soundBenar.play();
        backsound.play();
        backsound.volume = 0.4;
        updateScore(100);

        scoreContainer.classList.add("shake");
        scoreContainer.style.backgroundColor = "yellowgreen";

        setTimeout(function () {
          scoreContainer.style.backgroundColor = "white";
        }, 2000);

        setTimeout(function () {
          text.style.transform = "translateY(0)";
          image.style.transform = "translateY(0)";
        }, 2000);

        setTimeout(function () {
          alertBetul.style.display = "none";
          hideCurrentGame();
          showNextGame();
        }, 3000);
      } else {
        text.style.transform = "translateY(-100px)";
        image.style.transform = "translateY(100px)";
        alertSalah.style.display = "block";
        soundSalah.play();
        backsound.play();
        backsound.volume = 0.4;
        updateScore(-50);

        scoreContainer.classList.add("shake");
        scoreContainer.style.backgroundColor = "red";

        setTimeout(function () {
          scoreContainer.style.backgroundColor = "white";
        }, 2000);

        setTimeout(function () {
          alert(pesanAlertSalah);

          text.style.transform = "translateY(0)";
          image.style.transform = "translateY(0)";
        }, 2000);

        setTimeout(function () {
          hideCurrentGame();
          showNextGame();
        }, 3200);
      }
    });
  });
});

const petunjuk = document.querySelector(".petunjuk");
petunjuk.addEventListener("click", function () {
  alert("Pada Level ini Kamu memilih salah satu jawaban yang kamu anggap  benar!! Dengan cara meng klik salah satu jawaban.");
});
