import log from './logger';
import { server as baseServer, routeConfiguringFunction as makeRouter } from 'appium-base-driver';
import WechatDriver from './driver';

async function startServer (port, address, relaxedSecurityEnabled = false) {
  const d = new WechatDriver({port, address});
  d.relaxedSecurityEnabled = relaxedSecurityEnabled;
  const routeConfiguringFunction = makeRouter(d);
  const server = await baseServer({routeConfiguringFunction, port, hostname: address});
  log.info(`Wechat Driver server listening on http://${address}:${port}`);
  return server;
}

export { startServer };
