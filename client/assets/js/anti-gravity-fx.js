/**
 * ANTI-GRAVITY 60 FPS COSMIC ENGINE
 * Handles Canvas Stars, Mouse Parallax, Floating Orbits & 3D Tilt Cards
 */

(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'anti-gravity-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    const count = Math.floor((width * height) / 9000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        color: Math.random() > 0.4 ? '#00f3ff' : (Math.random() > 0.5 ? '#8a2be2' : '#ffffff')
      });
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Mouse interpolation for smooth parallax
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    stars.forEach(star => {
      // Parallax movement based on mouse
      const offsetX = (mouse.x - width / 2) * (star.radius * 0.02);
      const offsetY = (mouse.y - height / 2) * (star.radius * 0.02);

      star.y -= star.speed;
      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.alpha * (0.6 + Math.sin(Date.now() * 0.002 + star.x) * 0.4);
      ctx.shadowBlur = star.radius * 4;
      ctx.shadowColor = star.color;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  window.addEventListener('resize', resize);
  resize();
  render();

  // 3D Tilt Effect on Floating Glass Cards
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.glass-panel');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardX = rect.left + rect.width / 2;
      const cardY = rect.top + rect.height / 2;

      const angleX = (e.clientY - cardY) / 35;
      const angleY = (cardX - e.clientX) / 35;

      if (
        e.clientX >= rect.left - 50 &&
        e.clientX <= rect.right + 50 &&
        e.clientY >= rect.top - 50 &&
        e.clientY <= rect.bottom + 50
      ) {
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-4px)`;
      } else {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      }
    });
  });
})();
