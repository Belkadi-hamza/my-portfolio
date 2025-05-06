import data from './data.json';
import { PortfolioData } from './types';

export function getPortfolioData(): PortfolioData {
  return data as PortfolioData;
}