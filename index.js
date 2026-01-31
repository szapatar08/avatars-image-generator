const express = require("express");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");
const app = express();
const port = 9090;
const img = (
  name,
  lastname,
  background,
  size,
  fontSize,
  weight,
  color,
  fontFamily,
) => `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${background}" />
      <text
        x="50%"
        y="55%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="${fontSize}"
        font-family="${fontFamily}"
        fill="#${color}"
        font-weight="${weight}"
      >
        ${name}${lastname}
      </text>
    </svg>
  `;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Avatar image generator",
      version: "1.0.0",
      description: "Avatar generator according to the propeties provited",
      contact: {
        name: "Santiago Zapata",
        email: "dev.santizapata@gmail.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${port}/`,
      },
    ],
  },
  apis: ["./*.js"],
};

/**
 * @swagger
 * /api/avatar:
 *   get:
 *     summary: Generate an SVG avatar image
 *     description: |
 *       Generates a square SVG avatar using initials.
 *       If no values are provided, default initials and colors are used.
 *     tags:
 *       - Avatar
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           default: N
 *         description: First name. The first character is used as the first initial.
 *         example: John
 *
 *       - in: query
 *         name: lastname
 *         schema:
 *           type: string
 *           default: L
 *         description: Last name. The first character is used as the second initial.
 *         example: Doe
 *
 *       - in: query
 *         name: backgroundColor
 *         schema:
 *           type: string
 *           default: d9d9d9
 *           pattern: "^[0-9a-fA-F]{3,6}$"
 *         description: Background color in hex (without `#`).
 *         example: d9d9d9
 *
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *           default: 000 (black)
 *           pattern: "^[0-9a-fA-F]{3,6}$"
 *         description: Text color in hex (without `#`).
 *         example: 090909
 *
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           minimum: 16
 *           maximum: 512
 *           default: 100
 *         description: Width and height of the avatar in pixels.
 *
 *       - in: query
 *         name: fontSize
 *         schema:
 *           type: number
 *           minimum: 0.5
 *           maximum: 1.2
 *           default: 1
 *         description: Font size multiplier relative to the avatar size.
 *
 *       - in: query
 *         name: fontWeight
 *         schema:
 *           type: string
 *           default: normal
 *           enum: [normal, bold, bolder, lighter]
 *         description: Font weight of the initials.
 *
 *       - in: query
 *         name: fontFamily
 *         schema:
 *           type: string
 *           default: sans-serif
 *         description: Font family used for the initials.
 *
 *     responses:
 *       200:
 *         description: SVG avatar image
 *         content:
 *           image/svg+xml:
 *             schema:
 *               type: string
 *               format: binary
 */

const config = swaggerjsdoc(options);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(config));

app.get("/api/avatar", (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml");
  if (
    req.query.name ||
    req.query.lastname ||
    req.query.backgroundColor ||
    req.query.fontSize ||
    req.query.size ||
    req.query.fontWeight ||
    req.query.color ||
    req.query.fontFamily
  ) {
    const name = req.query.name
      ? Array.from(req.query.name)[0].toUpperCase()
      : "N";
    const lastname = req.query.lastname
      ? Array.from(req.query.lastname)[0].toUpperCase()
      : req.query.name
        ? Array.from(req.query.name)[1]
          ? Array.from(req.query.name)[1].toUpperCase()
          : "L"
        : "L";
    const background = req.query.backgroundColor
      ? req.query.backgroundColor
      : "d9d9d9";
    let fontSize = req.query.fontSize ? Number(req.query.fontSize) : 1;
    if (fontSize > 1.2 || fontSize < 0.5) {
      fontSize = 1;
    }
    const weight = req.query.fontWeight ? req.query.fontWeight : "normal";
    const color = req.query.color ? req.query.color : "000";
    const fontFamily = req.query.fontFamily
      ? req.query.fontFamily
      : "sans-serif";
    let size = req.query.size ? Number(req.query.size) : 100;
    if (size < 16 || size > 512) {
      size = 100;
    }
    res.send(
      img(
        name,
        lastname,
        background,
        size,
        size * fontSize * 0.64,
        weight,
        color,
        fontFamily,
      ),
    );
  } else {
    res.send(
      img("N", "L", "d9d9d9", "100", "64", "normal", "000", "sans-serif"),
    );
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`);
});
