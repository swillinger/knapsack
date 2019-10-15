/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
import log from 'npmlog'; // https://www.npmjs.com/package/npmlog

export function error(msg: string, extra?: any, prefix = ''): void {
  if (extra) {
    log.error(prefix, msg, extra);
  } else {
    log.error(prefix, msg);
  }
}

export function info(msg: string, extra?: any, prefix = ''): void {
  if (extra) {
    log.info(prefix, msg, extra);
  } else {
    log.info(prefix, msg);
  }
}

export function warn(msg: string, extra?: any, prefix = ''): void {
  if (extra) {
    log.warn(prefix, msg, extra);
  } else {
    log.warn(prefix, msg);
  }
}

export function verbose(msg: string, extra?: any, prefix = ''): void {
  if (extra) {
    log.verbose(prefix, msg, extra);
  } else {
    log.verbose(prefix, msg);
  }
}

export function silly(msg: string, extra?: any, prefix = ''): void {
  if (extra) {
    log.silly(prefix, msg, extra);
  } else {
    log.silly(prefix, msg);
  }
}

type LogLevelValues = 'error' | 'warn' | 'http' | 'info' | 'verbose' | 'silly';

export function setLogLevel(level: LogLevelValues): void {
  // info(`Setting loglevel to ${level}`);
  log.level = level;
}

setLogLevel((process.env.KNAPSACK_LOG_LEVEL as LogLevelValues) || 'info');
