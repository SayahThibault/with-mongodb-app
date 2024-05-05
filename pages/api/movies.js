// pages/api/movies.js
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("sample_mflix");

  switch (req.method) {
    case "POST":
      try {
        const newData = req.body;
        const result = await db.collection("movies").insertOne(newData);
        res.status(201).json({ status: 201, data: result.ops[0] });
      } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'insertion des données" });
      }
      break;

    case "GET":
      try {
        const movies = await db.collection("movies").find({}).limit(10).toArray();
        res.status(200).json({ status: 200, data: movies });
      } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des données" });
      }
      break;

    case "PUT":
      try {
        const { id } = req.query;
        const updatedData = req.body;
        const result = await db.collection("movies").updateOne(
          { _id: mongodb.ObjectID(id) },
          { $set: updatedData }
        );
        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: "Film non trouvé" });
        }
        res.status(200).json({ status: 200, message: "Données mises à jour avec succès" });
      } catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour des données" });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.query;
        const result = await db.collection("movies").deleteOne({ _id: mongodb.ObjectID(id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Film non trouvé" });
        }
        res.status(200).json({ status: 200, message: "Données supprimées avec succès" });
      } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression des données" });
      }
      break;

    default:
      res.status(405).json({ error: "Méthode non autorisée" });
  }
}
