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

  private async updateCapabilityValues(data: BoilerData) {
    return setCapabilityValues(this, [
      ["boiler_curflowtemp", data.curflowtemp],
      ["boiler_dhw_curtemp", data.dhw.curtemp],
      ["boiler_dhw_settemp", data.dhw.settemp],
      ["boiler_outdoortemp", data.outdoortemp],
      ["boiler_rettemp", data.rettemp],
      ["boiler_lastcode", formatLastCode(parseLastCode(data.lastcode))],
      ["boiler_rettemp", data.rettemp],
      ["boiler_metertotal", data.metertotal],
      ["measure_power", data.metertotal]
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
