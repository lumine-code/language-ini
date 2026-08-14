# language-ini

INI language support.

## Features

- **Grammars**: provides Tree-sitter grammars, built from [tree-sitter-ini](https://github.com/justinmk/tree-sitter-ini).
- **Syntax highlighting**: sections, keys and values, with both `;` and `#` recognised as comments.
- **Values**: picks numbers and the usual spellings of a flag out of otherwise untyped text.
- **Folding**: folds each section.
- **Symbol navigation**: section headers.

## Installation

To install `language-ini` search for it in the Install pane of the Lumine settings, or run the command `lumine --install lumine-code/language-ini`.

## Usage

Also used for `.cfg`, `.conf`, `.desktop`, `.editorconfig`, `.inf` and `.prefs` files. Java `.properties` and Git's config files are deliberately left to their own grammars.

## Services

- `hyperlink.injection`: consumed to highlight URLs inside INI files as clickable links.
- `todo.injection`: consumed to highlight `TODO`-style markers inside comments.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
