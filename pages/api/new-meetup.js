// /api/new-meetup

import { MongoClient } from "mongodb";

const handler = async (req, res) => {
  console.log("api new-meetup api", req, res);

  if (req.method === "POST") {
    const data = req.body;
    console.log("data", data);

    const mongodbConnectionString =
      "mongodb+srv://acvasniuc:JnhRglRb6dOJj2oW@cluster0.xqgv7e2.mongodb.net/meetups?retryWrites=true&w=majority";
    const client = await MongoClient.connect(mongodbConnectionString);
    const db = client.db();

    const meetupsCollection = db.collection("meetups");
    const result = await meetupsCollection.insertOne(data);

    console.log("result", result);

    client.close();

    res.status(201).json({ message: "Meetup inserted!" });
  }
};

export default handler;
