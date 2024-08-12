declare var process: {
  env: any;
};

const APP_VERSION = process.env.VERSION;
const API_URL = process.env.API_URL;
const AUTH_API_URL = process.env.AUTH_API_URL;
const AUTH_API_CLIENT_KEY = process.env.AUTH_API_CLIENT;
const AUTH_API_CLIENT_VALUE = process.env.AUTH_API_CLIENT_TOKEN;
const AUTH_REDIRECT_URL = process.env.AUTH_REDIRECT_URL;
const STORAGE_SECRET = process.env.STORAGE_SECRET;
const STORAGE_API_HOST = process.env.STORAGE_API_HOST;
const STORAGE_API_SECRET = process.env.STORAGE_API_SECRET;
const STORAGE_API_CLIENT = process.env.STORAGE_API_CLIENT;
const STORAGE_UPLOAD_VOLUME = process.env.STORAGE_UPLOAD_VOLUME;
const STORAGE_UPLOAD_DIRECTORY = process.env.STORAGE_UPLOAD_DIRECTORY;
const STORAGE_UPLOAD_PATH = process.env.STORAGE_UPLOAD_PATH;
const STORAGE_OBJECT_PATH = process.env.STORAGE_OBJECT_PATH;
const MODULE_NAME = process.env.MODULE_NAME;
const APP_LOGO_ASSET_PATH = process.env.APP_LOGO_ASSET_PATH;

export const environment = {
  production: false,
  version: APP_VERSION,
  api: {
    host: `${API_URL}`,
    endpoints: {},
  },
  app: {
    routing: {},
  },
  forms: {
    host: `${API_URL}`,
  },
  auth: {
    local: {
      host: `${AUTH_API_URL}`,
      clients: {
        id: `${AUTH_API_CLIENT_KEY}`,
        secret: `${AUTH_API_CLIENT_VALUE}`,
      },
    },
    redirect: {
      url: `${AUTH_REDIRECT_URL}`,
    },
  },
  storage: {
    host: STORAGE_API_HOST,
    secret: STORAGE_SECRET,
    client_id: STORAGE_API_CLIENT,
    client_secret: STORAGE_API_SECRET,
    volume: STORAGE_UPLOAD_VOLUME,
    directory: STORAGE_UPLOAD_DIRECTORY,
    paths: {
      updload: STORAGE_UPLOAD_PATH,
      storage_object: STORAGE_OBJECT_PATH,
    },
  },
  module: {
    name: MODULE_NAME,
    company_name: '',
    company_description: '',
    logoAssetPath: APP_LOGO_ASSET_PATH,
  },
  imgAmuPath: '',
  appServiceName: '',
  logoAssetPath: '',
};
