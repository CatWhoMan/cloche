const title = document.getElementById('title');
const poem = document.getElementById('poem');
const bellSounds = [
  document.getElementById('bell1'),
  document.getElementById('bell2'),
  document.getElementById('bell3')
];
const bruitBlanc = document.getElementById('bruitBlanc');

// On démarre le bruit blanc au chargement de la page
window.addEventListener('load', () => {
  bruitBlanc.volume = 0.5; // volume initial doux
  bruitBlanc.play().catch(() => {
    // certains navigateurs bloquent l'autoplay, donc on demande à l'utilisateur un clic
    title.addEventListener('click', () => {
      bruitBlanc.play();
    }, { once: true });
  });
});

title.addEventListener('click', () => {
  // Réinitialisation avant chaque clic
  const lines = poem.querySelectorAll('p');
  lines.forEach(line => {
    line.classList.remove('float-away');
    line.style.opacity = 0;
    line.style.transform = 'translateY(10px)';
  });
  poem.classList.remove('show', 'fade-out', 'hidden');

  // Choisir un son de cloche aléatoirement
  const randomBell = bellSounds[Math.floor(Math.random() * bellSounds.length)];

  // Arrêter toutes les cloches au cas où
  bellSounds.forEach(sound => {
    sound.pause();
    sound.currentTime = 0;
  });

  // Faire apparaître le poème
  poem.classList.add('show');
  lines.forEach((line, i) => {
    setTimeout(() => {
      line.style.opacity = 1;
      line.style.transform = 'translateY(0)';
    }, i * 400);
  });

  // Adoucir le volume du bruit blanc avant la cloche
  fadeVolume(bruitBlanc, 0.15, 1000); // baisse en 1 seconde

  // Jouer le son de cloche
  randomBell.volume = 1;
  randomBell.play();

  randomBell.onended = () => {
    // Quand le son de cloche se termine, on remonte le volume du bruit blanc
    fadeVolume(bruitBlanc, 0.5, 2000);

    // Chaque ligne flotte vers l'espace
    lines.forEach((line, i) => {
      setTimeout(() => {
        line.classList.add('float-away');
      }, i * 600);
    });

    // Une fois l'animation terminée, on "nettoie" la scène
    const totalFloatTime = lines.length * 600 + 6000; // temps total estimé
    setTimeout(() => {
      poem.classList.remove('show');
      poem.classList.add('hidden');

      // Réinitialiser les lignes pour permettre une nouvelle apparition
      lines.forEach(line => {
        line.classList.remove('float-away');
        line.style.opacity = 0;
        line.style.transform = 'translateY(10px)';
      });
    }, totalFloatTime);
  };
});

/**
 * Fonction utilitaire : transition douce du volume
 * @param {HTMLAudioElement} audio - l’audio à modifier
 * @param {number} targetVolume - le volume final
 * @param {number} duration - durée en ms
 */
function fadeVolume(audio, targetVolume, duration) {
  const startVolume = audio.volume;
  const steps = 30;
  const stepTime = duration / steps;
  const volumeStep = (targetVolume - startVolume) / steps;

  let currentStep = 0;
  const fadeInterval = setInterval(() => {
    currentStep++;
    audio.volume = Math.min(1, Math.max(0, startVolume + volumeStep * currentStep));
    if (currentStep >= steps) clearInterval(fadeInterval);
  }, stepTime);
}
