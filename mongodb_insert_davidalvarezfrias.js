const {MongoClient} = require('mongodb');

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/drivers/node/ for more details
     */
    const uri = "mongodb+srv://dalvarez:dalvarez123456@cluster0.uql7i2j.mongodb.net/remoto_davidalvarezfrias?retryWrites=true&w=majority";
   
    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls

         // Crear 1000 nuevas viviendas con valores aleatorios
         const newListings = generateRandomViviendas(1000);
         await createMultipleListings(client, newListings);

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);


/**
 * Create multiple Airbnb listings
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {Object[]} newListings The new listings to be added
 */
async function createMultipleListings(client, newListings){
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertMany for the insertMany() docs
    const result = await client.db("remoto_davidalvarezfrias").collection("viviendas").insertMany(newListings);

    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);
}
/**
 * Generar datos aleatorios para viviendas
 * @param {number} count El número de viviendas aleatorias a generar
 * @returns {Object[]} Un array de objetos que representan viviendas con datos aleatorios
 */
function generateRandomViviendas(count) {
    const viviendas = [];
    for (let i = 0; i < count; i++) {
        viviendas.push({
            SquareFeet: Math.floor(Math.random() * 5000) + 1000,
            Bedrooms: Math.floor(Math.random() * 5) + 1,
            Bathrooms: Math.floor(Math.random() * 3) + 1,
            Neighborhood: `Viviendas_davidalvarezfrias`,
            YearBuilt: Math.floor(Math.random() * (2023 - 1950)) + 1950,
            Price: Math.random() * (500000 - 100000) + 100000,
        });
    }
    return viviendas;
}