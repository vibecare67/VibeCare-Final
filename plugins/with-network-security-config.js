// plugins/with-network-security-config.js
const { withAndroidManifest, withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withNSC(config) {
  // 1) Manifest me attribute lagao
  return withAndroidManifest(config, (c) => {
    const app = c.modResults.manifest.application?.[0];
    if (app && !app.$["android:networkSecurityConfig"]) {
      app.$["android:networkSecurityConfig"] = "@xml/network_security_config";
    }
    return c;
  })
  // 2) XML resource likho
  && withDangerousMod(config, [
    "android",
    async (c) => {
      const resXmlDir = path.join(c.modRequest.platformProjectRoot, "app", "src", "main", "res", "xml");
      fs.mkdirSync(resXmlDir, { recursive: true });
      const xml = `
<network-security-config>
  <base-config cleartextTrafficPermitted="true">
    <trust-anchors>
      <certificates src="system" />
    </trust-anchors>
  </base-config>
  <domain-config cleartextTrafficPermitted="true">
    <!-- IP allow -->
    <domain includeSubdomains="false">16.16.204.221</domain>
  </domain-config>
</network-security-config>
      `.trim();
      fs.writeFileSync(path.join(resXmlDir, "network_security_config.xml"), xml);
      return c;
    },
  ]);
};