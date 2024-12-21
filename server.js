import express from 'express';
import bodyParser from 'body-parser';
import {ScrapperController} from "./ScrapperController.js";
import {PaginationController} from "./PaginationController.js";
import cors from "cors";

const port = process.env.PORT || 3000;
const app = express();


app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.get('/companies', PaginationController);

app.listen(port, () => {
    console.clear()
    console.log(`Server started on port ${port}`);
})