import { Mutex } from "async-mutex";

export type Settings = {
  network_address: string;
  access_token: string;
};

export type DeviceSettings = {
  networkAddress: string;
  accessToken: string;
  pollInterval: number;
  mutex: Mutex;
  timeout: NodeJS.Timeout | null;
};

export type SystemData = {
  "system": SystemInfo;
  "network": unknown;
  "ntp": unknown;
  "mqtt": unknown;
  "syslog": unknown;
  "sensor": unknown;
  "api": unknown;
  "bus": unknown;
  "settings": unknown;
  "devices": Array<DeviceData>;
};

export type SystemInfo = {
  "version": string;
  "platform": string;
  "uptime": string;
  "uptimeSec": number;
  "freeMem": number;
  "maxAlloc": number;
  "freeApp": number;
  "resetReason": string;
};

export type DeviceType =
  | "boiler"
  | "thermostat"
  | "heatpump"
  | "heatsource"
  | "solar"
  | "connect"
  | "mixer"
  | "controller"
  | "switch"
  | "gateway"
  | "alert"
  | "pump";

export type DeviceData = {
  "type": DeviceType;
  "name": string;
  "deviceID": string;
  "productID": string;
  "version": string;
  "entities": number;
  "handlersReceived": string;
  "handlersFetched": string;
  "handlersPending": string;
  "handlersIgnored": string;
};

