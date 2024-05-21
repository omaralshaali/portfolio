import * as path from "node:path";
import * as url from "node:url";

import { default as express } from "express";
import { default as sqlite3 } from "sqlite3";
import cors from "cors";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const db_filename = path.join(__dirname, "db", "stpaul_crime.sqlite3");

const port = 8000;

let app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());

/********************************************************************
 ***   DATABASE FUNCTIONS                                         ***
 ********************************************************************/
// Open SQLite3 database (in read-write mode)
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.log("Error opening " + path.basename(db_filename));
  } else {
    console.log("Now connected to " + path.basename(db_filename));
  }
});

// Create Promise for SQLite3 database SELECT query
function dbSelect(query, params) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Create Promise for SQLite3 database INSERT or DELETE query
function dbRun(query, params) {
  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/********************************************************************
 ***   REST REQUEST HANDLERS                                      ***
 ********************************************************************/
// GET request handler for crime codes
app.get("/codes", (req, res) => {
  console.log(req.query); // query object (key-value pairs after the ? in the url)

  let sql = "SELECT * FROM Codes";
  let params = [];

  if (req.query.hasOwnProperty("code")) {
    const ids = req.query.code.split(",");

    for (let i = 0; i < ids.length; i++) {
      if (i == 0) {
        sql += " WHERE code=?";
        params.push(ids[i]);
      } else {
        sql += " OR code=?";
        params.push(ids[i]);
      }
    }
  }

  //sql="SELECT DISTINCT code, incident FROM Incidents ORDER BY code"
  dbSelect(sql, params)
    .then((rows) => {
      rows = JSON.parse(
        JSON.stringify(rows).split('"incident_type":').join('"type":')
      );
      res.status(200).type("json").send(rows);
    })
    .catch((error) => {
      res.status(500).type("text").send(error);
    });
});

// GET request handler for neighborhoods
app.get("/neighborhoods", (req, res) => {
  console.log(req.query); // query object (key-value pairs after the ? in the url)

  let sql = "SELECT * FROM Neighborhoods";
  let params = [];

  if (req.query.hasOwnProperty("id")) {
    const ids = req.query.id.split(",");

    for (let i = 0; i < ids.length; i++) {
      if (i == 0) {
        sql += " WHERE neighborhood_number=?";
        params.push(ids[i]);
      } else {
        sql += " OR neighborhood_number=?";
        params.push(ids[i]);
      }
    }
  }

  sql += " ORDER BY neighborhood_number";

  dbSelect(sql, params)
    .then((rows) => {
      rows = JSON.parse(
        JSON.stringify(rows).split('"neighborhood_number":').join('"id":')
      );
      rows = JSON.parse(
        JSON.stringify(rows).split('"neighborhood_name":').join('"name":')
      );
      res.status(200).type("json").send(rows);
    })
    .catch((error) => {
      res.status(500).type("text").send(error);
    });
});

// GET request handler for crime incidents
app.get("/incidents", (req, res) => {
  console.log(req.query); // query object (key-value pairs after the ? in the url)

  let sql = "SELECT * FROM Incidents";
  let params = [];

  if (req.query.hasOwnProperty("start_date")) {
    if (params.length === 0) {
      sql += " WHERE date_time >= ?";
    } else {
      sql += " AND date_time >= ?";
    }
    params.push(req.query.start_date);
  }
  if (req.query.hasOwnProperty("end_date")) {
    if (params.length === 0) {
      sql += " WHERE date_time <= ?";
    } else {
      sql += " AND date_time <= ?";
    }
    params.push(req.query.end_date + "T23:59:59");
  }
  if (req.query.hasOwnProperty("code")) {
    const ids = req.query.code.split(",");

    for (let i = 0; i < ids.length; i++) {
      if (i == 0) {
        if (params.length === 0) {
          sql += " WHERE (code=?";
          params.push(ids[i]);
        } else {
          sql += " AND (code=?";
          params.push(ids[i]);
        }
      } else {
        sql += " OR code=?";
        params.push(ids[i]);
        if (i === ids.length - 1) {
          sql += ")";
        }
      }
      if (ids.length === 1) {
        sql += ")";
      }
    }
  }
  if (req.query.hasOwnProperty("grid")) {
    const ids = req.query.grid.split(",");

    for (let i = 0; i < ids.length; i++) {
      if (i === 0) {
        if (params.length === 0) {
          sql += " WHERE (police_grid=?";
          params.push(ids[i]);
        } else {
          sql += " AND (police_grid=?";
          params.push(ids[i]);
        }
      } else {
        sql += " OR police_grid=?";
        params.push(ids[i]);
        if (i === ids.length - 1) {
          sql += ")";
        }
      }
      if (ids.length === 1) {
        sql += ")";
      }
    }
  }
  if (req.query.hasOwnProperty("neighborhood")) {
    const ids = req.query.neighborhood.split(",");

    for (let i = 0; i < ids.length; i++) {
      if (i === 0) {
        if (params.length === 0) {
          sql += " WHERE (neighborhood_number=?";
          params.push(ids[i]);
        } else {
          sql += " AND (neighborhood_number=?";
          params.push(ids[i]);
        }
      } else {
        sql += " OR neighborhood_number=?";
        params.push(ids[i]);
        if (i === ids.length - 1) {
          sql += ")";
        }
      }
      if (ids.length === 1) {
        sql += ")";
      }
    }
  }

  sql += " ORDER BY date_time DESC";

  if (req.query.hasOwnProperty("limit")) {
    sql += " LIMIT ?";
    params.push(req.query.limit);
  } else {
    sql += " LIMIT 1000";
  }

  dbSelect(sql, params)
    .then((rows) => {
      const result = rows.map((x) => ({
        case_number: x.case_number,
        date: x["date_time"].split("T")[0],
        time: x["date_time"].split("T")[1],
        code: x.code,
        incident: x.incident,
        police_grid: x.police_grid,
        neighborhood_number: x.neighborhood_number,
        block: x.block,
      }));
      res.status(200).type("json").send(result);
    })
    .catch((error) => {
      res.status(500).type("text").send(error);
    });
});

// PUT request handler for new crime incident
app.put("/new-incident", (req, res) => {
  console.log("Received PUT request for new incident");
  console.log(req.body);
  let incident_data = req.body;
  let incident_id = incident_data.case_number;

  // check if incident already exists
  dbSelect("SELECT * FROM Incidents WHERE case_number=?", [incident_id])
    .then((existing_incident) => {
      if (existing_incident.length > 0) {
        // Incident already exists, reject
        res.status(500).type("txt").send("Incident already exists");
      } else {
        // Incident doesn't exist, proceed with adding it
        const sql =
          "INSERT INTO Incidents (case_number, date_time, code, incident, police_grid, neighborhood_number, block) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const params = [
          incident_data.case_number,
          incident_data.date_time, // Assuming date_time is already formatted correctly
          incident_data.code,
          incident_data.incident,
          incident_data.police_grid,
          incident_data.neighborhood_number,
          incident_data.block,
        ];

        dbRun(sql, params)
          .then(() => {
            res.status(200).type("txt").send("Incident added successfully");
          })
          .catch((error) => {
            res.status(500).type("txt").send(error);
          });
      }
    })
    .catch((error) => {
      res.status(500).type("txt").send(error);
    });
});

// DELETE request handler for new crime incident
app.delete("/remove-incident", (req, res) => {
  let sql = "DELETE FROM Incidents";
  let params = [];

  if (req.query.hasOwnProperty("case_number")) {
    const ids = req.query.case_number.split(",");

    for (let i = 0; i < ids.length; i++) {
      if (i == 0) {
        sql += " WHERE case_number=?";
        params.push(ids[i]);
      } else {
        sql += " OR case_number=?";
        params.push(ids[i]);
      }
    }
  }

  dbSelect(sql, params)
    .then((rows) => {
      res.status(200).type("txt").send("Incident deleted successfully");
    })
    .catch((error) => {
      res.status(500).type("text").send(error);
    });
});

/********************************************************************
 ***   START SERVER                                               ***
 ********************************************************************/
// Start server - listen for client connections
app.listen(port, () => {
  console.log("Now listening on port " + port);
});
