import Head from "next/head";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";

const MeetupDetailPage = ({ meetup }) => {
  console.log("MeetupDetailPage: meetup =>", meetup);
  return (
    <>
      <Head>
        <title>{meetup.title}</title>
        <meta name="description" content={meetup.description} />
      </Head>
      <MeetupDetail {...meetup} />
    </>
  );
};

export const getStaticProps = async (context) => {
  const meetupId = context.params.meetupId;

  console.log("meetupId", meetupId);

  const mongodbConnectionString =
    "mongodb+srv://acvasniuc:JnhRglRb6dOJj2oW@cluster0.xqgv7e2.mongodb.net/meetups?retryWrites=true&w=majority";
  const client = await MongoClient.connect(mongodbConnectionString);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  console.log("meetup", meetup);

  client.close();

  return {
    props: {
      meetup: {
        id: meetup._id.toString(),
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        description: meetup.description,
      },
    },
    revalidate: 10, // seconds
  };
};

export const getStaticPaths = async () => {
  const mongodbConnectionString =
    "mongodb+srv://acvasniuc:JnhRglRb6dOJj2oW@cluster0.xqgv7e2.mongodb.net/meetups?retryWrites=true&w=majority";
  const client = await MongoClient.connect(mongodbConnectionString);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetupIds = await meetupsCollection
    .find({}, { projection: { _id: 1 } })
    .toArray();

  console.log("meetupIds", meetupIds);

  client.close();

  return {
    fallback: "blocking",
    paths: meetupIds.map((meetupId) => ({
      params: {
        meetupId: meetupId._id.toString(),
      },
    })),
  };
};

export default MeetupDetailPage;
