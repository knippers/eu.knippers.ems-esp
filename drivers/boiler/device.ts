import Homey from "homey";
import { EmsEspClient } from "../../lib/ems-esp-client";
import {
  formatLastCode,
  parseLastCode,
  polling,
  setCapabilityValues,
} from "../../lib/utils";
import { BoilerData } from "../../lib/types";

// hpin2opt/hpin4opt are EMS-ESP option bitstrings. Only the first character
// reflects the on/off state we care about here; the rest of the digits are
// fixed configuration on this install and must be preserved as-is.
function isOptionOn(value: string | undefined): boolean {
  return value?.charAt(0) === "1";
}

function withOptionState(value: string, on: boolean): string {
  return `${on ? "1" : "0"}${value.slice(1)}`;
}

export class BoilerDevice extends Homey.Device {
  private stopPolling: (() => void) | null = null;
  private lastData: BoilerData | null = null;

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
      ["boiler_compressor_activity", this.getCompressorActivityLabel(data.hpactivity)],
      ["boiler_hpcurrpower", data.hpcurrpower],
      ["boiler_hpin4opt", isOptionOn(data.hpin4opt)],
      ["boiler_hpin2opt", isOptionOn(data.hpin2opt)]
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
          this.lastData = res;
          await this.updateCapabilityValues(res).catch(this.error);
          await this.setAvailable().catch(this.error);
          await this.triggerFlows(res).catch(this.error);
        }
      }
    );
  }

  async onInit() {
    this.registerCapabilityListener("boiler_hpin4opt", async (value: boolean) => {
      const current = this.lastData?.hpin4opt;
      if (current === undefined) {
        this.error("Cannot update Solar Active, hpin4opt value not known yet");
        return;
      }
      const data = withOptionState(current, value);
      this.log(`Setting Solar Active to ${value} (hpin4opt=${data})`);
      await this.client.setBoilerValue("hpin4opt", data).catch(this.error);
    });

    this.registerCapabilityListener("boiler_hpin2opt", async (value: boolean) => {
      const current = this.lastData?.hpin2opt;
      if (current === undefined) {
        this.error("Cannot update Block Heatpump, hpin2opt value not known yet");
        return;
      }
      const data = withOptionState(current, value);
      this.log(`Setting Block Heatpump to ${value} (hpin2opt=${data})`);
      await this.client.setBoilerValue("hpin2opt", data).catch(this.error);
    });

    // Flow actions reuse the capability listeners above, so the device's
    // capability state stays in sync regardless of whether it's toggled
    // from the UI or from a Flow.
    this.homey.flow
      .getActionCard("boiler_set_solar_active")
      .registerRunListener(async (args: { state: "on" | "off" }) => {
        await this.triggerCapabilityListener("boiler_hpin4opt", args.state === "on");
      });

    this.homey.flow
      .getActionCard("boiler_set_block_heatpump")
      .registerRunListener(async (args: { state: "on" | "off" }) => {
        await this.triggerCapabilityListener("boiler_hpin2opt", args.state === "on");
      });

    this.startPolling();
  }

  onDeleted() {
    this.stopPolling?.();
  }
}

module.exports = BoilerDevice;
