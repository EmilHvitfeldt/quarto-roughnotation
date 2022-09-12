function Meta(m)
  quarto.doc.addHtmlDependency({
    name = "roughnotation",
    version = "0.5.1",
    scripts = {"assets/rough-notation.iife.js"}
  })
  quarto.doc.addHtmlDependency({
    name = "roughnotation-init",
    version = "1.0.0",
    scripts = {"rough.js"}
  })
end
