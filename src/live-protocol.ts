import { slides } from './slide-content';

export const presenterKeyPattern = /^[0-9a-f]{64}$/;
export const slideCount = slides.length;
export const isSlide = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < slideCount;

export type RoomSnapshot = {
  type: 'state';
  presenterSlide: number;
  presenterOnline: boolean;
  counts: number[];
  browsing: number;
};
