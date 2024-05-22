import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";

export function ApiAddImageFile(fieldName: string = 'file') {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          productName: {
            type: 'string',
          },
          productDescription: {
            type: 'string',
          },
          productUrl: {
            type: 'string',
          },
          [fieldName]: { 
            type:'string',
            format: 'binary'
          },
        },
      },
    }),
  );
}

export function ApiUpdateImageFile(fieldName: string = 'file') {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          productName: {
            type: 'string',
          },
          productDescription: {
            type: 'string',
          },
          [fieldName]: { 
            type:'string',
            format: 'binary'
          },
        },
      },
    }),
  );
}

export function ApiaddMinuteFile(fieldName: string = 'file') {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          productMinuteName: {
            type: 'string',
          },
          [fieldName]: { 
            type:'string',
            format: 'binary'
          },
        },
      },
    }),
  );
}