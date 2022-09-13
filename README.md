# roughnotation

An extension that uses the [roughnotation](https://roughnotation.com/) javascript library to add animated annotations to revealjs documents.

## Installation

To install this extension in your current directory (or into the Quarto project that you're currently working in), use the following command:

``` bash
quarto install extension EmilHvitfeldt/quarto-roughnotation
```

## Usage

The roughnotation extension is implemented as a filter in Quarto. Once installed, using the extension is easy.

### Setup

You can enable this like:

``` markdown
---
title: Simple roughnotation setup
filters:
   - roughnotation
---
```

Then use the `.rn` to class to specify what elements should be highlighted.

``` markdown
[Highlight me!]{.rn}
```

Lastly, press the `R` key to activate the animation. For more examples and options look at the examples [here](https://Emilhvitfeldt.github.io/quarto-roughnotation/).

## Example

Here is the source code for many of the examples: [example.qmd](https://github.com/EmilHvitfeldt/quarto-roughnotation/blob/main/example.qmd)

This is the output of [example.qmd](https://Emilhvitfeldt.github.io/quarto-roughnotation/).
