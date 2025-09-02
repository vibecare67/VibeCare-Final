// plugins/with-network-security-config.js
const { withAndroidManifest, withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withNSC(config) {
  // 1) Add networkSecurityConfig attribute in AndroidManifest
  config = withAndroidManifest(config, (c) => {
    const app = c.modResults.manifest.application?.[0];
    if (app && !app.$["android:networkSecurityConfig"]) {
      app.$["android:networkSecurityConfig"] = "@xml/network_security_config";
    }
    return c;
  });

  // 2) Generate network_security_config.xml file
  config = withDangerousMod(config, [
    "android",
    async (c) => {
      const resXmlDir = path.join(
        c.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "res",
        "xml"
      );
      fs.mkdirSync(resXmlDir, { recursive: true });

      const xml = `
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <!-- Allow all cleartext traffic (for dev/testing) -->
  <base-config cleartextTrafficPermitted="true">
    <trust-anchors>
      <certificates src="system" />
    </trust-anchors>
  </base-config>
</network-security-config>
      `.trim();

      fs.writeFileSync(path.join(resXmlDir, "network_security_config.xml"), xml);
      return c;
    },
  ]);

  return config;
};
