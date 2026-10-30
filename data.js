// ============================================================
//  MASTER DATA KELUARGA
//  ⚠️  GANTI nama, tanggal, dan relasi sesuai keluarga Anda
// ============================================================
//
//  Aturan format:
//  - id         : unik (string/angka), tidak boleh sama
//  - gender     : "M" (laki-laki) atau "F" (perempuan)
//  - father/mother : id orang tua (untuk anak)
//  - spouses    : array id pasangan (dua arah!)
//  - children   : array id anak
//  - Kalau tidak ada relasi, boleh dihilangkan field-nya
// ============================================================

const FAMILY_DATA = [
  // ---------- GENERASI 1 ----------
  {
    id: "1",
    data: { "first name": "Sutrisno", "last name": "Wijaya", gender: "M", birthday: "1945" },
    rels: { spouses: ["2"], children: ["3", "4", "5"] }
  },
  {
    id: "2",
    data: { "first name": "Sri", "last name": "Wijaya", gender: "F", birthday: "1948" },
    rels: { spouses: ["1"], children: ["3", "4", "5"] }
  },

  // ---------- GENERASI 2 ----------
  {
    id: "3",
    data: { "first name": "Budi", "last name": "Wijaya", gender: "M", birthday: "1970" },
    rels: { father: "1", mother: "2", spouses: ["6"], children: ["9", "10"] }
  },
  {
    id: "6",
    data: { "first name": "Ani", "last name": "Lestari", gender: "F", birthday: "1972" },
    rels: { spouses: ["3"], children: ["9", "10"] }
  },
  {
    id: "4",
    data: { "first name": "Siti", "last name": "Wijaya", gender: "F", birthday: "1973" },
    rels: { father: "1", mother: "2", spouses: ["7"], children: ["11", "12"] }
  },
  {
    id: "7",
    data: { "first name": "Agus", "last name": "Santoso", gender: "M", birthday: "1970" },
    rels: { spouses: ["4"], children: ["11", "12"] }
  },
  {
    id: "5",
    data: { "first name": "Dedi", "last name": "Wijaya", gender: "M", birthday: "1976" },
    rels: { father: "1", mother: "2", spouses: ["8"], children: ["13", "14"] }
  },
  {
    id: "8",
    data: { "first name": "Rina", "last name": "Kartika", gender: "F", birthday: "1978" },
    rels: { spouses: ["5"], children: ["13", "14"] }
  },

  // ---------- GENERASI 3 ----------
  {
    id: "9",
    data: { "first name": "Rian", "last name": "Wijaya", gender: "M", birthday: "1995" },
    rels: { father: "3", mother: "6" }
  },
  {
    id: "10",
    data: { "first name": "Maya", "last name": "Wijaya", gender: "F", birthday: "1998" },
    rels: { father: "3", mother: "6" }
  },
  {
    id: "11",
    data: { "first name": "Fajar", "last name": "Santoso", gender: "M", birthday: "2000" },
    rels: { father: "7", mother: "4" }
  },
  {
    id: "12",
    data: { "first name": "Nadia", "last name": "Santoso", gender: "F", birthday: "2003" },
    rels: { father: "7", mother: "4" }
  },
  {
    id: "13",
    data: { "first name": "Kevin", "last name": "Wijaya", gender: "M", birthday: "2005" },
    rels: { father: "5", mother: "8" }
  },
  {
    id: "14",
    data: { "first name": "Lina", "last name": "Wijaya", gender: "F", birthday: "2008" },
    rels: { father: "5", mother: "8" }
  }
];