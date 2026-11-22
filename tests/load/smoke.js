import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    smoke: {
      executor: "constant-vus",
      vus: 10,
      duration: "30s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

const baseUrl = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  const page = http.get(`${baseUrl}/`);
  check(page, { "home returns 200": (response) => response.status === 200 });

  const health = http.get(`${baseUrl}/api/health`);
  check(health, {
    "health returns 200 or 503": (response) => response.status === 200 || response.status === 503,
  });

  sleep(1);
}
