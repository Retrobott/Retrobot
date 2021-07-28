const Canvas = require("canvas");

// Register Bold font
Canvas.registerFont(`${__dirname}/theboldfont.ttf`, { family: "Bold" });
// Register SketchMatch font
Canvas.registerFont(`${__dirname}/SketchMatch.ttf`, { family: "SketchMatch" });

module.exports = {
    Base: require(`${__dirname}/classes/Base.js`),
    Welcome: require(`${__dirname}/classes/Welcome.js`)
};