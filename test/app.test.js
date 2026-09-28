const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");

const app = require("../app");

test("GET /health should return status ok", async () => {
    const response = await request(app)
        .get("/health");

    assert.strictEqual(response.statusCode, 200);
    assert.deepStrictEqual(response.body, {
        status: "ok"
    });
});
test("POST /incidents should create a new incident", async () => {
    const response = await request(app)
        .post("/incidents")
        .send({
            type: "Malware Attack",
            severity: "CRITICAL",
            sourceIP: "192.168.1.50",
            description: "Malware detected on workstation"
        });

    assert.strictEqual(response.statusCode, 302);
    assert.strictEqual(response.headers.location, "/");
});
test("POST /incidents should reject invalid input", async () => {
    const response = await request(app)
        .post("/incidents")
        .send({
            type: "Malware Attack",
            severity: "CRITICAL",
            sourceIP: "999.999.999.999",
            description: "Invalid IP address test"
        });

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.text, "Invalid IPv4 address.");
});
test("POST /incidents/:id/status should update incident status", async () => {
    const response = await request(app)
        .post("/incidents/1001/status")
        .send({
            status: "RESOLVED"
        });

    assert.strictEqual(response.statusCode, 302);
    assert.strictEqual(response.headers.location, "/");
});
test("GET /api/incidents should return incident data", async () => {
    const response = await request(app)
        .get("/api/incidents");

    assert.strictEqual(response.statusCode, 200);
    assert.ok(Array.isArray(response.body));
    assert.ok(response.body.length > 0);
});
test("POST /incidents/:id/status should reject invalid status", async () => {
    const response = await request(app)
        .post("/incidents/1001/status")
        .send({
            status: "INVALID"
        });

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(response.text, "Invalid status.");
});

test("POST /incidents/:id/status should return 404 for missing incident", async () => {
    const response = await request(app)
        .post("/incidents/9999/status")
        .send({
            status: "RESOLVED"
        });

    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.text, "Incident not found.");
});