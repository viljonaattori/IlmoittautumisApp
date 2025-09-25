const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query } = require("../db/pool");
const { JWT } = require("../utils/config");
const emailValidator = require("../utils/emailValidator");

async function validateUserInput({ email, password, nimi }) {
  if (!email || !password || !nimi) {
    throw { status: 400, message: "Sähköposti, salasana ja nimi vaaditaan" };
  }
  if (!emailValidator(email)) {
    throw { status: 400, message: "Sähköposti ei saa sisältää ääkkösiä" };
  }
  if (password.length < 6) {
    throw { status: 400, message: "Salasanan pituus vähintään 6 merkkiä" };
  }
}

async function ensureEmailUnique(email) {
  const existing = await query("SELECT id FROM `käyttäjät` WHERE email = ?", [
    email,
  ]);
  if (existing.length > 0) {
    throw { status: 409, message: "Sähköposti on jo käytössä" };
  }
}

async function ensureTeamExists(id) {
  const team = await query("SELECT id FROM `joukkueet` WHERE id = ?", [id]);
  if (team.length === 0) {
    throw { status: 400, message: "Virheellinen joukkue_id" };
  }
}

async function createTeamIfNeeded(mode, newName, kuvaus) {
  if (mode === "create") {
    if (!newName)
      throw { status: 400, message: "Uuden joukkueen nimi on annettava" };

    const res = await query(
      "INSERT INTO `joukkueet` (nimi, kuvaus, ylläpitäjä_id) VALUES (?, ?, NULL)",
      [newName, kuvaus || null]
    );

    return Number(res.insertId);
  }
  return null;
}

async function createUser({ email, password, nimi, teamId }) {
  const hash = await bcrypt.hash(password, 10);
  const res = await query(
    "INSERT INTO `käyttäjät` (email, salasana_hash, nimi, joukkue_id) VALUES (?, ?, ?, ?)",
    [email, hash, nimi, teamId]
  );
  return Number(res.insertId);
}

async function setTeamAdminIfNeeded(mode, userId, teamId) {
  if (mode === "create") {
    await query("UPDATE `joukkueet` SET ylläpitäjä_id = ? WHERE id = ?", [
      userId,
      teamId,
    ]);
  }
}

function createJwt(user) {
  return jwt.sign(user, JWT.secret, { expiresIn: JWT.expiresIn || "7d" });
}

module.exports = {
  validateUserInput,
  ensureEmailUnique,
  ensureTeamExists,
  createTeamIfNeeded,
  createUser,
  setTeamAdminIfNeeded,
  createJwt,
};
