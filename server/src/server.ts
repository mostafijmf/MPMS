import app from "./app";
import connectDB from "./config/connectDB";
import { PORT } from "./libs/secret";

app.listen(PORT, async () => {
    console.log(`Server is running at ${PORT}`);
    await connectDB();
});