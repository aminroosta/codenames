export const shuffleArray = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const generateCards = () => {
  const colors = [
    "black",
    "blue", "blue", "blue", "blue", "blue", "blue", "blue",
    "neutral", "neutral", "neutral", "neutral",
    "red", "red", "red", "red", "red", "red", "red", "red",
  ];
  shuffleArray(colors);

  const cards = [];
  for (let i = 0; i < colors.length; i++) {
    const idx = Math.floor(Math.random() * (279 - 0 + 1)) + 0;
    const image = `card-${idx}.jpg`;
    cards.push({ image, color: colors[i] as "black" | "blue" | "neutral" | "red" });
  }

  return cards;
};

