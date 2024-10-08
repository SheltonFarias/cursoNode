const express = require("express");
const { create } = require("express-handlebars");
const { Client } = require("pg");
const conn = require("./db/conn");
const { User } = require("./models/User");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// Criando uma instância do Handlebars
const hbs = create({ extname: ".handlebars" });

// Configurando o Handlebars como engine de template
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.get("/users/create", (req, res) => {
  res.render("adduser");
});

app.post("/users/create", async (req, res) => {
  const name = req.body.name;
  const occupation = req.body.occupation;
  let newsletter = req.body.newsletter;

  if (newsletter == "on") {
    newsletter = true;
  }

  await User.creates({ name, occupation, newsletter });

  res.redirect("/");
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  const user = await User.findOne({ raw: true, where: { id: id } });

  res.render("userview", { user });
});

app.post("/users/delete/:id", async (req, res) => {
  const id = req.params.id;

  await User.destroy({ where: { id: id } });

  res.redirect("/");
});

app.get("/users/edit/:id", async (req, res) => {
  const id = req.params.id;

  const user = await User.findOne({ raw: true, where: { id: id } });

  res.redirect("useredit", { user });
});

// Definindo uma rota para o caminho "/"
app.get("/", async (req, res) => {
  const users = await User.findAll({ raw: true });

  console.log(users);

  res.render("home", { users: users });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

// Uma promisse para conectar/criar as tabelas e rodar servidor local
conn
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("Servidor rodando em http://localhost:3000");
    });
  })
  .catch((err) => console.log(err));
