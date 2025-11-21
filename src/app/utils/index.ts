import pako from "pako";

/** 解压数据 */
export const decompressData = (compressedString: string) => {
  // 1. 将 ISO-8859-1 字符串解码为字节数组
  const byteArray = new Uint8Array(compressedString.length);
  for (let i = 0; i < compressedString.length; i++) {
    byteArray[i] = compressedString.charCodeAt(i) & 0xff; // 取低8位
  }

  // 2. GZIP 解压字节数据
  const decompressedData = pako.inflate(byteArray);

  // 3. 将解压后的字节数组转为 UTF-8 字符串
  return new TextDecoder("utf-8").decode(decompressedData);
};
