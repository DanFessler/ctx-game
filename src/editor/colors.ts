const colors = {
  light: {
    headers: "rgb(236, 239, 242)",
    content: "rgb(196, 203, 209)",
    selected: "rgb(66,137,204)",
    background: "rgb(197, 204, 212)",
    document: "rgb(136, 142, 152)",
    border: "rgba(0,0,0,0.1)",
    text: "rgb(63, 63, 63)",
    gap: "rgb(133, 140, 151)",
    input: "rgb(255,255,255)",
    inputText: "rgb(0,0,0)",
  },
  mid: {
    headers: "rgb(70,70,70)",
    content: "rgb(64,64,64)",
    selected: "rgb(46,104,162)",
    background: "rgb(51, 51, 51)",
    document: "rgb(32,32,32)",
    border: "rgba(0,0,0,0.125)",
    text: "rgb(255, 255, 255)",
    gap: "rgb(32, 32, 32)",
    input: "rgba(0,0,0,0.2)",
    inputText: "rgb(255,255,255)",
  },
  dark: {
    headers: "rgb(54, 57, 61)",
    content: "rgb(34, 36, 38)",
    selected: "rgb(46,104,162)",
    background: "rgb(40, 43, 47)",
    document: "rgb(13, 13, 14)",
    border: "rgba(0, 0, 0, 0.15)",
    text: "rgb(255, 255, 255)",
    gap: "rgb(24, 24, 26)",
    input: "rgba(0,0,0,0.2)",
    inputText: "rgb(255,255,255)",
  },
};

const currentTheme = colors.light;

// Set CSS variables on body for current theme
Object.entries(currentTheme).forEach(([key, value]) => {
  document.body.style.setProperty(`--${key}`, value);
});

export default currentTheme;
