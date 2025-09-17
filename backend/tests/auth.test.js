const request = require("supertest");
const app = require("../app");
const { query } = require("../db/pool");

// Uuden käyttäjän rekisteröinti
describe("POST /api/auth/register", () => {
  // Tyhjennetään testitietokanta ennen jokaista testiä
  beforeEach(async () => {
    await query("DELETE FROM käyttäjät WHERE email LIKE '%testi%'");
  });

  test("Onnistuu kun data on oikein ja mode=join", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "testi@example333.com",
      password: "salasana",
      nimi: "Testimies",
      joukkue_id: 4,
      mode: "join",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("testi@example333.com");
  }, 15000); // <-- antaa 15 sekuntia aikaa

  test("Palauttaa 400 jos sähköposti puuttuu", async () => {
    const res = await request(app).post("/api/auth/register").send({
      password: "salasana",
      nimi: "TestimiesMakkonen",
      joukkue_id: 4,
    });
    expect(res.statusCode).toBe(400);
  });

  // Jos nimi kenttä on puutteellinen
  test("Palauttaa 400 jos nimi puuttuu", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "puuttuu@example.com",
      password: "salasana",
      joukkue_id: 4,
      mode: "join",
    });
    expect(res.statusCode).toBe(400);
  });

  // Jos salasana kenttä on puutteellinen
  test("Palauttaa 400 jos salasana puuttuu", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "puuttuu@example.com",
      nimi: "taavi",
      joukkue_id: 4,
      mode: "join",
    });
    expect(res.statusCode).toBe(400);
  });
});
