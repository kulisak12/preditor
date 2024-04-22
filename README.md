# Preditor

Preditor provides completions while typing, even in the middle of a sentence.
For Czech, it allows the user to substitute a word in a sentence
and automatically adjusts the forms of the surrounding words.

## Features

### Suggestions

Preditor offers suggestions while typing in a plain text file or a Markdown file.
It can suggest both at the end of a sentence (prediction) and in the middle of a sentence (infilling).

To trigger suggestions, simply start typing.
Characters such as a space or a comma will trigger suggestions.

### Substitution

Preditor makes it easy to substitute a word in a sentence.
In languages with inflection, such a substitution can cause the surrounding words to change their form.
Preditor automatically adjusts the forms of the surrounding words to match the new word.

Substitution uses the _Rename Symbol_ command (`F2` by default).
To substitute a word, place the cursor on it and press `F2`.
Then, type the new word and press `Enter`.

Currently, substitution is available only in Czech.

## Model

This extension requires a running server that answers requests.
You can find it in [a separate repository](https://github.com/kulisak12/preditor-model).

If you run the server locally, it will listen on `http://localhost:3000` by default.
Set this URL in the extension's configuration `preditor.url`.

## Configuration

- `preditor.url`: The URL of the server that provides completions.
- `preditor.charsBefore`: The number of characters before the cursor that should be sent to the server.
  The server may only use a part of this text, usually one paragraph.
- `preditor.charsAfter`: The number of characters after the cursor that should be sent to the server.
- `preditor.prediction.*`: Configuration for prediction.
- `preditor.infilling.*`: Configuration for infilling.
- `preditor.substitution.*`: Configuration for substitution.
