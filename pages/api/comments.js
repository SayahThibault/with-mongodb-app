// pages/api/comments.js

import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("sample_mflix");

  switch (req.method) {
    case "GET":
      try {
        // Récupérer tous les commentaires
        const comments = await db.collection("comments").find({}).toArray();

        res.status(200).json({ status: 200, data: { comments: comments } });
      } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des commentaires" });
      }
      break;

    default:
      res.status(405).json({ error: "Méthode non autorisée" });
  }
}
