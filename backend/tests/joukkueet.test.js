const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const { query } = require("../db/pool");
const { JWT } = require("../utils/config");

// Apufunktio tokenin luontiin
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

describe("Joukkueet API", () => {
  // Testijoukkue ja admin käyttäjä
  let teamId, adminId, memberId, adminToken, memberToken;

  beforeAll(async () => {
    const team = await query(
      "INSERT INTO joukkueet (nimi) VALUES ('TestiJoukkue')"
    );
    teamId = Number(team.insertId); // oltava Number tai mariadb herjaa

    const admin = await query(
      "INSERT INTO käyttäjät (email,nimi,salasana_hash,joukkue_id) VALUES (?,?,?,?) ",
      ["admin@testi.com", "Admin", "hash", teamId]
    );
    adminId = Number(admin.insertId);

    await query("UPDATE joukkueet SET ylläpitäjä_id=? WHERE id=?", [
      adminId,
      teamId,
    ]);

    const member = await query(
      "INSERT INTO käyttäjät (email,nimi,salasana_hash,joukkue_id) VALUES (?,?,?,?)",
      ["member@test.com", "Member", "hash", teamId]
    );
    memberId = Number(member.insertId);

    adminToken = Token({ id: adminId, joukkue_id: teamId });
    memberToken = Token({ id: memberId, joukkue_id: teamId });
  });

  afterAll(async () => {
    await query("DELETE FROM käyttäjät WHERE id IN (?,?)", [adminId, memberId]);
    await query("DELETE FROM joukkueet WHERE id = ?", [teamId]);
  });

  test("GET / api/joukkueet palauttaa listan ilman autentikointia", async () => {
    const res = await request(app).get("/api/joukkueet");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("nimi");
  });

  // Jäsenten haku toimii vain kun käyttäjällä on joukkue
  test("GET /api/joukkueet/members palauttaa oikeat jäsenet ja merkitsee adminin", async () => {
    const res = await request(app)
      .get("/api/joukkueet/members")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("joukkue_id", teamId);
    expect(Array.isArray(res.body.members)).toBe(true);

    // Tarkistetaan että admin löytyy ja että hänellä on is_admin = true
    const adminRow = res.body.members.find((m) => m.id === adminId);
    expect(adminRow).toBeDefined();
    expect(adminRow.is_admin).toBe(true);

    // Ja että member löytyy ja is_admin = false
    const memberRow = res.body.members.find((m) => m.id === memberId);
    expect(memberRow).toBeDefined();
    expect(memberRow.is_admin).toBe(false);
  });

  // Vain admin voi poistaa joukkueen
  test("DELETE /api/joukkueet/:id onnistuu adminilla ja poistaa joukkueen", async () => {
    // Luodaan väliaikainen joukkue poistotestiä varten
    const extraTeam = await query(
      "INSERT INTO joukkueet (nimi) VALUES ('PoistoJoukkue')"
    );
    const extraTeamId = Number(extraTeam.insertId);
    const extraAdmin = await query(
      "INSERT INTO käyttäjät (email,nimi,salasana_hash,joukkue_id) VALUES (?,?,?,?)",
      ["deleteadmin@testi.com", "DeleteAdmin", "hash", extraTeamId]
    );
    const extraAdminId = Number(extraAdmin.insertId);
    await query("UPDATE joukkueet SET ylläpitäjä_id=? WHERE id=?", [
      extraAdminId,
      extraTeamId,
    ]);
    const extraAdminToken = Token({
      id: extraAdminId,
      joukkue_id: extraTeamId,
    });

    const res = await request(app)
      .delete(`/api/joukkueet/${extraTeamId}`)
      .set("Authorization", `Bearer ${extraAdminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Joukkue poistettu onnistuneesti"
    );

    // varmista että joukkue on oikeasti poistettu
    const check = await query("SELECT id FROM joukkueet WHERE id = ?", [
      extraTeamId,
    ]);
    expect(check.length).toBe(0);
  });

  // Admin voi poistaa yksittäisen jäsenen
  test("DELETE /api/joukkueet/members/:id poistaa jäsenen", async () => {
    // Luodaan väliaikainen jäsen
    const extraMember = await query(
      "INSERT INTO käyttäjät (email,nimi,salasana_hash,joukkue_id) VALUES (?,?,?,?)",
      [`deleteme${Date.now()}@testi.com`, "DeleteMe", "hash", teamId]
    );
    const extraMemberId = Number(extraMember.insertId);

    const res = await request(app)
      .delete(`/api/joukkueet/members/${extraMemberId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);

    // Tarkistetaan ettei jäsentä enää ole
    const check = await query("SELECT id FROM käyttäjät WHERE id = ?", [
      extraMemberId,
    ]);
    expect(check.length).toBe(0);
  });

  // Varmistetaan että tavallinen jäsen ei voi poistaa joukkuetta
  test("DELETE /api/joukkueet/:id palauttaa 404 jos käyttäjä ei ole admin", async () => {
    const res = await request(app)
      .delete(`/api/joukkueet/${teamId}`)
      .set("Authorization", `Bearer ${memberToken}`);
    expect(res.statusCode).toBe(403);
  });
});
