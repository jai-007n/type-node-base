import { initializeApp } from  './initializers/index'

const startServer = async (): Promise<void> => {
  await initializeApp();
};

export default startServer;