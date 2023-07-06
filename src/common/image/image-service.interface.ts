export interface ImageServiceInterface<T> {
  createThumbnail(file: T, data: T): Promise<T>;
  createImage(file: T, data: T): Promise<T>;
}
