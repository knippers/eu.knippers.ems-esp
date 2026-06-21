import Homey from "homey";
import { EmsEspClient } from "../../lib/ems-esp-client";
import {
  formatLastCode,
  parseLastCode,
  polling,
  setCapabilityValues,
} from "../../lib/utils";
import { BoilerData } from "../../lib/types";

export class BoilerDevice extends Homey.Device {
  private stopPolling: (() => void) | null = null;

  private get client() {
    return new EmsEspClient(
      this.getSetting("network_address"),
      this.getSetting("access_token")
    );
  }

  private get intervalMs() {
    return Number(this.getSetting("poll_interval") || 10000);
  }

  private triggerFlows(newData: BoilerData) {
    // Don't have to explicity triggers that ends with _changed
    // because Homey does that automatically for us
    // https://apps.developer.homey.app/the-basics/flow#custom-capability-changed
    return this.homey.flow
      .getDeviceTriggerCard("boiler_dhw_curtemp_less_than")
      ?.trigger(this, { boiler_dhw_curtemp: newData.dhw.curtemp }, newData);
  }

  private cleanupError(error: string) {
    if (error === undefined || error === "")
      return "";

    return error.replace("--", "").trim();
  }

  private getCompressorActivityLabel(value: string) {
    switch (value) {
      case "off": return this.homey.__("compressor_activity.off");
      case "heating": return this.homey.__("compressor_activity.heating");
      case "cooling": return this.homey.__("compressor_activity.cooling");
      case "hot water": return this.homey.__("compressor_activity.hot_water");
      case "defrost": return this.homey.__("compressor_activity.defrost");
      case "compressor alarm": return this.homey.__("compressor_activity.alarm");
      default: return this.homey.__("compressor_activity.unknown");
    }
  }

  private async updateCapabilityValues(data: BoilerData) {
    return setCapabilityValues(this, [
      ["boiler_curflowtemp", data.curflowtemp],
      ["boiler_dhw_curtemp", data.dhw.curtemp],
      ["boiler_dhw_settemp", data.dhw.settemp],
      ["measure_temperature", data.outdoortemp],
      ["boiler_rettemp", data.rettemp],
      ["boiler_lastcode", this.cleanupError(data.lastcode)],
      ["boiler_rettemp", data.rettemp],
      ["boiler_syspress", data.syspress],
      ["meter_power", data.metertotal],
      ["boiler_eheater_total", data.metereheat],
      ["boiler_compressor_total", data.metercomp],
      ["boiler_heating_total", data.meterheat],
      ["boiler_dhw_total", data.dhw.meter],
      ["boiler_cool_total", data.metercool],
      ["boiler_compressor_activity", this.getCompressorActivityLabel(data.hpactivity)]
    ]);
  }

  private startPolling() {
    this.stopPolling?.();

    this.stopPolling = polling(
      this.intervalMs,
      () => this.client.getBoilerData(),
      async (err, res) => {
        if (err) {
          this.error(err);
          await this.setUnavailable(`${err}`).catch(this.error);
          // Automatically restart polling after the interval to recover from errors.          
          setTimeout(() => this.startPolling(), this.intervalMs * 2);
        } else if (res) {
          await this.updateCapabilityValues(res).catch(this.error);
          await this.setAvailable().catch(this.error);
          await this.triggerFlows(res).catch(this.error);
        }
      }
    );
  }

  async onInit() {
    this.startPolling();
  }

  onDeleted() {
    this.stopPolling?.();
  }
}

module.exports = BoilerDevice;
