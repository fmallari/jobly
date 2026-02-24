"use strict";

const db = require("../db");

/** Related functions for jobs. */

class Job {
  /** Find all jobs (optionally filtered by title/name, minSalary, hasEquity).
   *
   * Returns [{ id, title, salary, equity, companyHandle, companyName }, ...]
   **/
  static async findAll(filters = {}) {
    const { title, titleLike, minSalary, hasEquity } = filters;

    let query = `
      SELECT j.id,
             j.title,
             j.salary,
             j.equity,
             j.company_handle AS "companyHandle",
             c.name AS "companyName"
      FROM jobs AS j
        JOIN companies AS c ON c.handle = j.company_handle
    `;

    const whereParts = [];
    const values = [];

    // Allow either title or titleLike
    const titleSearch = titleLike ?? title;
    if (titleSearch) {
      values.push(`%${titleSearch}%`);
      whereParts.push(`j.title ILIKE $${values.length}`);
    }

    if (minSalary !== undefined && minSalary !== "") {
      values.push(Number(minSalary));
      whereParts.push(`j.salary >= $${values.length}`);
    }

    if (hasEquity === "true" || hasEquity === true) {
      whereParts.push(`j.equity > 0`);
    }

    if (whereParts.length > 0) {
      query += " WHERE " + whereParts.join(" AND ");
    }

    query += " ORDER BY j.id";

    const result = await db.query(query, values);
    return result.rows;
  }
}

module.exports = Job;