export type BoilerData = {
  "auxelecheatnrgconsheating": number; // aux elec. heater energy consumption heating (read-only)
  "auxelecheatnrgconspool": number; // aux elec. heater energy consumption pool (read-only)
  "auxelecheatnrgconstotal": number; // total aux elec. heater energy consumption (read-only)
  "auxheaterdelay": number; // aux heater on delay
  "auxheaterlevel": number; // aux heater level (read-only)
  "auxheateroff": "on" | "off" // disable aux heater
  "auxheateronly": "on" | "off" // aux heater only
  "auxheaterstatus": "off" | "heating" | "cooling" | "hot water" | "pool" | "pool heating" | "defrost" | "compressor alarm"; // aux heater status (read-only)
  "auxheatmix": number; // aux heater mixing valve (read-only)
  "auxheatrmode": "eco" | "comfort"; // aux heater mode
  "auxlimitstart": number; // aux heater limit start
  "auxmaxlimit": number; // aux heater max limit
  "boiltemp": number; // actual boiler temperature (read-only)
  "burn2workmin": number; // burner stage 2 operating time (read-only)
  "burnstarts": number; // burner starts (read-only)
  "burnworkmin": number; // total burner operating time (read-only)
  "coolingstarts": number; // cooling control starts (read-only)
  "curburnpow": number; // burner current power (read-only)
  "curflowtemp": number; // current flow temperature (read-only)
  "elheatstep1": "on" | "off" // el. heater step 1
  "elheatstep2": "on" | "off" // el. heater step 2
  "elheatstep3": "on" | "off" // el. heater step 3
  "emergencyops": "on" | "off" // emergency operation
  "emergencytemp": number; // emergency temperature
  "fan": number; // fan
  "headertemp": number; // low loss header (read-only)
  "heatcable": "on" | "off" // heating cable
  "heatingactivated": "on" | "off" // heating activated
  "heatingactive": "on" | "off" // heating active (read-only)
  "heatingoff": "on" | "off" // force heating off
  "heatingpump": "on" | "off" // heating pump (read-only)
  "heatingpumpmod": number; // heating pump modulation (read-only)
  "heatingstarts": number; // heating control starts (read-only)
  "heatingtemp": number; // heating temperature
  "heatstarts": number; // burner starts heating (read-only)
  "heatworkmin": number; // total heat operating time (read-only)
  "hp3way": "on" | "off" // 3-way valve
  "hp4way": "cooling & defrost" | "heating & dhw"; // 4-way valve (VR4) (read-only)
  "hpactivity": "off" | "heating" | "cooling" | "hot water" | "pool" | "pool heating" | "defrost" | "compressor alarm"; // compressor activity (read-only)
  "hpbrinein": number; // brine in/evaporator (read-only)
  "hpbrineout": number; // brine out/condenser (read-only)
  "hpbrinepumpspd": number; // brine pump speed (read-only)
  "hpcircspd": number; // circulation pump speed (read-only)
  "hpcompon": "on" | "off" // hp compressor (read-only)
  "hpcompspd": number; // compressor speed (read-only)
  "hpcurrpower": number; // compressor current power (read-only)
  "hpea0": "on" | "off" // condensate reservoir heating (EA0) (read-only)
  "hphystcool": number; // on/off hyst cool
  "hphystheat": number; // on/off hyst heat
  "hphystpool": number; // on/off hyst pool
  "hpin1": "on" | "off" // input 1 state (read-only)
  "hpin1opt": string; // input 1 options
  "hpin2": "on" | "off" // input 2 state (read-only)
  "hpin2opt": string; // input 2 options
  "hpin3": "on" | "off" // input 3 state (read-only)
  "hpin3opt": string; // input 3 options
  "hpin4": "on" | "off" // input 4 state (read-only)
  "hpin4opt": string; // input 4 options
  "hpmaxpower": number; // compressor max power
  "hpph1": number; // high pressure side temperature (PH1) (read-only)
  "hppl1": number; // low pressure side temperature (PL1) (read-only)
  "hppower": number; // compressor power output (read-only)
  "hppowerlimit": number; // power limit
  "hppumpmode": "auto" | "continuous"; // primary heatpump mode
  "hpsetdiffpress": number; // set differential pressure
  "hpswitchvalve": "on" | "off" // switch valve (read-only)
  "hpta4": number; // drain pan temp (TA4) (read-only)
  "hptc0": number; // heat carrier return (TC0) (read-only)
  "hptc1": number; // heat carrier forward (TC1) (read-only)
  "hptc3": number; // condenser temperature (TC3) (read-only)
  "hptl2": number; // air inlet temperature (TL2) (read-only)
  "hptr1": number; // compressor temperature (TR1) (read-only)
  "hptr3": number; // refrigerant temperature liquid side (condenser output) (TR3) (read-only)
  "hptr4": number; // evaporator inlet temperature (TR4) (read-only)
  "hptr5": number; // compressor inlet temperature (TR5) (read-only)
  "hptr6": number; // compressor outlet temperature (TR6) (read-only)
  "hptr7": number; // refrigerant temperature gas side (condenser input) (TR7) (read-only)
  "hptw1": number; // reservoir temp (TW1) (read-only)
  "lastcode": string; // last error code (read-only)
  "maintenance": "off" | "time" | "date" | "manual"; // maintenance scheduled
  "maintenancedate": string; // next maintenance date
  "maintenancemessage": string; // maintenance message (read-only)
  "maintenancetime": number; // time to next maintenance
  "mandefrost": "on" | "off" // manual defrost
  "maxheatcomp": "0 kW" | "2 kW" | "3 kW" | "4 kW" | "6 kW" | "9 kW"; // heat limit compressor
  "maxheatheat": "0 kW" | "2 kW" | "3 kW" | "4 kW" | "6 kW" | "9 kW"; // heat limit heating
  "metercomp": number; // meter compressor (read-only)
  "metercool": number; // meter cooling (read-only)
  "metereheat": number; // meter e-heater (read-only)
  "meterheat": number; // meter heating (read-only)
  "metertotal": number; // meter total (read-only)
  "mintempsilent": number; // min outside temp for silent mode
  "nrgconscompcooling": number; // energy consumption compressor cooling (read-only)
  "nrgconscompheating": number; // energy consumption compressor heating (read-only)
  "nrgconscomppool": number; // energy consumption compressor pool (read-only)
  "nrgconscomptotal": number; // total energy consumption compressor (read-only)
  "nrgconstotal": number; // total energy consumption (read-only)
  "nrgcool": number; // energy cooling (read-only)
  "nrgheat": number; // energy heating (read-only)
  "nrgsuppcooling": number; // total energy supplied cooling (read-only)
  "nrgsuppheating": number; // total energy supplied heating (read-only)
  "nrgsupppool": number; // total energy supplied pool (read-only)
  "nrgsupptotal": number; // total energy supplied (read-only)
  "nrgtotal": number; // total energy (read-only)
  "outdoortemp": number; // outside temperature (read-only)
  "pc0flow": number; // Flow PC0 (read-only)
  "pc1flow": number; // Flow PC1 (read-only)
  "pc1on": "on" | "off" // PC1 (read-only)
  "pc1rate": number; // PC1 rate (read-only)
  "poolsettemp": number; // pool set temperature
  "poolstarts": number; // pool control starts (read-only)
  "powerreduction": number; // power reduction
  "primepump": "on" | "off" // primary heatpump
  "primepumpmod": number; // primary heatpump modulation
  "pumpcharacter": "proportional" | "150mbar" | "200mbar" | "250mbar" | "300mbar" | "350mbar" | "400mbar"; // boiler pump characteristic
  "pumpdelay": number; // pump delay
  "pumpmode": "proportional" | "deltaP-1" | "deltaP-2" | "deltaP-3" | "deltaP-4"; // boiler pump mode
  "pumpmodmax": number; // boiler pump max power
  "pumpmodmin": number; // boiler pump min power
  "pumpontemp": number; // pump logic temperature
  "pvcooling": "on" | "off" // cooling only with PV
  "pvmaxcomp": number; // pv compressor max power
  "reset": "-" | "maintenance" | "error" | "history" | "message"; // reset
  "rettemp": number; // return temperature (read-only)
  "selburnpow": number; // burner selected max power
  "selflowtemp": number; // selected flow temperature
  "servicecode": string; // service code (read-only)
  "servicecodenumber": number; // service code number (read-only)
  "shutdown": "off" | "on"; // shutdown
  "silentfrom": number; // silent mode from
  "silentmode": "off" | "auto" | "on"; // silent mode
  "silentto": number; // silent mode to
  "switchtemp": number; // mixing switch temperature (read-only)
  "syspress": number; // system pressure (read-only)
  "tapwateractive": "on" | "off" // tapwater active (read-only)
  "tempdiffcool": number; // temp diff TC3/TC0 cool
  "tempdiffheat": number; // temp diff TC3/TC0 heat
  "tempparmode": number; // outside temp parallel mode
  "totalcompstarts": number; // total compressor control starts (read-only)
  "ubauptime": number; // total UBA operating time (read-only)
  "uptimecompcooling": number; // operating time compressor cooling (read-only)
  "uptimecompheating": number; // operating time compressor heating (read-only)
  "uptimecomppool": number; // operating time compressor pool (read-only)
  "uptimecontrol": number; // total operating time heat (read-only)
  "uptimetotal": number; // heatpump total uptime (read-only)
  "vc0valve": "on" | "off" // VC0 valve
  "vpcooling": "on" | "off" // valve/pump cooling
  "dhw": { 
    "3wayvalve": "on" | "off" // dhw 3-way valve active (read-only)
    "activated": "on" | "off" // dhw activated
    "active": "on" | "off" // dhw active (read-only)
    "alternatingop": "on" | "off" // dhw alternating operation
    "altopprio": number; // dhw prioritise dhw during heating
    "altopprioheat": number; // dhw prioritise heating during dhw
    "auxelecheatnrgcons": number; // dhw aux elec. heater energy consumption (read-only)
    "chargeoptimization": "on" | "off" // dhw charge optimization
    "chargetype": "chargepump" | "3-way valve"; // dhw charging type (read-only)
    "charging": "on" | "off" // dhw charging (read-only)
    "circ": "on" | "off" // dhw circulation active
    "circmode": "off" | "1x3min" | "2x3min" | "3x3min" | "4x3min" | "5x3min" | "6x3min" | "continuous"; // dhw circulation pump mode
    "circpump": "on" | "off" // dhw circulation pump available
    "comfdiff": number; // dhw comfort diff
    "comfoff": number; // dhw comfort switch off
    "comfort": "hot" | "eco" | "intelligent"; // dhw comfort
    "comfort1": "high comfort" | "eco"; // dhw comfort mode
    "comfstop": number; // dhw comfort stop temp
    "curflow": number; // dhw current tap water flow (read-only)
    "curtemp": number; // dhw current intern temperature (read-only)
    "curtemp2": number; // dhw current extern temperature (read-only)
    "cylmiddletemp": number; // dhw cylinder middle temperature (TS3) (read-only)
    "disinfecting": "on" | "off" // dhw disinfecting
    "disinfectiontemp": number; // dhw disinfection temperature
    "ecodiff": number; // dhw eco diff
    "ecooff": number; // dhw eco switch off
    "ecoplusdiff": number; // dhw eco+ diff
    "ecoplusoff": number; // dhw eco+ switch off
    "ecoplusstop": number; // dhw eco+ stop temp
    "ecostop": number; // dhw eco stop temp
    "flowtempoffset": number; // dhw flow temperature offset
    "hpcircpump": "on" | "off" // dhw circulation pump available during dhw
    "hystoff": number; // dhw hysteresis off temperature
    "hyston": number; // dhw hysteresis on temperature
    "maxheat": "0 kW" | "2 kW" | "3 kW" | "4 kW" | "6 kW" | "9 kW"; // dhw heat limit
    "maxpower": number; // dhw max power
    "maxtemp": number; // dhw maximum temperature
    "meter": number; // dhw meter (read-only)
    "mixertemp": number; // dhw mixer temperature (read-only)
    "nrg": number; // dhw energy (read-only)
    "nrgconscomp": number; // dhw energy consumption compressor (read-only)
    "nrgsupp": number; // dhw total energy warm supplied (read-only)
    "onetime": "on" | "off" // dhw one time charging
    "recharging": "on" | "off" // dhw recharging (read-only)
    "seltemp": number; // dhw selected temperature
    "seltemplow": number; // dhw selected lower temperature
    "seltempoff": number; // dhw selected temperature for off (read-only)
    "seltempsingle": number; // dhw single charge temperature
    "settemp": number; // dhw set temperature (read-only)
    "solartemp": number; // dhw solar boiler temperature (read-only)
    "starts": number; // dhw starts (read-only)
    "startshp": number; // dhw starts hp (read-only)
    "storagetemp1": number; // dhw storage intern temperature (read-only)
    "storagetemp2": number; // dhw storage extern temperature (read-only)
    "tapactivated": "on" | "off" // dhw turn on/off
    "tempecoplus": number; // dhw selected eco+ temperature
    "tempok": "on" | "off" // dhw temperature ok (read-only)
    "type": "off" | "flow" | "buffered flow" | "buffer" | "layered buffer"; // dhw type (read-only)
    "uptimecomp": number; // dhw operating time compressor (read-only)
    "workm": number; // dhw active time (read-only)
  }
};

