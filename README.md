# Homey Pro app for EMS-ESP

WIP: It is a fork of https://github.com/angas/se.assermark.ems-esp, it works for the mentioned Heatpump for what I need now, it is not ready for as-is-deployment to the Homey. I plan to make it more feature complete (thermostat, set smartgrid state, more metrics and tested flows). Ideally it should be more generic so it will be easier to add other Heatpumps connected to EMS-ESP. 

Adds thermostat and boiler support for the Homey Pro in a simplistic manner. Use it for inspiration and as a launch pad for your own project.

Communication with EMS-ESP is done via HTTP/REST.

# Getting Started

Install the [Homey CLI](https://apps.developer.homey.app/the-basics/getting-started#1.-install-homey-cli) then run the following [command](https://apps.developer.homey.app/the-basics/getting-started#3.-run-the-homey-app) to start the Homey app on your device of choice.

```
homey app run
```

## Tested on

- Homey Pro (early 2023)
- Bosch 5800i
- EMS-ESP 2.7.2

## Configuration

Both drivers (Thermostat and Boiler) pair against the same EMS-ESP device and need:

- **Network Address** — hostname or IP of EMS-ESP (default `ems-esp.local`)
- **Access Token** — only required for write actions (toggles, target temperature, flow actions). Found in the EMS-ESP web interface under Security > Manage Users.
- **Poll interval** — how often the device is polled, in ms (default `5000`)

## Implemented entities

### Thermostat

| Capability | EMS-ESP field | Access | Description |
|---|---|---|---|
| `target_temperature` | `hc1.seltemp` | Read/write | Selected room temperature |
| `measure_temperature` | `hc1.seltemp` | Read | Current room temperature |

### Boiler

| Capability | EMS-ESP field | Access | Unit | Description |
|---|---|---|---|---|
| `boiler_curflowtemp` | `curflowtemp` | Read | °C | Flow temperature |
| `boiler_rettemp` | `rettemp` | Read | °C | Return temperature |
| `boiler_syspress` | `syspress` | Read | Bar | System pressure |
| `boiler_lastcode` | `lastcode` | Read | – | Last error code |
| `boiler_compressor_activity` | `hpactivity` | Read | – | Compressor activity (off / heating / cooling / hot water / defrost / alarm) |
| `boiler_hpcurrpower` | `hpcurrpower` | Read | W | Current compressor power |
| `boiler_hpin4opt` | `hpin4opt` | Read/write | – | Solar panels active. Only the first character of the EMS-ESP option string is changed when toggled; the rest is preserved as-is. |
| `boiler_hpin2opt` | `hpin2opt` | Read/write | – | Block heatpump. Same first-character toggle behaviour as above. |
| `boiler_dhw_curtemp` | `dhw.curtemp` | Read | °C | Tank temperature |
| `boiler_dhw_settemp` | `dhw.settemp` | Read | °C | Tank setpoint |
| `boiler_dhw_total` | `dhw.meter` | Read | kWh | Total hot water energy |
| `boiler_compressor_total` | `metercomp` | Read | kWh | Total compressor energy |
| `boiler_heating_total` | `meterheat` | Read | kWh | Total heating energy |
| `boiler_eheater_total` | `metereheat` | Read | kWh | Total e-heater energy |
| `boiler_cool_total` | `metercool` | Read | kWh | Total cooling energy |
| `meter_power` | `metertotal` | Read | kWh | Total power meter |
| `measure_temperature` | `outdoortemp` | Read | °C | Outdoor temperature |

## Flows

### Triggers

- **Heatpum last code changed** *(Boiler)* — fires when the last error code changes.
- **Tap water temp less than [[temp]]°C** *(Boiler)* — fires when the tank temperature drops below the given value.
- **Heatpump operating state changed** *(Thermostat)* — fires when the heatpump's operating state changes.

### Conditions

- **Outdoor temperature greater than [[temp]]°C** *(Thermostat)*
- **Outdoor temperature less than [[temp]]°C** *(Thermostat)*

### Actions

- **Set Solar Active to On/Off** *(Boiler)* — toggles `boiler_hpin4opt`.
- **Set Block Heatpump to On/Off** *(Boiler)* — toggles `boiler_hpin2opt`.

