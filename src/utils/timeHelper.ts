import { Resolution } from './enum';

export const getTimestamp = () => {
  return Date.now();
};

//date is timestamp in second
export const getTimeWithResolution = (
  date: number,
  resolution: Resolution | string,
) => {
  return date - (date % +resolution);
};

export const getTimeNowWithResolution = (resolution: Resolution) => {
  const date = getTimestamp();

  return getTimeWithResolution(date, resolution);
};

export const getTimeWithOneDayResolution = (date: number) => {
  return getTimeWithResolution(date, Resolution.OneDay);
};
