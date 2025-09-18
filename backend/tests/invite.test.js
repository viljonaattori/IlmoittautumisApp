const request = require("supertest");
const app = require("../app");
const { query } = require("../db/pool");

describe("Invite API", () => {
  beforeEach(async () => {
    await query("DELETE FROM invite WHERE token LIKE 'testtoken%'");
  });

  test("GET /api/invite/bytoken/:token palauttaa 404 kun tokenia ei ole", async () => {
    const res = await request(app).get("/api/invite/bytoken/testtoken123");
    expect(res.statusCode).toBe(404);
  });

  test("GET /api/invite/bytoken/:token palauttaa 200 kun token on voimassa", async () => {
    const token = `testtoken_${Date.now()}`;
    await query(
      "INSERT INTO invite (team_id, token, expires_at, used) VALUES (?,?, DATE_ADD(NOW(), INTERVAL 7 DAY), FALSE)",
      [4, token]
    );

    const res = await request(app).get(`/api/invite/bytoken/${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.joukkue).toHaveProperty("id", 4);
  });

  test("POST /api/invite/use/:token palauttaa 404 jos tokenia ei ole", async () => {
    const res = await request(app).post("/api/invite/use/testtoken456");
    expect(res.statusCode).toBe(404);
  });

  test("POST /api/invite/use/:token merkitsee kutsun käytetyksi", async () => {
    const token = `testtoken_${Date.now()}`;
    await query(
      "INSERT INTO invite (team_id, token, expires_at, used) VALUES (?,?, DATE_ADD(NOW(), INTERVAL 7 DAY), FALSE)",
      [4, token]
    );

    const res = await request(app).post(`/api/invite/use/${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/merkitty käytetyksi/i);

    // Varmistetaan, että se on todella merkitty käytetyksi
    const rows = await query("SELECT used FROM invite WHERE token = ?", [
      token,
    ]);
    expect(rows[0].used).toBe(1);
  });
});
