// pages/api/movie/[id].js

import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const idMovie = req.query.id;
  const client = await clientPromise;
  const db = client.db("sample_mflix");

  switch (req.method) {
    case "GET":
      try {
        const dbMovie = await db.collection("movies").findOne({ _id: new ObjectId(idMovie) });
        if (!dbMovie) {
          return res.status(404).json({ error: "Film non trouvé" });
        }
        res.status(200).json({ status: 200, data: { movie: dbMovie } });
      } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des données du film" });
      }
      break;

    case "POST":
      try {
        const newData = req.body;
        const result = await db.collection("movies").insertOne(newData);
        res.status(201).json({ status: 201, data: result.ops[0] });
      } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'insertion des données du film" });
      }
      break;

    case "PUT":
      try {
        const updatedData = req.body;
        const result = await db.collection("movies").updateOne(
          { _id: new ObjectId(idMovie) },
          { $set: updatedData }
        );
        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: "Film non trouvé" });
        }
        res.status(200).json({ status: 200, message: "Données mises à jour avec succès" });
      } catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour des données du film" });
      }
      break;

    case "DELETE":
      try {
        const result = await db.collection("movies").deleteOne({ _id: new ObjectId(idMovie) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Film non trouvé" });
        }
        res.status(200).json({ status: 200, message: "Données supprimées avec succès" });
      } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression des données du film" });
      }
      break;

    default:
      res.status(405).json({ error: "Méthode non autorisée" });
  }
}
