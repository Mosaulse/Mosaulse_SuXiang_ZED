const fs = require("fs");

function convertSyntaxHighlighting(tokenColors) {
  const syntax = {};

  const scopeMapping = {
    variable: ["variable", "variable.other.readwrite", "entity.name.variable"],
    "variable.builtin": ["variable.defaultLanguage", "variable"],
    "variable.parameter": ["variable.parameter", "variable"],
    // "variable.member": [],
    // "variable.special": [],
    constant: ["constant", "variable.readonly", "variable.other.constant"],
    "constant.builtin": ["constant.defaultLibrary", "variable.readonly.defaultLibrary", "support.constant", "constant"],
    "constant.macro": ["macro"],
    module: ["entity.name.module"],
    label: ["label"],
    string: ["string"],
    "string.documentation": ["string.documentation", "documentation", "string"],
    "string.documentation": ["string.documentation", "documentation", "string"],
    "string.regexp": ["string.regexp"],
    "string.regex": ["string.regexp"],
    // "string.escape": [],
    // "string.special": [],
    // "string.special.path": [],
    // "string.special.symbol": [],
    // "string.special.url": [],
    charcter: ["charcter", "string"],
    "character.special": ["character.special", "string.regexp"],
    boolean: [],
    number: ["number", "constant.numeric"],
    // "number.float": [],
    // float: [],
    function: ["function", "entity.name.function"],
    "function.builtin": ["function.defaultLibrary", "support.function"],
    "function.call": ["function", "entity.name.function"],
    "function.decorator": ["decorator"],
    "function.macro": ["macro", "entity.name.function.macro"],
    "function.method": ["method", "entity.name.method"],
    "function.method.call": ["method", "entity.name.method"],
    type: ["type", "support.type", "entity.name.type"],
    "type.builtin": ["type.defaultLibrary", "type.language", "type", "entity.name.type", "support.type"],
    "type.definition": ["type.definition", "type"],
    "type.interface": ["interface", "entity.name.type.interface", "type"],
    // "type.super": [],
    attribute: ["attribute"],
    operator: ["operator", "keyword.operator", "keyword"],
    namespace: ["namespace", "entity.name.namespace"],
    enum: ["enum", "entity.name.type.enum"],
    class: ["class", "entity.name.type.class", "support.class"],
    property: ["property", "variable.other.property"],
    keyword: ["keyword", "keyword.control"],
    "keyword.type": ["type.defaultLibrary", "keyword.type", "keyword"],
    "keyword.function": ["function.defaultLibrary", "keyword.function", "keyword"],
    "keyword.operator": ["operator", "keyword.operator", "keyword"],
    "keyword.import": ["keyword.import", "keyword.control.import", "keyword"],
    // "keyword.modifier": [],
    // "keyword.coroutine": [],
    // "keyword.repeat": [],
    // "keyword.return": ["keyword.control.flow.return", "keyword.control.return"],
    // "keyword.debug": [],
    // "keyword.exception": [],
    // "keyword.conditional": [],
    // "keyword.conditional.ternary": [],
    // "keyword.directive": [],
    // "keyword.directive.define": [],
    // "keyword.export": [],
    // punctuation: [],
    "punctuation.delimiter": ["punctuation.separator"],
    // "punctuation.bracket": [],
    // "punctuation.special": [],
    // "punctuation.special.symbol": [],
    // "punctuation.list_marker": [],
    comment: ["comment"],
    // "comment.doc": [],
    // "comment.documentation": [],
    // "comment.error": [],
    // "comment.warning": [],
    // "comment.hint": [],
    // "comment.todo": [],
    // "comment.note": [],
    // "diff.plus": [],
    // "diff.minus": [],
    tag: ["entity.name.tag"],
    // "tag.attribute": [],
    // "tag.delimiter": [],
    // "tag.doctype": [],
    parameter: ["variable.parameter"],
    // field: [],
    // symbol: [],
    "emphasis.strong": ["strong"],
    emphasis: ["emphasis"],
    // embedded: [],
    // text: [],
    // "text.literal": [],
    // concept: [],
    "type.class.definition": ["class.definition", "type.definition"],
    // hint: [],
    // link_text: [],
    // link_uri: [],
    // parent: [],
    // predictive: [],
    // predoc: [],
    // primary: [],
    // title: [],
    // variant: [],
  };

  for (const [zedKey, tokens] of Object.entries(scopeMapping)) {
    for (const token of tokens) {
      for (const c of tokenColors) {
        const scope = Array.isArray(c.scope) ? c.scope : [c.scope];
        if (!scope.includes(token)) continue;

        const settings = c.settings;
        if (!syntax[zedKey]) syntax[zedKey] = {};

        if (settings.foreground && !syntax[zedKey].color) syntax[zedKey].color = settings.foreground;

        if (settings.fontStyle?.includes("italic") && !syntax[zedKey].font_style) syntax[zedKey].font_style = "italic";

        if (settings.fontStyle?.includes("bold") && !syntax[zedKey].font_weight) syntax[zedKey].font_weight = 700;
      }
    }
  }

  return syntax;
}

