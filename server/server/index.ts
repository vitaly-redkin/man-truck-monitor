/**
 * Server "entry point".
 */
import './common/env';
import Server from './common/server';
import routes from './routes';
import { getDb } from './db';

const port = parseInt(process.env.PORT);

const init = async () => await getDb();
init();

export default new Server().router(routes).listen(port);