export type ThermostatData = {
  "absent": "on" | "off" // absent
  "building": "light" | "medium" | "heavy"; // building type
  "dampedoutdoortemp": number; // damped outdoor temperature (read-only)
  "damping": "on" | "off" // damping outdoor temperature
  "datetime": string; // date/time
  "delayboiler": number; // delay boiler support
  "electricfactor": number; // electric energy factor
  "energycostratio": number; // energy cost ratio
  "errorcode": string; // error code (read-only)
  "floordry": "off" | "start" | "heat" | "hold" | "cool" | "end"; // floor drying (read-only)
  "floordrytemp": number; // floor drying temperature (read-only)
  "fossilefactor": number; // fossile energy factor
  "hybridstrategy": "co2 optimized" | "cost optimized" | "outside temp switched" | "co2 cost mix"; // hybrid control strategy
  "intoffset": number; // internal temperature offset
  "lastcode": string; // last error code (read-only)
  "minexttemp": number; // minimal external temperature
  "pvenabledhw": "on" | "off" // enable raise dhw
  "pvlowercool": number; // lower cooling with PV
  "pvraiseheat": number; // raise heating with PV
  "solar": "on" | "off" // solar
  "switchovertemp": number; // outside switchover temperature
  "tempdiffboiler": number; // temp diff boiler support
  "dhw": { 
    "charge": "on" | "off" // dhw charge
    "chargeduration": number; // dhw charge duration
    "circmode": "off" | "on" | "auto" | "own prog"; // dhw circulation pump mode
    "dailyheating": "on" | "off" // dhw daily heating
    "dailyheattime": number; // dhw daily heating time
    "disinfectday": "mo" | "tu" | "we" | "th" | "fr" | "sa" | "su" | "all"; // dhw disinfection day
    "disinfecting": "on" | "off" // dhw disinfecting
    "disinfecttime": number; // dhw disinfection time
    "extra": "on" | "off" // dhw extra (read-only)
    "mode": "off" | "eco+" | "eco" | "comfort" | "auto"; // dhw operating mode
    "settemp": number; // dhw set temperature
    "settemplow": number; // dhw set low temperature
  },
  "hc1": { 
    "boost": "on" | "off" // hc1 boost mode
    "boosttime": number; // hc1 boost time
    "comforttemp": number; // hc1 comfort temperature
    "control": "off" | "-" | "RC100" | "RC100H" | "-" | "RC120RF" | "RC220/RT800" | "single"; // hc1 control device
    "controlmode": "weather compensated" | "outside basepoint" | "n/a" | "room" | "power" | "constant"; // hc1 control mode
    "coolingon": "on" | "off" // hc1 cooling on (read-only)
    "cooloffdelay": number; // hc1 cooling off delay
    "coolondelay": number; // hc1 cooling on delay
    "coolstart": number; // hc1 cooling starttemp
    "cooltemp": number; // hc1 cooling temperature
    "curroominfl": number; // hc1 current room influence (read-only)
    "currsolarinfl": number; // hc1 curent solar influence (read-only)
    "currtemp": number; // hc1 current room temperature (read-only)
    "designtemp": number; // hc1 design temperature
    "dewoffset": number; // hc1 dew point offset
    "dhwprio": "on" | "off" // hc1 dhw priority
    "ecotemp": number; // hc1 eco temperature
    "fastheatup": number; // hc1 fast heatup
    "haclimate": "selTemp" | "roomTemp"; // hc1 mqtt discovery current room temperature (read-only)
    "heatingtype": "off" | "radiator" | "convector" | "floor"; // hc1 heating type
    "heatoffdelay": number; // hc1 heat-off delay
    "heatondelay": number; // hc1 heat-on delay
    "hpcooling": "on" | "off" // hc1 hp cooling
    "hpminflowtemp": number; // hc1 HP min. flow temp.
    "hpmode": "heating" | "cooling" | "heating & cooling"; // hc1 HP Mode
    "hpoperatingmode": "off" | "auto" | "heating" | "cooling"; // hc1 heatpump operating mode
    "hpoperatingstate": "heating" | "off" | "cooling"; // hc1 heatpump operating state (read-only)
    "instantstart": number; // hc1 instant start
    "manualtemp": number; // hc1 manual temperature
    "maxflowtemp": number; // hc1 max flow temperature
    "minflowtemp": number; // hc1 min flow temperature
    "mode": "off" | "manual" | "auto"; // hc1 operating mode
    "modetype": "eco" | "comfort"; // hc1 mode type (read-only)
    "nofrostmode": "room" | "outdoor" | "room outdoor"; // hc1 nofrost mode
    "nofrosttemp": number; // hc1 nofrost temperature
    "noreducetemp": number; // hc1 no reduce below temperature
    "offsettemp": number; // hc1 offset temperature
    "program": "prog 1" | "prog 2"; // hc1 program
    "redthreshold": number; // hc1 reduction threshold
    "reducemode": "outdoor" | "room" | "reduce"; // hc1 reduce mode
    "reducetemp": number; // hc1 off/reduce switch temperature
    "remotehum": number; // hc1 room humidity from remote
    "remotetemp": number; // hc1 room temperature from remote
    "roominflfactor": number; // hc1 room influence factor
    "roominfluence": number; // hc1 room influence
    "roomtempdiff": number; // hc1 room temp difference
    "seltemp": number; // hc1 selected room temperature
    "solarinfl": number; // hc1 solar influence
    "summermode": "winter" | "summer"; // hc1 summer mode (read-only)
    "summersetmode": "summer" | "auto" | "winter"; // hc1 set summer mode
    "summertemp": number; // hc1 summer temperature
    "switchonoptimization": "on" | "off" // hc1 switch-on optimization
    "switchprogmode": "level" | "absolute"; // hc1 switch program mode
    "targetflowtemp": number; // hc1 target flow temperature (read-only)
    "tempautotemp": number; // hc1 temporary set temperature automode
    "vacationmode": "on" | "off" // hc1 vacation mode (read-only)
  }
};


