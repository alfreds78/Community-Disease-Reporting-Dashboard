const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const reportRoutes = require("./Routes/reportRoutes");
const userRoutes = require("./Routes/userRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
     "http://localhost:5173",
     "https://community-disease-reporting-dashboard-ouxn.onrender.com"
   ],
  credentials: true
}));

app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));