const cfServices = require("cf-services");

const getDatabaseUrl = () => {
    try {
        return cfServices("v-buddy-db").credentials.uri;
    } catch (err) {
        return process.env.DATABASE_URL || "mongodb://localhost:27017/OnBoarding";
    }
};

module.exports = {
    getDatabaseUrl
};