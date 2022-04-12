import { app } from './app'
import { redisClient } from './make-client';

const startUp = async () => {
    console.log("initializing..")

    if (!process.env.CACHE_DURATION) {
        throw new Error("CACHE_DURATION NOT DEFINED");
    }

    const client = redisClient;

    try {
        await client.connect();
        console.log("Redis connected")
    }
    catch (err) {
        console.log(err); //Update this later to throw error
        throw new Error("Unablke to connect to database")
    }
}
//sudo service redis-server start

app.listen(8000, () => {
    console.log('App listening on 8000');
});

startUp();