// eslint-disable-next-line @typescript-eslint/no-require-imports
const docsPluginExports = require('@docusaurus/plugin-content-docs')
const { default: docsPlugin } = docsPluginExports

async function docsPluginEnhanced(context, options) {
  const docsPluginInstance = await docsPlugin(context, options)

  return {
    ...docsPluginInstance,
    async contentLoaded({ content, allContent, actions }) {
      // Create default plugin pages
      await docsPluginInstance.contentLoaded({ content, allContent, actions })

      // Expose global data for homepage
      const { setGlobalData } = actions

      setGlobalData({
        versions: content.loadedVersions.map(version => ({
          name: version.versionName,
          label: version.label,
          docs: version.docs,
        })),
      })
    },
  }
}

module.exports = Object.assign({}, docsPluginExports, { default: docsPluginEnhanced })
