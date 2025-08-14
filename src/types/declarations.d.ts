// Type declarations for modules without @types packages
declare module 'sqlite' {
  import sqlite3 from 'sqlite3';
  
  export interface Database {
    prepare: (sql: string) => Statement;
    exec: (sql: string) => void;
    close: () => void;
    run: (sql: string, params?: any[]) => Promise<any>;
    get: (sql: string, params?: any[]) => Promise<any>;
    all: (sql: string, params?: any[]) => Promise<any[]>;
  }

  export interface Statement {
    run: (...params: any[]) => any;
    get: (...params: any[]) => any;
    all: (...params: any[]) => any[];
  }

  export interface OpenOptions {
    filename: string;
    driver: typeof sqlite3.Database;
  }

  export function open(options: OpenOptions): Promise<Database>;
}

declare module '@zxing/browser' {
  import { BinaryBitmap, DecodeHintType, Reader, Result as ZXingResult } from '@zxing/library';
  
  export class BrowserQRCodeReader {
    constructor(reader?: Reader, timeBetweenScansMillis?: number, hints?: Map<DecodeHintType, any>);
    static listVideoInputDevices(): Promise<MediaDeviceInfo[]>;
    decodeFromVideoDevice(deviceId: string | null, videoElement: string | HTMLVideoElement | undefined, callbackFn: (result: ZXingResult | null, error?: Error) => void): Promise<void>;
    // Note: reset() method doesn't exist in the actual implementation
  }
  
  export { ZXingResult as Result };
  export interface IScannerControls {}
}