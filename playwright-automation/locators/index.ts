import login from './login';
import nav_bar from './nav_bar';
import dashboard from './dashboard';
import pricing from './pricing';
import saved_view from './saved_view';
import action_modal from './action_modal';
import voyage_deep_dive from './voyage_deep_dive';
import filters from './filters';
import view_key_metrics from './view_key_metrics';
import admin from './admin';
import performance from './performance';
import usage from './usage';
import config from './config';

export const locatorRegistry = {
  login,
  nav_bar,
  dashboard,
  pricing,
  saved_view,
  action_modal,
  voyage_deep_dive,
  filters,
  view_key_metrics,
  admin,
  performance,
  usage,
  config,
} as const;

export type PageName = keyof typeof locatorRegistry;
export type LocatorKey<P extends PageName> = keyof (typeof locatorRegistry)[P];
