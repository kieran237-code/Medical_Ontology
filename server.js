require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT ||4000;
const { runSelectQuery } = require("./services/sparql.service");
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/test-sparql", async (req, res) => {
  try {
    const query = `
      SELECT ?food ?label WHERE {
        ?food   rdfs:subClassOf hlt:Food .
        ?food   rdfs:label ?label .
      }
    `;
    const results = await runSelectQuery(query);
    res.json(results);
  } catch (error) {
    console.error("Error running SPARQL query:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
}); 