"use strict";
var fs = require("fs");
var path = require("path");

var dataDir = path.join(__dirname, "..", "data");
var dbFile = path.join(dataDir, "db.json");
var seedFile = path.join(dataDir, "seed.json");

function ensureDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function read() {
  ensureDir();
  var seed = JSON.parse(fs.readFileSync(seedFile, "utf8"));
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
  var data = JSON.parse(fs.readFileSync(dbFile, "utf8"));
  // Si une collection est vide dans db.json, on la réinitialise depuis le seed
  var changed = false;
  ["actualites", "documents", "conseillers", "services"].forEach(
    function (key) {
      if (!data[key] || data[key].length === 0) {
        data[key] = seed[key] || [];
        changed = true;
      }
    },
  );
  if (changed) {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), "utf8");
  }
  return data;
}

function write(data) {
  ensureDir();
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), "utf8");
}

function nextId(arr) {
  if (!arr || arr.length === 0) return 1;
  return (
    Math.max.apply(
      null,
      arr.map(function (x) {
        return x.id || 0;
      }),
    ) + 1
  );
}

module.exports = { read: read, write: write, nextId: nextId };
