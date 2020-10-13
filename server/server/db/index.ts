/**
 * Module to work with the database.
 */
import sqlite3 from 'sqlite3';

import { VehicleModel } from '../models/VehicleModel';
import { VehiclePositionModel } from '../models/VehiclePositionModel';
import L from '../common/logger';

// Database instance
let db: sqlite3.Database | null = null;

/**
 * Returns all "registered" vehicles.
 */
export async function getVehicles(): Promise<VehicleModel[]> {
  const db: sqlite3.Database = await getDb();
  const sql = `
    SELECT v.vehicle_id,
           v.license_plate
      FROM vehicle v
    ORDER BY v.license_plate
  `;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { rows } = await runQuery(db, sql, []);
  return rows.map((r) => ({ id: r.vehicle_id, licensePlate: r.license_plate }));
}

/**
 * Returns the stepNo last positions of the vehicle with the given ID.
 *
 * @param id ID of the vehicle to return the data for
 * @param stepNo the number of the last positions to return
 */
export async function getVehicleRoute(
  vehicleId: number,
  stepNo: number
): Promise<VehiclePositionModel[]> {
  const db: sqlite3.Database = await getDb();
  const sql = `
    SELECT vp.vehicle_position_id,
           vp.vehicle_id,
           vp.recorded_at,
           vp.lat,
           vp.lng
      FROM vehicle_position vp
     WHERE vp.vehicle_id = (?)
    ORDER BY vp.recorded_at DESC
    LIMIT (?)
  `;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { rows } = await runQuery(db, sql, [vehicleId, stepNo]);
  return rows.map((r) => ({
    id: r.vehicle_position_id,
    vehicleId: r.vehicle_id,
    recordedAt: r.recorded_at,
    lat: r.lat,
    lng: r.lng,
  }));
}

/**
 * Hack to look like node-postgres (and handle async / await operation).
 *
 * @param db database to run the query against
 * @param sql SQL with the query
 * @param params array with the SQL parameters
 */
function runQuery(
  db: sqlite3.Database,
  sql: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ rows: any[] }> {
  const that = db;
  return new Promise(function (resolve, reject) {
    that.all(sql, params, function (error, rows) {
      if (error) {
        reject(error);
      } else {
        resolve({ rows: rows });
      }
    });
  });
}

/**
 * Hack to look like node-postgres (and handle async / await operation).
 *
 * @param db database to run the statement against
 * @param sql SQL with the statement
 * @param params array with the SQL parameters
 */
function run(
  db: sqlite3.Database,
  sql: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ rows: any[] }> {
  const that = db;
  return new Promise(function (resolve, reject) {
    that.all(sql, params, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Creates (if not created yet and populates with tthe demo data) the database.
 */
export async function getDb(): Promise<sqlite3.Database> {
  if (!db) {
    L.info('Creating database...');
    db = new sqlite3.Database('database.sqlite');
    await populateDemoData(db);
    L.info('Database created.');
  }

  return db;
}

/**
 * Adds the demo data to the database.
 *
 * @param db database to populate the demo data with
 */
async function populateDemoData(db: sqlite3.Database): Promise<void> {
  L.info('Populating demo data...');

  const vehicles: VehicleModel[] = [
    { id: 1, licensePlate: '111-111', lat: 38.7197108, lng: -9.1569673 },
    { id: 2, licensePlate: '222-222', lat: 38.7755936, lng: -9.1375607 },
    { id: 3, licensePlate: '333-333', lat: 38.7755922, lng: -9.1529299 },
  ];
  const pathSteps = 20;

  await run(
    db,
    `
      CREATE TABLE IF NOT EXISTS vehicle
      (
        vehicle_id INTEGER PRIMARY KEY, 
        license_plate TEXT NOT NULL UNIQUE 
      )
    `,
    []
  );
  await run(
    db,
    `
      CREATE TABLE IF NOT EXISTS vehicle_position
      (
        vehicle_position_id INTEGER PRIMARY_KEY,
        vehicle_id INTEGER NOT NULL, 
        recorded_at TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        FOREIGN KEY (vehicle_id) 
          REFERENCES vehicle (vehicle_id) 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
      )
    `,
    []
  );

  const sql = `
    INSERT INTO vehicle
    (
      vehicle_id,
      license_plate
    )
    VALUES
    (
      (?),
      (?)
    )
  `;

  await run(db, 'DELETE FROM vehicle', []);

  vehicles.forEach(async (v) => {
    const params = [v.id, v.licensePlate];
    await run(db, sql, params);

    for (let i = 0; i < pathSteps; i++) {
      const sql2 = `
        INSERT INTO vehicle_position
        (
          vehicle_position_id,
          vehicle_id,
          recorded_at,
          lat,
          lng
        )
        VALUES
        (
          (?),
          (?),
          (?),
          (?),
          (?)
        )
      `;
      const params2 = [
        v.id * 1000000 + i,
        v.id,
        new Date(new Date().getTime() + i * 1000 * 60).toISOString(),
        v.lat - (pathSteps - i - 1) * 0.001,
        v.lng - (pathSteps - i - 1) * 0.001,
      ];
      await run(db, sql2, params2);
    }
  });

  L.info('Demo data added.');
}
