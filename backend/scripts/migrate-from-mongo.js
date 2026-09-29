require('dotenv').config();
const { MongoClient } = require('mongodb');
const { connectDB, getDB, closeDB } = require('../src/config/db');

const BATCH_SIZE = 100;

async function migrate() {
    if (!process.env.MONGODB_URL) {
        throw new Error('MONGODB_URL no está configurada. Hace falta para copiar los datos actuales.');
    }

    await connectDB();
    const postgres = await getDB();
    const mongo = new MongoClient(process.env.MONGODB_URL);
    await mongo.connect();
    const source = mongo.db(process.env.DB_NAME || 'dbgraduat');

    try {
        const collections = await source.listCollections().toArray();
        const summary = [];

        for (const collectionInfo of collections) {
            const name = collectionInfo.name;
            if (name.startsWith('system.')) {
                continue;
            }

            const sourceCollection = source.collection(name);
            const total = await sourceCollection.countDocuments();
            await postgres.createCollection(name);
            await postgres.collection(name).deleteMany({});

            let copied = 0;
            let batch = [];
            const cursor = sourceCollection.find({});
            for await (const doc of cursor) {
                batch.push(doc);
                if (batch.length >= BATCH_SIZE) {
                    await postgres.collection(name).insertMany(batch);
                    copied += batch.length;
                    batch = [];
                }
            }
            if (batch.length > 0) {
                await postgres.collection(name).insertMany(batch);
                copied += batch.length;
            }

            const stored = await postgres.collection(name).countDocuments();
            summary.push({ name, mongo: total, postgres: stored });
            console.log(`${name}: ${stored}/${total}`);
            if (stored !== total) {
                throw new Error(`La colección ${name} quedó incompleta (${stored} de ${total})`);
            }
        }

        console.log('Migración terminada');
        console.log(JSON.stringify(summary, null, 2));
    } finally {
        await mongo.close();
        await closeDB();
    }
}

migrate().catch((error) => {
    console.error('Error al migrar:', error.message);
    process.exit(1);
});
