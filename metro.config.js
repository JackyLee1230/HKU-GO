const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push("cjs");

module.exports = (async () => {
	const {
		resolver: { assetExts },
	} = await getDefaultConfig(__dirname);
	return {
		transformer: {
			getTransformOptions: async () => ({
				transform: {
					experimentalImportSupport: false,
					inlineRequires: false,
				},
			}),
		},
		resolver: {
			assetExts: [...assetExts, "bin", "cjs"],
		},
	};
})();
