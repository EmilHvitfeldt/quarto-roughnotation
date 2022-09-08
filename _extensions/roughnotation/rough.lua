function rn_setup()
  quarto.doc.addHtmlDependency({
    name = "roughnotation",
    version = "1.0.0",
    scripts = {"assets/rough-notation.iife.js"}
  })
  quarto.doc.includeFile("after-body", "assets/roughnotation.html")
end
