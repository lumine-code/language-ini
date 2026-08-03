// Pins which files this grammar wins.
//
// `.npmrc` is npm's own config and is read with the `ini` package, but
// language-shellscript claimed it for years. Under a shell grammar a `;` is a
// command separator rather than a comment introducer, so every commented line
// in an `.npmrc` tokenized as shell code.
//
// The claim has to be *removed* there, not merely added here: two grammars
// claiming `npmrc` score identically (same fileType length, both Tree-sitter),
// and `selectGrammar` picks on strict `>`, so an exact tie falls through to
// enumeration order — which is package activation order and not stable across
// platforms. That is also why asserting the winner is not enough on its own:
// with both claims present this suite still passed, purely on which package
// happened to load first. The assertion that actually holds the fix is the one
// on `fileTypes`.

const SHELL_SCOPE = "source.shell";

describe("INI grammar selection", () => {
  beforeEach(async () => {
    await atom.packages.activatePackage("language-ini");
    await atom.packages.activatePackage("language-shellscript");
  });

  it("is the only grammar claiming npmrc", () => {
    const claimants = atom.grammars
      .getGrammars({ includeTreeSitter: true })
      .filter((grammar) => (grammar.fileTypes ?? []).includes("npmrc"))
      .map((grammar) => grammar.scopeName);

    expect(claimants.length).toBeGreaterThan(0);
    expect(claimants).not.toContain(SHELL_SCOPE);
    for (const scopeName of claimants) expect(scopeName).toBe("source.ini");
  });

  it("wins .npmrc", () => {
    expect(atom.grammars.selectGrammar(".npmrc").scopeName).toBe("source.ini");
  });

  it("still leaves shell files to language-shellscript", () => {
    expect(atom.grammars.selectGrammar(".bashrc").scopeName).toBe(SHELL_SCOPE);
    expect(atom.grammars.selectGrammar("script.sh").scopeName).toBe(SHELL_SCOPE);
  });

  it("treats a semicolon in an .npmrc as a comment, not a command separator", async () => {
    const editor = await atom.workspace.open(".npmrc");
    editor.setText("; install-links means copy, not symlink\ninstall-links=true\n");
    await editor.languageMode.ready;

    expect(editor.scopeDescriptorForBufferPosition([0, 2]).scopes).toContain("comment.line.ini");
    expect(editor.scopeDescriptorForBufferPosition([1, 0]).scopes).toContain(
      "variable.other.key.ini",
    );
  });
});
