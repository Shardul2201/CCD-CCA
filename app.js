const express = require("express");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// EJS configuration
app.set("view engine", "ejs");
app.set("views", "./views");

// Sample cybersecurity incidents
const incidents = [
    {
        id: 1001,
        type: "Brute Force Attack",
        severity: "HIGH",
        sourceIP: "192.168.1.20",
        description: "Multiple failed SSH login attempts",
        status: "OPEN"
    },
    {
        id: 1002,
        type: "Port Scan",
        severity: "MEDIUM",
        sourceIP: "10.0.0.15",
        description: "Multiple ports scanned from an external source",
        status: "INVESTIGATING"
    },
    {
        id: 1003,
        type: "Phishing Attempt",
        severity: "HIGH",
        sourceIP: "172.16.0.23",
        description: "Suspicious email containing a malicious link",
        status: "RESOLVED"
    }
];

// Home page
app.get("/", (req, res) => {
    const search = req.query.search || "";
    const severity = req.query.severity || "";
    const status = req.query.status || "";

    const filteredIncidents = incidents.filter(incident => {
        const matchesSearch =
            incident.type.toLowerCase().includes(search.toLowerCase()) ||
            incident.sourceIP.includes(search) ||
            incident.description.toLowerCase().includes(search.toLowerCase());

        const matchesSeverity =
            !severity || incident.severity === severity;

        const matchesStatus =
            !status || incident.status === status;

        return matchesSearch && matchesSeverity && matchesStatus;
    });

    const stats = {
        total: incidents.length,
        open: incidents.filter(incident => incident.status === "OPEN").length,
        investigating: incidents.filter(
            incident => incident.status === "INVESTIGATING"
        ).length,
        resolved: incidents.filter(
            incident => incident.status === "RESOLVED"
        ).length,
        critical: incidents.filter(
            incident => incident.severity === "CRITICAL"
        ).length
    };

    res.render("index", {
        incidents: filteredIncidents,
        stats: stats,
        filters: {
            search: search,
            severity: severity,
            status: status
        },
        commitId: process.env.RENDER_GIT_COMMIT || "local-development"
    });
});

// Report incident page
app.get("/incidents/new", (req, res) => {
    res.render("add-incident");
});

// Create a new incident
app.post("/incidents", (req, res) => {
    const { type, severity, sourceIP, description } = req.body;

    const validSeverities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

    if (
        !type?.trim() ||
        !severity?.trim() ||
        !sourceIP?.trim() ||
        !description?.trim()
    ) {
        return res.status(400).send("All fields are required.");
    }

    // Validate severity
    if (!validSeverities.includes(severity)) {
        return res.status(400).send("Invalid severity.");
    }

    // Validate IPv4 address
    const ipPattern =
        /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

    if (!ipPattern.test(sourceIP)) {
        return res.status(400).send("Invalid IPv4 address.");
    }

    const newIncident = {
        id: 1000 + incidents.length + 1,
        type,
        severity,
        sourceIP,
        description,
        status: "OPEN"
    };

    incidents.push(newIncident);

    res.redirect("/");
});

// Update incident status
app.post("/incidents/:id/status", (req, res) => {
    const incidentId = Number(req.params.id);
    const newStatus = req.body.status;

    const validStatuses = ["OPEN", "INVESTIGATING", "RESOLVED"];

    // Validate status
    if (!validStatuses.includes(newStatus)) {
        return res.status(400).send("Invalid status.");
    }

    // Find the incident
    const incident = incidents.find(
        incident => incident.id === incidentId
    );

    if (!incident) {
        return res.status(404).send("Incident not found.");
    }

    // Update status
    incident.status = newStatus;

    res.redirect("/");
});

// JSON API for incidents
app.get("/api/incidents", (req, res) => {
    res.json(incidents);
});

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

module.exports = app;