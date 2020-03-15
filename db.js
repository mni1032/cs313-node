function connectToDb() {
    const connectionString = process.env.DATABASE_URL || "postgres://mohnqqmhlyxftp:3656ef63652e5d369a0bcc7391b883a8deeee9a2e9bb32a63174683c6b08f626@ec2-23-22-156-110.compute-1.amazonaws.com:5432/d5ps07nkfvc3dm?ssl=true";
    const pool = new Pool({connectionString: connectionString});
    return pool;
}