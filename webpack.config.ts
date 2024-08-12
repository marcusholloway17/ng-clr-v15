import { Configuration } from 'webpack';
import * as webpack from 'webpack';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Sanitizes environment variables for production
 */
function sanitizeForAngular(_object: Record<string, any>) {
  return (Object.keys(_object) as (keyof typeof _object)[]).reduce(
    (carr, curr) => {
      carr[curr] = JSON.stringify(_object[curr]);
      return carr;
    },
    {} as Record<string, any>
  );
}

export default {
  plugins: [
    new webpack.DefinePlugin(
      sanitizeForAngular({
        'process.env.VERSION': process.env['VERSION'],
        'process.env.API_URL': process.env['API_URL'],
        'process.env.AUTH_API_URL': process.env['AUTH_API_URL'],
        'process.env.AUTH_API_CLIENT': process.env['AUTH_API_CLIENT'],
        'process.env.AUTH_API_CLIENT_TOKEN':
          process.env['AUTH_API_CLIENT_TOKEN'],
        'process.env.AUTH_REDIRECT_URL': process.env['AUTH_REDIRECT_URL'],
        'process.env.STORAGE_SECRET': process.env['STORAGE_SECRET'],
        'process.env.STORAGE_API_HOST': process.env['STORAGE_API_HOST'],
        'process.env.STORAGE_API_CLIENT': process.env['STORAGE_API_CLIENT'],
        'process.env.STORAGE_API_SECRET': process.env['STORAGE_API_SECRET'],
        'process.env.STORAGE_UPLOAD_DIRECTORY':
          process.env['STORAGE_UPLOAD_DIRECTORY'],
        'process.env.STORAGE_UPLOAD_VOLUME':
          process.env['STORAGE_UPLOAD_VOLUME'],
        'process.env.STORAGE_UPLOAD_PATH': process.env['STORAGE_UPLOAD_PATH'],
        'process.env.STORAGE_OBJECT_PATH': process.env['STORAGE_OBJECT_PATH'],
        'process.env.MODULE_NAME': process.env['MODULE_NAME'],
        'process.env.APP_LOGO_ASSET_PATH': process.env['APP_LOGO_ASSET_PATH'],
      })
    ),
  ],
} as Configuration;
