; INI is a data format: a file is sections of key/value settings. The grammar
; has no notion of a typed value, so a setting's value is unquoted text rather
; than a string — upstream's @string would have claimed quoting the format does
; not have.

; COMMENTS
; ========

; Both `;` and `#` introduce a comment.
(comment) @comment.line.ini
((comment) @punctuation.definition.comment.ini
  (#set! adjust.endAfterFirstMatchOf "^[;#]"))


; SECTIONS
; ========

(section_name
  (text) @entity.name.section.ini)

; The brackets belong to `section_name`, not to `section`.
(section_name
  "[" @punctuation.definition.section.begin.bracket.square.ini
  "]" @punctuation.definition.section.end.bracket.square.ini)


; SETTINGS
; ========

(setting
  (setting_name) @variable.other.key.ini)

(setting
  "=" @punctuation.separator.key-value.ini)

(setting_value) @string.unquoted.ini

; A value that is only digits reads as a number, and one of the usual spellings
; of a flag reads as a boolean. Neither is in the grammar, so both are matched
; on the text. `setting_value` keeps the space after the `=`, hence the `\\s*`.
((setting_value) @constant.numeric.ini
  (#match? @constant.numeric.ini "^\\s*[+-]?[0-9]+(\\.[0-9]+)?\\s*$"))
((setting_value) @constant.language.boolean.ini
  (#match? @constant.language.boolean.ini "^\\s*([Tt]rue|[Ff]alse|[Yy]es|[Nn]o|[Oo]n|[Oo]ff)\\s*$"))
