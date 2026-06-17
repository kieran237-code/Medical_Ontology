require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const ontologyRoutes = require("./routes/ontology.routes");
const app = express();
const PORT = process.env.PORT ||4000;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use('/api', ontologyRoutes);
app.get('/', (req, res) => {
    res.json({message: 'API FoodHealth Operationnelle'});
});

app.use((req, res ) => {
    res.status(404).json({error:'Route non trouvee'})
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
}); 