const Sequelize = require("sequelize");
const db = new Sequelize("postgres://localhost/acme_bookmarks_db");

const data = [
  {
    name: "LinkedIn",
    URL: "http://www.linkedin.com",
    category: "jobs",
  },
  {
    name: "Indeed",
    URL: "http://www.indeed.com",
    category: "jobs",
  },
  {
    name: "Amazon",
    URL: "http://www.amazon.com",
    category: "shopping",
  },
  {
    name: "W3C Shools - Javascript",
    URL: "https://www.w3schools.com/jsref/default.asp",
    category: "coding",
  },
  {
    name: "Target",
    URL: "http://www.shopping.com",
    category: "shopping",
  },
  {
    name: "The Weekend",
    URL: "https://www.theweeknd.com/",
    category: "music",
  },
  {
    name: "Stack Overflow",
    URL: "https://stackoverflow.com/",
    category: "coding",
  },
];

const Bookmark = db.define("Bookmark", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  url: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

const syncAndSeed = async () => {
  await db.sync({ force: true });
  await Promise.all(
    data.map((ele) =>
      Bookmark.create({
        name: ele.name,
        url: ele.URL,
        category: ele.category,
      })
    )
  );
};

module.exports = {
  db,
  syncAndSeed,
  models: {
    Bookmark,
  },
};
