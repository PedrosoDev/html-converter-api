import { env } from "./env";
import { server } from "./server";

const { PORT } = env;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
