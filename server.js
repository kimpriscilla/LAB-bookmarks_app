const {
  db,
  syncAndSeed,
  models: { Bookmark },
} = require("./db");

const express = require("express");
const app = express();
const path = require("path");

app.get("/", (req, res) => res.redirect("/bookmarks"));
app.get("/styles.css", (req, res) =>
  res.sendFile(path.join(__dirname, "styles.css"))
);
app.use(require("method-override")("_method"));
app.use(express.urlencoded({ extended: false })); //!post routes & urlencoded go together

app.post("/bookmarks", async (req, res, next) => {
  try {
    const bookmark = await Bookmark.create(req.body);
    res.redirect(`/bookmarks/${bookmark.category}`);
  } catch (error) {
    next(error);
  }
});

app.delete("/bookmarks/:id", async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findByPk(req.params.id);
    await bookmark.destroy();
    res.redirect(`/bookmarks/${bookmark.id}`);
  } catch (error) {
    next(error);
  }
});

app.get("/bookmarks", async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.findAll();
    const grouped = bookmarks.reduce((acc, bookmark) => {
      console.log("this is the data------", acc);
      const category = bookmark.category;
      acc[category] = acc[category] || [];
      acc[category].push(bookmark);
      //console.log("this is the data------", acc);
      return acc;
    }, {});
    const entries = Object.entries(grouped);

    res.send(
      `    <html>
            <head>
              <link rel="stylesheet" href="/styles.css" />
            </head>
            <body>
              <h1> BOOKMARKERS </h1>
              <form method = 'POST' action ='/bookmarks'>
                <input name='name' placeholder ='Enter site name'/>
                <input name='url' placeholder = 'Enter site url'/>
                <input name ='category' placeholder ='Enter category'/>
                <button> Save </button>
              </form>
              <h2> Categories: </h2>
              <ul>
               ${entries
                 .map((entry) => {
                   const category = entry[0]; // !data now looks like [category:[{data}]]
                   const count = entry[1].length;
                   return ` <li>
                   <a href = '/bookmarks/${category}'>
                  ${category} (${count})
                  </a>
                </li>`;
                 })
                 .join("")}
              </ul>
            </body>
          </html>`
    );
  } catch (error) {
    next(error);
  }
});

app.get("/bookmarks/:category", async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.findAll({
      where: { category: req.params.category },
    });
    res.send(
      ` <html>
            <head>
              <title> Categories</title>
            </head>
            <body>
              <h1>BOOKMAKERS FOR ${req.params.category}</h1>
              <a href = '/'> All Categories</a>
              <ul>
                ${bookmarks
                  .map((bookmark) => {
                    return `
                  <li>
                  ${bookmark.name}
                  <form method='POST' action='/bookmarks/${bookmark.id}?_method=DELETE'>
                  <button>DELETE</button>
                  </form>
                  </li>
                  `;
                  })
                  .join("")}
              </ul>
            </body>
          </html>
          `
    );
  } catch (error) {
    next(error);
  }
});

const start = async () => {
  try {
    await db.authenticate();
    await syncAndSeed();
    const PORT = process.env.port || 8000;
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};
start();
