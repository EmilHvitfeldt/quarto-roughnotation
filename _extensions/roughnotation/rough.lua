-- Add .fragment class to elements with .rn-fragment
local function add_fragment_class(el)
  if el.classes:includes("rn-fragment") then
    el.classes:insert("fragment")
  end
  return el
end

function Span(el)
  return add_fragment_class(el)
end

function Div(el)
  return add_fragment_class(el)
end

function Meta(m)
  quarto.doc.addHtmlDependency({
    name = "roughnotation",
    version = "0.5.1",
    scripts = {"assets/rough-notation.iife.js"}
  })
  quarto.doc.addHtmlDependency({
    name = "roughnotation-init",
    version = "1.0.0",
    scripts = {"rough.js"},
    stylesheets = {"rough.css"}
  })
end