// Get command line arguments
const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error("Usage: node index.js <input-vscode-theme.json> <output-zed-theme.json>");
  process.exit(1);
}

try {
  // Read and parse VSCode theme
  const vscodeTheme = JSON.parse(fs.readFileSync(inputPath, "utf8"));

  // Create base Zed theme structure
  const zedTheme = {
    $schema: "https://zed.dev/schema/themes/v0.2.0.json",
    name: vscodeTheme.name,
    author: "Converted from VSCode theme",
    themes: [
      {
        name: vscodeTheme.name,
        appearance: vscodeTheme.type,
        style: {
          // Basic properties
          "background.appearance": "opaque",
          background: vscodeTheme.colors["editor.background"],
          "surface.background": vscodeTheme.colors["sideBar.background"] || vscodeTheme.colors["editor.background"],
          "panel.background": vscodeTheme.colors["sideBar.background"] || vscodeTheme.colors["editor.background"],
          "elevated_surface.background": vscodeTheme.colors["dropdown.background"],

          // Text colors
          text: vscodeTheme.colors["editor.foreground"],
          "text.muted": vscodeTheme.colors["sideBar.foreground"],
          "text.placeholder": vscodeTheme.colors["input.placeholderForeground"],
          "text.disabled": vscodeTheme.colors["disabledForeground"] || vscodeTheme.colors["editor.foreground"] + "80",
          "text.accent": vscodeTheme.colors["editorLineNumber.activeForeground"],

          // Borders
          border: vscodeTheme.colors["editorGroup.border"],
          "border.variant": vscodeTheme.colors["panel.border"],
          "border.focused": vscodeTheme.colors["focusBorder"],
          "border.selected": vscodeTheme.colors["activityBar.activeBorder"],
          "border.transparent": vscodeTheme.colors["panel.border"] + "00",
          "border.disabled": vscodeTheme.colors["input.disabledBorder"] || vscodeTheme.colors["disabledForeground"],

          // Elements
          "element.background": vscodeTheme.colors["button.background"],
          "element.hover":
            vscodeTheme.colors["editor.hoverHighlightBackground"] || vscodeTheme.colors["button.hoverBackground"],
          "element.active":
            vscodeTheme.colors["inputOption.activeBackground"] || vscodeTheme.colors["button.background"] + "CC",
          "element.selected": vscodeTheme.colors["list.activeSelectionBackground"],
          "element.disabled": vscodeTheme.colors["disabledbackground"],

          // Ghost elements
          "ghost_element.background": vscodeTheme.colors["editor.background"] + "00",
          "ghost_element.hover": vscodeTheme.colors["list.hoverBackground"],
          "ghost_element.active": vscodeTheme.colors["list.activeSelectionBackground"] + "CC",
          "ghost_element.selected": vscodeTheme.colors["list.activeSelectionBackground"],
          "ghost_element.disabled": vscodeTheme.colors["list.inactiveSelectionBackground"] + "66",

          // Editor specific
          "editor.background": vscodeTheme.colors["editor.background"],
          "editor.foreground": vscodeTheme.colors["editor.foreground"],
          "editor.line_number": vscodeTheme.colors["editorLineNumber.foreground"],
          "editor.active_line_number": vscodeTheme.colors["editorLineNumber.activeForeground"],
          "editor.active_line.background": vscodeTheme.colors["editor.lineHighlightBackground"],
          "editor.indent_guide": vscodeTheme.colors["editorIndentGuide.background"],
          "editor.indent_guide_active": vscodeTheme.colors["editorIndentGuide.activeBackground"],
          "editor.selection.background": vscodeTheme.colors["editor.selectionBackground"],
          "editor.gutter.background": vscodeTheme.colors["editorGutter.background"],
          "editor.document_highlight.bracket_background": vscodeTheme.colors["editorBracketMatch.background"],
          "editor.document_highlight.read_background":
            vscodeTheme.colors["editor.wordHighlightBackground"] ||
            vscodeTheme.colors["editor.selectionHighlightBackground"] ||
            vscodeTheme.colors["editor.findMatchBackground"],
          "editor.document_highlight.write_background":
            vscodeTheme.colors["editor.wordHighlightStrongBackground"] ||
            vscodeTheme.colors["editor.selectionHighlightBackground"] ||
            vscodeTheme.colors["editor.findMatchHighlightBackground"],

          "editor.subheader.background":
            vscodeTheme.colors["sideBarSectionHeader.background"] ||
            vscodeTheme.colors["panelSectionHeader.background"] ||
            vscodeTheme.colors["editor.background"],
          "link_text.hover":
            vscodeTheme.colors["editorLink.activeForeground"] || vscodeTheme.colors["textLink.activeForeground"],

          // Terminal colors
          "terminal.background": vscodeTheme.colors["terminal.background"],
          "terminal.foreground": vscodeTheme.colors["terminal.foreground"],
          "terminal.bright_foreground": vscodeTheme.colors["terminal.foreground"],
          "terminal.dim_foreground": vscodeTheme.colors["terminal.foreground"] + "99",
          "terminal.ansi.black": vscodeTheme.colors["terminal.ansiBlack"],
          "terminal.ansi.red": vscodeTheme.colors["terminal.ansiRed"],
          "terminal.ansi.green": vscodeTheme.colors["terminal.ansiGreen"],
          "terminal.ansi.yellow": vscodeTheme.colors["terminal.ansiYellow"],
          "terminal.ansi.blue": vscodeTheme.colors["terminal.ansiBlue"],
          "terminal.ansi.magenta": vscodeTheme.colors["terminal.ansiMagenta"],
          "terminal.ansi.cyan": vscodeTheme.colors["terminal.ansiCyan"],
          "terminal.ansi.white": vscodeTheme.colors["terminal.ansiWhite"],
          "terminal.ansi.bright_black": vscodeTheme.colors["terminal.ansiBrightBlack"],
          "terminal.ansi.bright_red": vscodeTheme.colors["terminal.ansiBrightRed"],
          "terminal.ansi.bright_green": vscodeTheme.colors["terminal.ansiBrightGreen"],
          "terminal.ansi.bright_yellow": vscodeTheme.colors["terminal.ansiBrightYellow"],
          "terminal.ansi.bright_blue": vscodeTheme.colors["terminal.ansiBrightBlue"],
          "terminal.ansi.bright_magenta": vscodeTheme.colors["terminal.ansiBrightMagenta"],
          "terminal.ansi.bright_cyan": vscodeTheme.colors["terminal.ansiBrightCyan"],
          "terminal.ansi.bright_white": vscodeTheme.colors["terminal.ansiBrightWhite"],
          "terminal.ansi.dim_black": vscodeTheme.colors["terminal.ansiBlack"] + "66",
          "terminal.ansi.dim_red": vscodeTheme.colors["terminal.ansiRed"] + "66",
          "terminal.ansi.dim_green": vscodeTheme.colors["terminal.ansiGreen"] + "66",
          "terminal.ansi.dim_yellow": vscodeTheme.colors["terminal.ansiYellow"] + "66",
          "terminal.ansi.dim_blue": vscodeTheme.colors["terminal.ansiBlue"] + "66",
          "terminal.ansi.dim_magenta": vscodeTheme.colors["terminal.ansiMagenta"] + "66",
          "terminal.ansi.dim_cyan": vscodeTheme.colors["terminal.ansiCyan"] + "66",
          "terminal.ansi.dim_white": vscodeTheme.colors["terminal.ansiWhite"] + "66",

          // Status indicators and Git decorations
          error: vscodeTheme.colors["editorError.foreground"] || vscodeTheme.colors["errorForeground"],
          "error.background":
            vscodeTheme.colors["editorError.background"] || vscodeTheme.colors["errorForeground"] + "19",
          "error.border": vscodeTheme.colors["editorError.border"] || vscodeTheme.colors["errorForeground"],

          warning:
            vscodeTheme.colors["editorWarning.foreground"] ||
            vscodeTheme.colors["editorOverviewRuler.warningForeground"],
          "warning.background":
            vscodeTheme.colors["editorWarning.background"] || vscodeTheme.colors["editorWarning.foreground"] + "19",
          "warning.border":
            vscodeTheme.colors["editorWarning.border"] || vscodeTheme.colors["editorWarning.foreground"],

          info: vscodeTheme.colors["editorInfo.foreground"] || vscodeTheme.colors["editorOverviewRuler.infoForeground"],
          "info.background":
            vscodeTheme.colors["editorInfo.background"] || vscodeTheme.colors["editorInfo.foreground"] + "19",
          "info.border": vscodeTheme.colors["editorInfo.border"] || vscodeTheme.colors["editorInfo.foreground"],

          hint: vscodeTheme.colors["editorHint.foreground"],
          "hint.background":
            vscodeTheme.colors["editorHint.background"] || vscodeTheme.colors["editorHint.foreground"] + "19",
          "hint.border": vscodeTheme.colors["editorHint.border"] || vscodeTheme.colors["editorHint.foreground"],

          success: vscodeTheme.colors["gitDecoration.addedResourceForeground"],
          "success.background": vscodeTheme.colors["gitDecoration.addedResourceForeground"] + "19",
          "success.border": vscodeTheme.colors["gitDecoration.addedResourceForeground"],

          // Git status
          created:
            vscodeTheme.colors["editorGutter.addedBackground"] ||
            vscodeTheme.colors["gitDecoration.addedResourceForeground"] ||
            vscodeTheme.colors["diffEditorOverview.insertedForeground"],
          "created.background": vscodeTheme.colors["diffEditor.insertedTextBackground"],
          "created.border":
            vscodeTheme.colors["editorGutter.addedBackground"] ||
            vscodeTheme.colors["gitDecoration.addedResourceForeground"] ||
            vscodeTheme.colors["diffEditorOverview.insertedForeground"],

          modified:
            vscodeTheme.colors["editorGutter.modifiedBackground"] ||
            vscodeTheme.colors["gitDecoration.modifiedResourceForeground"],
          "modified.border":
            vscodeTheme.colors["editorGutter.modifiedBackground"] ||
            vscodeTheme.colors["gitDecoration.modifiedResourceForeground"],

          deleted:
            vscodeTheme.colors["editorGutter.deletedBackground"] ||
            vscodeTheme.colors["gitDecoration.deletedResourceForeground"] ||
            vscodeTheme.colors["diffEditorOverview.removedForeground"],
          "deleted.background": vscodeTheme.colors["diffEditor.removedTextBackground"],
          "deleted.border":
            vscodeTheme.colors["editorGutter.deletedBackground"] ||
            vscodeTheme.colors["gitDecoration.deletedResourceForeground"] ||
            vscodeTheme.colors["diffEditorOverview.removedForeground"],

          conflict:
            vscodeTheme.colors["gitDecoration.conflictingResourceForeground"] ||
            vscodeTheme.colors["editorGutter.modifiedBackground"],
          "conflict.border":
            vscodeTheme.colors["gitDecoration.conflictingResourceForeground"] ||
            vscodeTheme.colors["editorGutter.modifiedBackground"],

          renamed:
            vscodeTheme.colors["gitDecoration.renamedResourceForeground"] ||
            vscodeTheme.colors["gitDecoration.modifiedResourceForeground"],
          "renamed.border":
            vscodeTheme.colors["gitDecoration.renamedResourceForeground"] ||
            vscodeTheme.colors["gitDecoration.modifiedResourceForeground"],

          ignored: vscodeTheme.colors["gitDecoration.ignoredResourceForeground"],
          "ignored.border": vscodeTheme.colors["gitDecoration.ignoredResourceForeground"],

          // UI elements
          "pane.focused_border": vscodeTheme.colors["focusBorder"],
          "pane_group.border": vscodeTheme.colors["panel.border"],
          "panel.background": vscodeTheme.colors["panel.background"],
          "panel.focused_border": vscodeTheme.colors["panel.activeBorder"],
          "panel.indent_guide": vscodeTheme.colors["editorIndentGuide.background"],
          "panel.indent_guide_active": vscodeTheme.colors["editorIndentGuide.activeBackground"],

          "status_bar.background": vscodeTheme.colors["statusBar.background"],
          "title_bar.background": vscodeTheme.colors["titleBar.activeBackground"],
          "toolbar.background":
            vscodeTheme.colors["toolbar.activeBackground"] || vscodeTheme.colors["editor.background"],
          "search.match_background": vscodeTheme.colors["editor.findMatchHighlightBackground"],
          "elevated_surface.background": vscodeTheme.colors["menu.background"],

          // Tabs
          "tab_bar.background": vscodeTheme.colors["editorGroupHeader.tabsBackground"],
          "tab.active_background": vscodeTheme.colors["tab.activeBackground"],
          "tab.inactive_background": vscodeTheme.colors["tab.inactiveBackground"],
          "drop_target.background": vscodeTheme.colors["editorGroup.dropBackground"],

          // Scrollbars
          "scrollbar.thumb.background": vscodeTheme.colors["scrollbarSlider.background"],
          "scrollbar.thumb.hover_background":
            vscodeTheme.colors["scrollbarSlider.hoverBackground"] ||
            vscodeTheme.colors["scrollbarSlider.activeBackground"],
          "scrollbar.track.background": vscodeTheme.colors["editorGutter.background"],
          "scrollbar.track.border": vscodeTheme.colors["editorGutter.background"],

          players: [
            {
              cursor: vscodeTheme.colors["editorCursor.foreground"],
              selection: vscodeTheme.colors["editor.selectionBackground"],
              background: vscodeTheme.colors["editorCursor.background"] || vscodeTheme.colors["editor.background"],
            },
          ],

          // Convert VSCode syntax highlighting to Zed syntax
          syntax: convertSyntaxHighlighting(vscodeTheme.tokenColors),
        },
      },
    ],
  };

  // Write converted theme to file
  fs.writeFileSync(outputPath, JSON.stringify(zedTheme, null, 2));
  console.log(`Theme converted and saved to ${outputPath}`);
} catch (error) {
  console.error("Error:", error.message);
  process.exit(1);
}
