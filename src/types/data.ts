export type Cell = string | number | boolean | null | Date;

export type Row = Record<string, Cell>;

export type ColumnType = 'string' | 'number' | 'boolean' | 'date';

export interface Column {
  name: string;
  type: ColumnType;
}

export type DataSet = Row[];

export function isNumberCell(v: Cell): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

export function isDateCell(v: Cell): v is Date {
  return v instanceof Date && !Number.isNaN(v.getTime());
}
