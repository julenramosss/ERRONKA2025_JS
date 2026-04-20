// Mock data for pakAG prototype

const MOCK_USER = {
  name: "Mikel Arregi",
  email: "mikel.arregi@pakag.com",
  role: "distributor", // or 'admin'
  createdAt: "2024-03-15",
  twoFA: true,
};

const ADDRESSES = [
  {
    name: "Itziar Etxeberria",
    addr: "Kale Nagusia 12, Tolosa",
    lat: 43.134,
    lng: -2.078,
    time: "09:15",
  },
  {
    name: "Jon Aranburu",
    addr: "Aduna bidea 8, Aduna",
    lat: 43.161,
    lng: -2.043,
    time: "09:45",
  },
  {
    name: "Miren Garmendia",
    addr: "Elduain auzoa 4, Elduaien",
    lat: 43.125,
    lng: -2.007,
    time: "10:20",
  },
  {
    name: "Aitor Zabaleta",
    addr: "San Joan 22, Villabona",
    lat: 43.176,
    lng: -2.053,
    time: "10:55",
  },
  {
    name: "Nerea Ibarra",
    addr: "Iturri kalea 3, Zizurkil",
    lat: 43.184,
    lng: -2.073,
    time: "11:30",
  },
  {
    name: "Xabier Mendiola",
    addr: "Errekaldea 17, Asteasu",
    lat: 43.175,
    lng: -2.098,
    time: "12:10",
  },
  {
    name: "Amaia Otaegi",
    addr: "Plaza Santa Maria 5, Tolosa",
    lat: 43.133,
    lng: -2.076,
    time: "12:45",
  },
  {
    name: "Iker Soria",
    addr: "Gernika ibilbidea 30, Anoeta",
    lat: 43.153,
    lng: -2.067,
    time: "13:20",
  },
];

const makeTracking = (i) => {
  const codes = ["PKG", "BLK", "AGT"];
  const c = codes[i % 3];
  return `${c}-26${(1042 + i).toString().padStart(4, "0")}`;
};

const MOCK_PACKAGES = ADDRESSES.map((a, i) => {
  const statuses = [
    "delivered",
    "delivered",
    "in_transit",
    "assigned",
    "assigned",
    "assigned",
    "assigned",
    "assigned",
  ];
  return {
    id: `pkg-${i + 1}`,
    tracking: makeTracking(i),
    recipient: a.name,
    email: a.name.toLowerCase().replace(" ", ".") + "@mail.com",
    address: a.addr,
    city: a.addr.split(",").pop().trim(),
    weight: (0.4 + i * 0.3).toFixed(1) + " kg",
    description: [
      "Sobre acolchado",
      "Caja cartón mediana",
      "Paquete frágil",
      "Libros",
      "Documentos",
      "Producto electrónica",
      "Ropa",
      "Accesorios",
    ][i],
    status: statuses[i],
    eta: a.time,
    stop: i + 1,
    lat: a.lat,
    lng: a.lng,
    createdAt: "19 abr 2026, 08:30",
    history: [
      { status: "pending", actor: "Sistema", time: "19 abr, 07:02" },
      { status: "assigned", actor: "Admin · Ane", time: "19 abr, 08:25" },
      ...(i < 3
        ? [
            {
              status: "in_transit",
              actor: "Mikel Arregi",
              time: "19 abr, 08:55",
            },
          ]
        : []),
      ...(i < 2
        ? [
            {
              status: "delivered",
              actor: "Mikel Arregi",
              time: `19 abr, ${a.time}`,
            },
          ]
        : []),
    ],
  };
});

const MOCK_HISTORY_DAYS = [
  {
    date: "18 abr 2026",
    items: [
      {
        id: "h1",
        tracking: "PKG-261032",
        recipient: "Laura Urreta",
        status: "delivered",
        changes: 4,
        time: "17:42",
      },
      {
        id: "h2",
        tracking: "BLK-261033",
        recipient: "Joseba Iñarra",
        status: "delivered",
        changes: 3,
        time: "16:15",
      },
      {
        id: "h3",
        tracking: "AGT-261034",
        recipient: "Oihana Perez",
        status: "failed",
        changes: 4,
        time: "15:03",
      },
      {
        id: "h4",
        tracking: "PKG-261035",
        recipient: "Ibon Etxabe",
        status: "delivered",
        changes: 3,
        time: "13:22",
      },
      {
        id: "h5",
        tracking: "BLK-261036",
        recipient: "Maite Azkue",
        status: "delivered",
        changes: 3,
        time: "11:48",
      },
    ],
  },
  {
    date: "17 abr 2026",
    items: [
      {
        id: "h6",
        tracking: "PKG-261021",
        recipient: "Gorka Larrea",
        status: "delivered",
        changes: 3,
        time: "17:05",
      },
      {
        id: "h7",
        tracking: "AGT-261022",
        recipient: "Usoa Goikoa",
        status: "delivered",
        changes: 3,
        time: "14:38",
      },
      {
        id: "h8",
        tracking: "PKG-261023",
        recipient: "Patxi Irure",
        status: "delivered",
        changes: 3,
        time: "12:12",
      },
    ],
  },
  {
    date: "16 abr 2026",
    items: [
      {
        id: "h9",
        tracking: "BLK-261011",
        recipient: "Sara Elorza",
        status: "delivered",
        changes: 3,
        time: "18:44",
      },
      {
        id: "h10",
        tracking: "PKG-261012",
        recipient: "Ander Zabala",
        status: "failed",
        changes: 4,
        time: "16:10",
      },
      {
        id: "h11",
        tracking: "AGT-261013",
        recipient: "Leire Ansola",
        status: "delivered",
        changes: 3,
        time: "14:02",
      },
    ],
  },
];

window.MOCK = { MOCK_USER, MOCK_PACKAGES, MOCK_HISTORY_DAYS };
