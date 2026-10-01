const fs = require("fs");
const path = require("path");

const packagePath = (name) => {
  const sibling = path.resolve(__dirname, "..", "..", name);
  return fs.existsSync(sibling) ? sibling : name;
};

describe("INI static annotations", () => {
  it("includes named comment text and filters ordinary comments", async () => {
    for (const name of ["language-ini", "language-hyperlink", "language-todo"]) {
      await lumine.packages.activatePackage(packagePath(name));
    }
    const editor = await lumine.workspace.open("annotations.ini");
    try {
      const text =
        "; TODO https://example.com/comment\n; ordinary comment\n[settings]\nvalue = plain\n";
      editor.setText(text);
      const mode = editor.languageMode;
      await mode.ready;
      await mode.atGrammarSettlement();
      const comment = mode.tree.rootNode.descendantsOfType("comment")[0];
      expect(comment.namedChildren.map((node) => node.type)).toEqual(["text"]);
      const layers = mode
        .getAllInjectionLayers()
        .filter((layer) => ["text.todo", "text.hyperlink"].includes(layer.grammar.scopeName));
      expect(layers.length).toBe(2);
      for (const [needle, scope] of [
        ["TODO", "storage.type.class.todo"],
        ["https://example.com/comment", "markup.underline.link.hyperlink"],
      ]) {
        const position = editor.getBuffer().positionForCharacterIndex(text.indexOf(needle));
        expect(editor.scopeDescriptorForBufferPosition(position).getScopesArray()).toContain(scope);
      }
    } finally {
      editor.destroy();
    }
  });
});
