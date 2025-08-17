// Type declarations for modules without @types packages
declare module '@zxing/browser' {
  import { BinaryBitmap, DecodeHintType, Reader, Result as ZXingResult } from '@zxing/library';
  
  export class BrowserQRCodeReader {
    constructor(reader?: Reader, timeBetweenScansMillis?: number, hints?: Map<DecodeHintType, any>);
    static listVideoInputDevices(): Promise<MediaDeviceInfo[]>;
    decodeFromVideoDevice(deviceId: string | null, videoElement: string | HTMLVideoElement | undefined, callbackFn: (result: ZXingResult | null, error?: Error) => void): Promise<void>;
  }
  
  export { ZXingResult as Result };
  export interface IScannerControls {}
}