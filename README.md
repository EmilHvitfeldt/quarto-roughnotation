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

Here is the source code for many of the examples: [example.qmd](https://github.com/EmilHvitfeldt/quarto-roughnotation/blob/main/examples/example.qmd)

This is the output of [example.qmd](https://Emilhvitfeldt.github.io/quarto-roughnotation/).

## Code Chunk Annotations (with Flourish)

You can annotate specific text within code chunks by combining roughnotation with the [flourish](https://github.com/kbodwin/flourish) extension.

### Setup

Install both extensions:

```bash
quarto add EmilHvitfeldt/quarto-roughnotation
quarto add kbodwin/flourish
```

Add both as filters (flourish must come first):

```yaml
---
title: Code annotations
filters:
  - flourish
  - roughnotation
---
```

### Usage

Use flourish's `style` option to pass roughnotation config via CSS custom properties:

````markdown
```{r}
#| flourish:
#|   - target: "mean"
#|     style: "--rn-type: circle; --rn-color: red;"
x <- c(1, 2, 3, 4, 5)
mean(x)
```
````

### Available Properties

| Property | Example | Description |
|----------|---------|-------------|
| `--rn-type` | `circle` | underline, box, circle, highlight, strike-through, crossed-off, bracket |
| `--rn-color` | `red` | Any CSS color |
| `--rn-animate` | `true` | Enable/disable animation |
| `--rn-animationDuration` | `800` | Duration in ms |
| `--rn-strokeWidth` | `2` | Line thickness |
| `--rn-padding` | `5` | Space around element |
| `--rn-multiline` | `true` | Annotate across lines |
| `--rn-iterations` | `2` | Drawing passes |
| `--rn-brackets` | `left,right` | Bracket sides |
| `--rn-index` | `1` | Fragment order |

See [example-flourish.qmd](https://github.com/EmilHvitfeldt/quarto-roughnotation/blob/main/examples/example-flourish.qmd) for more examples.
