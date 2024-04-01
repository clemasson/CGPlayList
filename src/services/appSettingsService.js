import settings from "./appSettings.json";

const appSettingsService = new class 
{

  get(setting) {
    if (!this.envSettings) { this.setEnv("prod"); }
    return this.envSettings[setting];
  }

  set(setting, value) {
    if (!this.envSettings) { this.setEnv("prod"); }
    this.envSettings[setting] = value;
  }

  getEnv() {
    return this.env;
  }

  setEnv(value) {
    console.log("Set environment ",value,settings)

    this.envSettings = settings[value];
    this.env = value;

    console.log("Set env = ",this.envSettings)
  }

  constructor() {
    this.env="";
    this.envSettings="";
  }
};

export default appSettingsService;
