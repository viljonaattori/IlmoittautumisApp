const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const { query } = require("../db/pool");
const { JWT } = require("../utils/config");

function Token(payload) {
  return jwt.sign(
    {
      ...payload,
      id: Number(payload.id),
      joukkue_id: Number(payload.joukkue_id),
    },
    JWT.secret,
    { expiresIn: "1h" }
  );
}

describe("Tapahtuma API", () => {
  let teamId, adminId, memberId;
  let adminToken, memberToken;
  let eventId;

  function sqlDatePlus(hours) {
    const d = new Date(Date.now() + hours * 60 * 60 * 1000);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  beforeAll(async () => {
    // Luodaan testidataa
    const team = await query(
      "INSERT INTO joukkueet (nimi) VALUES ('testitapahtuma')"
    );
    teamId = Number(team.insertId);

    const admin = await query(
      "INSERT INTO käyttäjät (email,nimi,salasana_hash, joukkue_id) VALUES (?,?,?,?)",
      ["admin@tapahtuma.com", "Admin", "hash", teamId]
    );

    adminId = Number(admin.insertId);

    await query("UPDATE joukkueet SET ylläpitäjä_id=? WHERE id=?", [
      adminId,
      teamId,
    ]);

    const member = await query(
      "INSERT INTO käyttäjät (email,nimi,salasana_hash,joukkue_id) VALUES (?,?,?,?)",
      ["member@event.com", "Member", "hash", teamId]
    );
    memberId = Number(member.insertId);

    adminToken = Token({ id: adminId, joukkue_id: teamId });
    memberToken = Token({ id: memberId, joukkue_id: teamId });
  });

  afterAll(async () => {
    await query("DELETE FROM osallistumiset WHERE tapahtuma_id = ?", [eventId]);
    await query("DELETE FROM tapahtumat WHERE id = ?", [eventId]);
    await query("DELETE FROM käyttäjät WHERE id IN (?, ?)", [
      adminId,
      memberId,
    ]);
    await query("DELETE FROM joukkueet WHERE id = ?", [teamId]);
  });

  // Testit
  test("POST /api/tapahtumat luo uuden tapahtuman (vain admin)", async () => {
    const res = await request(app)
      .post("/api/tapahtumat")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        tyyppi: "harjoitus",
        paikka: "Pesäpallokenttä",
        aika: sqlDatePlus(1),
        kuvaus: "testidataaa",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.tyyppi).toBe("harjoitus");

    eventId = res.body.id;
  });

  test("POST /api/tapahtumat epäonnistuu jos member yrittää", async () => {
    const res = await request(app)
      .post("/api/tapahtumat")
      .set("Authorization", `Bearer ${memberToken}`)
      .send({
        tyyppi: "harjoitus",
        paikka: "kenttä",
        aika: sqlDatePlus(1),
      });

    expect(res.statusCode).toBe(403); // requireTeamAdmin estää
  });

  test("POST /api/tapahtumat epäonnistuu jos pakollisia kenttiä puuttuu", async () => {
    const res = await request(app)
      .post("/api/tapahtumat")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        paikka: "kenttä",
        aika: sqlDatePlus(1),
      });

    expect(res.statusCode).toBe(400);
  });

  test("POST /api/tapahtumat epäonnistuu jos aika on menneisyydessä", async () => {
    const res = await request(app)
      .post("/api/tapahtumat")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        tyyppi: "harjoitus",
        paikka: "kenttä",
        aika: sqlDatePlus(-1), // menneisyys
      });

    expect(res.statusCode).toBe(400);
  });

  test("GET /api/tapahtumat palauttaa luodun tapahtuman listalla", async () => {
    const res = await request(app)
      .get("/api/tapahtumat")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    const found = res.body.find((t) => t.id === eventId);
    expect(found).toBeDefined();
    expect(found.tyyppi).toBe("harjoitus");
  });

  test("POST /api/tapahtumat/:id/osallistuminen lisää osallistumisen ja päivitys toimii", async () => {
    // ensimmäinen kerta
    let res = await request(app)
      .post(`/api/tapahtumat/${eventId}/osallistuminen`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ status: "osallistun" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("osallistun");

    // päivitys toiseen arvoon
    res = await request(app)
      .post(`/api/tapahtumat/${eventId}/osallistuminen`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ status: "en_osallistu" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("en_osallistu");
  });

  test("GET /api/tapahtumat/:id/osallistujat palauttaa ainakin yhden rivin", async () => {
    const res = await request(app)
      .get(`/api/tapahtumat/${eventId}/osallistujat`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("DELETE /api/tapahtumat/:id poistaa tapahtuman (vain admin)", async () => {
    const res = await request(app)
      .delete(`/api/tapahtumat/${eventId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);

    // varmistetaan ettei tapahtumaa enää löydy
    const check = await query("SELECT id FROM tapahtumat WHERE id = ?", [
      eventId,
    ]);
    expect(check.length).toBe(0);

    // nollataan, ettei afterall yritä poistaa toista kertaa
    eventId = null;
  });
});
