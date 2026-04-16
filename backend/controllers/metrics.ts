import express from "express";
import promClient from "prom-client";

const metricsController = express.Router();

promClient.collectDefaultMetrics({
  prefix: "backend_",
});

const httpRequestsTotal = new promClient.Counter({
  name: "http_requests_total",
  help: "count",
  labelNames: ["method", "route", "status"],
});

const httpRequestDurationSeconds = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "latency",
  labelNames: ["method", "route", "status"],
});

metricsController.get("/", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  return res.end(await promClient.register.metrics());
});

metricsController.use((req, res, next) => {
  const end = httpRequestDurationSeconds.startTimer();
  res.on("finish", () => {
    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    };
    httpRequestsTotal.inc(labels);
    end(labels);
  });
  next();
});

export default metricsController;
