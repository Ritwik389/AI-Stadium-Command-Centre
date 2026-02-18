import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs/promises";
import path from "path";

type RawPoint = [number, number];

function normalizeZones(rawZones: RawPoint[][]) {
  const allPoints = rawZones.flat();
  const maxX = Math.max(...allPoints.map((p) => p[0]), 1);
  const maxY = Math.max(...allPoints.map((p) => p[1]), 1);

  return rawZones.map((zone, zoneIndex) => ({
    zoneIndex,
    points: zone.map(([x, y]) => ({
      x: x / maxX,
      y: y / maxY,
    })),
  }));
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/zone-layout", async (_req, res) => {
    try {
      const configPath = path.resolve(import.meta.dirname, "..", "..", "config.json");
      const rawContent = await fs.readFile(configPath, "utf-8");
      const parsed = JSON.parse(rawContent) as { zones?: RawPoint[][] };
      const rawZones = Array.isArray(parsed.zones) ? parsed.zones : [];

      if (rawZones.length === 0) {
        return res.status(200).json({ zones: [] });
      }

      const normalizedZones = normalizeZones(rawZones);
      return res.status(200).json({ zones: normalizedZones });
    } catch (error) {
      console.error("Failed to load zone layout:", error);
      return res.status(500).json({ message: "Could not load zone layout" });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return httpServer;
}
