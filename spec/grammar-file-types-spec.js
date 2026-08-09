// Pins the file types this package claims.
//
// `.npmrc` is npm's own config, read with the `ini` package, but
// language-shellscript claimed it for years — and under a shell grammar a `;`
// is a command separator rather than a comment introducer, so every commented
// line tokenized as shell code.
//
// This suite deliberately asserts only what this package controls. Whether
// `.npmrc` actually *resolves* to `source.ini` depends on no sibling package
// claiming it too, and a sibling's grammars reach the integration job from
// whichever Lumine build it checks out — not from this repository. Asserting
// that here made this package's CI fail for a fix that had already landed in
// language-shellscript. The cross-package assertion belongs where the bundled
// set is defined, so it lives in the editor's own `check:grammar-file-types`.

const CLAIMED = ["ini", "cfg", "conf", "desktop", "editorconfig", "inf", "npmrc", "prefs"];

describe("INI grammar file types", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-ini");
  });

  it("claims npmrc along with the ini types", () => {
    const grammar = lumine.grammars.grammarForScopeName("source.ini");
    expect(grammar).toBeTruthy();
    expect(grammar.fileTypes.slice().sort()).toEqual(CLAIMED.slice().sort());
  });

  it("scopes a semicolon comment as a comment, not a separator", async () => {
    const editor = await lumine.workspace.open();
    editor.setText("; install-links means copy, not symlink\ninstall-links=true\n");
    lumine.grammars.assignLanguageMode(editor.getBuffer(), "source.ini");
    await editor.languageMode.ready;

    expect(editor.scopeDescriptorForBufferPosition([0, 2]).scopes).toContain("comment.line.ini");
    expect(editor.scopeDescriptorForBufferPosition([1, 0]).scopes).toContain(
      "variable.other.key.ini",
    );
  });
});
