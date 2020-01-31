import { HistoryElement } from './historyElementInterfase';

export interface ServerResponse {
  id: string;
  owner: string;
  history: Array<HistoryElement>;
}