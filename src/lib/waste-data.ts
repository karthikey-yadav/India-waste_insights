// India Municipal Solid Waste & Plastic Waste — approximate figures compiled
// from CPCB Annual Reports (2019-20 through 2022-23) and Swachh Bharat Mission
// urban dashboards. Units:
//   plasticGenTPD  = plastic waste generated (tonnes/day)
//   plasticProcTPD = plastic waste processed/recycled (tonnes/day)
//   mswGenTPD      = municipal solid waste generated (tonnes/day)
//   mswProcPct     = share of MSW processed (%)
//   urbanPct       = urbanisation (% urban population, Census + projections)

export type StateRow = {
  state: string;
  code: string;
  plasticGenTPD: number;
  plasticProcTPD: number;
  mswGenTPD: number;
  mswProcPct: number;
  urbanPct: number;
  populationM: number;
};

export const STATES: StateRow[] = [
  {
    state: "Maharashtra",
    code: "MH",
    plasticGenTPD: 1710,
    plasticProcTPD: 1180,
    mswGenTPD: 22570,
    mswProcPct: 87,
    urbanPct: 45.2,
    populationM: 124,
  },
  {
    state: "Tamil Nadu",
    code: "TN",
    plasticGenTPD: 1470,
    plasticProcTPD: 920,
    mswGenTPD: 14500,
    mswProcPct: 76,
    urbanPct: 48.4,
    populationM: 77,
  },
  {
    state: "Gujarat",
    code: "GJ",
    plasticGenTPD: 1080,
    plasticProcTPD: 810,
    mswGenTPD: 10450,
    mswProcPct: 79,
    urbanPct: 42.6,
    populationM: 71,
  },
  {
    state: "Karnataka",
    code: "KA",
    plasticGenTPD: 950,
    plasticProcTPD: 610,
    mswGenTPD: 11960,
    mswProcPct: 68,
    urbanPct: 38.6,
    populationM: 67,
  },
  {
    state: "West Bengal",
    code: "WB",
    plasticGenTPD: 1040,
    plasticProcTPD: 190,
    mswGenTPD: 13710,
    mswProcPct: 22,
    urbanPct: 31.9,
    populationM: 100,
  },
  {
    state: "Delhi",
    code: "DL",
    plasticGenTPD: 690,
    plasticProcTPD: 410,
    mswGenTPD: 11330,
    mswProcPct: 55,
    urbanPct: 97.5,
    populationM: 20,
  },
  {
    state: "Uttar Pradesh",
    code: "UP",
    plasticGenTPD: 1590,
    plasticProcTPD: 640,
    mswGenTPD: 15500,
    mswProcPct: 38,
    urbanPct: 22.3,
    populationM: 231,
  },
  {
    state: "Rajasthan",
    code: "RJ",
    plasticGenTPD: 620,
    plasticProcTPD: 300,
    mswGenTPD: 6600,
    mswProcPct: 46,
    urbanPct: 24.9,
    populationM: 79,
  },
  {
    state: "Kerala",
    code: "KL",
    plasticGenTPD: 490,
    plasticProcTPD: 380,
    mswGenTPD: 3800,
    mswProcPct: 84,
    urbanPct: 47.7,
    populationM: 35,
  },
  {
    state: "Telangana",
    code: "TG",
    plasticGenTPD: 470,
    plasticProcTPD: 320,
    mswGenTPD: 7500,
    mswProcPct: 66,
    urbanPct: 38.9,
    populationM: 38,
  },
  {
    state: "Andhra Pradesh",
    code: "AP",
    plasticGenTPD: 560,
    plasticProcTPD: 300,
    mswGenTPD: 7500,
    mswProcPct: 60,
    urbanPct: 29.5,
    populationM: 53,
  },
  {
    state: "Madhya Pradesh",
    code: "MP",
    plasticGenTPD: 540,
    plasticProcTPD: 300,
    mswGenTPD: 6400,
    mswProcPct: 62,
    urbanPct: 27.6,
    populationM: 86,
  },
  {
    state: "Punjab",
    code: "PB",
    plasticGenTPD: 420,
    plasticProcTPD: 210,
    mswGenTPD: 4500,
    mswProcPct: 49,
    urbanPct: 37.5,
    populationM: 30,
  },
  {
    state: "Haryana",
    code: "HR",
    plasticGenTPD: 380,
    plasticProcTPD: 190,
    mswGenTPD: 5400,
    mswProcPct: 47,
    urbanPct: 34.9,
    populationM: 30,
  },
  {
    state: "Bihar",
    code: "BR",
    plasticGenTPD: 680,
    plasticProcTPD: 90,
    mswGenTPD: 5100,
    mswProcPct: 18,
    urbanPct: 11.3,
    populationM: 128,
  },
  {
    state: "Odisha",
    code: "OD",
    plasticGenTPD: 320,
    plasticProcTPD: 110,
    mswGenTPD: 2600,
    mswProcPct: 34,
    urbanPct: 16.7,
    populationM: 46,
  },
  {
    state: "Jharkhand",
    code: "JH",
    plasticGenTPD: 290,
    plasticProcTPD: 70,
    mswGenTPD: 2100,
    mswProcPct: 23,
    urbanPct: 24.1,
    populationM: 39,
  },
  {
    state: "Assam",
    code: "AS",
    plasticGenTPD: 210,
    plasticProcTPD: 55,
    mswGenTPD: 1800,
    mswProcPct: 20,
    urbanPct: 14.1,
    populationM: 36,
  },
  {
    state: "Chhattisgarh",
    code: "CT",
    plasticGenTPD: 240,
    plasticProcTPD: 130,
    mswGenTPD: 1900,
    mswProcPct: 65,
    urbanPct: 23.2,
    populationM: 30,
  },
  {
    state: "Uttarakhand",
    code: "UT",
    plasticGenTPD: 130,
    plasticProcTPD: 60,
    mswGenTPD: 1500,
    mswProcPct: 44,
    urbanPct: 30.6,
    populationM: 11,
  },
];

// National plastic waste trend (tonnes/day) — CPCB annual reports
export const NATIONAL_TREND = [
  { year: "2016-17", generated: 6137, processed: 1600 },
  { year: "2017-18", generated: 6600, processed: 2100 },
  { year: "2018-19", generated: 8630, processed: 3100 },
  { year: "2019-20", generated: 9400, processed: 3800 },
  { year: "2020-21", generated: 11480, processed: 4600 },
  { year: "2021-22", generated: 11866, processed: 5340 },
  { year: "2022-23", generated: 12300, processed: 6100 },
];

export const withDerived = (rows: StateRow[]) =>
  rows.map((r) => {
    const gapTPD = r.plasticGenTPD - r.plasticProcTPD;
    const processedPct = (r.plasticProcTPD / r.plasticGenTPD) * 100;
    const gapPct = 100 - processedPct;
    return { ...r, gapTPD, processedPct, gapPct };
  });

export type DerivedRow = ReturnType<typeof withDerived>[number];
