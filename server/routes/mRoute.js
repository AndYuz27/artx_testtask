const router = require("express").Router();
const fs = require("fs");

let data = "";
const readFile = (path) => {
  return fs.readFileSync(__dirname + path, "utf-8");
};

console.log(data);




router.get("/", (req, res) => {
  res.render("index", {
    title: "DRESS-COD"
  });
});
router.get("/admin", (req, res) => {
  res.render("admin", {
      title: "Админская странца"

  });
});
router.get("/adddre", (req, res) => {
  res.render("adddre", {
      title: "Добавить товар"
  });
});

router.get("/t-shirt", (req, res) => {
  res.render("t-shirt", {
      title: "T-SHIRTS"
  });
});


module.exports = router;
