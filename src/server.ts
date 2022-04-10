import express, { Application, Request, Response } from "express";

const app: Application = express();
const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
    return res.send("Hello World!")
})

app.listen(5000, () => console.log(`⚡️Server is running at http://localhost:${port}`));