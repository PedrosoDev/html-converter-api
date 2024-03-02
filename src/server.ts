import "express-async-errors";
import express from "express";
import cors from "cors";
import { routes } from "./routes";

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors({ origin: "*" }));
server.use("/public", express.static("public"));
server.use("/html", express.static("html"));
server.use(routes);

export { server };
