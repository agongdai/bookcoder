import React from 'react';

export interface PropsWithChildren {
  children: React.ReactNode;
  className?: string;
}

export type Option = {
  label: string | React.ReactNode;
  value: string | number;
  href?: string;
};

export const enum Status {
  Active = 'active',
  Inactive = 'inactive',
}

export enum Severity {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export enum ExchangeStatus {
  Operative = 1,
  Maintenance = 0,
}

export const enum ValueFormat {
  Number = 'number',
  Money = 'money',
  Percentage = 'percentage',
  Date = 'date',
  Boolean = 'boolean',
  String = 'string',
  Coin = 'coin',
  Volume = 'volume',
  Image = 'image',
  Exchange = 'exchange',
  Link = 'link',
  CoinIcon = 'coinIcon',
  WalletAddress = 'walletAddress',
  DateTime = 'dateTime',
}

export type Value = string | number | boolean | Date | null | undefined;

export type FunctionType = (...args: any[]) => any;
