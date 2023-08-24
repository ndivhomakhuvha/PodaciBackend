import express, { response } from "express";
import request from "express";
import { load } from "node-url-shortener";

const servers = ["http://localhost:3000", "http://localhost:3001"];
let current = 0;

const handler = (request, response) => {
  const server = servers[current];
  request.pipe(request({ url: server + request.url })).pipe(response);
  current = (current + 1) % servers.length;
};
const load_balancer_server = express();

load_balancer_server.get("/favicon.ico", (request, response) => {
  response.send("/favicon.ico");
});
load_balancer_server.use((request, response) => {
  handler(request, response);
});
load_balancer_server.listen(8080, (err) => {
  err
    ? console.log("Failed to listen to PORT 8080")
    : console.log("Load balancer server is listening on PORT 8080");
});
